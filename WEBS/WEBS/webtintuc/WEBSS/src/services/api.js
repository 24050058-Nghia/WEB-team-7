import axiosClient from '../api/axiosClient';

export const authApi = {
  login: (username, password) => {
    // Gọi API POST /login tới Backend
    return axiosClient.post('/login', { username, password });
  },
};

export const newsApi = {
  // Các hàm lấy tin tức của bạn để ở đây...
};