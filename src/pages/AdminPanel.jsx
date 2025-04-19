import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';

const AdminPanel = () => {
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [newRoom, setNewRoom] = useState({
    picture: '',
    max_people: '',
    room_type: '',
    status: 'empty',
    building: '',
    facility: '',
    room_number: ''
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRooms();
    fetchStats();
    fetchBookings();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/rooms', {
        headers: { 'x-access-token': token }
      });
      setRooms(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/stats', {
        headers: { 'x-access-token': token }
      });
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/bookings', {
        headers: { 'x-access-token': token }
      });
      setBookings(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddRoom = async () => {
    try {
      await axios.post('http://localhost:5000/admin/rooms', newRoom, {
        headers: { 'x-access-token': token }
      });
      fetchRooms();
      fetchStats();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await axios.delete(`http://localhost:5000/admin/rooms/${roomId}`, {
        headers: { 'x-access-token': token }
      });
      fetchRooms();
      fetchStats();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/admin/rooms/${roomId}`, { status: newStatus }, {
        headers: { 'x-access-token': token }
      });
      fetchRooms();
      fetchStats();
    } catch (error) {
      console.error(error);
    }
  };

  const handleApproveBooking = async (bookingId) => {
    try {
      await axios.post(`http://localhost:5000/admin/bookings/${bookingId}/approve`, {}, {
        headers: { 'x-access-token': token }
      });
      fetchBookings();
      fetchRooms();
      fetchStats();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await axios.post(`http://localhost:5000/admin/bookings/${bookingId}/reject`, {}, {
        headers: { 'x-access-token': token }
      });
      fetchBookings();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 bg-[#f9fafb] min-h-screen">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Bảng Điều Khiển Quản Trị</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-gray-500">Tổng số phòng</p>
            <p className="text-xl font-bold">{stats.total_rooms}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-gray-500">Phòng đang sử dụng</p>
            <p className="text-xl font-bold">{stats.in_use}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-gray-500">Phòng trống</p>
            <p className="text-xl font-bold">{stats.empty}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-gray-500">Đang bảo trì</p>
            <p className="text-xl font-bold">{stats.maintenance}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow mb-10">
          <h3 className="text-xl font-semibold mb-4">Thêm phòng mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="URL hình ảnh" className="input" value={newRoom.picture} onChange={e => setNewRoom({...newRoom, picture: e.target.value})} />
            <input type="number" placeholder="Sức chứa" className="input" value={newRoom.max_people} onChange={e => setNewRoom({...newRoom, max_people: e.target.value})} />
            <input type="text" placeholder="Loại phòng" className="input" value={newRoom.room_type} onChange={e => setNewRoom({...newRoom, room_type: e.target.value})} />
            
            <input type="text" placeholder="Số phòng" className="input" value={newRoom.room_number} onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} />
          </div>
          <button onClick={handleAddRoom} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Thêm phòng</button>
        </div>

        <div className="overflow-x-auto shadow rounded bg-white">
          <h3 className="text-xl font-semibold p-4 border-b">Danh sách phòng</h3>
          <table className="min-w-full text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Hình ảnh</th>
                <th className="px-4 py-2 text-left">Trạng thái</th>
                <th className="px-4 py-2 text-left">Sức chứa</th>   
                <th className="px-4 py-2 text-left">Loại phòng</th>
                
                <th className="px-4 py-2 text-left">Phòng</th>
                <th className="px-4 py-2 text-left">Thời gian sử dụng</th>
                <th className="px-4 py-2 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {rooms.map(room => (
                <tr key={room._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <img src={room.picture} alt="Room" className="w-20 h-14 object-cover rounded" />
                  </td>
                  <td className="px-4 py-2">
                  {room.status === 'empty'
    ? 'Trống'
    : room.status === 'in use'
    ? 'Đang Sử Dụng'
    : room.status === 'bảo trì'
    ? 'Đang Bảo Trì'
    : room.status}



                  </td>
                  <td className="px-4 py-2">{room.max_people}</td>
                  <td className="px-4 py-2">{room.room_type}</td>
               
                  <td className="px-4 py-2">{room.room_number || '-'}</td>
                  <td className="px-4 py-2">
                    {room.status === 'in use' && room.in_use_time ? (
                      <>
                        <div>Từ: {new Date(room.in_use_time.arrival_time).toLocaleString()}</div>
                        <div>Đến: {new Date(room.in_use_time.end_time).toLocaleString()}</div>
                        
                      </>
                    ) : 'Không sử dụng'}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                  <select
  value={room.status}
  onChange={(e) => handleStatusChange(room._id, e.target.value)}
  className="text-sm px-2 py-1 bg-yellow-100 rounded border"
>
  <option value="empty">Trống</option>
  <option value="in use">Đang sử dụng</option>
  <option value="bảo trì">Bảo trì</option>
</select>
                    <button onClick={() => handleDeleteRoom(room._id)} className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto shadow rounded bg-white mt-10">
          <h3 className="text-xl font-semibold p-4 border-b">Yêu cầu đặt phòng đang chờ</h3>
          <table className="min-w-full text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Mã đặt</th>
                <th className="px-4 py-2 text-left">Phòng</th>
                <th className="px-4 py-2 text-left">Người dùng</th>
                <th className="px-4 py-2 text-left">Bắt đầu</th>
                <th className="px-4 py-2 text-left">Kết thúc</th>
                <th className="px-4 py-2 text-left">Số người</th>
                <th className="px-4 py-2 text-left">Ngày đặt</th>
                <th className="px-4 py-2 text-left">Trạng thái</th>
                <th className="px-4 py-2 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {bookings.map(booking => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{booking._id}</td>
                  <td className="px-4 py-2">{booking.room_id}</td>
                  <td className="px-4 py-2">{booking.user_id}</td>
                  <td className="px-4 py-2">{new Date(booking.arrival_time).toLocaleString()}</td>
                  <td className="px-4 py-2">{new Date(booking.end_time).toLocaleString()}</td>
                  <td className="px-4 py-2">{booking.number_of_people}</td>
                  <td className="px-4 py-2">{new Date(booking.booking_date).toLocaleString()}</td>
                  <td className="px-4 py-2">{booking.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={() => handleApproveBooking(booking._id)} className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Duyệt</button>
                    <button onClick={() => handleRejectBooking(booking._id)} className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Từ chối</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>    
    </MainLayout>
  );
};

export default AdminPanel;