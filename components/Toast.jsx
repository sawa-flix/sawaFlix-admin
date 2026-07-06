import React, { useEffect } from 'react';

const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-green-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 text-sm md:text-base">
      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      <span>{message}</span>
    </div>
  );
};

export default Toast;