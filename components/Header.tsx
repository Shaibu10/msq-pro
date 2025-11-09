
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Role } from '../types';

export const Header: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }

  const { currentUser, logout } = context;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 no-print">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">MSQ Pro</h1>
        </div>
        {currentUser && (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-gray-700 dark:text-gray-300">Welcome, <span className="font-semibold">{currentUser.name}</span></span>
              <p className={`text-sm font-medium ${currentUser.role === Role.ADMIN ? 'text-indigo-500' : 'text-green-500'}`}>
                {currentUser.role}
              </p>
            </div>
            <button
              onClick={() => {
                logout();
                window.location.hash = '/login';
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
