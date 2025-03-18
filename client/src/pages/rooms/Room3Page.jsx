import React from 'react';

const Room3Page = () => (
  <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-6">
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Conference Room</h1>
      <p className="text-gray-600 mb-6">A relaxation area for coffee breaks and casual conversations.</p>
      <button 
        onClick={() => window.history.back()} 
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition-colors"
      >
        Back to Office
      </button>
    </div>
  </div>
);

export default Room3Page;