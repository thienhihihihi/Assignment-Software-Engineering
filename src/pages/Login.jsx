import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate(); // Hook điều hướng

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(); // Cập nhật trạng thái login
      setLoginSuccess(true); // Đánh dấu đăng nhập thành công
      navigate('/booking'); // Chuyển hướng đến trang booking
    } catch (error) {
      console.error('Error details:', error); // Log chi tiết lỗi để kiểm tra
      if (error.response) {
        alert('Server error: ' + (error.response.data?.message || 'Unknown error'));
      } else if (error.request) {
        alert('No response from server: ' + error.message);
      } else {
        alert('Error setting up request: ' + error.message);
      }
    }
  };

  return (
    <MainLayout>
      <div className='bg-[#dbdada] h-156 flex items-center justify-center'>
        <form onSubmit={handleSubmit}>
          <div className="max-w-xl min-w-3xs bg-white h-80 md:h-86 border-2 rounded-xl border-gray-400 shadow-xl px-10 mx-auto">
            <p className='text-center text-[#1D0BEB] mt-8.5 text-xl font-bold'>Nhập thông tin tài khoản của bạn</p>
            <div className="mb-4">
              <label htmlFor="account" className="block text-base font-medium text-[#6F6F6F]">Tài khoản</label>
              <input
                type="text"
                id="account"
                name="account"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className='md:w-94 md:h-15 h-12 w-84 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300'
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-base font-medium text-[#6F6F6F]">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='md:w-94 w-84 h-12 md:h-15 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300'
              />
            </div>
            <div className='flex justify-center'>
              <button
                type="submit"
                className='w-44.5 h-10 mt-3.5 mb-7.5 bg-[#006DCC] text-white text-sm p-2 rounded hover:bg-[#123D65] cursor-pointer'
              >
                Đăng nhập
              </button>
            </div>
            {loginSuccess && (
              <div className="text-center text-green-500 mt-3">
                Đăng nhập thành công!
              </div>
            )}
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default Login;
