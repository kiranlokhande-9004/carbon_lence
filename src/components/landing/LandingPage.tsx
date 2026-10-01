import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Reliable autoplay & prefers-reduced-motion handling
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const video = videoRef.current;

    if (video) {
      if (prefersReducedMotion) {
        video.pause();
        return;
      }

      video.muted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoLoaded(true))
          .catch(() => {
            // Guarantee autoplay under browser media policies
            video.muted = true;
            video.play().catch(() => {});
          });
      }
    }
  }, []);

  const handleDiscover = () => {
    setActiveTab('dashboard');
  };

  return (
    <div
      id="landing-hero-container"
      className="fixed inset-0 w-screen h-screen min-h-screen overflow-hidden select-none bg-black text-white font-sans"
      style={{ margin: 0, padding: 0 }}
    >
      {/* =========================================================================
          1. FULL-SCREEN 1080P FLUID MOTION VIDEO BACKGROUND (<video> tags)
          Occupies 100% width, 100% height, 100vh from top to bottom.
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          id="carbonlens-hero-video"
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          poster="/videos/Smooth_fluid_motion_flow_1080p-poster.jpg"
          onPlaying={() => setIsVideoLoaded(true)}
          className={`absolute inset-0 w-full h-screen object-cover transition-opacity duration-700 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-95'
          }`}
          style={{
            width: '100%',
            height: '100vh',
            objectFit: 'cover',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            willChange: 'transform',
          }}
        >
          {/* Exact uploaded 1080p fluid motion video source */}
          <source src="/videos/Smooth_fluid_motion_flow_1080p.mp4" type="video/mp4" />
          <source src="/videos/travora-hero.mp4" type="video/mp4" />
          <source src="/videos/travora-hero-opt.mp4" type="video/mp4" />
        </video>

        {/* Subtle linear-gradient overlay for text contrast without dimming the video */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.38) 100%)',
          }}
        />
      </div>

      {/* =========================================================================
          2. TOP LEFT: CARBONLENS LOGO
          ========================================================================= */}
      <header
        id="carbonlens-header"
        className="absolute top-0 left-0 z-20 px-8 sm:px-12 pt-8 sm:pt-10 flex items-center pointer-events-auto"
      >
        <button
          type="button"
          onClick={handleDiscover}
          className="flex items-center gap-3 cursor-pointer group focus:outline-none"
          aria-label="CarbonLens Home"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-800/90 backdrop-blur-md flex items-center justify-center text-white font-bold text-base shadow-sm border border-white/20 group-hover:bg-emerald-700 transition-colors">
            <span>C</span>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">
            CarbonLens
          </span>
        </button>
      </header>

      {/* =========================================================================
          3. CENTER: EXACT REFERENCE COMPOSITION
             - Eyebrow: CARBONLENS (green)
             - Headline: 4-line centered large white typography
             - Subtitle: Simple carbon intelligence for small businesses.
             - Only ONE button: DISCOVER →
          ========================================================================= */}
      <main
        id="hero-content"
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto h-full min-h-screen"
      >
        {/* Small green eyebrow text */}
        <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-emerald-400 uppercase mb-4 drop-shadow-sm select-none">
          CARBONLENS
        </span>

        {/* Large white headline centered */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.12] drop-shadow-md mx-auto">
          <span className="block">Measure your</span>
          <span className="block">footprint.</span>
          <span className="block mt-2 sm:mt-3">Understand your</span>
          <span className="block">impact.</span>
        </h1>

        {/* Supporting text */}
        <p className="mt-5 text-sm sm:text-base md:text-lg text-white/90 font-normal max-w-md mx-auto leading-relaxed drop-shadow-sm">
          Simple carbon intelligence for small businesses.
        </p>

        {/* ONLY ONE CTA BUTTON: DISCOVER → */}
        <div className="mt-8 sm:mt-10">
          <button
            id="discover-button"
            type="button"
            onClick={handleDiscover}
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-semibold text-sm sm:text-base tracking-wide shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer border border-emerald-600/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            aria-label="Discover CarbonLens"
          >
            <span>DISCOVER</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1.5 font-bold">→</span>
          </button>
        </div>
      </main>
    </div>
  );
};
