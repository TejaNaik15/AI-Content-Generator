import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaRegEdit, FaTrashAlt, FaEye, FaPlusSquare } from "react-icons/fa";
import { getUserProfileAPI } from "../../apis/user/usersAPI";
import StatusMessage from "../Alert/StatusMessage";
import { Link } from "react-router-dom";
import Hero from "../shared/Hero";

const ContentGenerationHistory = () => {
  //get the user profile
  const { isLoading, isError, data, error } = useQuery({
    queryFn: getUserProfileAPI,
    queryKey: ["profile"],
    retry: false,
  });
  //  Display loading
  if (isLoading) {
    return <StatusMessage type="loading" message="Loading please wait" />;
  }
  //  Display loading
  if (isError) {
    return (
      <StatusMessage type="error" message={error?.response?.data?.message} />
    );
  }
  return (
    <>
      <Hero
        badgeText="History"
        badgeLabel="Your"
        title="Your Content Generation History"
        description="View, manage, and track all your AI-generated content in one place. Easily access your previous content and make the most of our platform."
        ctaButtons={[
          {
            text: "Generate New Content",
            href: "/generate-content",
            primary: true
          }
        ]}
        microDetails={[
          "Easy access to past content",
          "Track your AI generations",
          "Manage your content"
        ]}
      />
      <div className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
            Generated Content</h2>
        {/* Content history list */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {data?.user?.contentHistory?.length <= 0 ? (
            <div className="p-8 text-center">
              <h1 className="text-xl text-gray-600">No content history found</h1>
              <Link
                to="/generate-content"
                className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FaPlusSquare className="mr-2" /> Create Your First Content
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data?.user?.contentHistory?.map((content, index) => {
                return (
                  <li key={content?._id || index} className="hover:bg-gray-50 transition-colors duration-150">
                    <div className="px-6 py-6 flex items-center justify-between space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold text-gray-900 mb-1">
                          {content?.content}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <span className="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                            Generated on {new Date(content?.createdAt).toLocaleDateString()}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:text-green-600 transition-colors">
                          <FaEye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                          <FaRegEdit className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                          <FaTrashAlt className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
              {/* Additional list items can be added here */}
            </ul>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default ContentGenerationHistory;