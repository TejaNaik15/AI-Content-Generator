
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  LockClosedIcon,
} from "@heroicons/react/20/solid";
import Hero from "../shared/Hero";

const features = [
  {
    name: "Push to deploy",
    description:
      "Novagen AI implements a streamlined deployment process that makes updates and improvements instant. Your content generation workflow stays smooth and uninterrupted with our automated systems.",
    href: "#",
    icon: CloudArrowUpIcon,
  },
  {
    name: "SSL certificates",
    description:
      "Security is a top priority in our design. Novagen AI implements robust SSL encryption to ensure your content and data remain private and protected at all times.",
    href: "#",
    icon: LockClosedIcon,
  },
  {
    name: "Simple queues",
    description:
      "Novagen AI features an efficient queuing system that handles multiple content generation requests smoothly. Your projects are processed quickly and efficiently, without compromising quality.",
    href: "#",
    icon: ArrowPathIcon,
  },
];
export default function AppFeatures() {
  return (
    <>
      <Hero
        badgeText="Features"
        badgeLabel="Our"
        title={
          <>
            Everything you need
            <br className="hidden sm:block" />
            to create content
          </>
        }
        description="Novagen AI offers a comprehensive suite of features that make content creation effortless. Our AI-powered platform combines cutting-edge technology with user-friendly design to deliver exceptional results."
        microDetails={[
          "Fast and scalable",
          "Enterprise-grade security",
          "Developer friendly",
        ]}
      />
      <section className="relative isolate overflow-hidden py-24 sm:py-32">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mt-4 max-w-2xl lg:mt-6 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    <feature.icon
                      className="h-5 w-5 flex-none text-indigo-400"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                    <p className="flex-auto">{feature.description}</p>
                    <p className="mt-6">
                      <a
                        href={feature.href}
                        className="text-sm font-semibold leading-6 text-indigo-400"
                      >
                        Learn more <span aria-hidden="true">→</span>
                      </a>
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
