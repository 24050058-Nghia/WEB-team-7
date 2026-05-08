// src/pages/Dashboard/Statistics.jsx
export default function Statistics() {
  return (
    <div className="space-y-8">
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Hiệu suất bài viết của bạn</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-gray-200 shadow-sm border-l-4 border-l-blue-600">
          <p className="text-sm text-gray-500 font-bold uppercase">Tổng lượt đọc</p>
          <p className="text-3xl font-black mt-2">124,500</p>
        </div>
        {/* Copy các ô còn lại từ file cũ của bạn vào đây */}
      </div>
    </div>
  );
}
