import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { ClockIcon, DocumentTextIcon, CheckCircleIcon } from '../components/icons';
import { Quiz } from '../types';

export const UserDashboard: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return <div className="p-8 text-center">Loading context...</div>;

  const { currentUser, quizzes, assignments, results, classAssignments, classQuizAssignments } = context;

  if (!currentUser) return <div className="p-8 text-center">Please log in.</div>;

  // Get quizzes assigned directly to the user
  const directQuizIds = assignments
    .filter(a => a.userId === currentUser.id)
    .map(a => a.quizId);

  // Get classes the user is in
  const userClassIds = classAssignments
    .filter(ca => ca.userId === currentUser.id)
    .map(ca => ca.classId);

  // Get quizzes assigned to those classes
  const quizzesFromClasses = classQuizAssignments
    .filter(cqa => userClassIds.includes(cqa.classId))
    .map(cqa => cqa.quizId);

  // Combine and deduplicate quiz IDs
  const allAssignedQuizIds = [...new Set([...directQuizIds, ...quizzesFromClasses])];

  const userQuizzes = allAssignedQuizIds
    .map(quizId => quizzes.find(q => q.id === quizId))
    .filter(Boolean) as Quiz[];
  
  const userResults = results.filter(r => r.userId === currentUser.id);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Quizzes</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Here are the quizzes assigned to you. Good luck!</p>

      {userQuizzes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
          <DocumentTextIcon className="mx-auto w-12 h-12 text-gray-400" />
          <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">No Quizzes Assigned</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Check back later for new quizzes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userQuizzes.map(quiz => {
            const result = userResults.find(r => r.quizId === quiz.id);
            const isCompleted = !!result;

            return (
              <div key={quiz.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300 ${isCompleted ? 'border-2 border-green-500 animate-completed' : 'border-2 border-transparent'}`}>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h2>
                    {isCompleted && <span className="flex items-center text-sm font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2.5 py-1 rounded-full"><CheckCircleIcon className="w-4 h-4 mr-1.5"/> Completed</span>}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 h-12">{quiz.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex items-center space-x-2">
                          <DocumentTextIcon className="w-5 h-5"/>
                          <span>{quiz.questions.length} Questions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                          <ClockIcon className="w-5 h-5"/>
                          <span>{quiz.timeLimit} Minutes</span>
                      </div>
                  </div>

                  <div className="mt-6">
                    {isCompleted && result ? (
                        <Link to={`/results/${result.id}`} className="block w-full text-center px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-colors">
                            View Results
                        </Link>
                    ) : (
                        <Link to={`/quiz/${quiz.id}`} className="block w-full text-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-md">
                            Start Quiz
                        </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};