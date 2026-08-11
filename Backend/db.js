import mysql from 'mysql2/promise';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const DB_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'sdps_db',
  connectTimeout: 2000
};

let dbMode = 'mysql';
let mysqlPool = null;
let sqliteDb = null;

export async function initDatabase() {
  try {
    // Attempt connection to MySQL Database Server
    const connection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\`;`);
    await connection.end();

    mysqlPool = mysql.createPool({
      ...DB_CONFIG,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create MySQL Tables matching SRS Tables
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        role VARCHAR(20) DEFAULT 'Patient',
        contact_no VARCHAR(30),
        auth_provider VARCHAR(30) DEFAULT 'password',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS login_history (
        login_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        user_name VARCHAR(100),
        email VARCHAR(100),
        role VARCHAR(20),
        login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(50),
        device_info VARCHAR(255)
      );
    `);

    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS ai_predictions (
        prediction_id BIGINT PRIMARY KEY,
        user_id BIGINT,
        patient_name VARCHAR(150),
        symptoms_input TEXT,
        primary_diagnosis VARCHAR(200),
        confidence_score DECIMAL(5,2),
        urgency_level VARCHAR(30),
        ai_clinical_analysis TEXT,
        ai_recommendations TEXT,
        ai_prescriptions TEXT,
        specialist VARCHAR(150),
        model_used VARCHAR(80),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    dbMode = 'mysql';
    console.log(`✅ [MySQL DB] Connected successfully to database: '${DB_CONFIG.database}'`);
    return { mode: 'mysql' };

  } catch (err) {
    console.warn(`⚠️ [MySQL DB Connection Info] MySQL server on localhost:3306 unreachable (${err.message}). Using embedded SQLite database fallback.`);
    
    sqliteDb = await open({
      filename: path.join(process.cwd(), 'sdps_database.sqlite'),
      driver: sqlite3.Database
    });

    await sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT DEFAULT 'Patient',
        contact_no TEXT,
        auth_provider TEXT DEFAULT 'password',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS login_history (
        login_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        user_name TEXT,
        email TEXT,
        role TEXT,
        login_time TEXT DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT,
        device_info TEXT
      );
    `);

    await sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS ai_predictions (
        prediction_id INTEGER PRIMARY KEY,
        user_id INTEGER,
        patient_name TEXT,
        symptoms_input TEXT,
        primary_diagnosis TEXT,
        confidence_score REAL,
        urgency_level TEXT,
        ai_clinical_analysis TEXT,
        ai_recommendations TEXT,
        ai_prescriptions TEXT,
        specialist TEXT,
        model_used TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    dbMode = 'sqlite';
    console.log(`✅ [SQLite DB] Local database engine ready at 'sdps_database.sqlite'`);
    return { mode: 'sqlite' };
  }
}

// User Sync API logic
export async function syncUserToDb(userPayload) {
  const { name, email, role = 'Patient', contact_no = '', auth_provider = 'google' } = userPayload;

  if (dbMode === 'mysql' && mysqlPool) {
    // MySQL Upsert logic
    const [existing] = await mysqlPool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    if (existing.length > 0) {
      await mysqlPool.query(
        `UPDATE users SET name = ?, role = ?, contact_no = ?, auth_provider = ? WHERE email = ?`,
        [name, role, contact_no, auth_provider, email]
      );
      const [updated] = await mysqlPool.query(`SELECT * FROM users WHERE email = ?`, [email]);
      return updated[0];
    } else {
      const [result] = await mysqlPool.query(
        `INSERT INTO users (name, email, role, contact_no, auth_provider) VALUES (?, ?, ?, ?, ?)`,
        [name, email, role, contact_no, auth_provider]
      );
      const [inserted] = await mysqlPool.query(`SELECT * FROM users WHERE user_id = ?`, [result.insertId]);
      return inserted[0];
    }
  } else if (sqliteDb) {
    // SQLite Upsert logic
    const existing = await sqliteDb.get(`SELECT * FROM users WHERE email = ?`, [email]);
    if (existing) {
      await sqliteDb.run(
        `UPDATE users SET name = ?, role = ?, contact_no = ?, auth_provider = ? WHERE email = ?`,
        [name, role, contact_no, auth_provider, email]
      );
      return await sqliteDb.get(`SELECT * FROM users WHERE email = ?`, [email]);
    } else {
      const res = await sqliteDb.run(
        `INSERT INTO users (name, email, role, contact_no, auth_provider) VALUES (?, ?, ?, ?, ?)`,
        [name, email, role, contact_no, auth_provider]
      );
      return await sqliteDb.get(`SELECT * FROM users WHERE user_id = ?`, [res.lastID]);
    }
  }
}

// Fetch all users from DB
export async function getAllUsersFromDb() {
  if (dbMode === 'mysql' && mysqlPool) {
    const [rows] = await mysqlPool.query(`SELECT * FROM users ORDER BY user_id DESC`);
    return rows;
  } else if (sqliteDb) {
    return await sqliteDb.all(`SELECT * FROM users ORDER BY user_id DESC`);
  }
  return [];
}

// Save AI Prediction result to DB
export async function savePredictionToDb(predictionData) {
  const {
    prediction_id, user_id, patient_name, symptoms_input,
    primary_diagnosis, confidence_score, urgency_level,
    ai_clinical_analysis, ai_recommendations, ai_prescriptions,
    specialist, model_used
  } = predictionData;

  const symptomsStr = Array.isArray(symptoms_input) ? symptoms_input.join(', ') : symptoms_input;
  const recsStr = Array.isArray(ai_recommendations) ? JSON.stringify(ai_recommendations) : ai_recommendations;
  const rxStr = Array.isArray(ai_prescriptions) ? JSON.stringify(ai_prescriptions) : ai_prescriptions;

  if (dbMode === 'mysql' && mysqlPool) {
    await mysqlPool.query(
      `INSERT INTO ai_predictions
        (prediction_id, user_id, patient_name, symptoms_input, primary_diagnosis,
         confidence_score, urgency_level, ai_clinical_analysis, ai_recommendations,
         ai_prescriptions, specialist, model_used)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE primary_diagnosis=VALUES(primary_diagnosis)`,
      [prediction_id, user_id, patient_name, symptomsStr, primary_diagnosis,
       confidence_score, urgency_level, ai_clinical_analysis, recsStr, rxStr, specialist, model_used]
    );
  } else if (sqliteDb) {
    await sqliteDb.run(
      `INSERT OR REPLACE INTO ai_predictions
        (prediction_id, user_id, patient_name, symptoms_input, primary_diagnosis,
         confidence_score, urgency_level, ai_clinical_analysis, ai_recommendations,
         ai_prescriptions, specialist, model_used)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [prediction_id, user_id, patient_name, symptomsStr, primary_diagnosis,
       confidence_score, urgency_level, ai_clinical_analysis, recsStr, rxStr, specialist, model_used]
    );
  }
  return { prediction_id, primary_diagnosis };
}

// Fetch all AI predictions from DB
export async function getAllPredictionsFromDb() {
  if (dbMode === 'mysql' && mysqlPool) {
    const [rows] = await mysqlPool.query(`SELECT * FROM ai_predictions ORDER BY created_at DESC LIMIT 100`);
    return rows;
  } else if (sqliteDb) {
    return await sqliteDb.all(`SELECT * FROM ai_predictions ORDER BY created_at DESC LIMIT 100`);
  }
  return [];
}
