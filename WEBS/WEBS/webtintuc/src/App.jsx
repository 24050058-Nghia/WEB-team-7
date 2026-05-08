import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminEditor from './pages/AdminEditor';
import axiosClient from './api/axiosClient';

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // 1. LẤY USER TỪ LOCALSTORAGE (ƯU TIÊN OBJECT 'user')
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    const userName = localStorage.getItem('user_name');
    if (userName) {
      return {
        name: userName,
        role: localStorage.getItem('user_role') || 'user',
        avatar: localStorage.getItem('user_avatar')
      };
    }
    return null;
  });

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  const categories = [
    { 
      name: 'Trang chủ', 
      slug: '', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
    },
    { 
      name: 'Xã hội', 
      slug: 'XÃ HỘI', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9-9H3m9 9V3m0 9L3 3"></path><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"></circle><path strokeLinecap="round" d="M3.6 9h16.8M3.6 15h16.8"></path></svg>
    },
    { 
      name: 'Kinh tế', 
      slug: 'KINH TẾ', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
    },
    { 
      name: 'Giải trí', 
      slug: 'GIẢI TRÍ', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>
    },
    { 
      name: 'Công nghệ', 
      slug: 'CÔNG NGHỆ', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
    },
    { 
      name: 'Đời sống', 
      slug: 'ĐỜI SỐNG', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 12c.3 0 .5.2.5.5V15a4 4 0 01-4 4H8a4 4 0 01-4-4V6a2 2 0 012-2h7a2 2 0 012 2v2.5M13.5 12c.3 0 .5-.2.5-.5V10a2 2 0 10-4 0v1.5c0 .3.2.5.5.5h3zM18.5 8H21"></path></svg>
    },
  ];

  // Logic tìm kiếm
  useEffect(() => {
    if (!searchKey.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearchLoading(true);
      try {
        const response = await axiosClient.get(`/news`);
        const apiData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        const filteredData = apiData.filter(item =>
          item.title?.toLowerCase().includes(searchKey.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchKey.toLowerCase())
        );
        setSearchResults(filteredData);
      } catch (error) {
        setSearchResults([]);
      } finally {
        setIsSearchLoading(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchKey]);

  // 2. ĐỒNG BỘ USER KHI ĐĂNG NHẬP/ĐĂNG XUẤT (QUAN TRỌNG)
  useEffect(() => {
    const handleUserSync = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        const userName = localStorage.getItem('user_name');
        if (userName) {
          setUser({
            name: userName,
            role: localStorage.getItem('user_role') || 'user',
            avatar: localStorage.getItem('user_avatar')
          });
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', handleUserSync);
    return () => window.removeEventListener('storage', handleUserSync);
  }, []);

  // Theme & Click Outside
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setIsUserMenuOpen(false);
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) setIsSearchFocused(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/login');
    // window.location.reload(); // Có thể bỏ dòng này nếu setUser(null) đã đủ làm Header cập nhật
  };

  const isEditorOrAdmin = useMemo(() => {
    if (!user) return false;
    const role = String(user.role || '').toLowerCase();
    return role === 'editor' || role === 'admin';
  }, [user]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 transition-colors duration-500">

      {/* SIDEBAR */}
      <div className={`fixed inset-0 z-[200] ${isMenuOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${isMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute inset-y-0 left-0 w-80 bg-white dark:bg-[#0a0a0a] p-8 transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-black dark:hover:text-white">✕</button>
          <div className="mt-10">
            <h2 className="text-blue-600 font-black text-[10px] uppercase mb-8 border-b pb-2">Danh mục</h2>
            <nav className="flex flex-col gap-2">
              {categories.map((cat) => (
                <Link 
                  key={cat.slug} 
                  to={cat.slug === '' ? '/' : `/?cat=${encodeURIComponent(cat.slug)}`} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="py-3 px-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 italic font-medium flex items-center gap-4 transition-all rounded-xl group"
                >
                  <span className="text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300">{cat.icon}</span>
                  <span className="text-sm font-bold tracking-tight">{cat.name}</span>
                </Link>
              ))}
              {isEditorOrAdmin && (
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="mt-6 flex items-center gap-4 py-4 px-4 text-red-600 font-black uppercase text-[11px] tracking-widest bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all group/admin"
                >
                  <span className="group-hover/admin:rotate-12 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </span>
                  <span>Quản trị hệ thống</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-[100] glass-effect dark:dark-glass-effect transition-all duration-500">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between h-[72px]">
          <div className="flex items-center space-x-6">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all active:scale-90">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <Link to="/" className="text-2xl font-black font-serif tracking-tighter hover:opacity-80 transition-opacity hidden sm:block">TINTUC.VN</Link>
          </div>

          {/* SEARCH BAR */}
          <div className="flex-1 max-w-xl mx-8 relative" ref={searchContainerRef}>
            <form onSubmit={(e) => { e.preventDefault(); navigate(`/?search=${searchKey}`); setSearchKey(""); }} className="relative group">
              <input
                type="text"
                value={searchKey}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="Tìm kiếm câu chuyện của bạn..."
                className="w-full bg-black/5 dark:bg-white/5 py-3 px-11 rounded-full text-sm outline-none border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-black transition-all"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </form>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all">
               {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                {isEditorOrAdmin && (
                  <Link 
                    to="/dashboard/create" 
                    className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-xl shadow-blue-500/30 active:scale-95"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                    Đăng bài
                  </Link>
                )}
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 p-1 pr-4 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black overflow-hidden shadow-inner">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold hidden lg:block tracking-tight">{user.name}</span>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-[#111] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-black/5 dark:border-white/5 animate-in fade-in zoom-in duration-200 origin-top-right overflow-hidden">
                      <div className="px-4 py-3 border-b border-black/5 dark:border-white/5">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tài khoản</p>
                         <p className="text-xs font-bold truncate">{user.name}</p>
                      </div>
                      <button onClick={() => { navigate('/profile'); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 text-sm transition-colors flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Cá nhân
                      </button>
                      {isEditorOrAdmin && <button onClick={() => { navigate('/dashboard'); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-3 text-blue-600 text-sm font-bold hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Quản trị hệ thống
                      </button>}
                      <button onClick={handleLogout} className="w-full text-left px-4 py-4 text-red-600 border-t border-black/5 dark:border-white/5 text-xs font-black uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">Đăng xuất</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-[11px] font-bold uppercase">Đăng nhập</Link>
                <Link to="/register" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-full text-[11px] font-bold">Đăng ký</Link>
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
          <Route path="/admin/editor" element={isEditorOrAdmin ? <AdminEditor /> : <Navigate to="/" />} />
          <Route path="/admin/editor/:id" element={isEditorOrAdmin ? <AdminEditor /> : <Navigate to="/" />} />
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