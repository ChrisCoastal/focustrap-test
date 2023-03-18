import React from 'react';

const NestedButton = () => {
  return (
    <div>
      <div>
        <div>
          <button className="bg-gradient-to-br from-indigo-500 to-indigo-700 px-4 py-2 rounded-md text-sm font-bold text-white">
            Nested Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default NestedButton;
