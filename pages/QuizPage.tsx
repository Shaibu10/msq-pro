import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ClockIcon } from '../components/icons';

const Timer: React.FC<{ initialMinutes: number; onTimeUp: () => void }> = ({ initialMinutes, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft, onTimeUp]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className={`flex items-center space-x-2 font-mono text-xl md:text-2xl p-2 rounded-lg transition-colors duration-500 ${timeLeft < 60 ? 'bg-red-100 dark:bg-red-900/50 text-red-500 animate-pulse' : 'text-gray-700 dark:text-gray-300'}`}>
            <ClockIcon className="w-6 h-6"/>
            <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        </div>
    );
};


export const QuizPage: React.FC = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();
    const context = useContext(AppContext);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
    
    if (!context) return <div>Loading context...</div>;
    const { quizzes, currentUser, saveResult, results } = context;
    const quiz = quizzes.find(q => q.id === quizId);

    const shuffledQuestions = useMemo(() => {
        if (!quiz) return [];
        if (quiz.randomizeQuestions) {
            // Fisher-Yates shuffle algorithm for a fair shuffle
            const array = [...quiz.questions];
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        return quiz.questions;
    }, [quiz]);


    useEffect(() => {
        if (!quiz || !currentUser) {
            navigate('/');
            return;
        }
        const existingResult = results.find(r => r.quizId === quizId && r.userId === currentUser?.id);
        if (existingResult) {
            alert("You have already completed this quiz.");
            navigate(`/results/${existingResult.id}`);
        }
    }, [quiz, currentUser, navigate, results, quizId]);

    if (!quiz || !currentUser || shuffledQuestions.length === 0) return null;

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    const handleSelectOption = (optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIndex }));
    };

    const handleSubmit = () => {
        let score = 0;
        quiz.questions.forEach(q => {
            if (answers[q.id] === q.correctAnswerIndex) {
                score++;
            }
        });

        const resultId = `result-${Date.now()}`;
        const newResult = {
            id: resultId,
            quizId: quiz.id,
            userId: currentUser.id,
            score,
            totalQuestions: quiz.questions.length,
            answers,
            completedAt: new Date().toISOString(),
        };
        saveResult(newResult);
        navigate(`/results/${resultId}`);
    };

    const goToNext = () => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };
    
    const goToPrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{quiz.description}</p>
                    </div>
                    <Timer initialMinutes={quiz.timeLimit} onTimeUp={handleSubmit} />
                </div>

                <div className="p-8">
                    <div className="mb-6 text-center">
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Question {currentQuestionIndex + 1} of {shuffledQuestions.length}</p>
                        <h2 className="mt-2 text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200">{currentQuestion.text}</h2>
                    </div>

                    <div className="space-y-4">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleSelectOption(index)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                                    ${answers[currentQuestion.id] === index
                                        ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500 ring-2 ring-indigo-500'
                                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-indigo-400'
                                    }`}
                            >
                                <span className="font-medium text-gray-800 dark:text-gray-200">{option}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                    <button onClick={goToPrev} disabled={currentQuestionIndex === 0} className="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold">
                        Previous
                    </button>
                    {currentQuestionIndex === shuffledQuestions.length - 1 ? (
                        <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold shadow-md">
                            Submit Quiz
                        </button>
                    ) : (
                        <button onClick={goToNext} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold shadow-md">
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};