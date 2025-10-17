import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FreeTrial() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const ctaRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom-=100",
        end: "bottom center",
        toggleActions: "play none none reverse"
      }
    });

    tl.from(headingRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    })
      .from(paragraphRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6")
      .from(ctaRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6");

    
    gsap.to([orb1Ref.current, orb2Ref.current], {
      xPercent: "random(-20, 20)",
      yPercent: "random(-20, 20)",
      rotation: "random(-15, 15)",
      duration: "random(10, 15)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      repeatRefresh: true
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-gray-900">
      
      <div className="absolute inset-0 -z-10 overflow-hidden">
        
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/90 to-gray-900" />
        
        
        <div 
          ref={orb1Ref}
          className="absolute -left-[10%] top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 blur-3xl"
        />
        <div 
          ref={orb2Ref}
          className="absolute -right-[15%] top-3/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 blur-3xl"
        />
        
        
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/30 mix-blend-overlay" />
      </div>

      
      <div ref={contentRef} className="relative mx-auto px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl">
        
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl sm:p-12">
            <div className="text-center">
              <h2 
                ref={headingRef}
                className="text-3xl font-extralight tracking-tight text-white sm:text-4xl"
              >
                Experience the future of content creation
                <br />
                <span className="mt-2 block font-light text-blue-400">
                  Start your journey today
                </span>
              </h2>
              <p 
                ref={paragraphRef}
                className="mx-auto mt-6 max-w-xl text-base leading-7 text-gray-300"
              >
                Try our AI-powered content generator and see how it transforms your workflow. 
                Get started with a free trial and explore the full potential of AI-assisted content creation.
              </p>
              <div 
                ref={ctaRef}
                className="mt-10 flex items-center justify-center gap-x-6"
              >
                <Link
                  to="free-plan"
                  className="group relative rounded-xl bg-gradient-to-b from-blue-500 to-indigo-600 px-5 py-3 text-sm font-light text-white transition-all duration-300 hover:from-blue-400 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative z-10">Start 3 Day Free Trial</span>
                </Link>
                <Link
                  to="free-plan"
                  className="group text-sm font-light text-gray-300 transition-colors hover:text-white"
                >
                  Learn more{' '}
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>

            
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 opacity-0 transition-opacity duration-500 hover:opacity-100" />
              <div className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
