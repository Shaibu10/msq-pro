
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Role } from '../types';

export const LoginPage: React.FC = () => {
  const context = useContext(AppContext);
  const [name, setName] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [error, setError] = useState('');
  
  if (!context) return <div>Loading...</div>;

  const { users, login } = context;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (name && uniqueId) {
      const success = login(name, uniqueId);
      if (success) {
        // The user object is set in context, we just need to find them again for role-based redirect
        const user = users.find(u => u.name.toLowerCase() === name.toLowerCase().trim() && u.uniqueId === uniqueId.trim());
        if (user?.role === Role.ADMIN) {
          window.location.hash = '/admin';
        } else {
          window.location.hash = '/dashboard';
        }
      } else {
        setError('Invalid name or ID. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
        <div className="text-center">
            <div className="inline-block bg-indigo-600 p-3 rounded-full mb-4">
                 <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome to MSQ Pro</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Please enter your credentials to continue</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Alice"
              required
            />
          </div>
          <div>
            <label htmlFor="uniqueId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unique ID</label>
            <input
              id="uniqueId"
              type="text"
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 1002"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={!name || !uniqueId}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};