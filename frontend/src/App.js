import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import ProtectedRoute from './components/ProtectedRoute';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import './App.css'; 

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // 1. Check if splash has been shown in this tab session
    const splashSeen = sessionStorage.getItem("splashSeen");
    if (splashSeen === "true") {
      setShowSplash(false);
    }
    
    // 2. Load theme preference globally
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
    }
  }, []);

  const handleEnterSite = () => {
    sessionStorage.setItem("splashSeen", "true");
    setIsFading(true);
    // Wait for the CSS transition to finish before unmounting the splash
    setTimeout(() => {
      setShowSplash(false);
    }, 900);
  };

  return (
    <div className="container"> 
      {/* 3. Conditional Rendering: Only show Splash OR Navbar + Content */}
      {showSplash ? (
        <SplashPage onEnter={handleEnterSite} isFading={isFading} />
      ) : (
        <>
          <Navbar /> 
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path='/' element={<HomePage />} />
              <Route path='/home' element={<HomePage />} />
              <Route path='/about' element={<AboutPage />} />
              <Route path='/contact' element={<ContactPage />} />
              <Route path='/posts/:id' element={<PostPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />

              {/* Protected user routes */}
              <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path='/create-post' element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
              <Route path='/edit-post/:id' element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />

              {/* Admin only routes */}
              <Route path='/admin' element={<ProtectedRoute role='admin'><AdminPage /></ProtectedRoute>} />
            </Routes>
          </main>
        </>
      )}
    </div>
  );
}

export default App;