import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

// Dữ liệu giả lập (Mock UI)
const mockArticles = [
    { id: 1, title: 'Công nghệ AI 2026: Bước ngoặt mới', category: 'CÔNG NGHỆ', views: 15420, comments: 45, date: '10/04/2026' },
    { id: 2, title: 'Thị trường Bất động sản sôi động', category: 'BẤT ĐỘNG SẢN', views: 8900, comments: 12, date: '09/04/2026' },
    { id: 3, title: 'Startup Việt vươn tầm quốc tế', category: 'KINH TẾ', views: 24500, comments: 130, date: '08/04/2026' }
];

const StatisticsView = ({ stats }) => (
    <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Hiệu suất hệ thống</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-gray-200 shadow-sm border-l-4 border-l-blue-600 hover:-translate-y-1 transition transform duration-300">
                <p className="text-sm text-gray-500 font-bold uppercase">Tổng bài viết</p>
                <p className="text-3xl font-black mt-2">{stats.totalNews || 0}</p>
                <p className="text-xs text-green-600 font-bold mt-2">Dữ liệu thời gian thực</p>
            </div>
            <div className="bg-white p-6 border border-gray-200 shadow-sm border-l-4 border-l-red-500 hover:-translate-y-1 transition transform duration-300">
                <p className="text-sm text-gray-500 font-bold uppercase">Tổng lượt xem</p>
                <p className="text-3xl font-black mt-2">{stats.totalViews?.toLocaleString() || 0}</p>
                <p className="text-xs text-green-600 font-bold mt-2">Từ các bài viết</p>
            </div>
            <div className="bg-white p-6 border border-gray-200 shadow-sm border-l-4 border-l-green-500 hover:-translate-y-1 transition transform duration-300">
                <p className="text-sm text-gray-500 font-bold uppercase">Chuyên mục</p>
                <p className="text-3xl font-black mt-2">6</p>
                <p className="text-xs text-gray-400 font-bold mt-2">Đã được phân loại</p>
            </div>
            <div className="bg-white p-6 border border-gray-200 shadow-sm border-l-4 border-l-purple-500 hover:-translate-y-1 transition transform duration-300">
                <p className="text-sm text-gray-500 font-bold uppercase">Lượt bình luận</p>
                <p className="text-3xl font-black mt-2">{stats.totalComments || 0}</p>
                <p className="text-xs text-green-600 font-bold mt-2">Đã kết nối Database</p>
            </div>
        </div>
    </div>
);

const EditorView = ({ article, handleChange, handleSubmit, loading, isEditing }) => (
    <div className="bg-white p-8 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-black uppercase tracking-tighter mb-6 border-b pb-4">
            {isEditing ? "Chỉnh sửa bài viết" : "Soạn thảo bài báo mới"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Tít chính (Tiêu đề)</label>
                    <input type="text" name="title" value={article.title} onChange={handleChange} required className="w-full border border-gray-300 p-3 outline-none focus:border-blue-500 text-lg font-serif font-bold" placeholder="Nhập tiêu đề bài báo..." />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Tít phụ (Subtitle)</label>
                    <input type="text" name="subtitle" value={article.subtitle || ''} onChange={handleChange} className="w-full border border-gray-300 p-3 outline-none focus:border-blue-500 text-lg font-serif" placeholder="Nhập tít phụ..." />
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
                        <option value="KINH TẾ">KINH TẾ</option>
                        <option value="GIẢI TRÍ">GIẢI TRÍ</option>
                        <option value="CÔNG NGHỆ">CÔNG NGHỆ</option>
                        <option value="ĐỜI SỐNG">ĐỜI SỐNG</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Nội dung bài viết</label>
                <textarea name="content" value={article.content} onChange={handleChange} rows="15" required className="w-full border border-gray-300 p-4 outline-none focus:border-blue-500 font-serif text-lg leading-relaxed" placeholder="Nhập nội dung chi tiết..."></textarea>
            </div>
            <div className="flex justify-end pt-4 border-t gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className={`${loading ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'} text-white font-bold py-3 px-10 text-xs uppercase tracking-widest transition shadow-lg active:scale-95`}
                >
                    {loading ? 'Đang xử lý...' : (isEditing ? 'Lưu cập nhật' : 'Xuất bản bài viết')}
                </button>
            </div>
        </form>
    </div>
);

const CommentsManagementView = ({ comments, onDelete }) => (
    <div className="bg-white p-8 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-black uppercase tracking-tighter mb-6 pb-4 border-b">Kiểm duyệt bình luận</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-[10px] font-black tracking-widest uppercase text-gray-500">
                        <th className="p-4 border-b border-gray-200">Người dùng</th>
                        <th className="p-4 border-b border-gray-200">Nội dung</th>
                        <th className="p-4 border-b border-gray-200">Bài viết</th>
                        <th className="p-4 border-b border-gray-200">Ngày gửi</th>
                        <th className="p-4 border-b border-gray-200 text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {comments.length > 0 ? comments.map((c) => (
                        <tr key={c.id} className="border-b border-gray-100 hover:bg-red-50/30 transition">
                            <td className="p-4">
                                <div className="font-black text-xs uppercase text-blue-600">{c.user_name || c.username}</div>
                                <div className="text-[9px] text-gray-400 font-bold">UID: #{c.user_id}</div>
                            </td>
                            <td className="p-4 text-sm font-medium text-gray-700 max-w-xs truncate">{c.content}</td>
                            <td className="p-4 text-[11px] font-bold text-gray-500 truncate max-w-[150px]">{c.article_title || 'N/A'}</td>
                            <td className="p-4 text-[10px] font-bold text-gray-400">{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                            <td className="p-4 text-right">
                                <button onClick={() => onDelete(c.id)} className="text-[10px] bg-red-600 text-white font-bold uppercase tracking-wider px-3 py-1.5 rounded shadow-lg hover:bg-red-700 transition active:scale-95">Xóa</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="p-10 text-center text-gray-400 font-medium italic text-sm">Hệ thống chưa ghi nhận bình luận nào từ người dùng.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

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
            <div className="pt-4 border-t">
                <button className="bg-black text-white font-bold py-3 px-8 text-xs uppercase tracking-widest hover:bg-gray-800 transition active:scale-95">
                    Lưu thay đổi
                </button>
            </div>
        </div>
    </div>
);

function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();

    // Quản lý trạng thái dữ liệu (API)
    const [articlesList, setArticlesList] = useState([]);
    const [commentsList, setCommentsList] = useState([]);
    const [stats, setStats] = useState({ totalNews: 0, totalComments: 0, totalViews: 0 });
    
    // Trạng thái tìm kiếm
    const [newsSearch, setNewsSearch] = useState("");
    const [commentSearch, setCommentSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Lấy song song dữ liệu để nhanh hơn
            const [newsRes, commentsRes] = await Promise.all([
                axiosClient.get('/news'),
                axiosClient.get('/admin/comments')
            ]);

            const newsData = Array.isArray(newsRes) ? newsRes : (newsRes.data || []);
            const commentsData = Array.isArray(commentsRes) ? commentsRes : (commentsRes.data || []);

            setArticlesList(newsData);
            setCommentsList(commentsData);
            
            setStats({
                totalNews: newsData.length,
                totalComments: commentsData.length,
                totalViews: newsData.reduce((acc, curr) => acc + (curr.views || 0), 0)
            });
        } catch (error) {
            console.error("Lỗi tải dữ liệu Dashboard:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // LOGIC LỌC TỨC THÌ (LOCAL FILTERING) - KHÔNG ĐỘ TRỄ
    const filteredArticles = React.useMemo(() => {
        if (!newsSearch.trim()) return articlesList;
        const term = newsSearch.toLowerCase();
        return articlesList.filter(item => 
            item.title?.toLowerCase().includes(term) || 
            item.category?.toLowerCase().includes(term)
        );
    }, [newsSearch, articlesList]);

    const filteredComments = React.useMemo(() => {
        if (!commentSearch.trim()) return commentsList;
        const term = commentSearch.toLowerCase();
        return commentsList.filter(item => 
            item.content?.toLowerCase().includes(term) || 
            item.user_name?.toLowerCase().includes(term) ||
            item.username?.toLowerCase().includes(term)
        );
    }, [commentSearch, commentsList]);

    const emptyArticle = { id: null, title: '', subtitle: '', sapo: '', thumbnail: '', category: 'XÃ HỘI', content: '', author: '' };
    const [article, setArticle] = useState(emptyArticle);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
            try {
                await axiosClient.delete(`/comments/${commentId}`);
                setCommentsList(prev => prev.filter(c => c.id !== commentId));
                setStats(prev => ({ ...prev, totalComments: prev.totalComments - 1 }));
                alert("🗑 Đã xóa bình luận!");
            } catch (error) {
                alert("Lỗi khi xóa bình luận!");
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArticle(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (articleToEdit) => {
        setArticle({
            ...articleToEdit,
            sapo: articleToEdit.summary || '',
            thumbnail: articleToEdit.image_url || '',
        });
        setIsEditing(true);
        navigate('/dashboard/create');
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa bài báo này khỏi hệ thống không?");
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token') || localStorage.getItem('ACCESS_TOKEN');
                await axiosClient.delete(`/news/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setArticlesList(prev => prev.filter(item => item.id !== id));
                alert("🗑 Đã xóa bài viết thành công!");
            } catch (error) {
                console.error(error);
                alert("Lỗi khi xóa bài viết!");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token') || localStorage.getItem('ACCESS_TOKEN');
            if (!token) {
                alert("Vui lòng đăng nhập lại!");
                navigate('/login');
                return;
            }

            const formData = {
                title: article.title,
                summary: article.sapo,
                content: article.content,
                category: article.category,
                image_url: article.thumbnail,
            };

            if (isEditing) {
                await axiosClient.put(`/news/${article.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("✅ Đã cập nhật bài báo thành công!");
            } else {
                await axiosClient.post(`/news`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("🚀 BÀI BÁO MỚI ĐÃ ĐƯỢC PHÁT HÀNH THÀNH CÔNG!");
            }

            fetchData(); // Làm mới toàn bộ dữ liệu
            setArticle(emptyArticle);
            setIsEditing(false);
            navigate('/dashboard/manage');
        } catch (error) {
            console.error("Lỗi khi lưu bài viết:", error.response || error);
            alert(error.response?.data?.message || "Lỗi khi kết nối đến API lưu bài!");
        } finally {
            setLoading(false);
        }
    };

    const isActive = (path) => location.pathname.includes(path);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <aside className="w-64 bg-[#1a1a1a] text-white p-6 hidden md:block border-r border-gray-800">
                <Link to="/" className="block text-2xl font-black uppercase tracking-widest mb-10 font-serif hover:text-blue-400 transition">TÒA SOẠN<span className="text-blue-500">.</span></Link>
                <nav className="space-y-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 w-full">
                    <Link to="/dashboard/stats" className={`block px-4 py-4 rounded-xl transition ${isActive('stats') ? 'text-white bg-blue-600 shadow-md' : 'hover:text-white hover:bg-gray-800'}`}>Thống kê chung</Link>
                    <Link to="/dashboard/manage" className={`block px-4 py-4 rounded-xl transition ${isActive('manage') ? 'text-white bg-blue-600 shadow-md' : 'hover:text-white hover:bg-gray-800'}`}>Quản lý tin báo</Link>
                    <Link to="/dashboard/comments" className={`block px-4 py-4 rounded-xl transition ${isActive('comments') ? 'text-white bg-blue-600 shadow-md' : 'hover:text-white hover:bg-gray-800'}`}>Quản lý bình luận</Link>
                    <Link to="/dashboard/create" onClick={() => { setArticle(emptyArticle); setIsEditing(false); }} className={`block px-4 py-4 rounded-xl transition ${isActive('create') ? 'text-white bg-blue-600 shadow-md' : 'hover:text-white hover:bg-gray-800'}`}>Viết bài mới</Link>
                    <Link to="/dashboard/settings" className={`block px-4 py-4 rounded-xl transition ${isActive('settings') ? 'text-white bg-blue-600 shadow-md' : 'hover:text-white hover:bg-gray-800'}`}>Cài đặt & Vai trò</Link>
                </nav>
            </aside>

            <main className="flex-1 p-4 md:p-10 h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                    <div className="text-sm font-bold text-gray-500 tracking-wider">MÃ DASHBOARD: #ADM-2026</div>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:underline">Quay về Web</Link>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto">
                    <Routes>
                        <Route path="stats" element={<StatisticsView stats={stats} />} />
                        <Route path="create" element={<EditorView article={article} handleChange={handleChange} handleSubmit={handleSubmit} loading={loading} isEditing={isEditing} />} />
                        <Route path="manage" element={<ManageView 
                            articlesList={articlesList} 
                            filteredArticles={filteredArticles} 
                            newsSearch={newsSearch} 
                            setNewsSearch={setNewsSearch} 
                            handleEdit={handleEdit} 
                            handleDelete={handleDelete} 
                            emptyArticle={emptyArticle}
                            setArticle={setArticle}
                            setIsEditing={setIsEditing}
                        />} />
                        <Route path="comments" element={<CommentsManagementViewInternal 
                            commentsList={commentsList}
                            filteredComments={filteredComments}
                            commentSearch={commentSearch}
                            setCommentSearch={setCommentSearch}
                            handleDeleteComment={handleDeleteComment}
                        />} />
                        <Route path="settings" element={<SettingsView />} />
                        <Route path="/" element={<StatisticsView stats={stats} />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

// ======================== SUB-COMPONENTS (DEFINED OUTSIDE TO PREVENT RE-MOUNT) ========================

const ManageView = ({ articlesList, filteredArticles, newsSearch, setNewsSearch, handleEdit, handleDelete, emptyArticle, setArticle, setIsEditing }) => (
    <div className="bg-white p-8 border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b gap-4">
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-black uppercase tracking-tighter">Quản lý bài viết</h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${newsSearch ? 'text-blue-600' : 'text-gray-400'}`}>
                    {newsSearch ? `🔍 Tìm thấy ${filteredArticles.length} kết quả` : `Hiển thị ${articlesList.length} bài viết`}
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:w-72 group">
                    <input 
                        type="text" 
                        placeholder="Tìm tiêu đề bài báo..." 
                        value={newsSearch}
                        onChange={(e) => setNewsSearch(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 py-2.5 pl-10 pr-10 text-xs font-bold outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all duration-300"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    {newsSearch && (
                        <button onClick={() => setNewsSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors scale-100 active:scale-90">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    )}
                </div>

                <Link to="/dashboard/create" onClick={() => { setArticle(emptyArticle); setIsEditing(false); }} className="bg-blue-600 text-white px-5 py-2.5 text-[11px] uppercase font-bold tracking-widest hover:bg-blue-700 transition shadow-lg active:scale-95 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                    Viết bài mới
                </Link>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-[10px] font-black tracking-widest uppercase text-gray-500">
                        <th className="p-4 border-b border-gray-200">#</th>
                        <th className="p-4 border-b border-gray-200 w-1/3">Tiêu đề bài viết</th>
                        <th className="p-4 border-b border-gray-200">Chuyên mục</th>
                        <th className="p-4 border-b border-gray-200">Lượt Xem</th>
                        <th className="p-4 border-b border-gray-200 text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredArticles.length > 0 ? filteredArticles.map((item, idx) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors duration-200">
                            <td className="p-4 text-[11px] text-gray-400 font-bold">{idx + 1}</td>
                            <td className="p-4 font-bold text-sm text-blue-900 cursor-pointer hover:underline">{item.title}</td>
                            <td className="p-4">
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 text-[9px] uppercase font-black tracking-widest rounded shadow-sm">{item.category}</span>
                            </td>
                            <td className="p-4 text-xs font-semibold text-gray-600">
                                <span className="text-gray-900 font-bold">{(item.views || 0).toLocaleString()}</span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                                <button onClick={() => handleEdit(item)} className="text-[10px] bg-yellow-100 text-yellow-800 font-bold uppercase tracking-wider px-3 py-2 rounded hover:bg-yellow-200 transition shadow-sm active:scale-95">Sửa</button>
                                <button onClick={() => handleDelete(item.id)} className="text-[10px] bg-red-100 text-red-700 font-bold uppercase tracking-wider px-3 py-2 rounded hover:bg-red-200 transition shadow-sm active:scale-95">Xóa</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="p-10 text-center text-gray-400 font-medium italic text-sm">Không tìm thấy kết quả nào phù hợp.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const CommentsManagementViewInternal = ({ commentsList, filteredComments, commentSearch, setCommentSearch, handleDeleteComment }) => (
    <div className="bg-white p-8 border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b gap-4">
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-black uppercase tracking-tighter">Kiểm duyệt bình luận</h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${commentSearch ? 'text-red-500' : 'text-gray-400'}`}>
                    {commentSearch ? `🔍 Tìm thấy ${filteredComments.length} kết quả` : `Hiển thị ${commentsList.length} bình luận`}
                </p>
            </div>

            <div className="relative w-full md:w-96 group">
                <input 
                    type="text" 
                    placeholder="Tìm nội dung hoặc tên người dùng..." 
                    value={commentSearch}
                    onChange={(e) => setCommentSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 py-2.5 pl-10 pr-10 text-xs font-bold outline-none focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50 transition-all duration-300"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                {commentSearch && (
                    <button onClick={() => setCommentSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors scale-100 active:scale-90">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                )}
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-[10px] font-black tracking-widest uppercase text-gray-500">
                        <th className="p-4 border-b border-gray-200">Người dùng</th>
                        <th className="p-4 border-b border-gray-200">Nội dung</th>
                        <th className="p-4 border-b border-gray-200">Bài viết</th>
                        <th className="p-4 border-b border-gray-200 text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredComments.length > 0 ? filteredComments.map((c) => (
                        <tr key={c.id} className="border-b border-gray-100 hover:bg-red-50/30 transition-colors duration-200">
                            <td className="p-4">
                                <div className="font-black text-xs uppercase text-blue-600">{c.user_name || c.username}</div>
                                <div className="text-[9px] text-gray-400 font-bold">UID: #{c.user_id}</div>
                            </td>
                            <td className="p-4 text-sm font-medium text-gray-700 max-w-xs truncate">{c.content}</td>
                            <td className="p-4 text-[11px] font-bold text-gray-500 truncate max-w-[150px]">{c.article_title || 'N/A'}</td>
                            <td className="p-4 text-right">
                                <button onClick={() => handleDeleteComment(c.id)} className="text-[10px] bg-red-600 text-white font-bold uppercase tracking-wider px-3 py-1.5 rounded shadow-lg hover:bg-red-700 transition active:scale-95">Xóa</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="4" className="p-10 text-center text-gray-400 font-medium italic text-sm">Không tìm thấy bình luận phù hợp.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

export default Dashboard;