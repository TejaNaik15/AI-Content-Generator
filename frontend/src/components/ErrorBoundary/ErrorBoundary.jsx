import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    // Log additional mobile-specific info
    if (typeof window !== 'undefined') {
      console.error('Mobile info:', {
        userAgent: navigator.userAgent,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isTouch: 'ontouchstart' in window
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // For iPhone Safari - stay on current page, don't redirect to login
      const currentPath = window.location.pathname;
      return (
        <div 
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000000',
            color: 'white',
            padding: '16px'
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Something went wrong</h1>
            <p style={{ color: '#d1d5db', marginBottom: '24px', fontSize: '14px' }}>Please try refreshing this page.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  width: '100%',
                  background: '#3b82f6',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Refresh Page
              </button>
              {currentPath !== '/login' && (
                <button
                  onClick={() => {
                    try {
                      localStorage.removeItem('isAuthenticated');
                      localStorage.removeItem('authTimestamp');
                    } catch (e) {}
                    window.location.href = '/login';
                  }}
                  style={{
                    width: '100%',
                    background: '#6b7280',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Go to Login
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;