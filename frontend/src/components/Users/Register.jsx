import React, { useEffect } from "react";
import MobileSafeBackground from "../shared/MobileSafeBackground";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerAPI } from "../../apis/user/usersAPI";
import StatusMessage from "../Alert/StatusMessage";
import { useAuth } from "../../AuthContext/AuthContext";


const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  username: Yup.string().required("Username is required"),
});

const Registration = () => {

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem('isAuthenticated');
        const timestamp = localStorage.getItem('authTimestamp');
        if (stored === 'true' && timestamp) {
          const now = Date.now();
          const authTime = parseInt(timestamp);
          if ((now - authTime) < 24 * 60 * 60 * 1000) {
            navigate('/dashboard', { replace: true });
            return;
          }
        }
      } catch (e) {}
      
      if (isAuthenticated) {
        navigate('/dashboard', { replace: true });
      }
    };
    
    checkAuth();
  }, [isAuthenticated, navigate]);

  const mutation = useMutation({ mutationFn: registerAPI });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {

      mutation.mutate(values);
    },
  });
  useEffect(() => {
    if (mutation.isSuccess) {
      navigate('/login', { replace: true });
    }
  }, [mutation.isSuccess, navigate]);

  return (
    <div 
      style={{
        minHeight: '100vh',
        color: 'white',
        padding: '20px',
        paddingTop: '100px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <MobileSafeBackground />
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '400px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: 'clamp(20px, 4vw, 40px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          margin: '20px'
        }}
      >
        <h2 
          style={{
            fontSize: 'clamp(20px, 5vw, 28px)',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
            background: 'linear-gradient(to right, #a855f7, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Create an Account
        </h2>
        <p 
          style={{
            textAlign: 'center',
            color: '#d1d5db',
            marginBottom: '30px',
            fontSize: 'clamp(12px, 2.5vw, 14px)'
          }}
        >
          Create an account to get free access for 3 days. No credit card required.
        </p>

        {mutation.isPending && (
          <StatusMessage type="loading" message="Loading..." />
        )}

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

        {mutation.isSuccess && (
          <StatusMessage type="success" message="Registration success" />
        )}
        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(15px, 3vw, 20px)' }}>

          <div>
            <label
              htmlFor="username"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                color: '#d1d5db',
                fontWeight: '500'
              }}
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              {...formik.getFieldProps("username")}
              placeholder="John Doe"
              style={{
                width: '100%',
                padding: 'clamp(10px, 2.5vw, 14px)',
                background: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: 'white',
                fontSize: 'clamp(14px, 3vw, 16px)',
                boxSizing: 'border-box'
              }}
            />
            {formik.touched.username && formik.errors.username && (
              <div style={{ color: '#f87171', marginTop: '8px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
                {formik.errors.username}
              </div>
            )}
          </div>


          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                color: '#d1d5db',
                fontWeight: '500'
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps("email")}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: 'clamp(10px, 2.5vw, 14px)',
                background: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: 'white',
                fontSize: 'clamp(14px, 3vw, 16px)',
                boxSizing: 'border-box'
              }}
            />
            {formik.touched.email && formik.errors.email && (
              <div style={{ color: '#f87171', marginTop: '8px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
                {formik.errors.email}
              </div>
            )}
          </div>


          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                color: '#d1d5db',
                fontWeight: '500'
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps("password")}
              style={{
                width: '100%',
                padding: 'clamp(10px, 2.5vw, 14px)',
                background: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: 'white',
                fontSize: 'clamp(14px, 3vw, 16px)',
                boxSizing: 'border-box'
              }}
            />
            {formik.touched.password && formik.errors.password && (
              <div style={{ color: '#f87171', marginTop: '8px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
                {formik.errors.password}
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link
              to="/login"
              style={{
                color: '#a855f7',
                textDecoration: 'none',
                fontSize: 'clamp(12px, 2.5vw, 14px)'
              }}
            >
              Already have an account? Login
            </Link>
          </div>


          <button
            type="submit"
            style={{
              width: '100%',
              padding: 'clamp(12px, 3vw, 16px)',
              background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: 'clamp(14px, 3.5vw, 18px)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;