import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';
import { Breadcrumbs, Typography, Card } from "@material-tailwind/react";
import { FaChevronRight } from "react-icons/fa";
import { Button } from "flowbite-react";

const TABLE_HEAD = ["STT", "Mã đặt", "Mã phòng", "Giờ đến", "Giờ kết thúc", "Ngày đặt", "Trạng thái"];

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/user/bookings', {
        headers: { 'x-access-token': token }
      });
      setBookings(res.data);
    };
    fetchBookings();
  }, []);

  return (
    <MainLayout>
      <div className="bg-[#D9D9D9] pb-18">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<FaChevronRight className="pt-1" />}
            className="bg-white text-[10px] font-bold border-x-1 border-b-1 border-gray-400 rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.1),_0_1px_3px_rgba(0,0,0,0.8)] mb-6">
            <a href="/" className="font-bold px-1 py-1">Trang chủ</a>
            <a href="#" className="font-bold px-1 py-1">Đặt chỗ</a>
          </Breadcrumbs>

          {/* Table */}
          <div className="bg-[#D9D9D9] rounded-xl shadow-lg">
            <p className="bg-[#132D56] text-white text-center text-base py-2.5 font-bold rounded-t-xl">Danh sách đặt chỗ của tôi</p>
            <div className="bg-white rounded-b-xl pb-4">
              <Card className="h-full w-full overflow-auto p-4">
                <table className="w-full table-auto border-spacing-2 border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr>
                      {TABLE_HEAD.map((head, index) => (
                        <th
                          key={index}
                          className="border border-gray-300 bg-[#5B5B5B] text-white p-2 text-center">
                          <Typography
                            variant="small"
                            className="font-semibold">
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr key={booking._id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                        <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                        <td className="border border-gray-300 p-2 text-center">{booking._id}</td>
                        <td className="border border-gray-300 p-2 text-center">{booking.room_id}</td>
                        <td className="border border-gray-300 p-2 text-center">{new Date(booking.arrival_time).toLocaleString()}</td>
                        <td className="border border-gray-300 p-2 text-center">{new Date(booking.end_time).toLocaleString()}</td>
                        <td className="border border-gray-300 p-2 text-center">{new Date(booking.booking_date).toLocaleString()}</td>
                        <td
  className={`border border-gray-300 p-2 text-center capitalize ${
    booking.status === 'pending'
      ? 'text-yellow-600'
      : booking.status === 'accepted'
      ? 'text-green-600'
      : 'text-gray-700'
  }`}
>
  {booking.status === 'pending'
    ? 'Đang chờ chấp nhận'
    : booking.status === 'accepted'
    ? 'Chấp Nhận'
    : booking.status}
</td>



                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
              <div className="flex justify-center mt-4">
                <Button size="md" href='/' className=" bg-[#006DCC] text-white font-semibold px-12 md:px-18 py-3 rounded-lg hover:bg-[#123D65] cursor-pointer">Trở về</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyBookings;
