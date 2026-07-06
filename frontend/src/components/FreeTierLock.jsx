import React from 'react';

const FreeTierLock = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Free Tier Expired</h2>
        <p className="text-gray-600 mb-6">
          Your complimentary access to the platform has ended.
        </p>
      </div>
    </div>
  );
};

export default FreeTierLock;
