import { Link } from "react-router-dom";
import HomeFeatures from "./HomeFeatures";
import FreeTrial from "./FreeTrial";
import Hero from "../shared/Hero";

export default function Home() {
  return (
    <>
      <Hero
        badgeText="Now Available"
        badgeLabel="New"
        title="Experience the power of AI-driven content creation"
        description="Our intelligent platform uses advanced machine learning algorithms to generate unique, engaging content tailored to your specific needs and industry requirements."
        ctaButtons={[
          {
            text: "Start Free Trial",
            href: "/free-plan",
            primary: true
          },
          {
            text: "Learn More",
            href: "/free-plan"
          }
        ]}
        microDetails={[
          "Powered by GPT-4",
          "Near-human writing quality",
          "24/7 content generation"
        ]}
      />
      
      <HomeFeatures />
    
      <FreeTrial />
    </>
  );
}
