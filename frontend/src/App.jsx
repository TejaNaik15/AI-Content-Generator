import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Registration from "./components/Users/Register";
import Login from "./components/Users/Login";
import Dashboard from "./components/Users/Dashboard";
import Navbar from "./components/shared/Navbar";
import Home from "./components/Home/Home";
import { useAuth } from "./AuthContext/AuthContext";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import BlogPostAIAssistant from "./components/ContentGeneration/ContentGeneration";
import Plans from "./components/Plans/Plan";
import FreePlanSignup from "./components/StripePayment/FreePlanSignup";
import CheckoutForm from "./components/StripePayment/CheckoutForm";
import PaymentSuccess from "./components/StripePayment/PaymentSuccess";
import ContentGenerationHistory from "./components/ContentGeneration/ContentHistory";
import AppFeatures from "./components/Features/Features";
import AboutUs from "./components/About/About";

export default function App() {
  //custom auth hook
  const { isAuthenticated } = useAuth();
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  return (
    <>
      <BrowserRouter>
  {/* Navbar */}
  <Navbar />
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            }
          />
          <Route
            path="/generate-content"
            element={
              <AuthRoute>
                <BlogPostAIAssistant />
              </AuthRoute>
            }
          />
          <Route
            path="/history"
            element={
              <AuthRoute>
                <ContentGenerationHistory />
              </AuthRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<Plans />} />
          <Route
            path="/free-plan"
            element={
              <AuthRoute>
                <FreePlanSignup />
              </AuthRoute>
            }
          />
          <Route
            path="/checkout/:plan"
            element={
              <AuthRoute>
                <Elements stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              </AuthRoute>
            }
          />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/features" element={<AppFeatures />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}