import { User, Quiz, Role, QuizAssignment, Class, ClassAssignment, ClassQuizAssignment, Category } from './types';

export const USERS: User[] = [
  { id: 'user-1', name: 'Admin', role: Role.ADMIN, uniqueId: '1001' },
  { id: 'user-2', name: 'Alice', role: Role.USER, uniqueId: '1002' },
  { id: 'user-3', name: 'Bob', role: Role.USER, uniqueId: '1003' },
];

export const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Programming' },
  { id: 'cat-2', name: 'Geography' },
  { id: 'cat-3', name: 'Uncategorized' },
];


export const QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'React Fundamentals',
    description: 'Test your knowledge of core React concepts.',
    timeLimit: 10,
    category: 'Programming',
    randomizeQuestions: false,
    questions: [
      {
        id: 'q-1-1',
        text: 'What is JSX?',
        options: ['A JavaScript syntax extension', 'A template engine', 'A CSS preprocessor', 'A database query language'],
        correctAnswerIndex: 0,
      },
      {
        id: 'q-1-2',
        text: 'Which hook is used to perform side effects in a function component?',
        options: ['useState', 'useContext', 'useEffect', 'useReducer'],
        correctAnswerIndex: 2,
      },
      {
        id: 'q-1-3',
        text: 'How do you pass data from a parent component to a child component?',
        options: ['State', 'Props', 'Context', 'Redux'],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'quiz-2',
    title: 'Advanced TypeScript',
    description: 'Challenge your TypeScript skills with advanced topics.',
    timeLimit: 15,
    category: 'Programming',
    randomizeQuestions: false,
    questions: [
        {
            id: 'q-2-1',
            text: 'What is a generic in TypeScript?',
            options: ['A type that is generated automatically', 'A reusable component of code that can work with a variety of types', 'A specific type of interface', 'A decorative function'],
            correctAnswerIndex: 1,
        },
        {
            id: 'q-2-2',
            text: 'What does the `keyof` operator do?',
            options: ['Returns the keys of an object', 'Creates a union type of the property names of a type', 'Checks if a key exists in an object', 'Accesses a key from a type'],
            correctAnswerIndex: 1,
        },
    ],
  },
  {
    id: 'quiz-3',
    title: 'World Capitals',
    description: 'How well do you know the capital cities of the world?',
    timeLimit: 5,
    category: 'Geography',
    randomizeQuestions: false,
    questions: [
      {
        id: 'q-3-1',
        text: 'What is the capital of Japan?',
        options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'],
        correctAnswerIndex: 2,
      },
      {
        id: 'q-3-2',
        text: 'What is the capital of Canada?',
        options: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'],
        correctAnswerIndex: 2,
      },
    ],
  },
];

export const ASSIGNMENTS: QuizAssignment[] = [
    { quizId: 'quiz-1', userId: 'user-2' }, // Alice assigned React quiz
    { quizId: 'quiz-1', userId: 'user-3' }, // Bob assigned React quiz
    { quizId: 'quiz-3', userId: 'user-3' }, // Bob assigned Geography quiz
];

export const CLASSES: Class[] = [
  { id: 'class-1', name: 'Grade 5 Math' },
  { id: 'class-2', name: 'History 101' },
];

export const CLASS_ASSIGNMENTS: ClassAssignment[] = [
  { classId: 'class-1', userId: 'user-2' }, // Alice in Grade 5 Math
  { classId: 'class-2', userId: 'user-2' }, // Alice in History 101
  { classId: 'class-1', userId: 'user-3' }, // Bob in Grade 5 Math
];

export const CLASS_QUIZ_ASSIGNMENTS: ClassQuizAssignment[] = [
    { quizId: 'quiz-2', classId: 'class-1' }, // Assign TS quiz to the Grade 5 Math class
];