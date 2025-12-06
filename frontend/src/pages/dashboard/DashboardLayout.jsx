import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineUserGroup, HiViewGridAdd } from "react-icons/hi";
import { MdDashboard, MdOutlineManageHistory } from "react-icons/md";
import { FaRegFolder } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate("/admin"); 
  };

  const isActive = (path) => {
    return location.pathname === path 
      ? "text-purple-600 bg-white shadow-md" 
      : "text-gray-400 hover:text-white hover:bg-gray-700";
  };

  return (
    <section className="flex md:bg-gray-100 min-h-screen overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside className="hidden sm:flex sm:flex-col w-20 bg-gray-900 transition-all duration-300 border-r border-gray-800">
        {/* Logo */}
        <a
          href="/"
          className="inline-flex items-center justify-center h-20 w-full bg-purple-700 hover:bg-purple-600 focus:bg-purple-600 transition-colors"
        >
          <img src="/fav-icon.png" alt="Logo" className="w-10 h-10 drop-shadow-lg" />
        </a>

        <div className="flex-grow flex flex-col justify-between text-gray-500">
          <nav className="flex flex-col mx-2 my-6 space-y-4 items-center">
            
            {/* 1. Folders (Placeholder) */}
            <a
              href="#"
              title="Thư mục"
              className={`inline-flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive("#")}`}
            >
              <FaRegFolder className="h-6 w-6" />
            </a>

            {/* 2. Dashboard Home */}
            <Link
              to="/dashboard"
              title="Tổng quan (Dashboard)"
              className={`inline-flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${location.pathname === "/dashboard" ? "text-purple-600 bg-white shadow-[0_0_15px_rgba(147,51,234,0.5)]" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
            >
              <MdDashboard className="h-7 w-7" />
            </Link>

            {/* 3. Thêm Sách */}
            <Link
              to="/dashboard/add-new-book"
              title="Thêm sách mới"
              className={`inline-flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive("/dashboard/add-new-book")}`}
            >
              <HiViewGridAdd className="h-7 w-7" />
            </Link>

            {/* 4. Quản lý Sách */}
            <Link
              to="/dashboard/manage-books"
              title="Quản lý sách"
              className={`inline-flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive("/dashboard/manage-books")}`}
            >
              <MdOutlineManageHistory className="h-7 w-7" />
            </Link>

            {/* 5. Quản lý Người dùng (MỚI) */}
            <Link
              to="/dashboard/manage-users"
              title="Quản lý người dùng"
              className={`inline-flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive("/dashboard/manage-users")}`}
            >
              <HiOutlineUserGroup className="h-7 w-7" />
            </Link>

          </nav>

          {/* Bottom Actions */}
          <div className="inline-flex flex-col items-center justify-center pb-6 space-y-4">
             {/* Logout Button */}
             <button 
                onClick={handleLogout}
                title="Đăng xuất"
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-gray-400 hover:text-red-500 hover:bg-gray-800 transition-all duration-200"
            >
              <BiLogOut className="h-7 w-7" />
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-grow text-gray-800 bg-gray-50">
        <header className="flex items-center h-20 px-6 sm:px-10 bg-white shadow-sm border-b border-gray-200">
            {/* Mobile Menu Button (Giữ nguyên) */}
            <button className="block sm:hidden relative flex-shrink-0 p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <span className="sr-only">Menu</span>
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
            </button>

            {/* User Menu */}
            <div className="flex flex-shrink-0 items-center ml-auto">
                <button className="inline-flex items-center p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="hidden md:flex md:flex-col md:items-end md:leading-tight mr-3">
                    <span className="font-bold text-gray-800">Admin</span>
                    <span className="text-xs text-gray-500 font-medium">Quản trị viên</span>
                </div>
                <span className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden border-2 border-purple-200">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="user profile" className="h-full w-full object-cover" />
                </span>
                </button>
                
                {/* Logout Button on Header */}
                <div className="border-l pl-3 ml-3 space-x-1">
                    <button onClick={handleLogout} className="relative p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-all" title="Đăng xuất">
                        <BiLogOut className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>

        <main className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
            <div className="mr-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Tổng quan</h1>
              <p className="text-gray-500">Chào mừng quay trở lại, Admin!</p>
            </div>
            
            {/* Quick Actions Buttons */}
            <div className="flex flex-wrap items-start justify-end gap-3">
              <Link
                to="/dashboard/manage-books"
                className="inline-flex px-5 py-2.5 items-center text-purple-600 font-medium bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-all shadow-sm"
              >
                <MdOutlineManageHistory className="mr-2 h-5 w-5" />
                Quản lý sách
              </Link>
              <Link
                to="/dashboard/add-new-book"
                className="inline-flex px-5 py-2.5 items-center text-white font-medium bg-purple-600 hover:bg-purple-700 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <HiViewGridAdd className="mr-2 h-5 w-5" />
                Thêm sách mới
              </Link>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default DashboardLayout;
