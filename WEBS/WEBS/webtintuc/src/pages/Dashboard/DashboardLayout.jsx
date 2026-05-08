// src/pages/Dashboard/DashboardLayout.jsx
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Statistics from './Statistics';
import CreatePost from './CreatePost';

function DashboardLayout() {
  const location = useLocation();

  // Hàm kiểm tra link đang active để đổi màu chữ
  const activeClass = (path) => 
    location.pathname.includes(path) ? "text-white bg-blue-600" : "hover:text-white";

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* SIDEBAR - Giữ nguyên style cũ của bạn */}
      <aside className="w-64 bg-[#1a1a1a] text-white p-6 hidden md:block">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-10 font-serif">
          TÒA SOẠN<span className="text-blue-500">.</span>
        </h2>
        <nav className="space-y-4 text-sm font-bold uppercase tracking-widest text-gray-400">
          <Link to="/dashboard/create" className={`block px-4 py-3 rounded transition ${activeClass('/create')}`}>
            Soạn bài mới
          </Link>
          <Link to="/dashboard/manage" className={`block px-4 py-3 rounded transition ${activeClass('/manage')}`}>
            Quản lý bài viết
          </Link>
          <Link to="/dashboard/stats" className={`block px-4 py-3 rounded transition ${activeClass('/stats')}`}>
            Thống kê
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT - Nơi nội dung thay đổi */}
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <Routes>
            <Route path="stats" element={<Statistics />} />
            <Route path="create" element={<CreatePost />} />
            <Route path="manage" element={<div>Trang quản lý danh sách bài viết</div>} />
            {/* Mặc định khi vào /dashboard sẽ hiện Thống kê */}
            <Route path="/" element={<Statistics />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
