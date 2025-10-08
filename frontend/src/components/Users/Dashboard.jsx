import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileAPI } from "../../apis/user/usersAPI";
import StatusMessage from "../Alert/StatusMessage";
import MobileSafeBackground from "../shared/MobileSafeBackground";

const Dashboard = () => {

  const getCredits = () => {
    try {
      const saved = localStorage.getItem('userCredits');
      return saved ? JSON.parse(saved) : { total: 5, used: 0 };
    } catch {
      return { total: 5, used: 0 };
    }
  };

  const credits = getCredits();
  

  const { isLoading, isError, data, error } = useQuery({
    queryFn: getUserProfileAPI,
    queryKey: ["profile"],
    retry: false,
  });


  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <StatusMessage type="loading" message="Loading dashboard..." />
      </div>
    );
  }


  if (isError) {
    console.warn('Profile fetch error:', error);
  }


  const userData = data?.user || {
    username: "User",
    email: "user@example.com",
    subscriptionPlan: "Free",
    monthlyRequestCount: credits.total,
    apiRequestCount: credits.used,
    trialActive: false,
    payments: []
  };


  userData.monthlyRequestCount = credits.total;
  userData.apiRequestCount = credits.used;

  return (
    <div 
      style={{
        minHeight: '100vh',
        color: 'white',
        padding: '20px',
        paddingTop: '100px',
        position: 'relative'
      }}
    >
      <MobileSafeBackground />
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <h1 
          style={{
            fontSize: 'clamp(24px, 5vw, 36px)',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '40px',
            background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          User Dashboard
        </h1>

        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}
        >

          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: 'clamp(20px, 4vw, 40px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <h2 
              style={{
                fontSize: 'clamp(18px, 4vw, 24px)',
                fontWeight: 'bold',
                marginBottom: '20px',
                background: 'linear-gradient(to right, #a855f7, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Profile Information
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', color: '#d1d5db', fontSize: '14px', marginBottom: '5px' }}>
                  Name
                </label>
                <div 
                  style={{
                    background: 'rgba(31, 41, 55, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                >
                  {userData.username || "User"}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#d1d5db', fontSize: '14px', marginBottom: '5px' }}>
                  Email
                </label>
                <div 
                  style={{
                    background: 'rgba(31, 41, 55, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '14px',
                    wordBreak: 'break-all'
                  }}
                >
                  {userData.email || "user@example.com"}
                </div>
              </div>
            </div>
          </div>


          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: 'clamp(20px, 4vw, 40px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <h2 
              style={{
                fontSize: 'clamp(18px, 4vw, 24px)',
                fontWeight: 'bold',
                marginBottom: '20px',
                background: 'linear-gradient(to right, #a855f7, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Credit Usage
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#d1d5db', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span>Monthly Credit:</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{userData.monthlyRequestCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span>Credit Used:</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{userData.apiRequestCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span>Credit Remaining:</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{userData.monthlyRequestCount - userData.apiRequestCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span>Next Billing Date:</span>
                <span style={{ fontWeight: '600', color: 'white' }}>No Billing date</span>
              </div>
            </div>
          </div>


          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: 'clamp(20px, 4vw, 40px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <h2 
              style={{
                fontSize: 'clamp(18px, 4vw, 24px)',
                fontWeight: 'bold',
                marginBottom: '20px',
                background: 'linear-gradient(to right, #a855f7, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Payment & Plans
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#d1d5db', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span>Current Plan:</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{userData.subscriptionPlan}</span>
              </div>
              <div 
                style={{
                  background: 'rgba(31, 41, 55, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#d1d5db',
                  fontSize: '12px'
                }}
              >
                Free: 5 monthly requests
              </div>
              <Link 
                to="/plans" 
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginTop: '10px'
                }}
              >
                Upgrade Plan
              </Link>
            </div>
          </div>


          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: 'clamp(20px, 4vw, 40px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <h2 
              style={{
                fontSize: 'clamp(18px, 4vw, 24px)',
                fontWeight: 'bold',
                marginBottom: '20px',
                background: 'linear-gradient(to right, #a855f7, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Trial Information
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#d1d5db', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span>Trial Status:</span>
                <span style={{ fontWeight: '600', color: '#fbbf24' }}>Inactive</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span>Expires on:</span>
                <span style={{ fontWeight: '600', color: 'white' }}>N/A</span>
              </div>
              <Link 
                to="/plans" 
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginTop: '10px'
                }}
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>


        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: 'clamp(20px, 4vw, 40px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          <h2 
            style={{
              fontSize: 'clamp(18px, 4vw, 24px)',
              fontWeight: 'bold',
              marginBottom: '20px',
              background: 'linear-gradient(to right, #a855f7, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Payment History
          </h2>
          <div style={{ color: '#d1d5db', fontSize: '14px' }}>
            No Payment History
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;