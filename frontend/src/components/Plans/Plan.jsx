import { CheckIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../shared/Hero";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

const tiers = [
  {
    name: "Free",
    id: "Free",
    href: "checkout",
    price: "$0.00/month",
    amount: 0,
    description: "The essentials to provide your best work for clients.",
    features: ["5 Credits", "1 User", "Basic Support"],
    mostPopular: false,
  },
  {
    name: "Basic",
    id: "Basic",
    href: "checkout",
    price: "$20/month",
    amount: 20,
    description: "A plan that scales with your rapidly growing business.",
    features: [
      "50 Credits",
      "5 Users",
      "Priority Support",
      "Content generation history",
    ],
    mostPopular: true,
  },
  {
    name: "Premium",
    id: "Premium",
    href: "checkout",
    price: "$50/month",
    amount: 50,
    description: "Dedicated support and infrastructure for your company.",
    features: [
      "100 Credits",
      "10 Users",
      "Priority Support",
      "Content generation history",
    ],
    mostPopular: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Plans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (plan) => {
    setSelectedPlan(plan);
    if (plan?.id === "Free") {
      navigate("/free-plan");
    } else {
      navigate(`/checkout/${plan?.id}?amount=${plan?.amount}`);
    }
  };

  return (
    <>
      <Hero
        title="Pricing plans for teams of all sizes"
        description="Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales."
        badgeText="Pricing"
        badgeLabel="Plans"
      />
      <section className="relative isolate overflow-hidden py-12 sm:py-16 md:py-24 lg:py-32" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)' }}>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="isolate mx-auto mt-6 sm:mt-8 md:mt-10 grid max-w-md grid-cols-1 gap-4 sm:gap-6 md:gap-8 md:max-w-2xl md:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? "bg-white/5 ring-2 ring-indigo-500"
                    : "ring-1 ring-white/10",
                  "rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 xl:p-10 cursor-pointer hover:bg-white/5 transition-all duration-200"
                )}
                onClick={() => handleSelect(tier)}
              >
                <div className="flex items-center justify-between gap-x-2 sm:gap-x-4">
                  <h3
                    id={tier.id}
                    className="text-base sm:text-lg font-semibold leading-6 sm:leading-8 text-white"
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <p className="rounded-full bg-indigo-500 px-2 sm:px-2.5 py-1 text-xs font-semibold leading-4 sm:leading-5 text-white">
                      Most popular
                    </p>
                  ) : null}
                </div>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-5 sm:leading-6 text-gray-300">
                  {tier.description}
                </p>
                <p className="mt-4 sm:mt-6 flex items-baseline gap-x-1">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
                    {tier.price}
                  </span>
                </p>
                <a
                  aria-describedby={tier.id}
                  className={classNames(
                    tier.mostPopular
                      ? "bg-indigo-500 cursor-pointer text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500"
                      : "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white",
                    "mt-4 sm:mt-6 block rounded-md py-2 px-3 text-center text-xs sm:text-sm font-semibold leading-5 sm:leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  )}
                >
                  Buy plan
                </a>
                <ul
                  role="list"
                  className="mt-6 sm:mt-8 xl:mt-10 space-y-2 sm:space-y-3 text-xs sm:text-sm leading-5 sm:leading-6 text-gray-300"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-2 sm:gap-x-3">
                      <CheckIcon
                        className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-5 flex-none text-white mt-0.5"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// Wrap with ErrorBoundary for iPhone Safari
export default function WrappedPlans() {
  return (
    <ErrorBoundary>
      <Plans />
    </ErrorBoundary>
  );
}