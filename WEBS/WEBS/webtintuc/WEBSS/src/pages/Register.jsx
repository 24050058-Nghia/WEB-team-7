import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false); // Thêm state loading cho mượt

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Giả lập delay mạng một chút cho trải nghiệm thực tế hơn
    await new Promise(resolve => setTimeout(resolve, 800));

    // Lưu vào user_db để Login có thể kiểm tra (giả lập)
    localStorage.setItem('user_db', JSON.stringify(formData));
    alert('🎉 Đăng ký thành công! Hãy đăng nhập.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#fdfdfc] flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* TIÊU ĐỀ */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold italic text-gray-900 mb-2">Tạo tài khoản</h2>
          <p className="text-gray-500 text-sm">Gia nhập tòa soạn để trải nghiệm trọn vẹn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* FIELD: HỌ VÀ TÊN */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Họ và Tên
            </label>
            <input 
              type="text" 
              placeholder="ví dụ: Nguyễn Văn A" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-gray-900" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>

          {/* FIELD: EMAIL */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Email
            </label>
            <input 
              type="email" 
              placeholder="ví dụ: hello@toasoan.com" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-gray-900" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>

          {/* FIELD: MẬT KHẨU */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Mật khẩu
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-gray-900" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>

          {/* NÚT BẤM */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 mt-2 rounded-xl font-bold text-[12px] uppercase tracking-widest transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2 ${
              isLoading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-blue-600 hover:shadow-xl'
            }`}
          >
            {isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ TÀI KHOẢN'}
          </button>
        </form>

        {/* FOOTER */}
        <p className="mt-8 text-center text-[13px] text-gray-500">
          Đã có tài khoản? <Link to="/login" className="text-blue-600 font-bold hover:underline transition-all">Đăng nhập ngay</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;