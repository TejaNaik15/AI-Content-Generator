import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import ShaderBackground from './ShaderBackground';

gsap.registerPlugin(SplitText);

export default function Hero({
  title,
  description,
  badgeText = "Latest Release",
  badgeLabel = "New",
  ctaButtons = [],
  microDetails = []
}) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const paraRef = useRef(null);
  const ctaRef = useRef(null);
  const badgeRef = useRef(null);
  const microRef = useRef(null);
  const microItemRefs = useRef([]);

  useGSAP(
    () => {
      if (!headerRef.current) return;

      document.fonts.ready.then(() => {
        const split = new SplitText(headerRef.current, {
          type: 'lines',
          linesClass: 'split-line'
        });

        gsap.set(split.lines, {
          filter: 'blur(16px)',
          yPercent: 30,
          autoAlpha: 0,
          scale: 1.06,
          transformOrigin: '50% 100%',
        });

        if (badgeRef.current) {
          gsap.set(badgeRef.current, { autoAlpha: 0, y: -8 });
        }
        if (paraRef.current) {
          gsap.set(paraRef.current, { autoAlpha: 0, y: 8 });
        }
        if (ctaRef.current) {
          gsap.set(ctaRef.current, { autoAlpha: 0, y: 8 });
        }
        if (microRef.current) {
          gsap.set(microItemRefs.current, { autoAlpha: 0, y: 6 });
        }

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' }
        });

        if (badgeRef.current) {
          tl.to(badgeRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, 0);
        }

        tl.to(split.lines, {
          filter: 'blur(0px)',
          yPercent: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.15
        }, 0.1);

        if (paraRef.current) {
          tl.to(paraRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.55');
        }
        if (ctaRef.current) {
          tl.to(ctaRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.35');
        }
        if (microRef.current) {
          tl.to(microItemRefs.current, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1
          }, '-=0.25');
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <div className="relative">
      <section ref={sectionRef} className="relative h-screen w-screen overflow-hidden">
        <ShaderBackground />

        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 pb-24 pt-36 sm:gap-8 sm:pt-44 md:px-10 lg:px-16">
          {/* Badge */}
          {badgeText && (
            <div ref={badgeRef} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
              <span className="text-[10px] font-light uppercase tracking-[0.08em] text-white/70">
                {badgeLabel}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="text-xs font-light tracking-tight text-white/80">
                {badgeText}
              </span>
            </div>
          )}

          {/* Title */}
          <h1
            ref={headerRef}
            className="max-w-2xl text-left text-5xl font-extralight leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            {title}
          </h1>

          {/* Description */}
          <p
            ref={paraRef}
            className="max-w-xl text-left text-base font-light leading-relaxed tracking-tight text-white/75 sm:text-lg"
          >
            {description}
          </p>

          {/* CTA Buttons */}
          {ctaButtons.length > 0 && (
            <div ref={ctaRef} className="flex flex-wrap items-center gap-3 pt-2">
              {ctaButtons.map((button, index) => (
                <a
                  key={index}
                  href={button.href}
                  className={`rounded-2xl border border-white/10 px-5 py-3 text-sm font-light tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 duration-300 ${
                    button.primary
                      ? "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                      : "text-white/80 hover:bg-white/5"
                  }`}
                >
                  {button.text}
                </a>
              ))}
            </div>
          )}

          {/* Micro Details */}
          {microDetails.length > 0 && (
            <ul
              ref={microRef}
              className="mt-8 flex flex-wrap gap-6 text-xs font-extralight tracking-tight text-white/60"
            >
              {microDetails.map((detail, index) => (
                <li
                  key={index}
                  ref={(el) => (microItemRefs.current[index] = el)}
                  className="flex items-center gap-2"
                >
                  <span className="h-1 w-1 rounded-full bg-white/40" /> {detail}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
      </section>
    </div>
  );
}