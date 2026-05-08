import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
// --- BƯỚC 1: IMPORT AXIOSCLIENT ĐỂ KẾT NỐI ---
import axiosClient from '../api/axiosClient'; 

// --- 1. TÁCH COMPONENT THỐNG KÊ (GIỮ NGUYÊN) ---
const StatisticsView = () => (
    <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Hiệu suất bài viết của bạn</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border border-gray-200 shadow-sm border-l-4 border-l-blue-600">
                <p className="text-sm text-gray-500 font-bold uppercase">Tổng lượt đọc</p>
                <p className="text-3xl font-black mt-2">124,500</p>
                <p className="text-xs text-green-600 font-bold mt-2">↑ +12% so với tuần trước</p>
            </div>
            <div className="bg-white p-6 border border-gray-200 shadow-sm border-l-4 border-l-green-500">
                <p className="text-sm text-gray-500 font-bold uppercase">Lượt Chia sẻ (Share)</p>
                <p className="text-3xl font-black mt-2">8,430</p>
                <p className="text-xs text-green-600 font-bold mt-2">↑ +5% so với tuần trước</p>
            </div>
            <div className="bg-white p-6 border border-gray-200 shadow-sm border-l-4 border-l-purple-500">
                <p className="text-sm text-gray-500 font-bold uppercase">Bài viết đã đăng</p>
                <p className="text-3xl font-black mt-2">42</p>
            </div>
        </div>
    </div>
);

// --- 2. TÁCH COMPONENT SOẠN THẢO (GIỮ NGUYÊN) ---
const EditorView = ({ article, handleChange, handleSubmit, loading }) => (
    <div className="bg-white p-8 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-black uppercase tracking-tighter mb-6 border-b pb-4">Soạn thảo bài báo</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Tít chính (Tiêu đề)</label>
                    <input type="text" name="title" value={article.title} onChange={handleChange} required className="w-full border border-gray-300 p-3 outline-none focus:border-blue-500 text-lg font-serif font-bold" placeholder="Nhập tiêu đề bài báo..." />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Tít phụ (Subtitle)</label>
                    <input type="text" name="subtitle" value={article.subtitle} onChange={handleChange} className="w-full border border-gray-300 p-3 outline-none focus:border-blue-500 text-lg font-serif" placeholder="Nhập tít phụ..." />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Sapo (Đoạn tóm tắt đầu bài)</label>
                <textarea name="sapo" value={article.sapo} onChange={handleChange} rows="3" required className="w-full border border-gray-300 p-3 outline-none focus:border-blue-500 font-serif" placeholder="Viết đoạn sapo tóm tắt nội dung chính..."></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">URL Ảnh đại diện (Thumbnail)</label>
                    <input type="url" name="thumbnail" value={article.thumbnail} onChange={handleChange} required className="w-full border border-gray-300 p-3 outline-none focus:border-blue-500 text-sm" placeholder="https://..." />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Chuyên mục</label>
                    <select name="category" value={article.category} onChange={handleChange} className="w-full border border-gray-300 p-3 outline-none focus:border-blue-500 text-sm font-bold">
                        <option value="XÃ HỘI">XÃ HỘI</option>
                        <option value="CÔNG NGHỆ">CÔNG NGHỆ</option>
                        <option value="GIẢI TRÍ">GIẢI TRÍ</option>
                        <option value="KINH TẾ">KINH TẾ</option>
                        <option value="THỊ TRƯỜNG">THỊ TRƯỜNG</option>
                        <option value="BẤT ĐỘNG SẢN">BẤT ĐỘNG SẢN</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Nội dung bài viết</label>
                <textarea name="content" value={article.content} onChange={handleChange} rows="15" required className="w-full border border-gray-300 p-4 outline-none focus:border-blue-500 font-serif text-lg leading-relaxed" placeholder="Nhập nội dung chi tiết..."></textarea>
            </div>
            <div className="flex justify-end pt-4 border-t">
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`${loading ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'} text-white font-bold py-3 px-10 text-xs uppercase tracking-widest transition shadow-lg`}
                >
                    {loading ? 'Đang xuất bản...' : 'Xuất bản bài viết'}
                </button>
            </div>
        </form>
    </div>
);

// --- 3. TÁCH COMPONENT CÀI ĐẶT (GIỮ NGUYÊN) ---
const SettingsView = () => (
    <div className="bg-white p-8 border border-gray-200 shadow-sm max-w-2xl">
        <h3 className="text-xl font-black uppercase tracking-tighter mb-6 border-b pb-4">Cài đặt tòa soạn</h3>
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Tên hiển thị tác giả / Bút danh</label>
                <input type="text" className="w-full border border-gray-300 p-3 outline-none focus:border-blue-500" placeholder="Nhập bút danh của bạn..." />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Email nhận thông báo hệ thống</label>
                <input type="email" className="w-full border border-gray-300 p-3 outline-none focus:border-blue-500" placeholder="email@example.com" />
            </div>
            <div className="flex items-center gap-3">
                <input type="checkbox" id="notify" className="w-4 h-4" />
                <label htmlFor="notify" className="text-sm font-bold text-gray-600 uppercase tracking-tight">Nhận thông báo khi có bình luận mới</label>
            </div>
            <div className="pt-4 border-t">
                <button className="bg-black text-white font-bold py-3 px-8 text-xs uppercase tracking-widest hover:bg-gray-800 transition">
                    Lưu thay đổi
                </button>
            </div>
        </div>
    </div>
);

// --- COMPONENT CHÍNH ---
function Dashboard() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [article, setArticle] = useState({ 
        title: '', 
        subtitle: '', 
        sapo: '', 
        thumbnail: '', 
        category: 'XÃ HỘI', 
        content: '',
        author: 'Admin' // Tự động gán tác giả
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArticle(prev => ({ ...prev, [name]: value }));
    };

    // --- BƯỚC 2: SỬA HÀM SUBMIT ĐỂ ĐẨY LÊN WEB THẬT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Gửi dữ liệu tới API /news
            const res = await axiosClient.post('/news', article);
            
            if (res.success) {
                alert("🚀 BÀI BÁO ĐÃ ĐƯỢC XUẤT BẢN THÀNH CÔNG!");
                // Reset form sau khi đăng thành công
                setArticle({ title: '', subtitle: '', sapo: '', thumbnail: '', category: 'XÃ HỘI', content: '', author: 'Admin' });
            }
        } catch (err) {
            console.error("Lỗi xuất bản:", err);
            alert("Lỗi: Không thể gửi bài viết lên máy chủ!");
        } finally {
            setLoading(false);
        }
    };

    const isActive = (path) => location.pathname.includes(path);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <aside className="w-64 bg-[#1a1a1a] text-white p-6 hidden md:block">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-10 font-serif">TÒA SOẠN<span className="text-blue-500">.</span></h2>
                <nav className="space-y-4 text-sm font-bold uppercase tracking-widest text-gray-400">
                    <Link to="/dashboard/create" className={`block px-4 py-3 rounded transition ${isActive('create') ? 'text-white bg-blue-600' : 'hover:text-white'}`}>Soạn bài mới</Link>
                    <Link to="/dashboard/manage" className={`block px-4 py-3 rounded transition ${isActive('manage') ? 'text-white bg-blue-600' : 'hover:text-white'}`}>Quản lý bài viết</Link>
                    <Link to="/dashboard/stats" className={`block px-4 py-3 rounded transition ${isActive('stats') ? 'text-white bg-blue-600' : 'hover:text-white'}`}>Thống kê</Link>
                    <Link to="/dashboard/settings" className={`block px-4 py-3 rounded transition ${isActive('settings') ? 'text-white bg-blue-600' : 'hover:text-white'}`}>Cài đặt</Link>
                </nav>
            </aside>

            <main className="flex-1 p-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    <Routes>
                        <Route path="stats" element={<StatisticsView />} />
                        <Route path="create" element={<EditorView article={article} handleChange={handleChange} handleSubmit={handleSubmit} loading={loading} />} />
                        <Route path="manage" element={<div className="p-10 bg-white border">Giao diện danh sách bài viết sẽ ở đây...</div>} />
                        <Route path="settings" element={<SettingsView />} />
                        <Route path="/" element={<StatisticsView />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;