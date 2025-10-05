import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getUserProfileAPI } from "../../apis/user/usersAPI";
import StatusMessage from "../Alert/StatusMessage";
import ShaderBackground from "../shared/ShaderBackground";

const Dashboard = () => {
  //get the user profile
  const { isLoading, isError, data, error } = useQuery({
    queryFn: getUserProfileAPI,
    queryKey: ["profile"],
    retry: false,
  });

  //dsiplay loading
  if (isLoading) {
    return <StatusMessage type="loading" message="Loading please wait..." />;
  }

  //check for error
  else if (isError) {
    return (
      <StatusMessage type="error" message={error?.response?.data?.message} />
    );
  } else {
    return (
      <div className="relative min-h-screen text-white">
        <ShaderBackground />
        <div className="relative max-w-7xl mx-auto p-6">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            User Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="rounded-3xl p-8 xl:p-10 ring-1 ring-white/10 bg-white/5 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Profile Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Name
                </label>
                <p className="bg-gray-900/60 rounded-lg w-full py-3 px-4 text-white border border-white/10">
                  {data?.user?.username || <span className="text-gray-400">N/A</span>}
                </p>
              </div>
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Email
                </label>
                <p className="bg-gray-900/60 rounded-lg w-full py-3 px-4 text-white border border-white/10">
                  {data?.user?.email || <span className="text-gray-400">N/A</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Credit Usage Section */}
          <div className="rounded-3xl p-8 xl:p-10 ring-1 ring-white/10 bg-white/5 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Credit Usage</h2>
            <div className="space-y-3 text-gray-200">
              <p>
                Monthly Credit: <span className="font-semibold text-white">{data?.user?.monthlyRequestCount}</span>
              </p>
              <p>
                Credit Used: <span className="font-semibold text-white">{data?.user?.apiRequestCount}</span>
              </p>
              <p>
                Credit Remaining: <span className="font-semibold text-white">{data?.user?.monthlyRequestCount - data?.user?.apiRequestCount}</span>
              </p>
              <p>
                Next Billing Date: <span className="font-semibold text-white">{data?.user?.nextBillingDate ? data?.user?.nextBillingDate : "No Billing date"}</span>
              </p>
            </div>
          </div>

          {/* Payment and Plans Section */}
          <div className="rounded-3xl p-8 xl:p-10 ring-1 ring-white/10 bg-white/5 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Payment & Plans</h2>
            <div className="space-y-3 text-gray-200">
              <p>
                Current Plan: <span className="font-semibold text-white">{data?.user?.subscriptionPlan}</span>
              </p>
              {data?.user?.subscriptionPlan === "Trial" && (
                <p className="bg-gray-900/60 border border-white/10 mb-2 rounded-lg w-full py-2 px-3 text-gray-100">Trial: 1000 monthly request</p>
              )}

              {data?.user?.subscriptionPlan === "Free" && (
                <p className="bg-gray-900/60 border border-white/10 mb-2 rounded-lg w-full py-2 px-3 text-gray-100">Free: 5 monthly request</p>
              )}
              {data?.user?.subscriptionPlan === "Basic" && (
                <p className="bg-gray-900/60 border border-white/10 mb-2 rounded-lg w-full py-2 px-3 text-gray-100">Basic: 50 monthly request</p>
              )}
              {data?.user?.subscriptionPlan === "Premium" && (
                <p className="bg-gray-900/60 border border-white/10 mb-2 rounded-lg w-full py-2 px-3 text-gray-100">Premium: 100 monthly request</p>
              )}
              <Link to="/plans" className="inline-block py-2 px-4 rounded-md text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 shadow">
                Upgrade Plan
              </Link>
            </div>
          </div>

          {/* Trial Information Section */}
          <div className="rounded-3xl p-8 xl:p-10 ring-1 ring-white/10 bg-white/5 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Trial Information</h2>
            <div className="space-y-3 text-gray-200">
              <p>
                Trial Status: {" "}
                {data?.user?.trialActive ? (
                  <span className="text-green-400 font-semibold">Active</span>
                ) : (
                  <span className="text-yellow-400 font-semibold">Inactive</span>
                )}
              </p>
              <p>
                Expires on: <span className="font-semibold text-white">{new Date(data?.user?.trialExpires).toDateString()}</span>
              </p>
              <Link to="/plans" className="inline-block py-2 px-4 rounded-md text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 shadow">Upgrade to Premium</Link>
            </div>
          </div>

          {/* History Section */}
          <div className="col-span-1 md:col-span-2 rounded-3xl p-8 xl:p-10 ring-1 ring-white/10 bg-white/5 shadow-xl">
            <h2 className="text-2xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Payment History</h2>
            {data?.user?.payments?.length > 0 ? (
              <ul className="divide-y divide-white/10">
                {data?.user?.payments?.map((payment) => {
                  return (
                    <li key={payment?._id || payment?.createdAt} className="py-4 transition duration-150 ease-in-out">
                      <div className="flex flex-col sm:flex-row justify-between text-gray-200">
                        <div className="mb-2 sm:mb-0">
                          <p className="text-sm font-medium text-white">{payment?.subscriptionPlan}</p>
                          <p className="text-xs text-gray-400">{new Date(payment?.createdAt).toDateString()}</p>
                        </div>
                        <div className="flex items-center">
                          <p className={`text-sm font-semibold ${payment?.status === "succeeded" ? "text-green-400" : "text-orange-400"}`}>
                            {payment?.status}
                          </p>
                          <p className="text-sm text-white ml-4">$ {payment?.amount}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <h1 className="text-gray-300">No Payment History</h1>
            )}
          </div>
          </div> {/* <-- This closes the grid wrapper */}
        </div>
      </div>
    );
  }
};

export default Dashboard;