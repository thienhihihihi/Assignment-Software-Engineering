import React from 'react'
import { Button } from "flowbite-react";
import { Link } from 'react-router';

const Intro = () => {
    return (
        <div id="intro" className='bg-white'>
            <div className="max-w-7xl mx-auto bg-[#D9D9D9] py-10"> 
                <h6 className='text-center text-[#062251] md:text-[28px] text-xl font-bold'>Giới thiệu</h6>
                <p className='text-center mx-10 text-sm md:mx-19.5 md:text-base font-medium'>Trong bối cảnh của một trường đại học hiện đại, nhu cầu tự học, nghiên cứu và học nhóm của sinh viên ngày càng gia tăng. Để đáp ứng yêu cầu này, Trường Đại học Bách Khoa - ĐHQG TP.HCM (HCMUT) đã xây dựng các Không gian Học Tập Thông minh tại các tòa nhà trong khuôn viên trường. Với mục tiêu là nâng cao trải nghiệm học tập cho sinh viên, giúp sinh viên dễ dàng tìm kiếm và sử dụng không gian học tập hiệu quả. 
                    Bên cạnh việc xây dựng các không gian tự học hiện đại, Trường cũng đang triển khai Hệ thống Quản lý và Đặt chỗ Không gian Tự học Thông minh. Các không gian này được thiết  kế hiện đại, đáp ứng nhu cầu học tập đa dạng của sinh viên, bao gồm học cá nhân, học nhóm và các buổi mentoring 1-1. Tùy vào nhu cầu, không gian tự học sẽ cung cấp các thiết bị cơ bản như đèn, ổ cắm, màn hình trình chiếu, bảng trắng hoặc màn hình tương tác, thiết bị họp trực tuyến, điều hòa không khí, v.v...
                    Sinh viên có thể dễ dàng truy cập hệ thống qua các ứng dụng web-app và mobile app để có thể đặt chỗ linh hoạt và nhận được thông báo nhắc nhở khi gần đến giờ sử dụng hoặc khi có sự thay đổi trạng thái của không gian học tập.</p>
                <Link to="/booking">
                    <Button size="xl" className='mx-auto mt-5 text-lg md:px-15.5 md:font-bold md:text-2xl cursor-pointer'>Đặt chỗ ngay</Button>
                </Link>
            </div>
        </div>
    )
}

export default Intro