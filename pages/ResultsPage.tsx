import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { CheckCircleIcon, XCircleIcon } from '../components/icons';
import { Role } from '../types';

export const ResultsPage: React.FC = () => {
    const { resultId } = useParams<{ resultId: string }>();
    const context = useContext(AppContext);
    
    if (!context) return <div>Loading...</div>;
    const { results, quizzes, users, currentUser } = context;

    const result = results.find(r => r.id === resultId);

    if (!result) return <div className="p-8 text-center text-red-500">Result not found.</div>;
    
    const quiz = quizzes.find(q => q.id === result.quizId);
    const user = users.find(u => u.id === result.userId);

    if (!quiz || !user) return <div className="p-8 text-center text-red-500">Quiz or User data missing.</div>;

    const percentage = Math.round((result.score / result.totalQuestions) * 100);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg printable-content">
                <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Results</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{quiz.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">Completed by: <span className="font-semibold">{user.name}</span> on {new Date(result.completedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex space-x-2 no-print">
                            <Link 
                                to={currentUser?.role === Role.ADMIN ? "/admin" : "/dashboard"}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
                            >
                                Back to Dashboard
                            </Link>
                            <button onClick={handlePrint} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium transition-colors">
                                Print Results
                            </button>
                        </div>
                    </div>

                    <div className={`mt-8 text-center p-6 rounded-lg ${percentage >= 70 ? 'bg-green-50 dark:bg-green-900/50' : 'bg-red-50 dark:bg-red-900/50'} print-score-box`}>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Score</h2>
                        <p className={`text-6xl font-extrabold my-2 ${percentage >= 70 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{percentage}%</p>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">You answered {result.score} out of {result.totalQuestions} questions correctly.</p>
                    </div>
                </div>

                <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Answer Breakdown</h3>
                    <div className="space-y-8">
                        {quiz.questions.map((question, index) => {
                            const userAnswerIndex = result.answers[question.id];
                            const isCorrect = userAnswerIndex === question.correctAnswerIndex;

                            return (
                                <div key={question.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                                    <div className="flex items-start">
                                        <div className="mr-4">
                                            {isCorrect ? (
                                                <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                            ) : (
                                                <XCircleIcon className="w-6 h-6 text-red-500" />
                                            )}
                                        </div>
                                        <p className="flex-1 font-semibold text-lg text-gray-800 dark:text-gray-200">{index + 1}. {question.text}</p>
                                    </div>
                                    <div className="mt-4 pl-10 space-y-2">
                                        {question.options.map((option, optIndex) => {
                                            const isUserAnswer = userAnswerIndex === optIndex;
                                            const isCorrectAnswer = question.correctAnswerIndex === optIndex;
                                            
                                            let styles = 'text-gray-700 dark:text-gray-300';
                                            if (isCorrectAnswer) {
                                                styles = 'text-green-600 dark:text-green-400 font-bold';
                                            }
                                            if (isUserAnswer && !isCorrect) {
                                                styles = 'text-red-600 dark:text-red-400 line-through';
                                            }

                                            return <p key={optIndex} className={styles}>{option}</p>;
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};