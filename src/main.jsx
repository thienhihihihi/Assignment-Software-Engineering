import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Booking from './pages/Booking.jsx';
import BookingList from './pages/BookingList.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import RoomList from './pages/RoomList.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// ✅ Wrapper để quản lý trạng thái đăng nhập
const AppWrapper = () => {
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

  const router = createBrowserRouter([
    { path: "/", element: <App isLoggedIn={isLoggedIn} onLogout={handleLogout} /> },
    { path: "/login", element: <Login onLogin={handleLogin} /> },
    { path: "/register", element: <Register /> },
    { path: "/booking", element: <Booking /> },
    { path: "/viewmybooking", element: <BookingList /> },
    { path: "/roomlist", element: <RoomList/> },
    { path: "/admin", element: <AdminPanel /> },
    { path: "*", element: <NotFoundPage /> }
  ]);

  return <RouterProvider router={router} />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
