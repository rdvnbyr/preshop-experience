"use client";

import React, { useState } from "react";

const TestDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => {
          console.log("Test dropdown clicked!");
          setIsOpen(!isOpen);
        }}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-300 rounded"
      >
        Test Dropdown {isOpen ? "▲" : "▼"}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[9999] py-2">
          <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Test Item 1
          </div>
          <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Test Item 2
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDropdown;
