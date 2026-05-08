import React, { useState, useEffect } from 'react';

const generateMockEmail = (name) => {
  if (!name) return '';
  const normalized = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
  return `${normalized}@example.com`;
};

function Profile() {
  const [activeTab, setActiveTab] = useState('info');
  const [isUpdating, setIsUpdating] = useState(false);

  const initialName = localStorage.getItem('user_name') || 'Triệu';
  
  // 1. Thêm State quản lý Ảnh đại diện (Lấy từ localStorage nếu có)
  const [avatar, setAvatar] = useState(localStorage.getItem('user_avatar') || null);

  const [formData, setFormData] = useState({
    fullName: initialName,
    email: localStorage.getItem('user_email') || generateMockEmail(initialName), 
    bio: localStorage.getItem('user_bio') || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInfoChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Hàm xử lý khi người dùng chọn ảnh từ máy tính
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Giới hạn dung lượng ảnh < 2MB (để không làm tràn bộ nhớ localStorage)
    if (file.size > 2 * 1024 * 1024) {
      alert("Vui lòng chọn ảnh có dung lượng nhỏ hơn 2MB!");
      return;
    }

    // Dùng FileReader để đọc file và tạo ra chuỗi Base64 để preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result); // Cập nhật state để hiển thị ảnh ngay lập tức
    };
    reader.readAsDataURL(file);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      /* ==========================================
         CÁCH GỬI FILE ẢNH CHO API THẬT:
         Khi có API, bạn không gửi JSON mà phải dùng FormData.
         
         const uploadData = new FormData();
         uploadData.append('fullName', formData.fullName);
         uploadData.append('email', formData.email);
         uploadData.append('bio', formData.bio);
         
         // Nếu có file ảnh thật (Lấy từ document.getElementById hoặc state lưu Object File)
         // uploadData.append('avatar', selectedFile); 

         const response = await fetch('https://your-api.com/api/users/profile', {
           method: 'PUT',
           headers: {
             'Authorization': `Bearer ${localStorage.getItem('token')}`
             // KHÔNG set 'Content-Type': 'application/json' khi dùng FormData
           },
           body: uploadData
         });
      ========================================== */

      await new Promise(resolve => setTimeout(resolve, 500));

      // Lưu thông tin vào localStorage (Mô phỏng DB)
      localStorage.setItem('user_name', formData.fullName);
      localStorage.setItem('user_email', formData.email);
      localStorage.setItem('user_bio', formData.bio);
      if (avatar) localStorage.setItem('user_avatar', avatar); // Lưu ảnh
      
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userObj = JSON.parse(savedUser);
        userObj.name = formData.fullName; 
        userObj.email = formData.email; 
        if (avatar) userObj.avatar = avatar; // Đồng bộ ảnh vào Object User
        localStorage.setItem('user', JSON.stringify(userObj));
      }
      
      window.dispatchEvent(new Event("storage")); 
      
      alert('Cập nhật thành công! Hồ sơ của bạn đã được lưu.');
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      alert('Có lỗi xảy ra khi cập nhật. Vui lòng thử lại!');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    alert('Đổi mật khẩu thành công!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 transition-all duration-500">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* HEADER PROFILE CÓ CHỨC NĂNG ĐỔI AVATAR */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-6 flex flex-col items-center border border-gray-100 relative overflow-hidden">
          {/* Banner nền trang trí nhỏ (Tùy chọn) */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-purple-100 to-pink-100 opacity-50 z-0"></div>
          
          <div className="relative z-10 group mb-4">
            {/* Khung chứa Avatar */}
            <div className="w-28 h-28 rounded-full overflow-hidden bg-purple-600 text-white flex items-center justify-center text-4xl font-black shadow-lg border-4 border-white transition-transform duration-300 group-hover:scale-105">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            
            {/* Nút bấm Camera đè lên góc phải dưới của Avatar */}
            <label className="absolute bottom-0 right-0 bg-white p-2.5 rounded-full shadow-md cursor-pointer border border-gray-100 hover:bg-gray-50 hover:text-purple-600 transition-colors z-20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              {/* Thẻ input ẩn */}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange} 
              />
            </label>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 z-10">Trang cá nhân của {formData.fullName}</h1>
          <p className="text-gray-500 text-sm mt-1 z-10">Thành viên từ tháng 04/2026</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* SIDEBAR MENU */}
          <div className="md:col-span-1 space-y-2">
            {[
              { id: 'info', label: 'Thông tin chung', icon: '👤' },
              { id: 'security', label: 'Bảo mật', icon: '🔒' },
              { id: 'history', label: 'Bài viết đã lưu', icon: '🔖' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-5 py-3 rounded-2xl font-semibold text-sm transition-all flex items-center gap-3 ${
                  activeTab === tab.id 
                  ? 'bg-purple-600 text-white shadow-md scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* NỘI DUNG CHI TIẾT */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
              
              {activeTab === 'info' && (
                <form onSubmit={updateProfile} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                    <span className="w-1.5 h-6 bg-purple-600 rounded-full mr-3"></span>
                    Thông tin tài khoản
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Họ và tên</label>
                      <input 
                        name="fullName"
                        type="text" 
                        value={formData.fullName} 
                        onChange={handleInfoChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ring-purple-500 outline-none transition-all" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                      <input 
                        name="email"
                        type="email" 
                        value={formData.email} 
                        onChange={handleInfoChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ring-purple-500 outline-none transition-all" 
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Giới thiệu ngắn</label>
                    <textarea 
                      name="bio"
                      rows="4" 
                      value={formData.bio}
                      onChange={handleInfoChange}
                      placeholder="Chia sẻ đôi chút về bạn..." 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ring-purple-500 outline-none resize-none transition-all"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isUpdating}
                    className={`px-10 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${
                      isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {isUpdating ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT HỒ SƠ'}
                  </button>
                </form>
              )}

              {/* ... (Các Tab Security và History giữ nguyên như cũ) ... */}
              {activeTab === 'security' && (
                <form onSubmit={handlePasswordChange} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                    <span className="w-1.5 h-6 bg-purple-600 rounded-full mr-3"></span>
                    Đổi mật khẩu
                  </h2>
                  <div className="space-y-4 max-w-sm">
                    <input type="password" placeholder="Mật khẩu hiện tại" value={passwordData.currentPassword} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 ring-purple-500" onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} />
                    <input type="password" placeholder="Mật khẩu mới" value={passwordData.newPassword} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 ring-purple-500" onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} />
                    <input type="password" placeholder="Xác nhận mật khẩu mới" value={passwordData.confirmPassword} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 ring-purple-500" onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                    <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 shadow-lg active:scale-95 transition-all">THAY ĐỔI MẬT KHẨU</button>
                  </div>
                </form>
              )}

              {activeTab === 'history' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                    <span className="w-1.5 h-6 bg-purple-600 rounded-full mr-3"></span>
                    Bài viết đã đánh dấu
                  </h2>
                  {(() => {
                    const savedArticles = JSON.parse(localStorage.getItem('saved_articles') || '[]');
                    if (savedArticles.length === 0) {
                      return (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100 mt-4">
                          <div className="text-6xl mb-4 grayscale opacity-20">🔖</div>
                          <h3 className="text-lg font-bold text-gray-400">Danh sách trống</h3>
                          <p className="text-gray-400 text-sm mt-2">Bạn chưa lưu bài viết nào để xem lại.</p>
                          <button onClick={() => window.location.href='/'} className="mt-6 px-6 py-2 bg-purple-100 text-purple-700 rounded-full font-bold hover:bg-purple-200 transition-all text-sm">Khám phá bài viết ngay</button>
                        </div>
                      );
                    }
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedArticles.map((item, idx) => (
                          <div key={idx} onClick={() => window.location.href=`/article/${item.id}`} className="group flex flex-col sm:flex-row gap-4 border border-gray-100 rounded-2xl p-4 hover:shadow-xl transition-all cursor-pointer bg-white hover:border-purple-200">
                            {item.image_url && <img src={item.image_url} alt={item.title} className="w-full sm:w-28 h-40 sm:h-28 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />}
                            <div className="flex flex-col justify-between flex-1 py-1">
                              <div>
                                <span className="text-[9px] uppercase font-black tracking-widest text-purple-600 bg-purple-50 px-2 py-1 rounded inline-block mb-2">{item.category}</span>
                                <h4 className="font-bold text-sm text-gray-800 line-clamp-2 group-hover:text-purple-700 transition-colors">{item.title}</h4>
                              </div>
                              <div className="text-[10px] text-gray-400 font-medium mt-2">{item.created_at?.split(' ')[0] || 'Vừa xong'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
