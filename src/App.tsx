import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

function RedirectToLogin() {
  const location = useLocation();
  const from = encodeURIComponent(location.pathname + location.search);
  return <Navigate to={`/login?from=${from}`} replace />;
}
import Login from './components/Login';
import Home from './components/Home';
import ServiceListing from './components/ServiceListing';
import ServiceDetail from './components/ServiceDetail';
import JobsListing from './components/JobsListing';
import Emergency from './components/Emergency';
import BloodRequest from './components/BloodRequest';
import Chat from './components/Chat';
import Doctors from './components/Doctors';
import SymptomCheck from './components/SymptomCheck';
import Profile from './components/Profile';
import Payments from './components/Payments';
import Onboarding from './components/Onboarding';
import AdminDashboard from './admin/AdminDashboard';
import AdminUsers from './admin/AdminUsers';
import AdminProviders from './admin/AdminProviders';
import AdminBookings from './admin/AdminBookings';
import AdminEmergencies from './admin/AdminEmergencies';
import AdminBloodRequests from './admin/AdminBloodRequests';
import AdminPayments from './admin/AdminPayments';
import AdminLogin from './admin/AdminLogin';
import { getStoredToken, getStoredUser, clearAuthStorage } from './api/auth';

function getStoredAuth() {
  try {
    const hasToken = !!getStoredToken()?.trim();
    const hasUser = !!getStoredUser();
    const isAuthenticated = hasToken && hasUser;
    if (isAuthenticated) {
      try {
        localStorage.setItem('lifelink_authenticated', 'true');
      } catch {}
    }
    return {
      isAuthenticated,
      isAdmin: localStorage.getItem('lifelink_admin') === 'true',
    };
  } catch {
    return { isAuthenticated: false, isAdmin: false };
  }
}

export default function App() {
  const [auth, setAuth] = useState(getStoredAuth);
  const isAuthenticated = auth.isAuthenticated;
  const isAdmin = auth.isAdmin;

  const setAuthenticated = (value: boolean) => {
    setAuth((prev) => ({ ...prev, isAuthenticated: value }));
    if (value) localStorage.setItem('lifelink_authenticated', 'true');
    else {
      clearAuthStorage();
    }
  };
  const setAdmin = (value: boolean) => {
    setAuth((prev) => ({ ...prev, isAdmin: value }));
    if (value) localStorage.setItem('lifelink_admin', 'true');
    else localStorage.removeItem('lifelink_admin');
  };

  useEffect(() => {
    const onLogout = () => {
      clearAuthStorage();
      localStorage.removeItem('lifelink_admin');
      setAuth({ isAuthenticated: false, isAdmin: false });
    };
    window.addEventListener('lifelink_logout', onLogout);
    return () => window.removeEventListener('lifelink_logout', onLogout);
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setAuthenticated} setIsAdmin={setAdmin} />} 
        />
        <Route 
          path="/admin/login" 
          element={
            isAdmin ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogin setIsAuthenticated={setAuthenticated} setIsAdmin={setAdmin} />
            )
          } 
        />
        <Route 
          path="/" 
          element={<Home />} 
        />
        <Route 
          path="/services" 
          element={<ServiceListing />} 
        />
        <Route 
          path="/service/:id" 
          element={isAuthenticated ? <ServiceDetail /> : <RedirectToLogin />} 
        />
        <Route 
          path="/jobs" 
          element={<JobsListing />} 
        />
        <Route 
          path="/emergency" 
          element={isAuthenticated ? <Emergency /> : <RedirectToLogin />} 
        />
        <Route 
          path="/blood-request" 
          element={isAuthenticated ? <BloodRequest /> : <RedirectToLogin />} 
        />
        <Route 
          path="/chat" 
          element={isAuthenticated ? <Chat /> : <RedirectToLogin />} 
        />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/symptom-check" element={<SymptomCheck />} />
        <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile /> : <RedirectToLogin />} 
        />
        <Route 
          path="/onboarding" 
          element={isAuthenticated ? <Onboarding /> : <RedirectToLogin />} 
        />
        <Route 
          path="/payments" 
          element={isAuthenticated ? <Payments /> : <RedirectToLogin />} 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} 
        />
        <Route 
          path="/admin/users" 
          element={isAdmin ? <AdminUsers /> : <Navigate to="/admin/login" replace />} 
        />
        <Route 
          path="/admin/providers" 
          element={isAdmin ? <AdminProviders /> : <Navigate to="/admin/login" replace />} 
        />
        <Route 
          path="/admin/bookings" 
          element={isAdmin ? <AdminBookings /> : <Navigate to="/admin/login" replace />} 
        />
        <Route 
          path="/admin/emergencies" 
          element={isAdmin ? <AdminEmergencies /> : <Navigate to="/admin/login" replace />} 
        />
        <Route 
          path="/admin/blood-requests" 
          element={isAdmin ? <AdminBloodRequests /> : <Navigate to="/admin/login" replace />} 
        />
        <Route 
          path="/admin/payments" 
          element={isAdmin ? <AdminPayments /> : <Navigate to="/admin/login" replace />} 
        />
      </Routes>
    </Router>
  );
}
