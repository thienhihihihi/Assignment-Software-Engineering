import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../layout/MainLayout'; // Import layout dùng chung

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5000/rooms');
        setRooms(res.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <MainLayout>
      <div className="p-6 min-h-screen bg-[#f2f2f2]">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Danh sách phòng hiện có</h2>

        {loading && <div className="text-center text-blue-600">Đang tải dữ liệu...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}
    
        {!loading && !error && (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Hình ảnh</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Sức chứa</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Loại phòng</th>
                  
                  <th className="px-4 py-3 text-left text-sm font-semibold">Số phòng</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID Phòng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-50 transition-all">
                    <td className="px-4 py-3">
                      <img
                        src={room.picture}
                        alt="Room"
                        className="w-24 h-16 object-cover rounded border"
                      />
                    </td>
                    <td className="px-4 py-3">
  {room.status === 'empty'
    ? 'Trống'
    : room.status === 'in use'
    ? 'Đang Sử Dụng'
    : room.status === 'bảo trì'
    ? 'Đang Bảo Trì'
    : room.status}
</td>
                    <td className="px-4 py-3">{room.max_people}</td>
                    <td className="px-4 py-3">{room.room_type}</td>
                    
                    <td className="px-4 py-3">{room.room_number || '-'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{room._id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RoomList;
