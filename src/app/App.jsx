import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Login } from './components/Login';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { ChangePasswordDialog } from './components/ChangePasswordDialog';
import { Toaster } from './components/ui/sonner';
import { getCurrentUser } from './services/authService';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Notes & Lectures Management System
const AppContent = () => {
  const { currentUser } = useApp();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user must change password on mount
  useEffect(() => {
    if (currentUser?.mustChangePassword) {
      setShowChangePassword(true);
    }
  }, [currentUser]);

  // Force change password - prevent closing
  const handlePasswordClose = () => {
    const user = getCurrentUser();
    if (user?.mustChangePassword) {
      // Don't allow closing - user must change password
      return;
    }
    setShowChangePassword(false);
  };

  // Debug: Log routing
  useEffect(() => {
    console.log('Current route:', location.pathname);
    console.log('Current user:', currentUser);
  }, [location, currentUser]);

  if (!currentUser) {
    console.log('No user, showing Login');
    return <Login />;
  }

  // Show change password dialog if user must change password
  if (currentUser.mustChangePassword) {
    return (
      <>
        <ChangePasswordDialog 
          open={true} 
          onOpenChange={handlePasswordClose}
          isFirstLogin={true}
        />
      </>
    );
  }

  switch (currentUser.role) {
    case 'superadmin':
      return (
        <>
          <SuperAdminDashboard />
          <ChangePasswordDialog 
            open={showChangePassword} 
            onOpenChange={setShowChangePassword}
            isFirstLogin={false}
          />
        </>
      );
    case 'teacher':
      return (
        <>
          <TeacherDashboard />
          <ChangePasswordDialog 
            open={showChangePassword} 
            onOpenChange={setShowChangePassword}
            isFirstLogin={false}
          />
        </>
      );
    case 'student':
      return (
        <>
          <StudentDashboard />
          <ChangePasswordDialog 
            open={showChangePassword} 
            onOpenChange={setShowChangePassword}
            isFirstLogin={false}
          />
        </>
      );
    default:
      console.log('Unknown role, showing Login');
      return <Login />;
  }
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppContent />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
        <Toaster />
      </AppProvider>
    </ErrorBoundary>
  );
}
