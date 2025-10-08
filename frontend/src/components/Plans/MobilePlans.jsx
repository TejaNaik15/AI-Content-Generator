import { useState } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0/month",
    features: ["5 Credits", "Basic Support"],
    id: "Free"
  },
  {
    name: "Basic", 
    price: "$20/month",
    features: ["50 Credits", "Priority Support"],
    id: "Basic",
    amount: 20
  },
  {
    name: "Premium",
    price: "$50/month", 
    features: ["100 Credits", "Premium Support"],
    id: "Premium",
    amount: 50
  }
];

const MobilePlans = () => {
  const navigate = useNavigate();

  const handleSelect = (plan) => {
    if (plan.id === "Free") {
      navigate("/free-plan");
    } else {
      navigate(`/checkout/${plan.id}?amount=${plan.amount}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-24">
      <h1 className="text-2xl font-bold mb-6 text-center">Choose Your Plan</h1>
      
      <div className="space-y-4">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="text-2xl font-bold text-blue-400 my-2">{plan.price}</p>
            <ul className="space-y-1 mb-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-300">• {feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSelect(plan)}
              className="w-full bg-blue-600 py-2 rounded-lg"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobilePlans;