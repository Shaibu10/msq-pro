// FIX: Removed a conflicting import of `Role` from this file as it was already defined below.
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  uniqueId: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  id:string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  category: string;
  questions: Question[];
  randomizeQuestions?: boolean;
}

export interface QuizAssignment {
  quizId: string;
  userId: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  answers: { [questionId: string]: number }; // questionId -> selectedOptionIndex
  completedAt: string;
}

export interface Class {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ClassAssignment {
  classId: string;
  userId: string;
}

export interface ClassQuizAssignment {
  quizId: string;
  classId: string;
}