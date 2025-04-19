import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdHomeFilled } from "react-icons/md";
import { FaBell, FaBars, FaUser, FaXmark, FaChevronDown } from "react-icons/fa6";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/react';
import { Link as ScrollLink } from 'react-scroll';
import Logo from "../assets/LogoBK.png";

const navigation = [
  { name: 'Trang chủ', path: '/' },
  { name: 'Giới thiệu', path: 'intro', isScroll: true },
  { name: 'Đặt chỗ', path: '/booking' },
  { name: 'Danh Sách Phòng', path: '/roomlist' },
  { name: 'Của tôi', path: '/viewmybooking' },
];

const Navbar = ({ onLogout }) => {
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user')) : null;
  const isLoggedIn = !!token;
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  return (
    <Disclosure as="nav" className="bg-[#132D65]">
      <div className="max-w-7xl mx-auto py-5 flex flex-col sm:items-center sm:justify-center xl:items-start xl:justify-start">
        <Link to="/" className="flex flex-col items-center focus:outline-none sm:flex-row sm:justify-start">
          <img src={Logo} className="h-12.5" alt="Logo" />
          <div className="logo-title text-white md:items-start">
            <p className="text-center uppercase font-normal text-[10px] whitespace-nowrap">
              Đại học Quốc Gia Thành phố Hồ Chí Minh
            </p>
            <p className="text-center font-semibold text-sm uppercase">
              Trường đại học Bách Khoa
            </p>
          </div>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="bg-white border-b-2 border-b-[#dadada] hidden md:block">
        <div className="container mx-auto">
          <div className="flex justify-between">
            <ul className="flex-row flex font-bold mt-0 text-base">
              <li className="py-3.5 px-8 hover:bg-[#062251] hover:text-white">
                <Link to="/"><MdHomeFilled className="h-6 w-6" /></Link>
              </li>
              {navigation.map((item) => (
                <li key={item.name} className="py-3.5 px-5 hover:bg-[#062251] hover:text-white">
                  {item.isScroll ? (
                    <ScrollLink to={item.path} smooth={true} duration={500} className='cursor-pointer'>
                      {item.name}
                    </ScrollLink>
                  ) : (
                    <Link to={item.path}>{item.name}</Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Icons */}
            <ul className="flex-row flex mt-0 text-base">
              <li className="py-3.5 px-5 hover:bg-[#062251] hover:text-white cursor-pointer">
                <FaBell className="h-6 w-6" />
              </li>
              <Menu as="li" className="relative">
                <MenuButton className="flex flex-row px-5 py-3.5 cursor-pointer">
                  <span className="sr-only">Open user menu</span>
                  <FaUser className="h-6 w-6" />
                  <FaChevronDown aria-hidden="true" className="my-auto" />
                </MenuButton>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white py-1 shadow-lg ring-1 ring-black/5">
                  {isLoggedIn ? (
                    <>
                      {isAdmin && (
                        <MenuItem>
                          <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Admin Panel
                          </Link>
                        </MenuItem>
                      )}
                      <MenuItem>
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Hồ sơ
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link to="/report" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Báo cáo
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Đăng xuất
                        </button>
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem>
                        <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Đăng nhập
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Đăng ký
                        </Link>
                      </MenuItem>
                    </>
                  )}
                </MenuItems>
              </Menu>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Disclosure>
          {({ open }) => (
            <div>
              <div className="bg-white border-b-2 border-b-[#dadada] px-4 py-2 flex justify-between items-center">
                <DisclosureButton className="p-2 hover:bg-[#062251] hover:text-white focus:outline-none cursor-pointer">
                  {open ? <FaXmark className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
                </DisclosureButton>
                <div className="flex space-x-4">
                  <FaBell className="h-6 w-6 cursor-pointer hover:text-[#062251]" />
                  <Menu as="div" className="relative">
                    <MenuButton className="flex items-center space-x-2 cursor-pointer">
                      <span className="sr-only">Open user menu</span>
                      <FaUser className="h-6 w-6" />
                      <FaChevronDown className="h-4 w-4" />
                    </MenuButton>
                    <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg ring-1 ring-black/5 rounded-md overflow-hidden">
                      {isLoggedIn ? (
                        <>
                          {isAdmin && (
                            <MenuItem>
                              <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Admin Panel
                              </Link>
                            </MenuItem>
                          )}
                          <MenuItem>
                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Hồ sơ
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link to="/report" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Báo cáo
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <button
                              type="button"
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Đăng xuất
                            </button>
                          </MenuItem>
                        </>
                      ) : (
                        <>
                          <MenuItem>
                            <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Đăng nhập
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Đăng ký
                            </Link>
                          </MenuItem>
                        </>
                      )}
                    </MenuItems>
                  </Menu>
                </div>
              </div>

              <DisclosurePanel className="bg-white border-b-2 border-b-[#dadada]">
                <div>
                  <DisclosureButton as={Link} to="/" className="flex items-center gap-2 hover:bg-[#062251] hover:text-white border-b-2 border-b-[#dadada] px-3 py-2 text-base font-medium">
                    <MdHomeFilled className="h-6 w-6" />
                    <span>Trang chủ</span>
                  </DisclosureButton>
                  {navigation.map((item) => (
                    <DisclosureButton
                      key={item.name}
                      as={item.isScroll ? ScrollLink : Link}
                      to={item.path}
                      smooth={item.isScroll}
                      duration={500}
                      className="hover:bg-[#062251] hover:text-white border-b-2 border-b-[#dadada] block px-3 py-2 text-base font-medium"
                    >
                      {item.name}
                    </DisclosureButton>
                  ))}
                  {isLoggedIn && isAdmin && (
                    <DisclosureButton
                      as={Link}
                      to="/admin"
                      className="hover:bg-[#062251] hover:text-white border-b-2 border-b-[#dadada] block px-3 py-2 text-base font-medium"
                    >
                      Admin Panel
                    </DisclosureButton>
                  )}
                </div>
              </DisclosurePanel>
            </div>
          )}
        </Disclosure>
      </div>
    </Disclosure>
  );
};

export default Navbar;
