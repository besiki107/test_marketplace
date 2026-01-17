import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Toaster } from './components/ui/sonner';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminItems from './pages/AdminItems';
import ItemForm from './pages/ItemForm';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <div className="App min-h-screen bg-background">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/*"
                element={
                  <>
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/favorites" element={<Favorites />} />
                    </Routes>
                  </>
                }
              />

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="items" element={<AdminItems />} />
                <Route path="items/new" element={<ItemForm />} />
                <Route path="items/:id/edit" element={<ItemForm />} />
              </Route>
            </Routes>
            <Toaster />
          </div>
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;