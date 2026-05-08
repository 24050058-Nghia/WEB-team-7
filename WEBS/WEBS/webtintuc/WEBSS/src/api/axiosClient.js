import axios from 'axios';

const axiosClient = axios.create({
  // URL này phải khớp với link ngrok đang chạy ở Terminal của bạn
  baseURL: 'https://tracy-poikilothermic-trancedly.ngrok-free.dev/api', 
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' // Vượt qua cảnh báo ngrok
  },
});

// THÊM MỚI Ở ĐÂY: Interceptor Request
// Chặn mọi request trước khi gửi đi để tự động gắn Token (nếu Admin đã đăng nhập)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// GIỮ NGUYÊN CỦA BẠN: Interceptor Response
// Giúp bạn lấy thẳng dữ liệu từ 'data', không cần dùng .data nhiều lần
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("Lỗi API:", error.response || error.message);
    
    // Tùy chọn nâng cao: Xử lý nếu Token hết hạn (Backend trả về lỗi 401)
    if (error.response && error.response.status === 401) {
       console.log("Token hết hạn hoặc không hợp lệ, vui lòng đăng nhập lại.");
       // localStorage.removeItem('admin_token');
       // window.location.href = '/login'; 
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;