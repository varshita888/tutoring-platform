import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuestionsList from './pages/QuestionsList';
import QuestionDetail from './pages/QuestionDetail';
import AskQuestion from './pages/AskQuestion';
import Materials from './pages/Materials';
import Profile from './pages/Profile';

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/home" replace /> : children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding: user ? '24px 20px' : '0' }}>
        <Routes>
          <Route path="/"                element={<Navigate to="/login" replace />} />
          <Route path="/login"           element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register"        element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/home"            element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/questions-list"  element={<ProtectedRoute><QuestionsList /></ProtectedRoute>} />
          <Route path="/questions/:id"   element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
          <Route path="/ask"             element={<ProtectedRoute><AskQuestion /></ProtectedRoute>} />
          <Route path="/materials"       element={<ProtectedRoute><Materials /></ProtectedRoute>} />
          <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*"                element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}