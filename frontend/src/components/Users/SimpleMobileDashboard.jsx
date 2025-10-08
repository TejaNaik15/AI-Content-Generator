import React from "react";

const SimpleMobileDashboard = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'black', 
      color: 'white', 
      padding: '20px',
      paddingTop: '100px'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Dashboard</h1>
      
      <div style={{ marginBottom: '20px', backgroundColor: '#333', padding: '15px', borderRadius: '8px' }}>
        <h2>Welcome!</h2>
        <p>You are successfully logged in.</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <a href="/generate-content" style={{ 
          display: 'block', 
          backgroundColor: '#0066cc', 
          color: 'white', 
          padding: '15px', 
          textAlign: 'center', 
          textDecoration: 'none',
          borderRadius: '8px',
          marginBottom: '10px'
        }}>
          Generate Content
        </a>
        
        <a href="/plans" style={{ 
          display: 'block', 
          backgroundColor: '#6600cc', 
          color: 'white', 
          padding: '15px', 
          textAlign: 'center', 
          textDecoration: 'none',
          borderRadius: '8px'
        }}>
          View Plans
        </a>
      </div>
    </div>
  );
};

export default SimpleMobileDashboard;