
import React from "react";
import {
  LifebuoyIcon,
  NewspaperIcon,
  PhoneIcon,
} from "@heroicons/react/20/solid";
import Hero from "../shared/Hero";

const cards = [
  {
    name: "Innovative Solutions",
    description:
      "Innovation drives our approach to solutions. Novagen AI focuses on transforming complex AI technology into user-friendly tools for content generation, helping our users stay ahead in the digital content race.",
    icon: PhoneIcon,
  },
  {
    name: "Dedicated Customer Support",
    description:
      "Novagen AI believes in empowering users through excellent support. We've built a dedicated support system to assist with any queries, ensuring you have a smooth, uninterrupted experience in content creation.",
    icon: LifebuoyIcon,
  },
  {
    name: "Press & Media Collaborations",
    description:
      "Novagen AI pushes the boundaries of AI-driven content generation. We are always eager to collaborate with media and press to share insights and discuss the future of digital content creation.",
    icon: NewspaperIcon,
  },
];
export default function AboutUs() {
  return (
    <>
      <Hero
        title="Novagen AI - Redefining Content Creation"
        description="Novagen AI brings you this revolutionary content creation tool. Our cutting-edge AI technology is designed to automate and enhance content generation, helping creators like you produce high-quality, engaging material effortlessly."
        badgeText="About Us"
        badgeLabel="Info"
      />
  <section className="relative isolate overflow-hidden py-24 sm:py-32 bg-black">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            {cards.map((card) => (
              <div
                key={card.name}
                className="flex gap-x-4 rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10"
              >
                <card.icon
                  className="h-7 w-5 flex-none text-indigo-400"
                  aria-hidden="true"
                />
                <div className="text-base leading-7">
                  <h3 className="font-semibold text-white">{card.name}</h3>
                  <p className="mt-2 text-gray-300">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
