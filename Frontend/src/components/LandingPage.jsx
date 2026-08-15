import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import Lenis from 'lenis';

/* ═══════════════════════════════════════════════════════════════════════════
   SMART DISEASE PREDICTION SYSTEM (SDPS.ai) — 3D WEBGL PARTICLE SCROLLYTELLING
   Reverse-Engineered 1:1 Pixel-Perfect Fidelity from Reference Architecture
   Three.js WebGL Engine | 6,000 Multi-Attribute Particles | Lenis Smooth Scroll
   ═══════════════════════════════════════════════════════════════════════════ */

const COUNT = 6000;
const HEADER_H = 64;

// ── Step scroll targets — module level so they never go stale in closures ──
const PANEL_TARGETS = [0.00, 0.25, 0.42, 0.57, 0.70, 0.82, 0.91, 1.00];


// Color Palette — SDPS Light Theme (Indigo, Violet, Purple, Cyan, Sky, Rose)
const COLOR_HEXES = [
  '#4f46e5', // indigo-600
  '#6366f1', // indigo-500
  '#818cf8', // indigo-400
  '#7c3aed', // violet-600
  '#8b5cf6', // violet-500
  '#a855f7', // purple-500
  '#06b6d4', // cyan-500
  '#38bdf8', // sky-400
  '#ec4899', // pink-500
];

// Linear Congruential Generator (Deterministic PRNG)
function createLcg(seed) {
  let t = seed;
  return () => {
    t = (t * 1664525 + 1013904223) % 4294967296;
    return t / 4294967296;
  };
}

// Smoothstep math
function smoothstep(e) {
  const t = Math.min(1, Math.max(0, e));
  return t * t * (3 - 2 * t);
}

// Lerp math
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Create Soft Radial Glow Particle Texture
function createParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.9)');
  grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.4)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/* ─── 3D Shape Mathematical Formulations (Extracted 1:1) ─── */

// Shape 0: Sparse Floating Cloud (Hero)
function generateHeroCloud(e) {
  const rng = createLcg(42);
  const pos = new Float32Array(e * 3);
  for (let i = 0; i < e; i++) {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const r = 2.5 + rng() * 4.5;
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.cos(phi) * 0.75;
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return pos;
}

// Shape 1: Human Anatomical Torso Silhouette (Dv)
function generateSilhouette(e) {
  const rng = createLcg(7);
  const pos = new Float32Array(e * 3);
  const weights = [
    { w: 0.14, fn: (u, v, w) => spherePt(0, 2.5, 0, 0.42, u, v, w) },
    { w: 0.05, fn: (u, v, w) => cylPt(0, 2, 0, 0.14, 0.25, u, v, w) },
    { w: 0.30, fn: (u, v, w) => torsoPt(u, v, w) },
    { w: 0.11, fn: (u, v, w) => limbPt(-0.68, 1.8, 0.45, -0.28, 0.12, u, v, w) },
    { w: 0.11, fn: (u, v, w) => limbPt(0.68, 1.8, 0.45, 0.28, 0.12, u, v, w) },
    { w: 0.145, fn: (u, v, w) => limbPt(-0.26, 0.8, -1.55, 0, 0.17, u, v, w) },
    { w: 0.145, fn: (u, v, w) => limbPt(0.26, 0.8, -1.55, 0, 0.17, u, v, w) }
  ];

  function spherePt(cx, cy, cz, rad, u, v, w) {
    const s = u * Math.PI * 2;
    const c = Math.acos(2 * v - 1);
    const l = rad * (0.75 + 0.25 * w);
    return [cx + l * Math.sin(c) * Math.cos(s), cy + l * Math.cos(c), cz + l * Math.sin(c) * Math.sin(s) * 0.85];
  }

  function cylPt(cx, cy, cz, rad, h, u, v, w) {
    const c = v * Math.PI * 2;
    return [cx + rad * Math.cos(c), cy + (w - 0.5) * h, cz + rad * Math.sin(c)];
  }

  function torsoPt(u, v, w) {
    const r = 0.65 + v * 1.3;
    const norm = (r - 0.65) / 1.3;
    const a = 0.42 + 0.28 * Math.sin(norm * Math.PI * 0.95);
    const ang = u * Math.PI * 2;
    const s = 0.7 + 0.3 * w;
    return [Math.cos(ang) * a * s, r, Math.sin(ang) * a * 0.62 * s];
  }

  function limbPt(sx, sy, ez, ex, rad, u, v, w) {
    const c = w;
    const lx = sx + ex * c;
    const ly = sy + (ez - sy) * c;
    const d = v * Math.PI * 2;
    const f = rad * (0.6 + 0.4 * u) * (1 - 0.25 * c);
    return [lx + Math.cos(d) * f, ly, Math.sin(d) * f];
  }

  let idx = 0;
  while (idx < e) {
    const rVal = rng();
    let accum = 0;
    let chosen = weights[weights.length - 1];
    for (const item of weights) {
      accum += item.w;
      if (rVal <= accum) {
        chosen = item;
        break;
      }
    }
    const [x, y, z] = chosen.fn(rng(), rng(), rng());
    pos[idx * 3]     = x;
    pos[idx * 3 + 1] = y - 1.25;
    pos[idx * 3 + 2] = z;
    idx++;
  }
  return pos;
}

// Shape 2: Symptom Network Graph (Ov)
function generateNetwork(e, clusterCount = 26) {
  const rng = createLcg(21);
  const pos = new Float32Array(e * 3);
  const hubs = [];
  for (let i = 0; i < clusterCount; i++) {
    const theta = (i / clusterCount) * Math.PI * 2 + rng() * 0.3;
    const rad = 2.4 + rng() * 2.6;
    hubs.push([
      Math.cos(theta) * rad,
      (rng() - 0.5) * 4.4,
      Math.sin(theta) * rad * 0.8 - rng() * 1.5
    ]);
  }
  for (let i = 0; i < e; i++) {
    const hub = hubs[i % clusterCount];
    const jitter = 0.16 + rng() * 0.3;
    pos[i * 3]     = hub[0] + (rng() - 0.5) * jitter * 3;
    pos[i * 3 + 1] = hub[1] + (rng() - 0.5) * jitter * 3;
    pos[i * 3 + 2] = hub[2] + (rng() - 0.5) * jitter * 3;
  }
  return pos;
}

// Shape 3: Machine Learning Neural Planes / Depth Grid (kv)
function generateNeuralGrid(e, layers = 6) {
  const rng = createLcg(53);
  const pos = new Float32Array(e * 3);
  const perLayer = Math.ceil(e / layers);
  for (let i = 0; i < e; i++) {
    const layerIdx = Math.floor(i / perLayer);
    const inLayerIdx = i % perLayer;
    const gridDim = Math.ceil(Math.sqrt(perLayer));
    const col = inLayerIdx % gridDim;
    const row = Math.floor(inLayerIdx / gridDim);
    const span = 4.6;
    pos[i * 3]     = (col / (gridDim - 1) - 0.5) * span + (rng() - 0.5) * 0.16;
    pos[i * 3 + 1] = (row / (gridDim - 1) - 0.5) * span * 0.75 + (rng() - 0.5) * 0.16;
    pos[i * 3 + 2] = -layerIdx * 3.4 + 5 + (rng() - 0.5) * 0.25;
  }
  return pos;
}

// Shape 4: Disease Prediction Core Sphere (Av)
function generatePredictionSphere(e) {
  const rng = createLcg(101);
  const pos = new Float32Array(e * 3);
  for (let i = 0; i < e; i++) {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const r = rng() > 0.25 ? 2.1 + rng() * 0.12 : rng() * 1.9;
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.cos(phi);
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return pos;
}

// Shape 5: Confidence Torus Ring (jv)
function generateConfidenceTorus(e, majorR = 1.95) {
  const rng = createLcg(311);
  const pos = new Float32Array(e * 3);
  for (let i = 0; i < e; i++) {
    const theta = (i / e) * Math.PI * 2;
    const minorR = 0.1 + rng() * 0.14;
    const phi = rng() * Math.PI * 2;
    pos[i * 3]     = (majorR + minorR * Math.cos(phi)) * Math.cos(theta);
    pos[i * 3 + 1] = (majorR + minorR * Math.cos(phi)) * Math.sin(theta);
    pos[i * 3 + 2] = minorR * Math.sin(phi) * 2.2;
  }
  return pos;
}

// Shape 6: Diagnosis Report Sheet (Mv)
function generateReportSheet(e) {
  const rng = createLcg(777);
  const pos = new Float32Array(e * 3);
  const width = 3.1;
  const height = 4.2;
  for (let i = 0; i < e; i++) {
    const isBorder = rng() < 0.3;
    let px, py;
    if (isBorder) {
      const u = rng();
      const edge = Math.floor(rng() * 4);
      if (edge === 0) [px, py] = [(u - 0.5) * width, height / 2];
      else if (edge === 1) [px, py] = [(u - 0.5) * width, -height / 2];
      else if (edge === 2) [px, py] = [-width / 2, (u - 0.5) * height];
      else [px, py] = [width / 2, (u - 0.5) * height];
    } else {
      const lineIdx = Math.floor(rng() * 11);
      const lineLen = lineIdx % 3 === 2 ? 0.55 : 0.86;
      px = (rng() - 0.5) * width * lineLen;
      py = height / 2 - 0.42 - lineIdx * 0.34;
    }
    pos[i * 3]     = px;
    pos[i * 3 + 1] = py;
    pos[i * 3 + 2] = (rng() - 0.5) * 0.35;
  }
  return pos;
}

// Shape 7: Folded Prescription Sheet with Signature Wave (Nv)
function generatePrescription(e) {
  const rng = createLcg(9091);
  const pos = new Float32Array(e * 3);
  const width = 2.3;
  const height = 3.4;
  for (let i = 0; i < e; i++) {
    const rVal = rng();
    let px, py, pz;
    if (rVal < 0.28) {
      const u = rng();
      const edge = Math.floor(rng() * 4);
      if (edge === 0) [px, py] = [(u - 0.5) * width, height / 2];
      else if (edge === 1) [px, py] = [(u - 0.5) * width, -height / 2];
      else if (edge === 2) [px, py] = [-width / 2, (u - 0.5) * height];
      else [px, py] = [width / 2, (u - 0.5) * height];
      pz = 0;
    } else if (rVal < 0.42) {
      const wave = rng() * Math.PI * 3;
      px = -width * 0.28 + (wave / (Math.PI * 3)) * width * 0.6;
      py = -1.15 + Math.sin(wave) * 0.16;
      pz = 0;
    } else {
      const lineIdx = Math.floor(rng() * 8);
      px = (rng() - 0.5) * width * (lineIdx % 2 === 0 ? 0.8 : 0.5) - width * 0.05;
      py = height / 2 - 0.7 - lineIdx * 0.32;
      pz = 0;
    }
    pos[i * 3]     = px;
    pos[i * 3 + 1] = py;
    pos[i * 3 + 2] = pz + Math.abs(px) * 0.16 + (rng() - 0.5) * 0.08;
  }
  return pos;
}

// 10 Camera Keyframes extracted 1:1
const CAMERA_KEYFRAMES = [
  { p: 0.00, pos: [0.0, 0.4, 9.2],   look: [0.0, 0.1, 0.0] },
  { p: 0.16, pos: [1.6, 0.2, 6.2],   look: [-0.4, 0.0, 0.0] },
  { p: 0.32, pos: [-1.4, 1.0, 10.5], look: [0.0, 0.0, -1.0] },
  { p: 0.46, pos: [0.6, 0.6, 9.0],   look: [0.0, 0.0, -4.0] },
  { p: 0.56, pos: [0.0, 0.2, 2.6],   look: [0.0, 0.0, -8.0] },
  { p: 0.64, pos: [0.0, 0.0, -1.2],  look: [0.0, 0.0, -10.0] },
  { p: 0.72, pos: [0.0, 0.2, 8.6],   look: [0.0, 0.0, 0.0] },
  { p: 0.82, pos: [0.4, 0.0, 10.6],  look: [0.0, 0.0, 0.0] },
  { p: 0.90, pos: [0.9, 0.3, 9.4],   look: [0.0, 0.0, 0.0] },
  { p: 1.00, pos: [-0.9, 0.1, 8.8],  look: [0.2, 0.0, 0.0] }
];

// Story Panels Copy & Timing Definition
const STORY_PANELS = [
  {
    range: [0.00, 0.16],
    align: 'left',
    badge: '✦ SDPS.AI — SMART DISEASE PREDICTION',
    heading: ['Predicting Wellness,', 'Preventing Illness.'],
    accentLine: 1,
    desc: 'Tell us what you feel. In seconds, our trained machine learning model identifies the most likely disease, measures its certainty, and hands you a complete clinical report — no waiting room required.',
    cta: 'SCROLL TO SEE HOW IT WORKS'
  },
  {
    range: [0.16, 0.34],
    align: 'right',
    badge: 'STEP 01 — INPUT LAYER',
    heading: ['The body', 'becomes signal.'],
    accentLine: 1,
    desc: 'Every symptom you choose is encoded into a binary feature vector — a precise, numerical fingerprint of how you feel right now. The physical dissolves into the mathematical.'
  },
  {
    range: [0.34, 0.50],
    align: 'left',
    badge: 'STEP 02 — FEATURE GRAPH',
    heading: ['Symptoms', 'do not stand alone.'],
    accentLine: 1,
    desc: 'Fever means something different alongside chest pain than alongside a sore throat. Our model maps 132 clinical co-occurrence relationships to read the full picture.'
  },
  {
    range: [0.50, 0.64],
    align: 'right',
    badge: 'STEP 03 — INFERENCE ENGINE',
    heading: ['Inside the', 'prediction engine.'],
    accentLine: 1,
    desc: 'Trained on 4,920 clinical records across 41 disease classes, the Random Forest classifier processes your symptom vector through 100 decision trees simultaneously.'
  },
  {
    range: [0.64, 0.76],
    align: 'center',
    badge: 'STEP 04 — DISEASE CLASSIFICATION',
    heading: ['One answer', 'surfaces.'],
    accentLine: 1,
    desc: 'The ensemble votes converge. A single disease label rises above the noise — ranked by majority agreement across every tree in the forest.'
  },
  {
    range: [0.76, 0.88],
    align: 'left',
    badge: 'STEP 05 — CONFIDENCE CALIBRATION',
    isConfidence: true,
    accentLine: 0,
    desc: 'Certainty is not binary. The system tells you exactly how confident the prediction is — so you can decide how urgently to see a doctor.'
  },
  {
    range: [0.88, 0.94],
    align: 'right',
    badge: 'STEP 06 — CLINICAL REPORT',
    heading: ['Structured.', 'Exportable. Yours.'],
    accentLine: 0,
    desc: 'The predicted condition, your full symptom profile, and the confidence rating are compiled into a structured PDF-ready diagnosis report — saved to your account, accessible across any device.'
  },
  {
    range: [0.92, 1.00],
    align: 'left',
    badge: 'STEP 07 — PREDICT YOUR DISEASE',
    heading: ['Predict your disease,', 'take action today.'],
    accentLine: 0,
    desc: 'Your personalized health report and digital prescription are ready. View recommended clinical precautions, medications, and step-by-step health guidance tailored directly to your diagnosis.',
    isFinal: true
  }
];

const SIDE_LABELS = [
  { max: 0.16, label: 'Input Layer' },
  { max: 0.34, label: 'Feature Graph' },
  { max: 0.50, label: 'Inference' },
  { max: 0.64, label: 'Classification' },
  { max: 0.76, label: 'Confidence' },
  { max: 0.88, label: 'Report' },
  { max: 1.01, label: 'Prescription' }
];

const BOTTOM_NAV = ['Intro', 'Symptoms', 'Network', 'ML Engine', 'Prediction', 'Confidence', 'Report', 'Prescription'];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN REACT COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function LandingPage({ onEnter }) {
  const mountRef = useRef(null);
  const lenisRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const smoothedScrollRef = useRef(0);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSideLabel, setActiveSideLabel] = useState('Symptoms');
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [entering, setEntering] = useState(false);
  const isHashNav = useRef(false); // true while a hashchange-triggered scroll is in progress


  // Initialize Three.js WebGL Scene & Particles
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#f8fafc', 0.045);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 9.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Precompute All 8 3D Morph Targets (Float32Array[6000 * 3])
    const allShapes = [
      generateHeroCloud(COUNT),
      generateSilhouette(COUNT),
      generateNetwork(COUNT),
      generateNeuralGrid(COUNT),
      generatePredictionSphere(COUNT),
      generateConfidenceTorus(COUNT),
      generateReportSheet(COUNT),
      generatePrescription(COUNT)
    ];

    // Colors Array (BufferAttribute)
    const colorArray = new Float32Array(COUNT * 3);
    const rng = createLcg(99);
    for (let i = 0; i < COUNT; i++) {
      const hex = COLOR_HEXES[Math.floor(rng() * COLOR_HEXES.length)];
      const c = new THREE.Color(hex);
      colorArray[i * 3]     = c.r;
      colorArray[i * 3 + 1] = c.g;
      colorArray[i * 3 + 2] = c.b;
    }

    // Live Positions BufferGeometry
    const geometry = new THREE.BufferGeometry();
    const livePositions = new Float32Array(allShapes[0]);
    geometry.setAttribute('position', new THREE.BufferAttribute(livePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    // Points Material with Radial Soft Texture
    const particleTexture = createParticleTexture();
    const material = new THREE.PointsMaterial({
      size: 0.085,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    // ── 4. Dynamic Neural Connection Lines (LineSegments Animation) ──
    const LINE_COUNT = 900;
    const lineConnections = [];
    const groupSize = Math.floor(COUNT / 5);
    const lineRng = createLcg(777);

    for (let i = 0; i < LINE_COUNT; i++) {
      const g = i % 4; // clusters 0 to 3
      const pA = g * groupSize + Math.floor(lineRng() * groupSize);
      const pB = (g + 1) * groupSize + Math.floor(lineRng() * groupSize);
      lineConnections.push([pA, pB]);
    }

    const linePositions = new Float32Array(LINE_COUNT * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color('#6366f1'),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // ── 5. Parallax Background Depth Particles ──
    const BG_COUNT = 900;
    const bgPos = new Float32Array(BG_COUNT * 3);
    const bgRng = createLcg(42);
    for (let i = 0; i < BG_COUNT; i++) {
      bgPos[i * 3]     = (bgRng() - 0.5) * 28;
      bgPos[i * 3 + 1] = (bgRng() - 0.5) * 20;
      bgPos[i * 3 + 2] = bgRng() * 40 - 30;
    }
    const bgGeometry = new THREE.BufferGeometry();
    bgGeometry.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    const bgMaterial = new THREE.PointsMaterial({
      size: 0.05,
      map: particleTexture,
      color: new THREE.Color('#818cf8'),
      transparent: true,
      opacity: 0.4,
      depthWrite: false
    });
    const bgPoints = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(bgPoints);

    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5
    });
    lenisRef.current = lenis;

    lenis.on('scroll', (e) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? e.scroll / maxScroll : 0;
      scrollProgressRef.current = Math.min(1, Math.max(0, progress));
    });

    // Native scroll fallback
    const handleNativeScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      scrollProgressRef.current = Math.min(1, Math.max(0, progress));
    };
    window.addEventListener('scroll', handleNativeScroll, { passive: true });

    // LookAt Target Vector for Smooth Camera Tracking
    const currentLookAt = new THREE.Vector3(0, 0.1, 0);
    const targetLookAt = new THREE.Vector3();
    const targetPos = new THREE.Vector3();

    let animationFrameId;
    let lastTime = performance.now();

    // Main WebGL Ticker Animation Loop
    const animate = (now) => {
      animationFrameId = requestAnimationFrame(animate);

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Update Lenis
      lenis.raf(now);

      // Smooth scroll progress using exponential dampening (lambda = 6.5)
      smoothedScrollRef.current += (scrollProgressRef.current - smoothedScrollRef.current) * (1 - Math.exp(-6.5 * dt));
      const p = smoothedScrollRef.current;

      setScrollProgress(p);

      // 1. Camera Keyframe Interpolation
      let kIdx = 0;
      while (kIdx < CAMERA_KEYFRAMES.length - 2 && p > CAMERA_KEYFRAMES[kIdx + 1].p) {
        kIdx++;
      }
      const kStart = CAMERA_KEYFRAMES[kIdx];
      const kEnd = CAMERA_KEYFRAMES[kIdx + 1];
      const kRange = Math.max(1e-4, kEnd.p - kStart.p);
      const localT = smoothstep((p - kStart.p) / kRange);

      targetPos.set(
        lerp(kStart.pos[0], kEnd.pos[0], localT),
        lerp(kStart.pos[1], kEnd.pos[1], localT),
        lerp(kStart.pos[2], kEnd.pos[2], localT)
      );

      targetLookAt.set(
        lerp(kStart.look[0], kEnd.look[0], localT),
        lerp(kStart.look[1], kEnd.look[1], localT),
        lerp(kStart.look[2], kEnd.look[2], localT)
      );

      camera.position.lerp(targetPos, 1 - Math.exp(-9 * dt));
      currentLookAt.lerp(targetLookAt, 1 - Math.exp(-9 * dt));
      camera.lookAt(currentLookAt);

      // 2. 3D Particle Morphing between 8 Shapes
      const shapeSpan = (allShapes.length - 1);
      const rawShapeIndex = p * shapeSpan;
      const sIdxA = Math.min(Math.floor(rawShapeIndex), allShapes.length - 2);
      const sIdxB = sIdxA + 1;
      const morphT = smoothstep(rawShapeIndex - sIdxA);

      const shapeA = allShapes[sIdxA];
      const shapeB = allShapes[sIdxB];
      const positions = geometry.attributes.position.array;

      const timeVal = now * 0.001;

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const targetX = lerp(shapeA[i3], shapeB[i3], morphT);
        const targetY = lerp(shapeA[i3 + 1], shapeB[i3 + 1], morphT);
        const targetZ = lerp(shapeA[i3 + 2], shapeB[i3 + 2], morphT);

        // Subtle ambient organic floating displacement
        const wave = Math.sin(timeVal * 1.5 + i * 0.1) * 0.015;

        positions[i3]     += (targetX - positions[i3]) * (1 - Math.exp(-12 * dt)) + wave;
        positions[i3 + 1] += (targetY - positions[i3 + 1]) * (1 - Math.exp(-12 * dt)) + wave;
        positions[i3 + 2] += (targetZ - positions[i3 + 2]) * (1 - Math.exp(-12 * dt));
      }

      geometry.attributes.position.needsUpdate = true;

      // 3. Update Neural Connection Lines (Connecting Particle Coordinates)
      const linePosArray = lineGeometry.attributes.position.array;
      for (let i = 0; i < LINE_COUNT; i++) {
        const [pA, pB] = lineConnections[i];
        const idx6 = i * 6;
        const a3 = pA * 3;
        const b3 = pB * 3;

        linePosArray[idx6]     = positions[a3];
        linePosArray[idx6 + 1] = positions[a3 + 1];
        linePosArray[idx6 + 2] = positions[a3 + 2];

        linePosArray[idx6 + 3] = positions[b3];
        linePosArray[idx6 + 4] = positions[b3 + 1];
        linePosArray[idx6 + 5] = positions[b3 + 2];
      }
      lineGeometry.attributes.position.needsUpdate = true;

      // Dynamic Lining Opacity (Step 02 & 03: Feature Graph & Inference Network)
      let lineOpacity = 0;
      if (p >= 0.22 && p <= 0.74) {
        const fadeIn = smoothstep(Math.max(0, Math.min(1, (p - 0.22) / 0.12)));
        const fadeOut = 1 - smoothstep(Math.max(0, Math.min(1, (p - 0.62) / 0.12)));
        lineOpacity = fadeIn * fadeOut * 0.38;
      }
      lineMaterial.opacity = lineOpacity;

      // 4. Gentle scene rotation on Y axis
      const sceneRotY = p * 0.4 + Math.sin(timeVal * 0.2) * 0.04;
      pointCloud.rotation.y = sceneRotY;
      lineSegments.rotation.y = sceneRotY;

      // 5. Parallax Depth on Background Points
      bgPoints.position.z = p * 16;
      bgPoints.rotation.y = p * 0.12;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Handle Window Resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleNativeScroll);
      lenis.destroy();
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      bgGeometry.dispose();
      bgMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Side Progress Label & Confidence Score Counter
  useEffect(() => {
    const labelObj = SIDE_LABELS.find(item => scrollProgress <= item.max) || SIDE_LABELS[SIDE_LABELS.length - 1];
    setActiveSideLabel(labelObj.label);

    // Step 5 Confidence Score Range (0.76 - 0.88)
    if (scrollProgress >= 0.74 && scrollProgress <= 0.90) {
      const norm = (scrollProgress - 0.74) / (0.88 - 0.74);
      const score = Math.round(smoothstep(Math.min(1, Math.max(0, norm))) * 94);
      setConfidenceScore(score);
    } else if (scrollProgress < 0.74) {
      setConfidenceScore(0);
    } else {
      setConfidenceScore(94);
    }
  }, [scrollProgress]);

  // ───────────────────────────────────────────────────────────────────────────────
  //  BROWSER BACK / FORWARD BUTTON SUPPORT
  //  Strategy: pushState changes only the URL hash (#step-0 … #step-7).
  //  When the user presses Back or Forward the browser fires BOTH popstate
  //  AND hashchange (because the hash changed).  We listen to hashchange —
  //  it is the most reliable event for within-page hash navigation.
  // ───────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Helper: scroll to a step index (does NOT push a new history entry)
    const scrollToStep = (stepIdx) => {
      const targetP = PANEL_TARGETS[stepIdx] ?? 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const targetPx = targetP * maxScroll;
      isHashNav.current = true;
      if (lenisRef.current) {
        lenisRef.current.scrollTo(targetPx, { duration: 1.0, force: true });
      } else {
        window.scrollTo({ top: targetPx, behavior: 'smooth' });
      }
      // Allow enough time for the scroll to start before we re-enable push
      setTimeout(() => { isHashNav.current = false; }, 300);
    };

    // Parse '#step-N' from the current URL hash
    const stepFromHash = (hash) => {
      const m = hash.match(/#step-(\d+)/);
      return m ? Math.min(parseInt(m[1], 10), PANEL_TARGETS.length - 1) : null;
    };

    // Check if mounting with a specific hash (e.g. #step-7 when returning from Login page)
    const initialStep = stepFromHash(window.location.hash);
    if (initialStep !== null && initialStep > 0) {
      setTimeout(() => scrollToStep(initialStep), 120);
    } else {
      history.replaceState(null, '', '#step-0');
    }

    // hashchange fires whenever the user presses Back or Forward
    // and the hash portion of the URL changes (i.e. #step-2 → #step-1)
    const onHashChange = () => {
      const stepIdx = stepFromHash(window.location.hash);
      if (stepIdx !== null) scrollToStep(stepIdx);
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []); // empty deps — PANEL_TARGETS is module-level and lenisRef is a ref

  // Enter to Login transition (Back from app/login restores the landing page)
  const handleEnter = useCallback(() => {
    setEntering(true);
    sessionStorage.setItem('sdps_landing_done', '1');
    // Push an entry so pressing Back from the login/app returns here
    history.pushState(null, '', '#app');
    setTimeout(() => onEnter(), 650);
  }, [onEnter]);

  // Helper to determine the current active nav step index (0 to 7)
  const getActiveNavIndex = () => {
    if (scrollProgress < 0.16) return 0;
    if (scrollProgress < 0.34) return 1;
    if (scrollProgress < 0.50) return 2;
    if (scrollProgress < 0.64) return 3;
    if (scrollProgress < 0.76) return 4;
    if (scrollProgress < 0.88) return 5;
    if (scrollProgress < 0.95) return 6;
    return 7;
  };

  // Jump to a step (smooth scroll + push a #step-N history entry so Back works)
  const handleNavClick = (idx) => {
    const targetP = PANEL_TARGETS[idx] ?? 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetPx = targetP * maxScroll;

    // Smooth scroll via Lenis (or native fallback)
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetPx, { duration: 1.1 });
    } else {
      window.scrollTo({ top: targetPx, behavior: 'smooth' });
    }

    // Push a hash history entry — skip if scroll was already triggered by hashchange
    if (!isHashNav.current) {
      history.pushState(null, '', `#step-${idx}`);
    }
  };

  // Advance smoothly to the next step
  const handleNextStep = (currentIdx) => {
    const nextIdx = Math.min(currentIdx + 1, PANEL_TARGETS.length - 1);
    handleNavClick(nextIdx);
  };

  // Helper to compute opacity, translate, and blur for each story panel
  const getPanelStyle = (panel, idx) => {
    const [start, end] = panel.range;

    // For the very first panel (Hero / Intro), keep it 100% visible at the top
    if (idx === 0) {
      if (scrollProgress <= 0.05) {
        return { opacity: 1, transform: 'translateY(0px)', filter: 'none', pointerEvents: 'auto' };
      }
      const fadeProgress = (scrollProgress - 0.05) / (end - 0.05);
      const opacity = smoothstep(Math.max(0, Math.min(1, 1 - fadeProgress * 1.5)));
      const ty = (1 - opacity) * 28;
      const blur = (1 - opacity) * 6;
      return {
        opacity,
        transform: `translateY(${ty}px)`,
        filter: blur > 0.4 ? `blur(${blur}px)` : 'none',
        pointerEvents: opacity > 0.6 ? 'auto' : 'none'
      };
    }

    // For the final panel (Step 07 / Predict Your Disease), permanently lock it in view from 0.94 to 1.00 (end of page)
    if (panel.isFinal || idx === STORY_PANELS.length - 1) {
      if (scrollProgress >= 0.94) {
        return { opacity: 1, transform: 'translateY(0px)', filter: 'none', pointerEvents: 'auto' };
      }
      if (scrollProgress < start) {
        return { opacity: 0, transform: 'translateY(24px)', filter: 'blur(8px)', pointerEvents: 'none' };
      }
      const fadeInProgress = (scrollProgress - start) / (0.94 - start);
      const opacity = smoothstep(Math.max(0, Math.min(1, fadeInProgress * 1.4)));
      const ty = (1 - opacity) * 28;
      const blur = (1 - opacity) * 6;
      return {
        opacity,
        transform: `translateY(${ty}px)`,
        filter: blur > 0.4 ? `blur(${blur}px)` : 'none',
        pointerEvents: opacity > 0.6 ? 'auto' : 'none'
      };
    }

    // Standard middle story panels (Steps 1 to 6)
    const mid = (start + end) / 2;
    const halfSpan = (end - start) / 2;
    const dist = Math.abs(scrollProgress - mid);

    if (dist > halfSpan * 1.25) {
      return { opacity: 0, transform: 'translateY(24px)', filter: 'blur(8px)', pointerEvents: 'none' };
    }

    const inRange = 1 - (dist / halfSpan);
    const opacity = smoothstep(Math.max(0, Math.min(1, inRange * 1.4)));
    const ty = (1 - opacity) * 28;
    const blur = (1 - opacity) * 6;

    return {
      opacity,
      transform: `translateY(${ty}px)`,
      filter: blur > 0.4 ? `blur(${blur}px)` : 'none',
      pointerEvents: opacity > 0.6 ? 'auto' : 'none'
    };
  };

  return (
    <div className="relative bg-[#f8fafc] text-slate-900 font-sans select-none overflow-x-hidden">

      {/* ══ Fixed Fullscreen 3D WebGL Canvas Container ══ */}
      <div
        ref={mountRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ width: '100vw', height: '100vh' }}
      />

      {/* ══ Fixed Top Header Bar ══ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 border-b border-indigo-100/60 bg-slate-50/85 backdrop-blur-xl shadow-xs"
        style={{ height: `${HEADER_H}px` }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/30">
            S
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight text-lg">
            SDPS<span className="text-indigo-600">.ai</span>
          </span>
        </div>

        <button
          onClick={() => handleNextStep(getActiveNavIndex())}
          className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.24em] text-slate-400 hover:text-indigo-600 uppercase transition-colors duration-200 cursor-pointer"
          title="Click to advance to next step"
        >
          <span>SCROLL OR CLICK TO TRAVEL</span>
          <span className="text-xs">↓</span>
        </button>

        <button
          onClick={handleEnter}
          className="text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-full border border-indigo-500/40 text-indigo-600 bg-indigo-50/60 hover:bg-indigo-600 hover:text-white transition-all duration-200 shadow-xs active:scale-95 cursor-pointer"
        >
          Skip to App →
        </button>
      </header>

      {/* ══ Fixed Top Progress Bar ══ */}
      <div
        className="fixed left-0 right-0 z-49 h-[2.5px] bg-indigo-100/60"
        style={{ top: `${HEADER_H}px` }}
      >
        <div
          className="h-full bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 transition-all duration-75"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* ══ Fixed Right Vertical Progress Track & Label (1:1 Reference) ══ */}
      <div
        onClick={() => handleNextStep(getActiveNavIndex())}
        className="fixed right-6 sm:right-10 top-1/2 -translate-y-1/2 z-40 hidden md:flex items-center gap-4 cursor-pointer group"
        title="Click to advance to next step"
      >
        {/* Dynamic Vertical Text Label */}
        <span
          className="text-[11px] font-extrabold tracking-[0.3em] uppercase text-indigo-600/90 group-hover:text-indigo-800 transition-all duration-300"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {activeSideLabel}
        </span>

        {/* Vertical Track & Indicator Line */}
        <div className="relative w-[2px] h-36 bg-indigo-100/80 rounded-full overflow-hidden group-hover:w-[3px] transition-all">
          <div
            className="absolute top-0 left-0 right-0 bg-indigo-600 rounded-full transition-transform duration-75 origin-top"
            style={{
              height: '100%',
              transform: `scaleY(${scrollProgress})`
            }}
          />
        </div>
      </div>

      {/* ══ Fixed Story Panels Overlay Container ══ */}
      <main className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center">
        {STORY_PANELS.map((panel, idx) => {
          const style = getPanelStyle(panel, idx);
          const isLeft = panel.align === 'left';
          const isRight = panel.align === 'right';
          const isCenter = panel.align === 'center';

          return (
            <div
              key={idx}
              className={`absolute inset-0 flex items-center px-6 sm:px-16 lg:px-24 transition-all duration-300 ${
                isLeft ? 'justify-start' : isRight ? 'justify-end' : 'justify-center text-center'
              }`}
              style={style}
            >
              <div className={`max-w-lg w-full ${isCenter ? 'mx-auto' : ''}`}>
                {/* Step Badge */}
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 mb-5 text-[11px] font-extrabold tracking-[0.2em] uppercase bg-indigo-50/90 text-indigo-600 border border-indigo-200/60 shadow-xs">
                  {panel.badge}
                </div>

                {/* Heading */}
                {panel.heading && (
                  <h2 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-black text-slate-900 leading-[1.06] tracking-tight mb-5">
                    {panel.heading.map((line, li) => (
                      <span
                        key={li}
                        className={li === panel.accentLine
                          ? 'block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-600'
                          : 'block'
                        }
                      >
                        {line}
                      </span>
                    ))}
                  </h2>
                )}

                {/* Step 05 Dynamic Confidence Percentage Counter */}
                {panel.isConfidence && (
                  <div className="mb-6">
                    <div className="text-[5.5rem] sm:text-[7rem] lg:text-[8.5rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 leading-none tabular-nums">
                      {confidenceScore}%
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-indigo-400 to-violet-400 opacity-60" />
                      <span className="text-xs font-extrabold tracking-[0.28em] uppercase text-indigo-600/80">
                        CONFIDENCE SCORE
                      </span>
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
                  {panel.desc}
                </p>

                {/* Hero Scroll CTA Button */}
                {panel.cta && (
                  <div className="mt-8">
                    <button
                      onClick={() => handleNextStep(0)}
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-indigo-50 border border-indigo-200/80 text-xs font-extrabold tracking-[0.2em] text-indigo-600 uppercase hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200 shadow-xs cursor-pointer pointer-events-auto active:scale-95"
                    >
                      <span className="inline-block animate-bounce">↓</span>
                      {panel.cta}
                    </button>
                  </div>
                )}

                {/* Step Transition Action Button on Steps 1 through 6 */}
                {!panel.cta && !panel.isFinal && (
                  <div className="mt-8">
                    <button
                      onClick={() => handleNextStep(idx)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200/70 text-xs font-bold tracking-wider text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200 shadow-xs cursor-pointer pointer-events-auto active:scale-95"
                    >
                      <span>Next Step</span>
                      <span className="text-sm">→</span>
                    </button>
                  </div>
                )}

                {/* Step 07 Final Get Started CTA */}
                {panel.isFinal && (
                  <div className="mt-8 flex flex-col items-center sm:items-start">
                    <button
                      onClick={handleEnter}
                      className="group inline-flex flex-col items-center sm:items-start px-8 py-3.5 rounded-2xl text-white font-extrabold bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/35 transition-all duration-300 cursor-pointer pointer-events-auto border border-white/20"
                    >
                      <div className="inline-flex items-center gap-2.5 text-base leading-tight">
                        <span>Predict Your Disease</span>
                        <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                      <span className="text-[10px] font-medium text-indigo-200/90 tracking-wide mt-0.5">
                        Crafted with purpose by Harsh Patel
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* ══ Fixed Bottom Navigation Bar (1:1 Reference) ══ */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-40 hidden sm:flex items-center justify-center gap-1.5 py-3 px-6 bg-slate-50/85 backdrop-blur-xl border-t border-indigo-100/60 shadow-lg"
      >
        {BOTTOM_NAV.map((label, idx) => {
          const isActive = getActiveNavIndex() === idx;

          return (
            <React.Fragment key={label}>
              <button
                onClick={() => handleNavClick(idx)}
                className={`text-[11px] font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/60'
                }`}
              >
                {label}
              </button>
              {idx < BOTTOM_NAV.length - 1 && (
                <span className="text-[10px] text-slate-300 font-bold select-none">→</span>
              )}
            </React.Fragment>
          );
        })}
      </footer>

      {/* ══ Dummy Spacer Scroll Container (900vh) for Smooth Scrollytelling ══ */}
      <div className="relative z-0" style={{ height: '900vh', pointerEvents: 'none' }} />

      {/* Fade-out Overlay on Skip/Enter */}
      <div
        className="fixed inset-0 z-60 pointer-events-none bg-[#f8fafc] transition-opacity duration-700"
        style={{ opacity: entering ? 1 : 0 }}
      />
    </div>
  );
}
