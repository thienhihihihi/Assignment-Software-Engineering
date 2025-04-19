import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Slider from './components/Slider';
import Intro from './components/Intro';
import Login from './pages/Login';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<><Slider /><Intro /></>} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        {/* Thêm route booking nếu cần */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
