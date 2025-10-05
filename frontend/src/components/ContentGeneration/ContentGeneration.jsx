import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserProfileAPI } from "../../apis/user/usersAPI";
import StatusMessage from "../Alert/StatusMessage";
import { generateContentAPI } from "../../apis/ai/aiAPI";
import ShaderBackground from "../shared/ShaderBackground";
const BlogPostAIAssistant = () => {
  const [generatedContent, setGeneratedContent] = useState("");
  //get the user profile
  const { isLoading, isError, data, error } = useQuery({
    queryFn: getUserProfileAPI,
    queryKey: ["profile"],
    retry: false,
  });

  // Handle loading state
  if (isLoading) {
    return <StatusMessage type="loading" message="Loading please wait..." />;
  }

  // Handle error state
  if (isError) {
    return (
      <StatusMessage 
        type="error" 
        message={error?.response?.data?.message || "An error occurred while loading your profile"} 
      />
    );
  }

  const formik = useFormik({
    initialValues: {
      prompt: "",
      tone: "",
      category: "",
    },
    validationSchema: Yup.object({
      prompt: Yup.string().required("A prompt is required"),
      tone: Yup.string().required("Selecting a tone is required"),
      category: Yup.string().required("Selecting a category is required"),
    }),
    onSubmit: (values) => {
      if (data?.user?.apiRequestCount >= data?.user?.monthlyRequestCount) {
        return alert("You've reached your monthly request limit. Please upgrade your plan to continue.");
      }
      const prompt = `Generate a blog post with the following parameters:\n        Topic: ${values.prompt}\n        Category: ${values.category}\n        Tone: ${values.tone}\n        Please provide a well-structured, engaging blog post.`;
      mutation.mutate(prompt);
    },
  });

  const mutation = useMutation({ mutationFn: generateContentAPI });

  return (
    <div className="relative min-h-screen text-white">
      <ShaderBackground />
      <div className="relative mx-auto max-w-2xl w-full p-6">
        <div className="rounded-3xl p-8 xl:p-10 ring-1 ring-white/10 bg-white/5 shadow-xl overflow-hidden">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6 text-center">
            AI Blog Post Generator
          </h2>

          {/* Loading */}
          {mutation?.isPending && (
            <StatusMessage type="loading" message="Loading please wait..." />
          )}

          {/* Success */}
          {mutation?.isSuccess && (
            <StatusMessage type="success" message="Content generated successfully!" />
          )}

          {/* Error */}
          {mutation?.isError && (
            <StatusMessage type="error" message={mutation?.error?.response?.data?.message} />
          )}

          {/* Static display for Plan and Credits */}
          <div className="flex flex-wrap gap-4 mt-3 mb-6">
            <div>
              <span className="text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 rounded-full text-white shadow-lg">
                {data?.user?.subscriptionPlan} Plan
              </span>
            </div>
            <div>
              <span className="text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 rounded-full text-white shadow-lg">
                Credits: {data?.user?.monthlyRequestCount - data?.user?.apiRequestCount} / {data?.user?.monthlyRequestCount}
              </span>
            </div>
          </div>

          {/* Form for generating content */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Prompt input field */}
            <div className="space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-gray-200 text-sm font-medium mb-2">
                  Enter a topic or idea
                </label>
                <input
                  id="prompt"
                  type="text"
                  {...formik.getFieldProps("prompt")}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter a topic or idea"
                />
                {formik.touched.prompt && formik.errors.prompt && (
                  <div className="text-red-400 mt-2 text-sm">{formik.errors.prompt}</div>
                )}
              </div>

              {/* Tone selection field */}
              <div>
                <label htmlFor="tone" className="block text-gray-200 text-sm font-medium mb-2">
                  Select Tone
                </label>
                <select
                  id="tone"
                  {...formik.getFieldProps("tone")}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Choose a tone...</option>
                  <option value="formal">Formal</option>
                  <option value="informal">Informal</option>
                  <option value="humorous">Humorous</option>
                </select>
                {formik.touched.tone && formik.errors.tone && (
                  <div className="text-red-400 mt-2 text-sm">{formik.errors.tone}</div>
                )}
              </div>

              {/* Category selection field */}
              <div>
                <label htmlFor="category" className="block text-gray-200 text-sm font-medium mb-2">
                  Select Category
                </label>
                <select
                  id="category"
                  {...formik.getFieldProps("category")}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Choose a category...</option>
                  <option value="technology">Technology</option>
                  <option value="health">Health</option>
                  <option value="business">Business</option>
                </select>
                {formik.touched.category && formik.errors.category && (
                  <div className="text-red-400 mt-2 text-sm">{formik.errors.category}</div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg shadow-lg text-white font-medium bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform transition-all duration-200 hover:scale-[1.02]"
              >
                Generate Content
              </button>
              <Link to="/history" className="block text-center py-2 text-gray-300 hover:text-white transition-colors">
                View History
              </Link>
            </div>
          </form>

          {/* Display generated content */}
          {mutation.isSuccess && mutation.data && (
            <div className="mt-8 p-6 bg-black/30 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
                Generated Content:
              </h3>
              <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{mutation.data?.content}</p>

              <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
                <span>
                  Credits Remaining: {data?.user?.monthlyRequestCount - data?.user?.apiRequestCount} / {data?.user?.monthlyRequestCount}
                </span>
                <Link to="/plans" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Upgrade Plan →
                </Link>
              </div>
            </div>
          )}

          {/* Display error message if request fails */}
          {mutation.isError && (
            <div className="mt-6 p-6 bg-red-900/20 border border-red-500/50 rounded-xl">
              <p className="text-red-400">
                {mutation.error?.response?.data?.message || "Failed to generate content. Please try again."}
              </p>
              {/* Show suggestion if provided */}
              {mutation.error?.response?.data?.suggestion && (
                <p className="mt-2 text-gray-300">
                  {mutation.error.response.data.suggestion}
                </p>
              )}
              {data?.user?.subscriptionPlan === "Free" && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-gray-300">
                    Free Plan Credits: {data?.user?.monthlyRequestCount - data?.user?.apiRequestCount} remaining
                  </p>
                  <Link to="/plans" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2">
                    Upgrade Plan 
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPostAIAssistant;