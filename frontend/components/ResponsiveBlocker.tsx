import React, { useEffect, useState } from 'react';

const ResponsiveBlocker: React.FC = () => {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 640) {
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    };

    checkScreenSize(); // Check on initial render
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isBlocked) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // Ensure it's on top
        color: 'white',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <div>
        <h1>Application Not Supported</h1>
        <p>This application is best viewed on a tablet or larger screen.</p>
        <p>Please switch to a larger device to continue.</p>
      </div>
    </div>
  );
};

export default ResponsiveBlocker; 