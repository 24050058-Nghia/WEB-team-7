import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = "http://localhost:5001";

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
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // 1. ĐỒNG BỘ DỮ LIỆU VỚI CÁC KHÓA MÀ APP.JSX ĐANG ĐỢI
        // Lưu object user tổng thể (để App.jsx dùng JSON.parse)
        const userObj = {
          name: data.user?.full_name || data.user?.username || 'Người dùng',
          role: data.user?.role || 'user',
          avatar: data.user?.avatar || null
        };

        localStorage.setItem('user', JSON.stringify(userObj));

        // Lưu các trường lẻ (dự phòng cho logic cũ hoặc các component khác)
        localStorage.setItem('ACCESS_TOKEN', data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_name', userObj.name);
        localStorage.setItem('user_role', userObj.role);
        localStorage.setItem('user_avatar', userObj.avatar);

        // 2. KÍCH HOẠT SỰ KIỆN STORAGE ĐỂ HEADER CẬP NHẬT TỨC THÌ
        // Vì window.addEventListener('storage') chỉ bắt được sự kiện từ tab khác,
        // chúng ta cần tự dispatch sự kiện này để tab hiện tại cũng nhận được.
        window.dispatchEvent(new Event("storage"));

        // 3. ĐIỀU HƯỚNG
        let redirectPath = location.state?.from?.pathname || "/";

        // Kiểm tra quyền Admin/Editor để đẩy vào Dashboard ngay
        const role = String(userObj.role).toLowerCase();
        if (role === 'admin' || role === 'editor') {
          redirectPath = "/dashboard";
        }

        navigate(redirectPath, { replace: true });
      } else {
        // Hiển thị lỗi cụ thể từ Server (ví dụ: "Sai mật khẩu", "Email không tồn tại")
        setErrorMsg(data.message || "Email hoặc mật khẩu không chính xác.");
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
      setErrorMsg("Không thể kết nối đến Server Backend. Hãy chắc chắn Server đang chạy ở port 5001!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfc] flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 w-full max-w-md">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold italic text-gray-900 mb-2">Chào mừng trở lại</h2>
          <p className="text-gray-500 text-sm">Đăng nhập để lưu bài viết và tương tác nội dung</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-[13px] font-medium rounded-xl text-center border border-red-100 animate-in fade-in slide-in-from-top-1">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
              Địa chỉ Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ví dụ: hello@toasoan.com"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 ring-blue-600/20 focus:border-blue-600 outline-none transition-all duration-300"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Mật khẩu
              </label>
              <button type="button" className="text-[11px] font-bold text-blue-600 hover:text-blue-700">Quên mật khẩu?</button>
            </div>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 ring-blue-600/20 focus:border-blue-600 outline-none transition-all duration-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 mt-2 rounded-xl font-bold text-[12px] uppercase tracking-widest transition-all duration-500 shadow-lg flex justify-center items-center gap-3 ${isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-blue-600 hover:-translate-y-1'
              }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                Đang xác thực...
              </>
            ) : 'ĐĂNG NHẬP NGAY'}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-gray-500">
          Bạn chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Mở tài khoản mới
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;