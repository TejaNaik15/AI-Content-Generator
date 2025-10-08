import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getUserProfileAPI } from "../../apis/user/usersAPI";
import StatusMessage from "../Alert/StatusMessage";

const MobileDashboard = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryFn: getUserProfileAPI,
    queryKey: ["profile"],
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 pt-24">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (isError || !data?.user) {
    return (
      <div className="min-h-screen bg-black text-white p-4 pt-24">
        <div className="text-center text-red-400">Error loading dashboard</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-24">
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Profile</h2>
          <p>Name: {data.user.username || "N/A"}</p>
          <p>Email: {data.user.email || "N/A"}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Credits</h2>
          <p>Plan: {data.user.subscriptionPlan || "Free"}</p>
          <p>Used: {data.user.apiRequestCount || 0}</p>
          <p>Total: {data.user.monthlyRequestCount || 0}</p>
        </div>

        <div className="space-y-2">
          <Link to="/generate-content" className="block w-full bg-blue-600 text-center py-3 rounded-lg">
            Generate Content
          </Link>
          <Link to="/plans" className="block w-full bg-purple-600 text-center py-3 rounded-lg">
            View Plans
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;