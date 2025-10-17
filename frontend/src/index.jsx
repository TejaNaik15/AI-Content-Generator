import React from "react";
import ReactDOM from "react-dom/client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import "./index.css";
import App from "./App";


gsap.registerPlugin(ScrollTrigger, SplitText);
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./AuthContext/AuthContext";

const stripePromise = loadStripe(
  "pk_test_51LVGZED8n0ExDwA4ocq21Al6QdhH7mgu9wk26r0mOCAB1n4dYb8CwepGCH6BvQvggiyLogZjxQsSHNHrxPUoaha200iDWOiYVW"
);

const options = {
  mode: "payment",
  currency: "usd",
  amount: 1099,
};
const root = ReactDOM.createRoot(document.getElementById("root"));


const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Elements stripe={stripePromise} options={options}>
          <App />
        </Elements>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);


reportWebVitals();
