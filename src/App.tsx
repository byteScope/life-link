import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import ServiceListing from './components/ServiceListing';
import ServiceDetail from './components/ServiceDetail';
import Emergency from './components/Emergency';
import BloodRequest from './components/BloodRequest';
import Chat from './components/Chat';
import Profile from './components/Profile';
import Payments from './components/Payments';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminProviders from './components/admin/AdminProviders';
import AdminBookings from './components/admin/AdminBookings';
import AdminEmergencies from './components/admin/AdminEmergencies';
import AdminBloodRequests from './components/admin/AdminBloodRequests';
import AdminPayments from './components/admin/AdminPayments';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />} 
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
          element={isAuthenticated ? <ServiceDetail /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/emergency" 
          element={isAuthenticated ? <Emergency /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/blood-request" 
          element={isAuthenticated ? <BloodRequest /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/chat" 
          element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/payments" 
          element={isAuthenticated ? <Payments /> : <Navigate to="/login" />} 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/users" 
          element={isAdmin ? <AdminUsers /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/providers" 
          element={isAdmin ? <AdminProviders /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/bookings" 
          element={isAdmin ? <AdminBookings /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/emergencies" 
          element={isAdmin ? <AdminEmergencies /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/blood-requests" 
          element={isAdmin ? <AdminBloodRequests /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/payments" 
          element={isAdmin ? <AdminPayments /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}
