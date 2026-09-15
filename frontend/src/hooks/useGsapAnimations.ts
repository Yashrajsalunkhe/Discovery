import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGsapAnimations = () => {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Just make everything visible
      gsap.set(
        '[data-line] > span, .hero-kicker, .hero-sub, .hero-actions, .timeline-item, [data-perks] .perk-cell, .cta-title, .cta-sub, .cta-actions, .cta-deadline',
        { clearProps: 'all' }
      );
      const fill = document.getElementById('timelineFill');
      if (fill) fill.style.transform = 'scaleY(1)';
      return;
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Hero load timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-kicker', { y: 16, autoAlpha: 0, duration: 0.6 })
        .from('[data-line] > span', { yPercent: 110, duration: 0.9, stagger: 0.12, ease: 'power4.out' }, '-=0.2')
        .from('.hero-sub', { y: 16, autoAlpha: 0, duration: 0.6 }, '-=0.35')
        .from('.hero-actions', { y: 16, autoAlpha: 0, duration: 0.6 }, '-=0.4')
        .from('.countdown-cell', { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.08 }, '-=0.3');

      // Ticker
      gsap.from('.ticker', {
        autoAlpha: 0,
        duration: 0.8,
        scrollTrigger: { trigger: '.ticker', start: 'top 95%' },
      });

      // Redacted bars declassify
      gsap.utils.toArray('[data-redact]').forEach((bar) => {
        gsap.to(bar as Element, {
          scaleX: 0,
          duration: 0.7,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: bar as Element, start: 'top 85%' },
        });
      });

      // Briefing grid reveal
      gsap.from('[data-reveal] p, [data-reveal] strong, [data-reveal] .org-stamp', {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-reveal]', start: 'top 75%' },
      });

      // Timeline draw
      const fill = document.getElementById('timelineFill');
      if (fill) {
        gsap.to(fill, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-timeline]',
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: 0.6,
          },
        });
      }

      gsap.utils.toArray('.timeline-item').forEach((item) => {
        gsap.from(item as Element, {
          x: -20,
          autoAlpha: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: item as Element, start: 'top 85%' },
        });
      });

      // Perks stagger
      gsap.from('[data-perks] .perk-cell', {
        autoAlpha: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-perks]', start: 'top 85%' },
      });

      // CTA reveal
      gsap.from('.cta-title, .cta-sub, .cta-actions, .cta-deadline', {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#register', start: 'top 70%' },
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);
};
