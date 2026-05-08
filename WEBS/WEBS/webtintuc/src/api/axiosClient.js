import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5001/api', // Đảm bảo Backend của bạn đang chạy ở cổng 5001
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' // Đã thêm để khớp với cấu hình CORS Backend
  },
});

// --- 1. GẮN TOKEN VÀO HEADER ---
axiosClient.interceptors.request.use(
  (config) => {
    // Kiểm tra cả 2 loại key token có thể có
    const token = localStorage.getItem('token') || localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 2. XỬ LÝ DỮ LIỆU TRẢ VỀ ---
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về dữ liệu trực tiếp để Frontend dễ sử dụng
    return response.data;
  },
  (error) => {
    // Kiểm tra nếu lỗi là 401 (Hết hạn hoặc chưa đăng nhập)
    if (error.response && error.response.status === 401) {
      alert("Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!");

      // Xóa token cũ để dọn dẹp bộ nhớ
      localStorage.removeItem('token');

      // Chuyển hướng về trang đăng nhập
      window.location.href = '/login';
    }

    // Trả lỗi về để catch ở nơi gọi API (ví dụ Dashboard.jsx)
    return Promise.reject(error);
  }
);

export default axiosClient;