import React from 'react';

export const SideMedicalPulseAnimation = () => {
  return (
    <div className="hidden sm:block absolute inset-0 pointer-events-none overflow-hidden z-0">
      
      {/* Top-Right Side Floating Glowing Pulse Wave & Ring */}
      <div className="absolute top-10 right-6 sm:right-12 flex items-center gap-3 animate-float">
        <div className="relative w-14 h-14 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping opacity-75" />
          <div className="absolute inset-2 rounded-full border-2 border-indigo-400/50 animate-spin-slow" />
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/40 text-white font-bold text-[10px]">
            AI
          </div>
        </div>

        {/* Live EKG Heartbeat Line SVG (Top Side) */}
        <div className="hidden sm:block">
          <svg className="w-36 h-10 stroke-indigo-500" fill="none" viewBox="0 0 140 40">
            <path
              d="M0 20 H30 L38 5 L46 35 L54 10 L62 28 L70 20 H140"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-shimmer-path"
              style={{ strokeDasharray: 200, strokeDashoffset: 0 }}
            />
          </svg>
        </div>
      </div>

      {/* Bottom-Left Side Floating Glowing Energy Node */}
      <div className="absolute bottom-12 left-6 sm:left-12 flex items-center gap-3 animate-float" style={{ animationDelay: '2s' }}>
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
          <div className="absolute inset-1 rounded-full border-2 border-emerald-400/60 border-dashed animate-slow-spin" />
          <div className="w-5 h-5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/40" />
        </div>

        <div className="hidden sm:block">
          <svg className="w-32 h-10 stroke-emerald-500" fill="none" viewBox="0 0 140 40">
            <path
              d="M0 20 H40 L48 8 L56 32 L64 16 L72 20 H140"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Vertical Animated ECG Pulse Bars framing the right side of the Sign-In card */}
      <div className="absolute top-1/3 right-3 hidden xl:flex flex-col gap-2 items-center">
        {[40, 65, 30, 80, 50, 95, 45, 70, 35].map((h, i) => (
          <div
            key={i}
            className="w-1.5 bg-gradient-to-t from-indigo-500 to-violet-500 rounded-full transition-all duration-300 animate-pulse"
            style={{
              height: `${h * 0.4}px`,
              animationDelay: `${i * 0.15}s`,
              opacity: 0.7
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-1/3 left-3 hidden xl:flex flex-col gap-2 items-center">
        {[30, 75, 45, 90, 60, 40, 85, 50, 30].map((h, i) => (
          <div
            key={i}
            className="w-1.5 bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-full transition-all duration-300 animate-pulse"
            style={{
              height: `${h * 0.4}px`,
              animationDelay: `${i * 0.18}s`,
              opacity: 0.7
            }}
          />
        ))}
      </div>

    </div>
  );
};
