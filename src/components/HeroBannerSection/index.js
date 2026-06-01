import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Text } from 'grommet';
import { FormNext, FormPrevious, LinkNext } from 'grommet-icons';

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
  CTAButtonLabel,
  CTARow,
  PrimaryBtn,
  GhostBtn,
  GhostExternalBtn,
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
    subtitle: 'From concept to production. Models, agents, and infrastructure.',
    cta1: { label: 'Learn more', href: '/topic/ai-and-data' },
    cta2: {
      label: 'View solutions',
      href: 'https://www.hpe.com/us/en/solutions/ai-artificial-intelligence.html',
      newTab: true,
    },
    theme: 'light',
    bgColor: '#f1f2f4',
    bgImage: '',
    bgVideo: '/img/hero/slide1-ai.mp4',
    bgVideoOpacity: 0.32,
    bgVideoFallback: '/img/hero/slide1-ai-fallback.jpg',
  },
  {
    id: 2,
    title: 'Learn, build, & deploy',
    subtitle:
      'Build, break, and iterate alongside engineers solving real AI and infrastructure challenges—then demo what you ship.',
    cta1: {
      label: 'Join the hackathon',
      href: 'https://events.bizzabo.com/797906/home',
      newTab: true,
    },
    cta2: { label: 'See other events', href: '/events/' },
    theme: 'dark',
    bgColor: '#292d3a',
    bgVideo: '/img/hero/slide2-code.mp4',
    bgVideoOpacity: 0.5,
  },
  {
    id: 3,
    title: 'Run AI in production',
    subtitle:
      'Deploy, scale, and observe LLM and GPU workloads with Kubernetes-native controls and enterprise policies on HPE Private Cloud AI.',
    cta1: { label: 'Learn more', href: '/platform/hpe-private-cloud-ai/home/' },
    cta2: {
      label: 'Convince your CEO',
      href: 'https://www.hpe.com/psnow/doc/a00146294enw',
      newTab: true,
    },
    theme: 'light',
    bgColor: '#ffffff',
    bgVideo: '/img/hero/slide3-dataviz.mp4',
    bgVideoOpacity: 0.5,
  },
];

const AUTO_ADVANCE_MS = 5000;
const ENABLE_AUTO_ADVANCE = false;

const HeroBannerSection = () => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    if (!ENABLE_AUTO_ADVANCE) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
  }, []);

  useEffect(() => {
    if (!ENABLE_AUTO_ADVANCE) return undefined;
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    if (ENABLE_AUTO_ADVANCE) startTimer();
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % SLIDES.length);
    if (ENABLE_AUTO_ADVANCE) startTimer();
  };

  return (
    <HeroWrapper>
      <SlideTrack index={index}>
        {SLIDES.map((slide) => {
          const dark = slide.theme === 'dark';
          const primaryText = dark ? '#292d3a' : '#ffffff';
          const primaryBg = dark ? '#ffffff' : '#292d3a';
          const secondaryText = dark ? '#ffffff' : '#292d3a';
          const secondaryIcon = '#01a982';
          const previousIconColor = dark ? 'rgba(255,255,255,0.8)' : '#b1b9be';

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
                  <SlideBgOverlay
                    $isVideo
                    $isDark={dark}
                    bgColor={slide.bgColor}
                  />
                </>
              )}
              {!slide.bgVideo && slide.bgImage && (
                <>
                  <SlideBgImage src={slide.bgImage} alt="" isDark={dark} />
                  <SlideBgOverlay $isDark={dark} bgColor={slide.bgColor} />
                </>
              )}

              <SlideContent direction="column" gap="32px">
                <SlideTitle level={2} margin="none" $isDark={dark}>
                  {slide.title}
                </SlideTitle>

                <SlideSubtitle as="p" margin="none" $isDark={dark}>
                  {slide.subtitle}
                </SlideSubtitle>

                <CTARow direction="row" align="center" gap="20px">
                  <PrimaryBtn
                    to={slide.cta1.href}
                    label={
                      <CTAButtonLabel
                        size="20px"
                        weight={500}
                        color={primaryText}
                      >
                        {slide.cta1.label}
                      </CTAButtonLabel>
                    }
                    icon={<LinkNext color={primaryText} size="24px" />}
                    reverse
                    plain={false}
                    background={primaryBg}
                    round="full"
                    pad={{ horizontal: '36px', vertical: '20px' }}
                    gap="12px"
                    $isDark={dark}
                  />

                  {slide.cta2.newTab ? (
                    <GhostExternalBtn
                      to={slide.cta2.href}
                      label={
                        <CTAButtonLabel
                          size="20px"
                          weight={500}
                          color={secondaryText}
                        >
                          {slide.cta2.label}
                        </CTAButtonLabel>
                      }
                      icon={<LinkNext color={secondaryIcon} size="24px" />}
                      reverse
                      plain
                      round="full"
                      pad={{ horizontal: '36px', vertical: '20px' }}
                      gap="12px"
                      $isDark={dark}
                    />
                  ) : (
                    <GhostBtn
                      to={slide.cta2.href}
                      label={
                        <CTAButtonLabel
                          size="20px"
                          weight={500}
                          color={secondaryText}
                        >
                          {slide.cta2.label}
                        </CTAButtonLabel>
                      }
                      icon={<LinkNext color={secondaryIcon} size="24px" />}
                      reverse
                      plain
                      round="full"
                      pad={{ horizontal: '36px', vertical: '20px' }}
                      gap="12px"
                      $isDark={dark}
                    />
                  )}
                </CTARow>
              </SlideContent>

              <HeroControls direction="row" align="center" gap="40px">
                <NavBtnRow direction="row" align="center" gap="12px">
                  <NavBtn
                    plain
                    onClick={handlePrev}
                    disabled={false}
                    icon={
                      <FormPrevious color={previousIconColor} size="16px" />
                    }
                    aria-label="Previous slide"
                    $isDark={dark}
                    $isPrimary={false}
                  />
                  <NavBtn
                    plain
                    onClick={handleNext}
                    disabled={false}
                    icon={<FormNext color="#ffffff" size="16px" />}
                    aria-label="Next slide"
                    $isDark={dark}
                    $isPrimary
                  />
                </NavBtnRow>

                <SlideCounter as="span" $isDark={dark}>
                  {index + 1} / {SLIDES.length}
                </SlideCounter>
              </HeroControls>
            </Slide>
          );
        })}
      </SlideTrack>
    </HeroWrapper>
  );
};

export default HeroBannerSection;
