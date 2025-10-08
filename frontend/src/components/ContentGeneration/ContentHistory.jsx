import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaRegEdit, FaTrashAlt, FaEye, FaPlusSquare } from "react-icons/fa";
import { getUserProfileAPI } from "../../apis/user/usersAPI";
import StatusMessage from "../Alert/StatusMessage";
import { Link } from "react-router-dom";
import Hero from "../shared/Hero";
import MobileSafeBackground from "../shared/MobileSafeBackground";

const ContentGenerationHistory = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryFn: getUserProfileAPI,
    queryKey: ["profile"],
    retry: false,
  });
  if (isLoading) {
    return <StatusMessage type="loading" message="Loading please wait" />;
  }
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
      <div className="relative bg-gray-100 py-8 sm:py-12">
        <MobileSafeBackground />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 text-center mb-4 sm:mb-6">
            Generated Content</h2>

        <div className="bg-white shadow-xl rounded-xl sm:rounded-2xl overflow-hidden">
          {data?.user?.contentHistory?.length <= 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <h1 className="text-lg sm:text-xl text-gray-600 mb-4">No content history found</h1>
              <Link
                to="/generate-content"
                className="mt-4 inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FaPlusSquare className="mr-2" /> Create Your First Content
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data?.user?.contentHistory?.map((content, index) => {
                return (
                  <li key={content?._id || index} className="hover:bg-gray-50 transition-colors duration-150">
                    <div className="px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {content?.content}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 flex items-center">
                          <span className="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                            Generated on {new Date(content?.createdAt).toLocaleDateString()}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 justify-end">
                        <button className="p-1.5 sm:p-2 text-gray-500 hover:text-green-600 transition-colors">
                          <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 transition-colors">
                          <FaRegEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 transition-colors">
                          <FaTrashAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}

            </ul>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default ContentGenerationHistory;