import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddUser from './components/AddUser';
import AddPackage from './components/AddPackage';
import UserLayout from './userpanel/user/UserLayout';
import HomePage from './userpanel/HomePage';
import PackagesPage from './userpanel/PackagesPage';
import ContactPage from './userpanel/ContactPage';
import UserDashboard from './userpanel/UserDashboard';
import CheckoutPage from './userpanel/CheckoutPage'; // ✅ import
import ProtectedRoute from './ProtectedRoute';
import UserProtectedRoute from './UserProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<HomePage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="user-dashboard" element={
              <UserProtectedRoute>
                <UserDashboard />
              </UserProtectedRoute>
            } />
            <Route path="checkout" element={
              <UserProtectedRoute>
                <CheckoutPage />
              </UserProtectedRoute>
            } />
          </Route>
          
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add-user" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
          <Route path="/add-package" element={<ProtectedRoute><AddPackage /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;