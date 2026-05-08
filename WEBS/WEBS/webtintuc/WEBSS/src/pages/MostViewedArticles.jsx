import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const API_BASE_URL = "https://tracy-poikilothermic-trancedly.ngrok-free.dev";

// --- DỮ LIỆU DỰ PHÒNG (Sẽ hiển thị nếu API lỗi) ---
const FALLBACK_POPULAR = [
  { id: "101", title: "Thị trường Bất động sản quý II/2026: Làn sóng mới", category: "BẤT ĐỘNG SẢN", views: 12500, created_at: "2026-04-09" },
  { id: "102", title: "Nghệ thuật số lên ngôi trong kỷ nguyên AI", category: "CÔNG NGHỆ", views: 9800, created_at: "2026-04-08" },
  { id: "103", title: "Cập nhật xu hướng kinh tế toàn cầu", category: "KINH TẾ", views: 7600, created_at: "2026-04-07" },
  { id: "104", title: "Đỉnh cao mới của kiến trúc xanh giữa lòng đô thị", category: "ĐỜI SỐNG", views: 5400, created_at: "2026-04-06" },
  { id: "105", title: "Bí quyết quản lý tài chính cá nhân hiệu quả năm 2026", category: "TÀI CHÍNH", views: 4200, created_at: "2026-04-05" }
];

function MostViewedArticles() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // GỌI API & XỬ LÝ FALLBACK
  useEffect(() => {
    const fetchPopularNews = async () => {
      try {
        // Thay đường dẫn này bằng API thật của bạn (VD: /api/news/popular hoặc /api/news?sort=views)
        const response = await axiosClient.get(`${API_BASE_URL}/api/news/popular`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        
        const data = response.data?.data || response.data;
        
        if (Array.isArray(data) && data.length > 0) {
          // Lấy top 5 bài viết
          setArticles(data.slice(0, 5));
        } else {
          setArticles(FALLBACK_POPULAR);
        }
      } catch (error) {
        console.warn("Lỗi tải API bài viết xem nhiều. Đang dùng dữ liệu dự phòng.", error.message);
        setArticles(FALLBACK_POPULAR);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularNews();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full py-12 flex justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!articles || articles.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-16 px-4">
      {/* TIÊU ĐỀ KHỐI */}
      <div className="flex items-center gap-4 mb-10 border-b border-gray-200 dark:border-gray-800 pb-4">
        <h2 className="text-2xl md:text-3xl font-serif font-bold italic text-gray-900 dark:text-white">
          Đọc Nhiều Nhất
        </h2>
        <div className="h-[2px] w-12 bg-blue-600"></div>
      </div>

      {/* DANH SÁCH BÀI VIẾT */}
      <div className="flex flex-col gap-6">
        {articles.map((article, index) => (
          <Link 
            key={article.id} 
            to={`/news/${article.id}`}
            className="group relative flex items-center gap-6 p-4 -mx-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            {/* SỐ THỨ TỰ LỚN (Chữ mờ phía sau) */}
            <div className="w-12 flex-shrink-0 text-center">
              <span className="text-4xl md:text-5xl font-serif font-black italic text-gray-200 dark:text-gray-800 group-hover:text-blue-100 dark:group-hover:text-blue-900/30 transition-colors">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            {/* NỘI DUNG CHÍNH */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                  {article.category || 'TIN TỨC'}
                </span>
                <span className="text-[10px] text-gray-400 font-sans">
                  • {article.views?.toLocaleString('vi-VN')} lượt xem
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold font-serif text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors leading-tight">
                {article.title}
              </h3>
            </div>

            {/* MŨI TÊN ĐIỀU HƯỚNG (Hiện khi hover) */}
            <div className="hidden md:flex w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 items-center justify-center opacity-0 group-hover:opacity-100 group-hover:border-blue-600 group-hover:text-blue-600 transition-all duration-300 -translate-x-4 group-hover:translate-x-0">
              →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MostViewedArticles;