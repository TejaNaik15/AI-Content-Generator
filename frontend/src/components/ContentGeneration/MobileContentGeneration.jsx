import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserProfileAPI } from "../../apis/user/usersAPI";
import { generateContentAPI } from "../../apis/ai/aiAPI";

const MobileContentGeneration = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryFn: getUserProfileAPI,
    queryKey: ["profile"],
    retry: 1,
  });

  const mutation = useMutation({ mutationFn: generateContentAPI });

  const formik = useFormik({
    initialValues: {
      prompt: "",
      tone: "formal",
      category: "technology",
    },
    validationSchema: Yup.object({
      prompt: Yup.string().required("A prompt is required"),
    }),
    onSubmit: (values) => {
      const prompt = `Generate content about: ${values.prompt}`;
      mutation.mutate(prompt);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 pt-24">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-black text-white p-4 pt-24">
        <div className="text-center text-red-400">Error loading page</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-24">
      <h1 className="text-2xl font-bold mb-6 text-center">Generate Content</h1>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <p>Credits: {(data?.user?.monthlyRequestCount || 0) - (data?.user?.apiRequestCount || 0)} remaining</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Topic</label>
          <input
            type="text"
            {...formik.getFieldProps("prompt")}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            placeholder="Enter your topic"
          />
          {formik.touched.prompt && formik.errors.prompt && (
            <div className="text-red-400 text-sm mt-1">{formik.errors.prompt}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 py-3 rounded-lg disabled:opacity-50"
        >
          {mutation.isPending ? "Generating..." : "Generate Content"}
        </button>
      </form>

      {mutation.isSuccess && mutation.data && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Generated Content:</h3>
          <p className="text-gray-200">{mutation.data?.content}</p>
        </div>
      )}

      {mutation.isError && (
        <div className="mt-6 bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-400">Error generating content</p>
        </div>
      )}

      <div className="mt-6">
        <Link to="/dashboard" className="block w-full bg-gray-600 text-center py-3 rounded-lg">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default MobileContentGeneration;