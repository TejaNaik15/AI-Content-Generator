import React, { useEffect } from "react";
import ShaderBackground from "../shared/ShaderBackground";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import StatusMessage from "../Alert/StatusMessage";
import { useMutation } from "@tanstack/react-query";
import { loginAPI } from "../../apis/user/usersAPI";
import { useAuth } from "../../AuthContext/AuthContext";

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  //custom auth hook
  const { isAuthenticated, login } = useAuth();

  const navigate = useNavigate();
  //Redirect if a user is login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);
  //mutation
  const mutation = useMutation({ mutationFn: loginAPI });
  // Formik setup for form handling
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Here, you would typically handle form submission

      mutation.mutate(values);
    },
  });
  //Update is authenticated
  useEffect(() => {
    if (mutation.isSuccess) {
      login();
      // Navigate once mutation succeeds
      navigate("/dashboard");
    }
  }, [mutation.isSuccess]);
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <ShaderBackground />
      <div className="relative z-10 max-w-md w-full rounded-3xl bg-white/5 ring-1 ring-white/10 shadow-2xl p-8 m-4 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center text-white mb-8">
          Login to Your Account
        </h2>
        {/* display loading */}
        {mutation.isPending && (
          <StatusMessage type="loading" message="Loading..." />
        )}
        {/* display error */}
        {mutation.isError && (
          <StatusMessage
            type="error"
            message={
              mutation?.error?.response?.data?.message ||
              mutation?.error?.message ||
              "An unexpected error occurred. Please try again."
            }
          />
        )}
        {/* display success */}
        {mutation.isSuccess && (
          <StatusMessage type="success" message="Login success" />
        )}
        {/* Form for login */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Email input field */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-white block mb-2"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps("email")}
              className="w-full px-3 py-2 border border-white/10 bg-black/30 text-sm rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:border-indigo-500"
              placeholder="you@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 mt-1">{formik.errors.email}</div>
            )}
          </div>

          {/* Password input field */}
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-white block mb-2"
            >
              Your Password
            </label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps("password")}
              className="w-full px-3 py-2 border border-white/10 bg-black/30 text-sm rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:border-indigo-500"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 mt-1">{formik.errors.password}</div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/register"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                Don't have an account? Register
              </Link>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-indigo-500 rounded-2xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;