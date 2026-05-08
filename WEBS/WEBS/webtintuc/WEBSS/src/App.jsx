import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login'; 
import Register from './pages/Register'; 
import Dashboard from './pages/Dashboard'; 
import Profile from './pages/Profile'; 
import axiosClient from './api/axiosClient'; 

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchKey, setSearchKey] = useState(""); 
  const [isSearchFocused, setIsSearchFocused] = useState(false); 
  
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const userName = localStorage.getItem('user_name');
    if (savedUser) return JSON.parse(savedUser);
    if (userName) return { name: userName };
    return null;
  });

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const searchContainerRef = useRef(null); 
  const navigate = useNavigate();

  const categories = [
    { name: 'Trang chủ', slug: '' },
    { name: 'Xã hội', slug: 'XÃ HỘI' },
    { name: 'Kinh tế', slug: 'KINH TẾ' },
    { name: 'Thị trường', slug: 'THỊ TRƯỜNG' },
    { name: 'Bất động sản', slug: 'BẤT ĐỘNG SẢN' },
    { name: 'Giải trí', slug: 'GIẢI TRÍ' },
    { name: 'Công nghệ', slug: 'CÔNG NGHỆ' },
  ];

  // LOGIC TÌM KIẾM: CHỈ DÙNG API THẬT - KHÔNG CÓ DỮ LIỆU GIẢ
  useEffect(() => {
    // Chỉ chạy search nếu người dùng thực sự nhập từ khóa
    if (!searchKey.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearchLoading(true);
      try {
        const response = await axiosClient.get(`/api/news`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        const data = response.data?.data || response.data || response;
        const apiData = Array.isArray(data) ? data : [];

        // Lọc kết quả dựa trên từ khóa người dùng nhập
        const filteredData = apiData.filter(item => 
          (item.title && item.title.toLowerCase().includes(searchKey.toLowerCase())) ||
          (item.description && item.description.toLowerCase().includes(searchKey.toLowerCase())) ||
          (item.category && item.category.toLowerCase().includes(searchKey.toLowerCase()))
        );
        
        setSearchResults(filteredData);
      } catch (error) {
        console.error("Lỗi API tìm kiếm:", error);
        setSearchResults([]); 
      } finally {
        setIsSearchLoading(false);
      }
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchKey]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKey.trim()) {
      navigate(`/?search=${encodeURIComponent(searchKey.trim())}`);
      setSearchKey(""); 
      setIsSearchFocused(false);
    }
  };

  // Các useEffect xử lý giao diện khác giữ nguyên
  useEffect(() => {
    const handleUserSync = () => {
      const updatedName = localStorage.getItem('user_name');
      const savedUser = localStorage.getItem('user');
      if (updatedName) setUser(prev => ({ ...prev, name: updatedName }));
      else if (savedUser) setUser(JSON.parse(savedUser));
    };
    window.addEventListener('storage', handleUserSync);
    return () => window.removeEventListener('storage', handleUserSync);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setIsUserMenuOpen(false);
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) setIsSearchFocused(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/login');
    window.location.reload();
  };

  const isEditorOrAdmin = useMemo(() => {
    if (!user) return false;
    const role = String(user.role || '').toLowerCase();
    return role === 'editor' || role === 'admin' || user.is_admin;
  }, [user]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500">
      
      {/* SIDEBAR */}
      <div className={`fixed inset-0 z-[200] transition-all duration-300 ${isMenuOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute inset-y-0 left-0 w-80 bg-white dark:bg-[#0a0a0a] shadow-2xl p-8 transition-transform duration-500 ease-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-black dark:hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" /></svg></button>
          <div className="mt-10">
            <h2 className="text-blue-600 font-black tracking-[0.3em] text-[10px] uppercase mb-8 border-b dark:border-blue-900/30 pb-2">Danh mục</h2>
            <nav className="flex flex-col gap-2">
              {categories.map((cat) => (
                <Link key={cat.slug} to={cat.slug === '' ? '/' : `/?cat=${encodeURIComponent(cat.slug)}`} onClick={() => setIsMenuOpen(false)} className="py-3 px-3 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all border-b border-gray-50 dark:border-gray-900/50 last:border-0 italic font-medium">{cat.name}</Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-[100] backdrop-blur-xl bg-white/90 dark:bg-[#0a0a0a]/90 border-b border-gray-200 dark:border-gray-800">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between max-w-7xl h-[72px]">
          <div className="flex items-center space-x-6">
            <button onClick={toggleMenu} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>
            <Link to="/" className="text-2xl font-black tracking-tighter uppercase font-serif hover:text-blue-600 hidden sm:block">TINTUC.VN</Link>
          </div>

          {/* SEARCH BAR */}
          <div className="flex-1 max-w-2xl mx-4 md:mx-10 relative" ref={searchContainerRef}> 
            <form onSubmit={handleSearch} className="relative z-20 group">
              <input
                type="text"
                value={searchKey}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="Tìm kiếm nội dung..."
                className="w-full bg-gray-50 dark:bg-white/5 border border-blue-400 focus:border-blue-600 py-2.5 pl-6 pr-12 rounded-full text-sm outline-none transition-all"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
                {isSearchLoading ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
              </button>
            </form>

            {/* DROPDOWN - CHỈ HIỆN KHI CÓ TỪ KHÓA VÀ CÓ KẾT QUẢ */}
            {isSearchFocused && searchKey.trim() && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-[#1a1a1a] shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-10">
                <div className="max-h-[400px] overflow-y-auto p-2">
                  {searchResults.length > 0 ? (
                    searchResults.map((article) => (
                      <div key={article.id} onClick={() => { navigate(`/article/${article.id}`); setIsSearchFocused(false); setSearchKey(""); }} className="flex items-start gap-4 p-3 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer rounded-xl group transition-all">
                        <img src={article.img || article.thumbnail || 'https://via.placeholder.com/200'} alt="thumb" className="w-20 h-14 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[8px] font-bold text-blue-600 uppercase block">{article.category || 'TIN TỨC'}</span>
                          <h4 className="text-sm font-bold truncate group-hover:text-blue-600">{article.title}</h4>
                        </div>
                      </div>
                    ))
                  ) : !isSearchLoading && (
                    <div className="p-8 text-center text-sm text-gray-400 italic">Không tìm thấy kết quả nào cho "{searchKey}"</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">{theme === 'dark' ? '☀️' : '🌙'}</button>
            {user ? (
              <div className="relative flex items-center pl-2 border-l border-gray-200 dark:border-gray-800" ref={userMenuRef}>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 p-1 pr-4 rounded-full">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">{user.name?.charAt(0).toUpperCase()}</div>
                  <span className="text-xs font-bold hidden lg:block">{user.name}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <button onClick={() => { setIsUserMenuOpen(false); navigate('/profile'); }} className="w-full text-left px-5 py-3 hover:bg-gray-50 text-sm">Trang cá nhân</button>
                    {isEditorOrAdmin && <button onClick={() => { setIsUserMenuOpen(false); navigate('/dashboard'); }} className="w-full text-left px-5 py-3 hover:bg-gray-50 text-sm font-semibold text-blue-600">Quản trị</button>}
                    <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 text-sm font-bold border-t border-gray-100">Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-800">
                <Link to="/login" className="text-[11px] font-bold uppercase hover:text-blue-600">Đăng nhập</Link>
                <Link to="/register" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-full text-[11px] font-bold uppercase">Đăng ký</Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/dashboard/*" element={isEditorOrAdmin ? <Dashboard /> : <Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}