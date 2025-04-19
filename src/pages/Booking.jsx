import React, { useState } from 'react';
import { Breadcrumbs } from "@material-tailwind/react";
import { FaChevronRight } from "react-icons/fa";
import MainLayout from '../layout/MainLayout';
import { Button } from "flowbite-react";
import axios from 'axios';

const Booking = () => {
    const [building, setBuilding] = useState('');
    const [room, setRoom] = useState('');
    const [date, setDate] = useState('');
    const [periods, setPeriods] = useState([]);
    const [message, setMessage] = useState('');

    const handlePeriodChange = (event) => {
        const value = parseInt(event.target.value);
        setPeriods(prevPeriods =>
            prevPeriods.includes(value)
                ? prevPeriods.filter(period => period !== value)
                : [...prevPeriods, value]
        );
    };

    const validatePeriods = (periods) => {
        if (periods.length < 2) return true;
        periods.sort((a, b) => a - b);
        for (let i = 0; i < periods.length - 1; i++) {
            if (periods[i + 1] - periods[i] !== 1) return false;
        }
        return true;
    };

    

    const handleBooking = async () => {
        console.log("🔥 Đã gọi handleBooking");
    
        if (!building || !room || !date || periods.length === 0) {
            console.log("⚠️ Thiếu thông tin đầu vào", { building, room, date, periods });
            setMessage("Vui lòng chọn tất cả các trường trước khi đăng ký.");
            return;
        }
    
        if (!validatePeriods(periods)) {
            console.log("❌ Các tiết không liên tiếp", periods);
            setMessage("Vui lòng chọn các tiết liên tiếp nhau.");
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            console.log("🔐 Token:", token);
    
            const sortedPeriods = [...periods].sort((a, b) => a - b);
            const startHour = 6 + (sortedPeriods[0] - 2);
            const endHour = 6 + (sortedPeriods[sortedPeriods.length - 1] - 1);
    
            const arrivalTime = new Date(`${date.split('/').reverse().join('-')}T${startHour.toString().padStart(2, '0')}:00`);
            const endTime = new Date(`${date.split('/').reverse().join('-')}T${endHour.toString().padStart(2, '0')}:00`);
    
            console.log("📤 Dữ liệu gửi đi:", {
                room_id: `${building}-${room}`,
                arrival_time: arrivalTime.toISOString(),
                end_time: endTime.toISOString(),
            });
    
            const res = await axios.post('http://localhost:5000/book', {
                room_id: `${building}-${room}`,
                arrival_time: arrivalTime.toISOString(),
                end_time: endTime.toISOString(),
            }, {
                headers: {
                    'x-access-token': token,
                },
            });
    
            console.log("✅ Kết quả trả về:", res.data);
            setMessage(res.data.message || "Đặt phòng thành công!");
        } catch (error) {
            console.error("❌ Lỗi khi gửi booking:", error);
            const errorMsg = error.response?.data?.message || 'Đặt phòng thất bại. Vui lòng thử lại sau.';
            setMessage(`Đặt phòng thất bại: ${errorMsg}`);
        }
    };
    
    

    const buildings = [
        "H1", "H2", "H3", "H6",
        ...Array.from({ length: 5 }, (_, i) => `A${i + 1}`),
        ...Array.from({ length: 10 }, (_, i) => `B${i + 1}`),
        ...Array.from({ length: 6 }, (_, i) => `C${i + 1}`)
    ];

    const rooms = Array.from({ length: 4 }, (_, i) =>
        Array.from({ length: 13 }, (_, j) => `${i + 1}${j + 1 < 10 ? '0' : ''}${j + 1}`)
    ).flat();

    const dates = Array.from({ length: 12 }, (_, month) =>
        Array.from({ length: new Date(2025, month + 1, 0).getDate() }, (_, day) =>
            `${(day + 1).toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/2025`
        )
    ).flat();

    const periodsWithTimes = [
        { period: 2, time: "06:00 - 07:00" },
        { period: 3, time: "07:00 - 08:00" },
        { period: 4, time: "08:00 - 09:00" },
        { period: 5, time: "09:00 - 10:00" },
        { period: 6, time: "10:00 - 11:00" },
        { period: 7, time: "11:00 - 12:00" },
        { period: 8, time: "12:00 - 13:00" },
        { period: 9, time: "13:00 - 14:00" },
        { period: 10, time: "14:00 - 15:00" },
        { period: 11, time: "15:00 - 16:00" },
        { period: 12, time: "16:00 - 17:00" },
    ];

    return (
        <MainLayout>
            <div className="bg-[#D9D9D9] pb-18">
                <div className="max-w-7xl mx-auto">
                    <Breadcrumbs
                        separator={<FaChevronRight className="pt-1" />}
                        className="bg-white text-[10px] font-bold border-x-1 border-b-1 border-gray-400 rounded-xl shadow mb-6">
                        <a href="/" className="font-bold px-1 py-1">Trang chủ</a>
                        <a href="#" className="font-bold px-1 py-1">Đặt chỗ</a>
                    </Breadcrumbs>

                    <div className="bg-white rounded-xl shadow-lg pb-9">
                        <p className="bg-[#132D56] text-white text-center text-base py-2.5 font-bold rounded-t-xl">Đăng ký sử dụng phòng</p>
                        <p className="text-gray-700 text-sm text-center font-bold mt-5">Vui lòng chọn lần lượt theo thứ tự bên dưới</p>

                        {/* Tòa */}
                        <div className="mt-4 p-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tòa:</label>
                            <select value={building} onChange={e => setBuilding(e.target.value)}
                                className="block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 focus:outline-none">
                                <option value="">Chọn tòa</option>
                                {buildings.map((b) => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                        </div>

                        {/* Phòng */}
                        <div className="mt-4 px-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Phòng:</label>
                            <select value={room} onChange={e => setRoom(e.target.value)}
                                className="block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 focus:outline-none">
                                <option value="">Chọn phòng</option>
                                {rooms.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        {/* Ngày */}
                        <div className="mt-4 px-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Ngày đặt:</label>
                            <select value={date} onChange={e => setDate(e.target.value)}
                                className="block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 focus:outline-none">
                                <option value="">Chọn ngày</option>
                                {dates.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tiết */}
                        <div className="mt-4 px-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tiết:</label>
                            <div className="grid grid-cols-6 md:grid-cols-12 gap-x-1">
                                {periodsWithTimes.map(({ period, time }) => (
                                    <label key={period} className="flex items-center">
                                        <input type="checkbox" value={period} checked={periods.includes(period)}
                                            onChange={handlePeriodChange} className="mr-2" />
                                        {`Tiết ${period} (${time})`}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Gửi */}
                        <div className="flex justify-center mt-6">
                            <Button onClick={handleBooking}
                                className="bg-[#006DCC] text-white font-semibold px-12 py-3 rounded-lg hover:bg-[#123D65]">
                                Gửi đăng ký
                            </Button>
                        </div>

                        {/* Thông báo */}
                        {message && (
                            <p className={`text-center mt-4 font-bold ${message.includes("thành công") ? "text-green-500" : "text-red-500"}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Booking;
