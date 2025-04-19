import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/register', { username, password });
      alert('Registration successful. Please login.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed: ' + error.response.data.message);
    }
  };

  return (
    <MainLayout>
      <div className='bg-[#dbdada] h-156 flex items-center justify-center'>
        <form onSubmit={handleRegister}>
          <div className="max-w-xl min-w-3xs bg-white h-80 md:h-86 border-2 rounded-xl border-gray-400 shadow-xl px-10 mx-auto">
            <p className='text-center text-[#1D0BEB] mt-8.5 text-xl font-bold'>Nhập thông tin tài khoản của bạn</p>
            <div className="mb-4">
              <label htmlFor="username" className="block text-base font-medium text-[#6F6F6F]">Tài khoản</label>
              <input
                type="text"
                id="username"
                name="username"
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
                Đăng ký
              </button>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default Register;
