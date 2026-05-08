import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * GIẢI PHÁP DỨT ĐIỂM: Sử dụng đường dẫn tuyệt đối bắt đầu từ /src.
 * Cách này giúp Vite truy cập trực tiếp vào file api/axiosClient.js 
 * bất kể file AdminEditor.jsx nằm sâu bao nhiêu cấp thư mục.
 */
import axiosClient from '/src/api/axiosClient';

const AdminEditor = () => {
  // 1. Quản lý trạng thái các trường dữ liệu
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('1');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Hàm xử lý gửi bài viết
  const handlePublish = async () => {
    // Kiểm tra dữ liệu đầu vào cơ bản
    if (!title.trim() || !content.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
      return;
    }

    setIsSubmitting(true);

    // Chuẩn bị dữ liệu gửi đi (Mapping đúng với Backend)
    const postData = {
      title: title,
      content: content,
      image_url: imageUrl,
      cat_id: category,
    };

    try {
      /**
       * SỬ DỤNG AXIOS CLIENT:
       * Request này sẽ tự động mang theo Token trong Header Authorization
       * nhờ vào cấu trúc Interceptor chúng ta đã thiết lập.
       */
      await axiosClient.post('/news', postData);

      alert("✅ Xuất bản bài viết thành công!");

      // Reset form sau khi thành công
      setTitle('');
      setContent('');
      setImageUrl('');
      setCategory('1');

    } catch (error) {
      // Lấy thông báo lỗi cụ thể từ server (ví dụ: Token expired, Validation error)
      const errorMsg = error.response?.data?.message || "Lỗi khi kết nối đến server!";
      alert("❌ " + errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-editor-container p-6 bg-white rounded shadow-lg max-w-5xl mx-auto my-10">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b pb-2 text-center uppercase">
        Soạn thảo bài báo mới
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Tít chính (Tiêu đề):</label>
          <input
            type="text"
            className="w-full p-2.5 border rounded focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề bài báo..."
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Chuyên mục:</label>
          <select
            className="w-full p-2.5 border rounded focus:ring-2 focus:ring-blue-400 outline-none transition-all cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="1">Xã Hội</option>
            <option value="5">Kinh Tế</option>
            <option value="3">Giải Trí</option>
            <option value="2">Công Nghệ</option>
            <option value="6">Đời Sống</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">URL Ảnh đại diện (Thumbnail):</label>
        <input
          type="text"
          className="w-full p-2.5 border rounded focus:ring-2 focus:ring-blue-400 outline-none transition-all"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Dán link ảnh (https://...)"
        />
      </div>

      <div className="mb-24">
        <label className="block mb-2 font-semibold text-gray-700">Nội dung chi tiết:</label>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder="Viết nội dung bài báo chi tiết tại đây..."
          className="h-80"
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['link', 'image'],
              ['clean']
            ],
          }}
        />
      </div>

      <div className="flex justify-center border-t pt-6">
        <button
          className={`px-12 py-3 rounded-full font-bold text-white transition-all transform active:scale-95 ${isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }`}
          onClick={handlePublish}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              ĐANG XỬ LÝ...
            </span>
          ) : "XUẤT BẢN BÀI VIẾT"}
        </button>
      </div>
    </div>
  );
};

export default AdminEditor;