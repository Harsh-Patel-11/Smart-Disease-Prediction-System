import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import { initDatabase, syncUserToDb, getAllUsersFromDb, savePredictionToDb, getAllPredictionsFromDb, saveLoginHistoryToDb, getAllLoginHistoryFromDb } from './db.js';


const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Groq client
const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
const GROQ_MODEL = 'llama-3.3-70b-versatile';

app.use(cors());
app.use(express.json());

// Initialize Database connection on start
let dbStatus = { mode: 'pending' };
initDatabase().then(status => {
  dbStatus = status;
});

// ─────────────────────────────────────────────
// Health check endpoint
// ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Smart Disease Prediction System (SDPS) Backend',
    groq_model: GROQ_MODEL,
    groq_ready: !!process.env.GROQ_API_KEY,
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// ─────────────────────────────────────────────
// POST /api/predict — Groq AI Disease Prediction
// ─────────────────────────────────────────────
app.post('/api/predict', async (req, res) => {
  try {
    const {
      symptoms,          // Array of {name, severity, category, description}
      patientName = 'Patient',
      patientAge,
      patientGender,
      userId,
      localPrediction    // Optional: local ML engine's top result as a hint
    } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ error: 'At least one symptom is required.' });
    }

    const symptomsText = symptoms.map(s =>
      `• ${s.name} (Severity: ${s.severity || 'Moderate'}${s.category ? `, Category: ${s.category}` : ''})`
    ).join('\n');

    const localHint = localPrediction
      ? `\nLocal ML engine preliminary result (as a reference only): ${localPrediction.disease_name} (${localPrediction.confidence_score}% confidence)`
      : '';

    const systemPrompt = `You are an expert medical AI diagnostic assistant integrated into a Smart Disease Prediction System (SDPS). You analyze patient symptoms and produce detailed, accurate clinical assessments. Always respond with valid JSON only — no markdown, no explanation text outside JSON.`;

    const userPrompt = `Analyze the following patient case and provide a comprehensive clinical diagnosis and treatment plan.

Patient: ${patientName}${patientAge ? ` | Age: ${patientAge}` : ''}${patientGender ? ` | Gender: ${patientGender}` : ''}
${localHint}

REPORTED SYMPTOMS:
${symptomsText}

Total symptoms reported: ${symptoms.length}

IMPORTANT — Confidence Score Calculation:
- Compute a UNIQUE confidenceScore (integer 0-97) for each diagnosis based on:
  * How many of the reported symptoms specifically match that disease
  * The severity of matching symptoms (Severe = higher weight)
  * Disease specificity (common diseases with many matching symptoms score higher)
  * Number of symptoms reported (more symptoms = more diagnostic clarity)
- The primaryDiagnosis score MUST be the highest (best fit)
- Differential diagnosis scores must be strictly lower and meaningfully different from each other
- Do NOT reuse example values. Calculate a real score for this specific symptom set.

Respond ONLY with a JSON object in this exact structure:
{
  "primaryDiagnosis": {
    "name": "Disease name",
    "icdCode": "ICD-10 code e.g. J18.9",
    "confidenceScore": <calculated integer 40-97>,
    "severityLevel": "Moderate",
    "category": "Respiratory",
    "urgencyLevel": "Urgent",
    "clinicalSummary": "2-3 sentence clinical explanation of this diagnosis based on the symptoms"
  },
  "differentialDiagnoses": [
    { "name": "Disease 2", "confidenceScore": <lower than primary>, "reason": "short reason" },
    { "name": "Disease 3", "confidenceScore": <even lower>, "reason": "short reason" },
    { "name": "Disease 4", "confidenceScore": <lowest>, "reason": "short reason" }
  ],
  "clinicalAnalysis": "A detailed 3-4 paragraph clinical analysis explaining the pathophysiology, symptom correlations, and diagnostic reasoning",
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2",
    "Specific recommendation 3",
    "Specific recommendation 4",
    "Specific recommendation 5"
  ],
  "prescriptions": [
    { "medicine": "Medicine name", "dosage": "500mg", "frequency": "Twice daily", "duration": "5 days", "notes": "Take after meals" },
    { "medicine": "Medicine name 2", "dosage": "10mg", "frequency": "Once daily", "duration": "7 days", "notes": "Avoid alcohol" }
  ],
  "recommendedSpecialist": "Pulmonologist / General Physician",
  "followUpAdvice": "Follow up within 3-5 days if symptoms worsen",
  "emergencyWarnings": ["Warning sign 1 that requires immediate ER visit", "Warning sign 2"]
}

Important: urgencyLevel must be one of: "Normal", "Urgent", "Emergency". severityLevel must be one of: "Low", "Moderate", "High", "Emergency".`;

    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: GROQ_MODEL,
      temperature: 0.4,
      max_tokens: 2048,
      response_format: { type: 'json_object' }
    });

    const rawContent = chatCompletion.choices[0]?.message?.content || '{}';
    let aiResult;
    try {
      aiResult = JSON.parse(rawContent);
    } catch {
      return res.status(500).json({ error: 'Groq AI returned malformed JSON. Please try again.' });
    }

    // Save to database
    const predictionId = Date.now();
    const dbEntry = {
      prediction_id: predictionId,
      user_id: userId || null,
      patient_name: patientName,
      symptoms_input: symptoms.map(s => `${s.name} (${s.severity})`),
      primary_diagnosis: aiResult.primaryDiagnosis?.name || 'Unknown',
      confidence_score: aiResult.primaryDiagnosis?.confidenceScore || 0,
      urgency_level: aiResult.primaryDiagnosis?.urgencyLevel || 'Normal',
      ai_clinical_analysis: aiResult.clinicalAnalysis || '',
      ai_recommendations: aiResult.recommendations || [],
      ai_prescriptions: aiResult.prescriptions || [],
      specialist: aiResult.recommendedSpecialist || '',
      model_used: GROQ_MODEL
    };

    await savePredictionToDb(dbEntry).catch(err => console.warn('DB save note:', err.message));

    res.json({
      success: true,
      predictionId,
      model: GROQ_MODEL,
      usage: chatCompletion.usage,
      result: aiResult
    });

  } catch (err) {
    console.error('[/api/predict Error]', err);
    if (err.status === 401) {
      return res.status(401).json({ error: 'Invalid Groq API Key. Please check your GROQ_API_KEY in Backend/.env' });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: 'Groq API rate limit exceeded. Please wait a moment and try again.' });
    }
    res.status(500).json({ error: err.message || 'Groq AI prediction failed.' });
  }
});

// ─────────────────────────────────────────────
// User Sync API Endpoint
// ─────────────────────────────────────────────
app.post('/api/users/sync', async (req, res) => {
  try {
    const syncedUser = await syncUserToDb(req.body);
    res.json({
      message: 'User synchronized with database successfully',
      user: syncedUser
    });
  } catch (err) {
    console.error('Error syncing user to DB:', err);
    res.status(500).json({ error: 'Failed to synchronize user with database.' });
  }
});

// Audit Log endpoints
app.post('/api/audit-logs', async (req, res) => {
  try {
    await saveLoginHistoryToDb(req.body);
    res.json({ message: 'Login event logged successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save audit log.' });
  }
});

app.get('/api/audit-logs', async (req, res) => {
  try {
    const logs = await getAllLoginHistoryFromDb();
    res.json({ count: logs.length, logs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve audit logs.' });
  }
});


// ─────────────────────────────────────────────
// Get all users from Database
// ─────────────────────────────────────────────
app.get('/api/users', async (req, res) => {
  try {
    const users = await getAllUsersFromDb();
    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve users from database.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/chat — Groq AI Medical Chatbot
// ─────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, patientContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const systemPrompt = `You are SDPS Health Assistant, an empathetic, highly knowledgeable, and precise AI medical & health assistant integrated into the Smart Disease Prediction System (SDPS).
Provide accurate, reassuring, and practical medical guidance, health recommendations, symptom explanations, diet tips, and general medical knowledge.
Format your responses using clean GitHub-style Markdown with bullet points, bold key terms, and short paragraphs for readability.
If a user asks about urgent or life-threatening symptoms (chest pain, stroke, severe bleeding), emphasize seeking emergency care immediately.
Keep responses concise, informative, warm, and helpful.`;

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    ];

    const completion = await groqClient.chat.completions.create({
      model: GROQ_MODEL,
      messages: groqMessages,
      temperature: 0.6,
      max_tokens: 1024
    });

    const reply = completion.choices[0]?.message?.content || 'I apologize, but I could not process your query at this moment.';

    res.json({
      reply,
      model: GROQ_MODEL,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Groq AI Chat Error:', err);
    res.status(500).json({
      error: 'Failed to process AI chat query.',
      details: err.message
    });
  }
});

// ─────────────────────────────────────────────
// Get all AI predictions from Database
// ─────────────────────────────────────────────
app.get('/api/predictions', async (req, res) => {
  try {
    const predictions = await getAllPredictionsFromDb();
    res.json({ count: predictions.length, predictions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve predictions from database.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 [SDPS Backend] Server running on http://localhost:${PORT}`);
  console.log(`🤖 [Groq AI] Model: ${GROQ_MODEL} | API Key: ${process.env.GROQ_API_KEY ? '✅ Configured' : '❌ MISSING — set GROQ_API_KEY in .env'}`);
});

export default app;
