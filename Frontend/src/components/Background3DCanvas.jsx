import React, { useEffect, useRef } from 'react';

export const Background3DCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const isMobile = () => window.innerWidth < 768;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const FOCAL_LENGTH = 450;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      if (isMobile()) return; // skip parallax on mobile
      const centerX = width >= 1024 ? width * 0.76 : width / 2;
      targetMouseX = (e.clientX - centerX) * 0.14;
      targetMouseY = (e.clientY - height / 2) * 0.14;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Color Palette for Attractive 3D Medical DNA
    const strand1Colors = ['#6366f1', '#4f46e5', '#3b82f6', '#06b6d4'];
    const strand2Colors = ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

    // Generate 3D DNA Helix Nodes
    const nodes = [];
    const NUM_PAIRS = 48;
    for (let i = 0; i < NUM_PAIRS; i++) {
      const angle = (i / NUM_PAIRS) * Math.PI * 7;
      const radius = 150;
      const y = (i - NUM_PAIRS / 2) * 26;

      nodes.push({
        x: Math.cos(angle) * radius,
        y: y,
        z: Math.sin(angle) * radius,
        type: 'dna_1',
        radius: 4.5,
        color: strand1Colors[i % strand1Colors.length]
      });

      nodes.push({
        x: Math.cos(angle + Math.PI) * radius,
        y: y,
        z: Math.sin(angle + Math.PI) * radius,
        type: 'dna_2',
        radius: 4.5,
        color: strand2Colors[i % strand2Colors.length]
      });
    }

    // Floating Ambient Energy Nanoparticles
    for (let i = 0; i < 32; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 550,
        y: (Math.random() - 0.5) * 750,
        z: (Math.random() - 0.5) * 450,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4,
        type: 'floating',
        radius: 2.5 + Math.random() * 3,
        color: Math.random() > 0.5 ? '#10b981' : '#f43f5e'
      });
    }

    let rotationY = 0;
    let rotationX = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      rotationY += 0.009;
      rotationX = Math.sin(rotationY * 0.4) * 0.14;

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      // On desktop, origin aligns with right sign-in section; on mobile, dead center
      const originX = width >= 1024 ? width * 0.76 : width / 2;
      const originY = height / 2;

      const projectedNodes = [];

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        if (n.type === 'floating') {
          n.x += n.vx;
          n.y += n.vy;
          n.z += n.vz;

          if (Math.abs(n.x) > 320) n.vx *= -1;
          if (Math.abs(n.y) > 420) n.vy *= -1;
          if (Math.abs(n.z) > 280) n.vz *= -1;
        }

        let x1 = n.x * cosY - n.z * sinY;
        let z1 = n.z * cosY + n.x * sinY;

        let y1 = n.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + n.y * sinX;

        x1 += mouseX * (1 + z2 / 1000);
        y1 += mouseY * (1 + z2 / 1000);

        const scale = FOCAL_LENGTH / (FOCAL_LENGTH + z2 + 400);
        const screenX = originX + x1 * scale;
        const screenY = originY + y1 * scale;

        projectedNodes.push({
          screenX,
          screenY,
          scale,
          z: z2,
          color: n.color,
          radius: n.radius * scale,
          type: n.type
        });
      }

      // Draw DNA Rung Lines with Glowing Gradients
      for (let i = 0; i < NUM_PAIRS; i++) {
        const p1 = projectedNodes[i * 2];
        const p2 = projectedNodes[i * 2 + 1];

        if (p1 && p2 && p1.scale > 0 && p2.scale > 0) {
          const avgZ = (p1.z + p2.z) / 2;
          const alpha = Math.max(0.15, Math.min(0.7, (avgZ + 450) / 900));

          const grad = ctx.createLinearGradient(p1.screenX, p1.screenY, p2.screenX, p2.screenY);
          grad.addColorStop(0, p1.color);
          grad.addColorStop(1, p2.color);

          ctx.beginPath();
          ctx.moveTo(p1.screenX, p1.screenY);
          ctx.lineTo(p2.screenX, p2.screenY);
          ctx.strokeStyle = grad;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 2.2 * p1.scale;
          ctx.stroke();
        }
      }

      // Draw Molecular Links
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];

          const dx = n1.screenX - n2.screenX;
          const dy = n1.screenY - n2.screenY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 95) {
            const alpha = (1 - dist / 95) * 0.35 * n1.scale;
            ctx.beginPath();
            ctx.moveTo(n1.screenX, n1.screenY);
            ctx.lineTo(n2.screenX, n2.screenY);
            ctx.strokeStyle = n1.color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Sort nodes by Z depth (painter's algorithm)
      const sortedNodes = [...projectedNodes].sort((a, b) => b.z - a.z);

      for (let i = 0; i < sortedNodes.length; i++) {
        const p = sortedNodes[i];
        if (p.scale <= 0) continue;

        const alpha = Math.max(0.35, Math.min(0.95, (p.z + 450) / 900));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, Math.max(2, p.radius * 1.5), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12 * p.scale;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: 'transparent',
        opacity: window.innerWidth < 768 ? 0.35 : 1,
      }}
    />
  );
};
