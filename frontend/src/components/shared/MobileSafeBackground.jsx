const MobileSafeBackground = () => {
  // iPhone-safe background with inline styles
  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{
        zIndex: -10,
        background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(0, 0, 0, 1) 50%, rgba(30, 58, 138, 0.3) 100%)',
        minHeight: '100vh',
        minWidth: '100vw'
      }}
    />
  );
};

export default MobileSafeBackground;