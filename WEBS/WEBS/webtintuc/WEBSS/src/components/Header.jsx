import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // State user - Khởi tạo trực tiếp từ localStorage để tránh bị delay 1 nhịp render
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('user_name');
    return token && name ? { name, token } : null;
  });

  // Hàm đồng bộ dữ liệu
  const syncUser = () => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('user_name');
    if (token && name) {
      setUser({ name, token });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Lắng nghe sự kiện thay đổi storage và sự kiện custom authChange
    window.addEventListener('storage', syncUser);
    window.addEventListener('authChange', syncUser); 

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('authChange', syncUser);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/login');
    // Reload nhẹ để clear sạch state các component khác
    window.location.reload(); 
  };

  return (
    <nav className="sticky top-0 z-[100] backdrop-blur-md bg-white/90 dark:bg-[#0a0a0a]/90 border-b border-gray-200 dark:border-gray-800 py-3 shadow-sm">
      <div className="container mx-auto px-6 flex justify-between items-center max-w-7xl">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black tracking-tighter uppercase font-serif text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
          TINTUC.VN
        </Link>
        
        {/* BÊN PHẢI */}
        <div className="flex items-center gap-4">
          {user ? (
            /* --- GIAO DIỆN PILL (AVATAR TÍM + TÊN) --- */
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 p-1 pr-4 rounded-full transition-all duration-300 border border-transparent hover:border-gray-300 dark:hover:border-gray-700 shadow-sm"
              >
                {/* Vòng tròn Avatar tím */}
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                
                {/* Tên người dùng */}
                <span className="text-sm font-bold text-gray-800 dark:text-gray-100 max-w-[120px] truncate">
                  {user.name}
                </span>
                
                {/* Mũi tên nhỏ */}
                <svg className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Menu thả xuống */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-3 w-60 bg-white dark:bg-[#111] shadow-2xl border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden z-[999] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 bg-gray-50/80 dark:bg-white/5 border-b dark:border-gray-800">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Tài khoản</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                  </div>
                  
                  <div className="py-2">
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Trang cá nhân
                    </Link>
                  </div>

                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-3 px-5 py-4 text-sm text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 border-t border-gray-100 dark:border-gray-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* --- KHI CHƯA ĐĂNG NHẬP --- */
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[11px] font-bold tracking-widest text-gray-500 hover:text-blue-600 uppercase transition-colors">Đăng nhập</Link>
              <Link to="/register" className="text-[11px] font-bold tracking-widest bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-blue-600 transition-all uppercase shadow-md active:scale-95">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;