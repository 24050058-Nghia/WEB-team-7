// src/pages/Dashboard/CreatePost.jsx
import React, { useState } from 'react';

export default function CreatePost() {
  const [article, setArticle] = useState({ title: '', subtitle: '', sapo: '', thumbnail: '', source: '', content: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Đã xuất bản thành công!");
  };

  return (
    <div className="bg-white p-8 border border-gray-200 shadow-sm">
      <h3 className="text-xl font-black uppercase tracking-tighter mb-6 border-b pb-4">Soạn thảo bài báo</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Copy toàn bộ nội dung <form> từ file cũ vào đây */}
      </form>
    </div>
  );
}