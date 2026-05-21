import React, { useState, useEffect, useRef, useCallback } from 'react';

import {
  HeroWrapper,
  SlideTrack,
  Slide,
  SlideBgImage,
  SlideBgVideo,
  SlideBgOverlay,
  SlideContent,
  SlideTitle,
  SlideSubtitle,
  CTARow,
  PrimaryBtn,
  GhostBtn,
  HeroControls,
  NavBtnRow,
  NavBtn,
  SlideCounter,
} from './styles';

// ---------------------------------------------------------------------------
// Slide data
// NOTE: bgImage paths are placeholders — save your images to static/img/hero/
// and replace the empty strings below with e.g. '/img/hero/slide1.jpg'
// ---------------------------------------------------------------------------
const SLIDES = [
  {
    id: 1,
    title: "Let's talk AI",
    subtitle:
      'From concept to production. Models, agents, and infrastructure that actually ship.',
    cta1: { label: 'Read how', href: '#' },
    cta2: { label: 'See examples', href: '#' },
    theme: 'light',
    bgColor: '#d4d4d4',
    bgImage: '',
    bgVideo: '/img/hero/slide1-ai.mp4',
    bgVideoOpacity: 0.5,
    bgVideoFallback: '/img/hero/slide1-ai-fallback.jpg',
  },
  {
    id: 2,
    title: 'Ship in 48 Hours',
    subtitle:
      'Build, break, and iterate alongside engineers solving real AI and infrastructure challenges—then demo what you ship.',
    cta1: { label: 'Join the Hackathon', href: '/hackshack' },
    cta2: { label: 'See past events', href: '/hackshack/workshops' },
    theme: 'dark',
    bgColor: '#292d3a',
    bgVideo: '/img/hero/slide2-code.mp4',
    bgVideoOpacity: 0.5,
  },
  {
    id: 3,
    title: 'Run AI in Production, Not Just in Notebooks',
    subtitle:
      'Deploy, scale, and observe LLM and GPU workloads with Kubernetes-native controls and enterprise policy.',
    cta1: { label: 'Deploy an AI Workload', href: '#' },
    cta2: { label: 'See examples', href: '#' },
    theme: 'light',
    bgColor: '#ffffff',
    bgVideo: '/img/hero/slide3-dataviz.mp4',
    bgVideoOpacity: 0.5,
  },
];

const AUTO_ADVANCE_MS = 5000;

const ArrowRight = ({ color }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 9H15M9 3l6 6-6 6"
      stroke={color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronLeft = ({ color }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M14 5L8 11L14 17"
      stroke={color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = ({ color }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M8 5L14 11L8 17"
      stroke={color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeroBannerSection = () => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
  }, []);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    startTimer();
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % SLIDES.length);
    startTimer();
  };

  const activeSlide = SLIDES[index];
  const isDark = activeSlide.theme === 'dark';

  return (
    <HeroWrapper>
      <SlideTrack index={index}>
        {SLIDES.map((slide) => {
          const dark = slide.theme === 'dark';
          return (
            <Slide key={slide.id} bgColor={slide.bgColor}>
              {slide.bgVideo && (
                <>
                  <SlideBgVideo
                    autoPlay
                    loop
                    muted
                    playsInline
                    $opacity={slide.bgVideoOpacity ?? 1}
                    poster={slide.bgVideoFallback || ''}
                  >
                    <source src={slide.bgVideo} type="video/mp4" />
                  </SlideBgVideo>
                  <SlideBgOverlay isVideo bgColor={slide.bgColor} />
                </>
              )}
              {!slide.bgVideo && slide.bgImage && (
                <>
                  <SlideBgImage src={slide.bgImage} alt="" isDark={dark} />
                  <SlideBgOverlay isDark={dark} bgColor={slide.bgColor} />
                </>
              )}

              <SlideContent>
                <SlideTitle isDark={dark}>{slide.title}</SlideTitle>
                <SlideSubtitle isDark={dark}>{slide.subtitle}</SlideSubtitle>
                <CTARow>
                  <PrimaryBtn href={slide.cta1.href} isDark={dark}>
                    {slide.cta1.label}
                    <ArrowRight color={dark ? '#292d3a' : '#ffffff'} />
                  </PrimaryBtn>
                  <GhostBtn href={slide.cta2.href} isDark={dark}>
                    {slide.cta2.label}
                    <ArrowRight color={dark ? '#ffffff' : '#292d3a'} />
                  </GhostBtn>
                </CTARow>
              </SlideContent>
            </Slide>
          );
        })}
      </SlideTrack>

      {/* Controls: rendered once outside the track, theme from active slide */}
      <HeroControls>
        <NavBtnRow>
          <NavBtn
            onClick={handlePrev}
            disabled={false}
            isDark={isDark}
            isPrimary={false}
            aria-label="Previous slide"
          >
            <ChevronLeft color={isDark ? 'rgba(255,255,255,0.8)' : '#292d3a'} />
          </NavBtn>
          <NavBtn
            onClick={handleNext}
            disabled={false}
            isDark={isDark}
            isPrimary
            aria-label="Next slide"
          >
            <ChevronRight color="#ffffff" />
          </NavBtn>
        </NavBtnRow>
        <SlideCounter isDark={isDark}>
          {index + 1} / {SLIDES.length}
        </SlideCounter>
      </HeroControls>
    </HeroWrapper>
  );
};

export default HeroBannerSection;
