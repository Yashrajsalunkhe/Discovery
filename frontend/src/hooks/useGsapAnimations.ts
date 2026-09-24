import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Helper: only run a GSAP `.from()` if the target elements actually exist in the DOM.
 * Prevents "GSAP target not found" console warnings on pages where elements aren't rendered.
 */
const safeFrom = (targets: string, vars: gsap.TweenVars, tl?: gsap.core.Timeline, position?: string) => {
  const els = gsap.utils.toArray(targets);
  if (els.length === 0) return;
  if (tl) {
    tl.from(els, vars, position);
  } else {
    gsap.from(els, vars);
  }
};

const safeTo = (targets: string, vars: gsap.TweenVars) => {
  const els = gsap.utils.toArray(targets);
  if (els.length === 0) return;
  gsap.to(els, vars);
};

export const useGsapAnimations = (isActive: boolean = true) => {
  useEffect(() => {
    // Skip all animations when not on the home view
    if (!isActive) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Just make everything visible — only for elements that exist
      const selector =
        '[data-line] > span, .hero-kicker, .hero-sub, .hero-actions, .timeline-item, [data-perks] .perk-cell, .cta-title, .cta-sub, .cta-actions, .cta-deadline';
      const els = gsap.utils.toArray(selector);
      if (els.length > 0) {
        gsap.set(els, { clearProps: 'all' });
      }
      const fill = document.getElementById('timelineFill');
      if (fill) fill.style.transform = 'scaleY(1)';
      return;
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Hero load timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      safeFrom('.hero-kicker', { y: 16, autoAlpha: 0, duration: 0.6 }, tl);
      safeFrom('[data-line] > span', { yPercent: 110, duration: 0.9, stagger: 0.12, ease: 'power4.out' }, tl, '-=0.2');
      safeFrom('.hero-sub', { y: 16, autoAlpha: 0, duration: 0.6 }, tl, '-=0.35');
      safeFrom('.hero-actions', { y: 16, autoAlpha: 0, duration: 0.6 }, tl, '-=0.4');
      safeFrom('.countdown-cell', { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.08 }, tl, '-=0.3');

      // Ticker
      if (document.querySelector('.ticker')) {
        gsap.from('.ticker', {
          autoAlpha: 0,
          duration: 0.8,
          scrollTrigger: { trigger: '.ticker', start: 'top 95%' },
        });
      }

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
      if (document.querySelector('[data-reveal]')) {
        safeFrom('[data-reveal] p, [data-reveal] strong, [data-reveal] .org-stamp', {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-reveal]', start: 'top 75%' },
        });
      }

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
      if (document.querySelector('[data-perks]')) {
        safeFrom('[data-perks] .perk-cell', {
          autoAlpha: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-perks]', start: 'top 85%' },
        });
      }

      // CTA reveal
      if (document.querySelector('#register')) {
        safeFrom('.cta-title, .cta-sub, .cta-actions, .cta-deadline', {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: '#register', start: 'top 70%' },
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [isActive]);
};

