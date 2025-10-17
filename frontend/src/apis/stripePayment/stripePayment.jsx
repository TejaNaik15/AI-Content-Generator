import api from "../axiosConfig";


export const handleFreeSubscriptionAPI = async () => {
  const response = await api.post(
    "/api/v1/stripe/free-plan",
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};


export const createStripePaymentIntentAPI = async (payment) => {
  console.log(payment);
  const response = await api.post(
    "/api/v1/stripe/checkout",
    {
      amount: Number(payment?.amount),
      subscriptionPlan: payment?.plan,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};


export const verifyPaymentAPI = async (paymentId) => {
  const response = await api.post(
    `/api/v1/stripe/verify-payment/${paymentId}`,
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
