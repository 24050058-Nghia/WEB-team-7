import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import axiosClient from '../api/axiosClient'; // Bỏ comment dòng này khi bạn có API thật

const API_BASE_URL = "https://tracy-poikilothermic-trancedly.ngrok-free.dev";

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      /* ==========================================
         1. GỌI API ĐĂNG NHẬP THẬT (Bỏ comment khi dùng)
      ========================================== */
      // const response = await axiosClient.post(`${API_BASE_URL}/api/login`, formData);
      // const token = response.data?.token || response.data?.access_token;
      // const user = response.data?.user;
      
      // if (!token) throw new Error("Không nhận được token từ server");

      /* ==========================================
         2. GIẢ LẬP ĐĂNG NHẬP (Dùng tạm khi chờ Backend)
      ========================================== */
      // Mô phỏng độ trễ mạng 1 giây
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const savedUser = JSON.parse(localStorage.getItem('user_db'));
      const loginName = savedUser ? savedUser.name : "Thành Nghĩa";
      const token = "mock_token_123456789"; // Token giả định

      // LƯU VÀO LOCAL STORAGE (Lưu ý: dùng ACCESS_TOKEN để khớp với ArticleDetail)
      localStorage.setItem('ACCESS_TOKEN', token);
      localStorage.setItem('user_name', loginName);
      localStorage.setItem('user_email', formData.email);

      // KÍCH HOẠT SỰ KIỆN ĐỂ HEADER TỰ ĐỘNG CẬP NHẬT MÀ KHÔNG CẦN RELOAD TRANG
      window.dispatchEvent(new Event("storage"));

      // CHUYỂN HƯỚNG VỀ TRANG TRƯỚC ĐÓ HOẶC TRANG CHỦ
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });

    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setErrorMsg("Email hoặc mật khẩu không chính xác. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfc] flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold italic text-gray-900 mb-2">Chào mừng trở lại</h2>
          <p className="text-gray-500 text-sm">Đăng nhập để lưu bài viết và tương tác</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-[13px] font-medium rounded-xl text-center border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Email của bạn
            </label>
            <input 
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ví dụ: hello@toasoan.com" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ring-blue-600 outline-none transition-all" 
              required 
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Mật khẩu
              </label>
              <a href="#" className="text-[11px] font-bold text-blue-600 hover:underline">Quên mật khẩu?</a>
            </div>
            <input 
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ring-blue-600 outline-none transition-all" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 mt-2 rounded-xl font-bold text-[12px] uppercase tracking-widest transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2 ${
              isLoading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-blue-600 hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ĐANG XỬ LÍ...
              </>
            ) : (
              'ĐĂNG NHẬP NGAY'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-gray-500">
          Bạn chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline transition-all">
            Mở tài khoản mới
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;