
import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { QuizPage } from './pages/QuizPage';
import { ResultsPage } from './pages/ResultsPage';
import { Header } from './components/Header';
import { Role } from './types';

const ProtectedRoute: React.FC<{ allowedRoles: Role[] }> = ({ allowedRoles }) => {
    const context = useContext(AppContext);
    const currentUser = context?.currentUser;

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/unauthorized" replace />;
    }
    
    return (
        <div>
            <Header />
            <main className="flex-grow">
              <Outlet />
            </main>
        </div>
    );
};

const App: React.FC = () => {
    const context = useContext(AppContext);
    
    return (
        <HashRouter>
            <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    
                    <Route path="/" element={
                      !context?.currentUser ? <Navigate to="/login" /> : (
                        context.currentUser.role === Role.ADMIN ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />
                      )
                    } />
                    
                    <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN]} />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={[Role.USER]} />}>
                        <Route path="/dashboard" element={<UserDashboard />} />
                    </Route>

                     <Route element={<ProtectedRoute allowedRoles={[Role.USER, Role.ADMIN]} />}>
                         <Route path="/quiz/:quizId" element={<QuizPage />} />
                         <Route path="/results/:resultId" element={<ResultsPage />} />
                    </Route>
                    
                    <Route path="/unauthorized" element={<div className="p-8 text-center text-red-500">You are not authorized to view this page.</div>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </HashRouter>
    );
};

export default App;
