import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "AI-Powered Content Creation",
    description: "Our advanced AI technology creates high-quality, engaging content designed to save your time while enhancing creative potential.",
    gradientFrom: "#FF6B6B",
    gradientTo: "#4ECDC4"
  },
  {
    title: "Customizable for Your Needs",
    description: "Whether it's blog posts, marketing copy, or creative stories, we tailor content to your specific needs, ensuring perfect suitability.",
    gradientFrom: "#6C63FF",
    gradientTo: "#4ECDC4"
  },
  {
    title: "Streamline Your Workflow",
    description: "Seamless integration with various platforms makes content creation more efficient and intuitive than ever before.",
    gradientFrom: "#FF6584",
    gradientTo: "#6C63FF"
  }
];

export default function HomeFeatures() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(() => {
    const cards = cardRefs.current;

    cards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=100",
          end: "bottom center",
          toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: index * 0.2
      });
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-gray-900 py-20 sm:py-32">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(0,0,0,0))]" />
      
      {/* Glowing orbs */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-[800px] w-[600px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.08),rgba(0,0,0,0))]" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-[600px] w-[600px] translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.08),rgba(0,0,0,0))]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-extralight tracking-tight text-white sm:text-5xl">
            Create content faster<span className="text-blue-400">.</span> 
            <br className="hidden sm:inline" />
            Scale effortlessly<span className="text-indigo-400">.</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Unlock the power of AI to transform your content creation process. From ideation to publishing, 
            we've streamlined every step.
          </p>
        </div>

        <div className="mx-auto grid max-w-lg grid-cols-1 gap-6 sm:gap-8 lg:max-w-none lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={el => cardRefs.current[index] = el}
              className="relative isolate flex flex-col gap-6 rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl"
            >
              {/* Card Background Gradient */}
              <div 
                className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br opacity-10 blur-xl transition-opacity duration-500 group-hover:opacity-30"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${feature.gradientFrom}, ${feature.gradientTo})` 
                }} 
              />

              {/* Card Glass Effect */}
              <div className="absolute inset-0 -z-10 rounded-2xl bg-white/[0.02] backdrop-blur-3xl" />

              {/* Card Content */}
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-light tracking-tight text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-6 text-gray-300">
                  {feature.description}
                </p>
              </div>

              {/* Card Bottom Shine */}
              <div className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import ai1 from "../../assets/                          Our versatile system excels in creating blog posts,
                          marketing copy, and creative stories. Every piece of content
                          is carefully tailored to match your unique requirements.t-with-wrench.png";
import blink from "../../assets/blink-sm.png";

export default function HomeFeatures() {
  return (
    <>
      <section className="relative py-12 md:py-24 lg:py-32 bg-gray-900 bg-body overflow-hidden">
        <img
          className="hidden sm:block absolute top-0 right-1/2 -mr-64 xl:mr-24 mt-12 h-20 animate-spinStar"
          src={blink}
          alt="Blink"
        />
        <img
          className="hidden sm:block absolute bottom-0 right-0 mb-64 mr-8 h-20 animate-spinStar"
          src={blink}
          alt="Blink"
        />
        <div className="relative container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-2/5 xl:w-1/2 px-4 mb-8 lg:mb-0">
              <img
                className="block w-full max-w-md xl:max-w-lg"
                src={ai1}
                alt="Features bg"
              />
            </div>
            <div className="w-full lg:w-3/5 xl:w-1/2 px-4">
              <div className="relative overflow-hidden">
                <div className="hidden xs:block absolute z-10 top-0 left-0 w-full h-20 lg:h-48 bg-gradient-to-b from-darkBlue-900 via-darkBlue-900 to-transparent opacity-90" />
                <div className="hidden xs:block absolute z-10 bottom-0 left-0 w-full h-20 lg:h-48 bg-gradient-to-t from-darkBlue-900 via-darkBlue-900 to-transparent opacity-90" />
                <div className="slider">
                  <div className="slider-container">
                    <div className="slide flex mb-16 items-start">
                      <div className="flex-shrink-0 flex mr-8 items-center justify-center w-16 h-16 rounded-full bg-indigo-700">
                        {/* Icon or image */}
                      </div>
                      <div className="max-w-lg">
                        <h4 className="text-3xl font-medium text-white mb-8">
                          AI-Powered Content Creation
                        </h4>
                        <p className="text-xl text-gray-400">
                          Novagen AI revolutionizes the way you create content.
                          Novagen AI utilizes intelligent algorithms that create high-quality,
                          engaging content, designed to save your time while enhancing your
                          creative potential.
                        </p>
                      </div>
                    </div>
                    <div className="slide flex mb-16 items-start">
                      <div className="flex-shrink-0 flex mr-8 items-center justify-center w-16 h-16 rounded-full bg-yellow-700">
                        {/* Icon or image */}
                      </div>
                      <div className="max-w-lg">
                        <h4 className="text-3xl font-medium text-white mb-8">
                          Customizable for Your Needs
                        </h4>
                        <p className="text-xl text-gray-400">
                          Whether it’s blog posts, marketing copy, or creative
                          stories, Novagen AI tailors content to your specific
                          needs, ensuring each piece is perfectly suited for its
                          purpose.
                        </p>
                      </div>
                    </div>
                    <div className="slide flex items-start">
                      <div className="flex-shrink-0 flex mr-8 items-center justify-center w-16 h-16 rounded-full bg-green-700">
                        {/* Icon or image */}
                      </div>
                      <div className="max-w-lg">
                        <h4 className="text-3xl font-medium text-white mb-8">
                          Streamline Your Workflow
                        </h4>
                        <p className="text-xl text-gray-400">
                          Novagen AI ensures seamless integration with various platforms,
                          making this AI assistant feel like a natural part of your workflow.
                          Content creation has never been more efficient or intuitive.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}