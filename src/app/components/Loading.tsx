import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="bg-blue-300 rounded-full w-16 h-36 animate-bounce"></div>
      <div className="bg-blue-400 rounded-full w-16 h-36 animate-bounce200"></div>
      <div className="bg-blue-500 rounded-full w-16 h-36 animate-bounce400"></div>
    </div>
  );
};

export default Loading;