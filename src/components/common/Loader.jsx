import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', fullScreen = false }) => {
  const loaderClass = `loader loader-${size}`;

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <div className={loaderClass}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return <div className={loaderClass}></div>;
};

export default Loader;