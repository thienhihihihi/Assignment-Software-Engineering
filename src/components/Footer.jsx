import React from 'react';
import Logo from "../assets/LogoBK.png";
import { AiFillTikTok } from "react-icons/ai";
import { FaCaretRight, FaFacebookSquare, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <div className="bg-[#132D65]">
            <div className="max-w-7xl mx-auto grid py-5 lg:grid-cols-4 gap-8">
                <div className="location col-span-2 flex flex-col">
                    <a href="./" className="flex flex-col items-center focus:outline-none justify-center lg:flex-row lg:justify-start">
                        <img src={Logo} className="h-12.5" alt="Logo" />
                        <div className="logo-title text-white md:items-start">
                            <p className="text-center uppercase font-normal text-[10px] whitespace-nowrap">Đại học Quốc Gia Thành phố Hồ Chí Minh</p>
                            <p className="text-center font-semibold text-sm uppercase">Trường đại học Bách Khoa</p>
                        </div>
                    </a>
                    <div className="address text-white font-semibold text-xs mt-10 mx-auto lg:mx-0">
                        <div className="campus-1 flex flex-row items-center">
                            <FaCaretRight className='size-3.5'></FaCaretRight>
                            <p>Cơ sở Lý Thường Kiệt: 268 Lý Thường Kiệt, Phường 14, Quận 10, TP. HCM <a href="https://www.google.com/maps/place/Ho+Chi+Minh+City+University+of+Technology/@10.7771353,106.6600527,16.23z/data=!4m12!1m6!3m5!1s0x31752ec3c161a3fb:0xef77cd47a1cc691e!2sHo+Chi+Minh+City+University+of+Technology!8m2!3d10.7733743!4d106.6606193!3m4!1s0x31752ec3c161a3fb:0xef77cd47a1cc691e!8m2!3d10.7733743!4d106.6606193" target="_blank" rel="noopener noreferrer" className='italic'>(Bản đồ)</a></p>
                        </div>
                        <div className="campus-2 flex flex-row items-center mt-1">
                            <FaCaretRight className='size-3.5'></FaCaretRight>
                            <p>Cơ sở Dĩ An: Khu phố Tân Lập, Phường Đông Hòa, TP. Dĩ An, Tỉnh Bình Dương <a href="https://www.google.com/maps/place/Ho+Chi+Minh+city+University+of+Technology/@10.8805585,106.8053863,15z/data=!4m2!3m1!1s0x0:0xdeac05f17a166e0c?sa=X&ved=2ahUKEwjSwqa33ezyAhVMA4gKHXMvAPwQ_BIwGnoECFUQBQ" target="_blank" rel="noopener noreferrer" className='italic'>(Bản đồ)</a></p>
                        </div>
                    </div>
                </div>
                <div className="contact text-white flex justify-center flex-col">
                    <h6 className='font-medium text-center lg:text-left'>Thông tin liên hệ và hỗ trợ</h6>
                    <ul className='flex flex-col items-start font-bold text-xs pt-2 mx-auto lg:mx-0'>
                        <li className='py-2 flex flex-row items-center'><FaCaretRight className='size-3.5'></FaCaretRight><a href="https://mybk.hcmut.edu.vn/my/index.action" target="_blank" rel="noopener noreferrer">MyBk</a></li>
                        <li className='py-2 flex flex-row items-center'><FaCaretRight className='size-3.5'></FaCaretRight><a href="#" target="_blank" rel="noopener noreferrer">Email</a></li>
                        <li className='py-2 flex flex-row items-center'><FaCaretRight className='size-3.5'></FaCaretRight><a href="https://hcmut.edu.vn/contact" target="_blank" rel="noopener noreferrer">Liên hệ</a></li>
                    </ul>
                </div>
                <div className="socialmedia flex justify-center flex-col">
                    <h6 className='font-medium text-white mx-auto'>Liên kết mạng xã hội</h6>
                    <div className="social-icon my-6 flex flex-row justify-between text-white gap-4 mx-auto">
                        <a href="https://www.tiktok.com/@truongdhbachkhoa" target="_blank" rel="noopener noreferrer"><AiFillTikTok className='size-10 cursor-pointer' /></a>
                        <a href="https://www.instagram.com/truongdaihocbachkhoa.1957/" target="_blank" rel="noopener noreferrer"><FaInstagram className='size-10 cursor-pointer' /></a>
                        <a href="https://www.facebook.com/truongdhbachkhoa/" target="_blank" rel="noopener noreferrer"><FaFacebookSquare className='size-10 cursor-pointer' /></a>
                        <a href="#" target="_blank" rel="noopener noreferrer"><FaLinkedin className='size-10 cursor-pointer' /></a>
                    </div>
                </div>
            </div>
            <div className="copyright bg-[#062251] text-white text-sm font-bold p-4.5">
                <p className='text-center'>Bản quyền thuộc Trường Đại học Bách khoa - ĐHQG-HCM</p>
            </div>
        </div>
    );
};

export default Footer;
