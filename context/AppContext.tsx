import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Quiz, QuizAssignment, QuizResult, Role, Class, ClassAssignment, ClassQuizAssignment, Category } from '../types';
import { USERS, QUIZZES, ASSIGNMENTS, CLASSES, CLASS_ASSIGNMENTS, CLASS_QUIZ_ASSIGNMENTS, CATEGORIES } from '../constants';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  quizzes: Quiz[];
  assignments: QuizAssignment[];
  results: QuizResult[];
  classes: Class[];
  classAssignments: ClassAssignment[];
  classQuizAssignments: ClassQuizAssignment[];
  categories: Category[];
  login: (name: string, uniqueId: string) => boolean;
  logout: () => void;
  saveQuiz: (quiz: Quiz) => void;
  deleteQuiz: (quizId: string) => void;
  assignQuiz: (quizId: string, userIds: string[]) => void;
  assignQuizToClasses: (quizId: string, classIds: string[]) => void;
  saveResult: (result: QuizResult) => void;
  saveUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  saveClass: (classToSave: Class, assignedUserIds: string[]) => void;
  deleteClass: (classId: string) => void;
  saveCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  const [users, setUsers] = useLocalStorage<User[]>('users', USERS);
  const [quizzes, setQuizzes] = useLocalStorage<Quiz[]>('quizzes', QUIZZES);
  const [assignments, setAssignments] = useLocalStorage<QuizAssignment[]>('assignments', ASSIGNMENTS);
  const [results, setResults] = useLocalStorage<QuizResult[]>('results', []);
  const [classes, setClasses] = useLocalStorage<Class[]>('classes', CLASSES);
  const [classAssignments, setClassAssignments] = useLocalStorage<ClassAssignment[]>('classAssignments', CLASS_ASSIGNMENTS);
  const [classQuizAssignments, setClassQuizAssignments] = useLocalStorage<ClassQuizAssignment[]>('classQuizAssignments', CLASS_QUIZ_ASSIGNMENTS);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', CATEGORIES);
  
  // Initialize data if localStorage is empty
  useEffect(() => {
    if(!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify(USERS));
    if(!localStorage.getItem('quizzes')) localStorage.setItem('quizzes', JSON.stringify(QUIZZES));
    if(!localStorage.getItem('assignments')) localStorage.setItem('assignments', JSON.stringify(ASSIGNMENTS));
    if(!localStorage.getItem('results')) localStorage.setItem('results', JSON.stringify([]));
    if(!localStorage.getItem('classes')) localStorage.setItem('classes', JSON.stringify(CLASSES));
    if(!localStorage.getItem('classAssignments')) localStorage.setItem('classAssignments', JSON.stringify(CLASS_ASSIGNMENTS));
    if(!localStorage.getItem('classQuizAssignments')) localStorage.setItem('classQuizAssignments', JSON.stringify(CLASS_QUIZ_ASSIGNMENTS));
    if(!localStorage.getItem('categories')) localStorage.setItem('categories', JSON.stringify(CATEGORIES));
  }, [])


  const login = useCallback((name: string, uniqueId: string): boolean => {
    const user = users.find(u => u.name.toLowerCase() === name.toLowerCase().trim() && u.uniqueId === uniqueId.trim());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [users, setCurrentUser]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  const saveQuiz = useCallback((quizToSave: Quiz) => {
    setQuizzes(prevQuizzes => {
      const existingIndex = prevQuizzes.findIndex(q => q.id === quizToSave.id);
      if (existingIndex > -1) {
        const updatedQuizzes = [...prevQuizzes];
        updatedQuizzes[existingIndex] = quizToSave;
        return updatedQuizzes;
      }
      return [...prevQuizzes, quizToSave];
    });
  }, [setQuizzes]);

  const deleteQuiz = useCallback((quizId: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    setAssignments(prev => prev.filter(a => a.quizId !== quizId));
    setResults(prev => prev.filter(r => r.quizId !== quizId));
    setClassQuizAssignments(prev => prev.filter(a => a.quizId !== quizId));
  }, [setQuizzes, setAssignments, setResults, setClassQuizAssignments]);

  const assignQuiz = useCallback((quizId: string, userIds: string[]) => {
    setAssignments(prev => {
        const filtered = prev.filter(a => a.quizId !== quizId);
        const newAssignments = userIds.map(userId => ({ quizId, userId }));
        return [...filtered, ...newAssignments];
    });
  }, [setAssignments]);
  
  const assignQuizToClasses = useCallback((quizId: string, classIds: string[]) => {
    setClassQuizAssignments(prev => {
        const filtered = prev.filter(a => a.quizId !== quizId);
        const newAssignments = classIds.map(classId => ({ quizId, classId }));
        return [...filtered, ...newAssignments];
    });
  }, [setClassQuizAssignments]);

  const saveResult = useCallback((result: QuizResult) => {
    setResults(prev => [...prev, result]);
  }, [setResults]);

  const saveUser = useCallback((userToSave: User) => {
    setUsers(prevUsers => {
      const existingIndex = prevUsers.findIndex(u => u.id === userToSave.id);
      if (existingIndex > -1) {
        const updatedUsers = [...prevUsers];
        const originalUser = updatedUsers[existingIndex];
        // Ensure uniqueId cannot be changed on edit
        updatedUsers[existingIndex] = { ...userToSave, uniqueId: originalUser.uniqueId };
        return updatedUsers;
      } else {
        // Find the highest existing uniqueId and add 1 for the new user
        const maxId = prevUsers.reduce((max, user) => {
          const idNum = parseInt(user.uniqueId, 10);
          return idNum > max ? idNum : max;
        }, 1000); // Start from 1000 if no users exist
        const newUniqueId = String(maxId + 1);
        const newUser = { ...userToSave, uniqueId: newUniqueId };
        return [...prevUsers, newUser];
      }
    });
  }, [setUsers]);

  const deleteUser = useCallback((userId: string) => {
    if (currentUser?.id === userId) {
        alert("You cannot delete your own account while logged in.");
        return;
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
    setAssignments(prev => prev.filter(a => a.userId !== userId));
    setResults(prev => prev.filter(r => r.userId !== userId));
    setClassAssignments(prev => prev.filter(a => a.userId !== userId));
  }, [setUsers, setAssignments, setResults, setClassAssignments, currentUser]);

  const saveClass = useCallback((classToSave: Class, assignedUserIds: string[]) => {
    setClasses(prevClasses => {
      const existingIndex = prevClasses.findIndex(c => c.id === classToSave.id);
      if (existingIndex > -1) {
        const updatedClasses = [...prevClasses];
        updatedClasses[existingIndex] = classToSave;
        return updatedClasses;
      }
      return [...prevClasses, classToSave];
    });

    setClassAssignments(prev => {
      const filtered = prev.filter(a => a.classId !== classToSave.id);
      const newAssignments = assignedUserIds.map(userId => ({ classId: classToSave.id, userId }));
      return [...filtered, ...newAssignments];
    });
  }, [setClasses, setClassAssignments]);

  const deleteClass = useCallback((classId: string) => {
    setClasses(prev => prev.filter(c => c.id !== classId));
    setClassAssignments(prev => prev.filter(a => a.classId !== classId));
    setClassQuizAssignments(prev => prev.filter(a => a.classId !== classId));
  }, [setClasses, setClassAssignments, setClassQuizAssignments]);

  const saveCategory = useCallback((categoryToSave: Category) => {
    setCategories(prev => {
      const existingIndex = prev.findIndex(c => c.id === categoryToSave.id);
      if (existingIndex > -1) {
        const updatedCategories = [...prev];
        updatedCategories[existingIndex] = categoryToSave;
        return updatedCategories;
      }
      return [...prev, categoryToSave];
    });
  }, [setCategories]);

  const deleteCategory = useCallback((categoryId: string) => {
    const categoryToDelete = categories.find(c => c.id === categoryId);
    if (!categoryToDelete || categoryToDelete.name === 'Uncategorized') {
      alert("This category cannot be deleted.");
      return;
    }

    setQuizzes(prevQuizzes => 
      prevQuizzes.map(quiz => 
        quiz.category === categoryToDelete.name 
          ? { ...quiz, category: 'Uncategorized' } 
          : quiz
      )
    );

    setCategories(prev => prev.filter(c => c.id !== categoryId));
  }, [setCategories, setQuizzes, categories]);

  return (
    <AppContext.Provider value={{ currentUser, users, quizzes, assignments, results, login, logout, saveQuiz, deleteQuiz, assignQuiz, saveResult, saveUser, deleteUser, classes, classAssignments, saveClass, deleteClass, classQuizAssignments, assignQuizToClasses, categories, saveCategory, deleteCategory }}>
      {children}
    </AppContext.Provider>
  );
};