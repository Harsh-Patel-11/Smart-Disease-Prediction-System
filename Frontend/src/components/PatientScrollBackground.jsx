import React, { useEffect, useRef } from 'react';

/**
 * PatientScrollBackground
 * 
 * A scroll-driven 3D canvas background inspired by mont-fort.com.
 * Features: perspective wave terrain mesh, floating DNA double helix,
 * glowing particle orbs with depth parallax, ambient light blobs,
 * and floating medical cross marks.
 * 
 * Pass scrollContainerRef to hook into a specific scroll container.
 * Falls back to window scroll if not provided.
 */
export const PatientScrollBackground = ({ scrollContainerRef }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const scrollRef = useRef(0);
  const maxScrollRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const mobile = window.innerWidth < 640;

    let W = 0, H = 0;

    const setSize = () => {
      const parent = canvas.parentElement;
      W = parent.offsetWidth;
      H = parent.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    setSize();

    const onResize = () => {
      setSize();
      initParticles();
      initGrid();
    };
    window.addEventListener('resize', onResize);

    // Determine scroll host
    const getScrollHost = () => scrollContainerRef?.current || window;

    const handleScroll = (e) => {
      const host = scrollContainerRef?.current;
      if (host) {
        scrollRef.current = host.scrollTop;
        maxScrollRef.current = host.scrollHeight - host.clientHeight || 1;
      } else {
        scrollRef.current = window.scrollY || document.documentElement.scrollTop;
        maxScrollRef.current = document.documentElement.scrollHeight - window.innerHeight || 1;
      }
    };

    let scrollHost = getScrollHost();
    scrollHost.addEventListener('scroll', handleScroll, { passive: true });

    // ─── PARTICLES: floating glowing orbs ───────────────────────────────────
    const NUM_PARTICLES = mobile ? 20 : 55;
    let particles = [];

    const initParticles = () => {
      particles = Array.from({ length: NUM_PARTICLES }, (_, i) => ({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random(),
        r: 2 + Math.random() * 4.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.08 - Math.random() * 0.18,
        opacity: 0.18 + Math.random() * 0.45,
        hue: 210 + Math.floor(Math.random() * 90),
        phase: Math.random() * Math.PI * 2,
        speed: 0.006 + Math.random() * 0.014,
      }));
    };
    initParticles();

    // ─── WAVE GRID: 3D-perspective terrain mesh ──────────────────────────────
    const COLS = mobile ? 10 : 20;
    const ROWS = mobile ? 7 : 13;
    let gridPoints = [];

    const initGrid = () => {
      gridPoints = [];
      for (let row = 0; row <= ROWS; row++) {
        const rowArr = [];
        for (let col = 0; col <= COLS; col++) {
          rowArr.push({
            bx: (col / COLS) * W,
            by: (row / ROWS) * H,
            phase: col * 0.45 + row * 0.6 + Math.random() * 1.2,
            amp: 10 + Math.random() * 18,
            freq: 0.007 + Math.random() * 0.006,
          });
        }
        gridPoints.push(rowArr);
      }
    };
    initGrid();

    // ─── DNA PAIRS ───────────────────────────────────────────────────────────
    const DNA_PAIRS = 26;

    // ─── MEDICAL CROSS MARKS ─────────────────────────────────────────────────
    const marks = Array.from({ length: 10 }, () => ({
      x: Math.random() * (W || 800),
      y: Math.random() * (H || 600),
      size: 7 + Math.random() * 9,
      opacity: 0.06 + Math.random() * 0.1,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -0.08 - Math.random() * 0.15,
      rot: Math.random() * Math.PI,
      rotV: (Math.random() - 0.5) * 0.004,
    }));

    let t = 0;

    const draw = () => {
      t += 0.007;
      const scroll = scrollRef.current;
      const maxScroll = maxScrollRef.current;
      const scrollFactor = Math.min(scroll / maxScroll, 1);

      ctx.clearRect(0, 0, W, H);

      // ── Background gradient (shifts subtly on scroll) ─────────────────────
      const grd = ctx.createLinearGradient(0, 0, 0, H);
      const topR = Math.round(248 - scrollFactor * 8);
      const topG = Math.round(250 - scrollFactor * 10);
      grd.addColorStop(0, `rgb(${topR},${topG},252)`);
      grd.addColorStop(0.45, `rgba(235,240,255,1)`);
      grd.addColorStop(1, `rgba(240,235,255,1)`);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // ── 3D Wave Terrain Mesh ───────────────────────────────────────────────
      const scrollOffset = scroll * 0.06;
      const perspShift = scrollFactor * H * 0.22;

      const getXY = (p) => {
        const wave = Math.sin(t * 0.65 + p.phase + scrollOffset * p.freq * 0.4) * p.amp;
        const perspective = 0.55 + (p.by / H) * 0.45;
        const x = W / 2 + (p.bx - W / 2) * perspective;
        const y = p.by * perspective + perspShift + wave;
        return [x, y];
      };

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const pts = [
            gridPoints[row][col],
            gridPoints[row][col + 1],
            gridPoints[row + 1][col + 1],
            gridPoints[row + 1][col],
          ].map(getXY);

          const rowProgress = row / ROWS;
          const alpha = 0.035 + rowProgress * 0.055;
          const hue = 218 + rowProgress * 28;

          ctx.beginPath();
          ctx.moveTo(...pts[0]);
          ctx.lineTo(...pts[1]);
          ctx.lineTo(...pts[2]);
          ctx.lineTo(...pts[3]);
          ctx.closePath();
          ctx.strokeStyle = `hsla(${hue},68%,60%,${alpha * 1.8})`;
          ctx.lineWidth = 0.55;
          ctx.stroke();
          ctx.fillStyle = `hsla(${hue},55%,85%,${alpha * 0.38})`;
          ctx.fill();
        }
      }

      // ── DNA Double Helix ──────────────────────────────────────────────────
      const helixYBase = H * 0.70 + Math.sin(t * 0.28) * 8;
      const helixY = helixYBase - scrollFactor * H * 0.12;
      const helixXStart = W * 0.08 - scrollFactor * W * 0.04;
      const helixXEnd = W * 0.92;
      const helixW = helixXEnd - helixXStart;
      const helixAmp = Math.min(H * 0.038, 30);

      for (let i = 0; i < DNA_PAIRS; i++) {
        const frac = i / (DNA_PAIRS - 1);
        const xPos = helixXStart + frac * helixW;
        const phase1 = t * 0.75 + frac * Math.PI * 4.2;
        const y1H = helixY + Math.sin(phase1) * helixAmp;
        const y2H = helixY + Math.sin(phase1 + Math.PI) * helixAmp;
        const depthAlpha = 0.55 + 0.45 * Math.abs(Math.sin(phase1));

        if (i < DNA_PAIRS - 1) {
          const nextFrac = (i + 1) / (DNA_PAIRS - 1);
          const nextX = helixXStart + nextFrac * helixW;
          const nextPhase = t * 0.75 + nextFrac * Math.PI * 4.2;
          const nextY1 = helixY + Math.sin(nextPhase) * helixAmp;
          const nextY2 = helixY + Math.sin(nextPhase + Math.PI) * helixAmp;

          ctx.beginPath();
          ctx.moveTo(xPos, y1H);
          ctx.lineTo(nextX, nextY1);
          ctx.strokeStyle = `rgba(99,102,241,0.22)`;
          ctx.lineWidth = 1.1;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(xPos, y2H);
          ctx.lineTo(nextX, nextY2);
          ctx.strokeStyle = `rgba(139,92,246,0.20)`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }

        // Connecting rungs every 2nd pair
        if (i % 2 === 0) {
          const rGrad = ctx.createLinearGradient(xPos, y1H, xPos, y2H);
          rGrad.addColorStop(0, `rgba(99,102,241,${depthAlpha * 0.28})`);
          rGrad.addColorStop(0.5, `rgba(192,132,252,0.12)`);
          rGrad.addColorStop(1, `rgba(139,92,246,${depthAlpha * 0.28})`);
          ctx.beginPath();
          ctx.moveTo(xPos, y1H);
          ctx.lineTo(xPos, y2H);
          ctx.strokeStyle = rGrad;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(xPos, y1H, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${depthAlpha * 0.55})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(xPos, y2H, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${(1 - depthAlpha * 0.4) * 0.55})`;
        ctx.fill();
      }

      // ── Floating Orbs (particles) ─────────────────────────────────────────
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.speed;
        const pulse = Math.sin(p.phase);
        const currentR = p.r * (0.82 + 0.18 * pulse);
        const currentOpacity = p.opacity * (0.7 + 0.3 * Math.abs(pulse));
        const parallax = p.z * scrollFactor * 55;
        const drawY = p.y - parallax;
        const size = currentR * (0.5 + p.z * 0.5);

        if (p.x < -15) p.x = W + 15;
        if (p.x > W + 15) p.x = -15;
        if (p.y < -15) p.y = H + 15;
        if (p.y > H + 15) p.y = -15;

        const glow = ctx.createRadialGradient(p.x, drawY, 0, p.x, drawY, size * 3.2);
        glow.addColorStop(0, `hsla(${p.hue},78%,70%,${currentOpacity * 0.75})`);
        glow.addColorStop(0.5, `hsla(${p.hue},68%,65%,${currentOpacity * 0.25})`);
        glow.addColorStop(1, `hsla(${p.hue},58%,60%,0)`);
        ctx.beginPath();
        ctx.arc(p.x, drawY, size * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, drawY, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},85%,72%,${currentOpacity})`;
        ctx.fill();
      });

      // ── Connection lines between nearby particles ─────────────────────────
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const pA = a.z * scrollFactor * 55;
          const pB = b.z * scrollFactor * 55;
          const dx = a.x - b.x;
          const dy = (a.y - pA) - (b.y - pB);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 85) {
            const alpha = (1 - dist / 85) * 0.1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y - pA);
            ctx.lineTo(b.x, b.y - pB);
            ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // ── Medical Cross Marks ───────────────────────────────────────────────
      marks.forEach(m => {
        m.x += m.vx;
        m.y += m.vy;
        m.rot += m.rotV;
        if (m.x < -25) m.x = W + 25;
        if (m.x > W + 25) m.x = -25;
        if (m.y < -25) m.y = H + 30;

        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rot);
        ctx.strokeStyle = `rgba(99,102,241,${m.opacity})`;
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-m.size, 0); ctx.lineTo(m.size, 0);
        ctx.moveTo(0, -m.size); ctx.lineTo(0, m.size);
        ctx.stroke();
        ctx.restore();
      });

      // ── Large ambient light blobs (like mont-fort fog/glow) ───────────────
      const drawBlob = (bx, by, radius, r, g, b, alpha) => {
        const blob = ctx.createRadialGradient(bx, by, 0, bx, by, radius);
        blob.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        blob.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = blob;
        ctx.fillRect(0, 0, W, H);
      };

      drawBlob(
        W * 0.78 + Math.sin(t * 0.14) * 55,
        H * 0.18 + Math.cos(t * 0.11) * 38 - scrollFactor * H * 0.28,
        300, 99, 102, 241, 0.09
      );
      drawBlob(
        W * 0.18 + Math.cos(t * 0.09) * 45,
        H * 0.68 + Math.sin(t * 0.12) * 30 - scrollFactor * H * 0.14,
        270, 139, 92, 246, 0.08
      );
      drawBlob(
        W * 0.5 + Math.sin(t * 0.07) * 40,
        H * 0.42 + Math.cos(t * 0.1) * 35 - scrollFactor * H * 0.2,
        220, 167, 139, 250, 0.05
      );

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      scrollHost.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: window.innerWidth < 640 ? 0.4 : 1,
      }}
    />
  );
};
