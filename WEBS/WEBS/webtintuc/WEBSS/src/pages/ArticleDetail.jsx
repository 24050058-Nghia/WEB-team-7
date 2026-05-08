import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const API_BASE_URL = "https://tracy-poikilothermic-trancedly.ngrok-free.dev";

// --- DỮ LIỆU DỰ PHÒNG (FALLBACK) ---
const LOCAL_ARTICLES = [
  {
    id: "1",
    title: "Khám phá giao diện báo chí hiện đại 2026",
    summary: "Hệ thống đang kết nối dữ liệu. Nội dung này hiển thị để đảm bảo trải nghiệm người dùng không bị gián đoạn.",
    content: "<p>Báo chí hiện đại không chỉ là nơi cung cấp thông tin, mà còn là một trải nghiệm thị giác. Sự kết hợp giữa nghệ thuật sắp chữ (typography) và khoảng trắng (whitespace) tạo ra không gian đọc tinh tế, giúp độc giả tập trung tối đa vào nội dung cốt lõi.</p>",
    category: "CÔNG NGHỆ",
    author: "Ban Biên Tập",
    created_at: "2026-04-10 10:00:00",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070"
  }
];

const LOCAL_COMMENTS = [
  { id: 1, user_name: "Hoàng Tuấn", content: "Giao diện bài viết thiết kế rất đẹp và dễ đọc. Mong tòa soạn phát huy!", created_at: "2026-04-10 11:30:00" },
  { id: 2, user_name: "Minh Anh", content: "Bài viết rất hữu ích, cảm ơn tác giả.", created_at: "2026-04-10 12:15:00" }
];

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  
  // States cho bài viết
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // States cho User & Tương tác
  const [userToken, setUserToken] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // States cho Bình luận
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) setUserToken(token);
  }, []);

  // --- 1. LOGIC TẢI BÀI VIẾT (HYBRID: API -> FALLBACK) ---
  useEffect(() => {
    const fetchArticleDetail = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`${API_BASE_URL}/api/news/${id}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const data = res.data?.data || res.data;
        
        // NẾU CÓ DỮ LIỆU TỪ API THẬT
        if (data && data.id) {
          setArticle(data);
          // Lấy bình luận đi kèm bài viết (nếu Backend có trả về), không thì mảng rỗng
          setComments(data.comments || []);
        } else {
          throw new Error("API trả về nhưng thiếu dữ liệu bài viết");
        }
      } catch (err) {
        // NẾU API LỖI -> DÙNG DỮ LIỆU DỰ PHÒNG
        console.warn("Lỗi tải API bài viết, đang sử dụng dữ liệu dự phòng:", err.message);
        const fallbackData = LOCAL_ARTICLES.find(item => item.id === id) || LOCAL_ARTICLES[0];
        setArticle(fallbackData);
        setComments(LOCAL_COMMENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchArticleDetail();
  }, [id]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const checkAuthGuard = () => {
    if (!userToken) {
      showToast("🔒 Vui lòng đăng nhập để sử dụng tính năng này!");
      setTimeout(() => navigate('/login'), 1500);
      return false;
    }
    return true;
  };

  const handleInteraction = async (action) => {
    if (!checkAuthGuard()) return;

    if (action === 'share') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("🔗 Đã sao chép liên kết bài viết!");
      } catch {
        showToast("❌ Trình duyệt không hỗ trợ copy tự động.");
      }
      return;
    }

    if (action === 'save') {
      if (isSaving) return;
      setIsSaving(true);
      try {
        await axiosClient.post(
          `${API_BASE_URL}/api/user/saved-articles`, 
          { article_id: id },
          { headers: { 'Authorization': `Bearer ${userToken}` } }
        );
        setIsSaved(!isSaved);
        showToast(isSaved ? "Đã bỏ lưu bài viết." : "❤️ Đã lưu bài viết thành công!");
      } catch (error) {
        if (error.response?.status === 401) {
          showToast("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
          localStorage.removeItem('ACCESS_TOKEN');
          setUserToken(null);
          setTimeout(() => navigate('/login'), 1500);
        } else {
          // GIẢ LẬP UI NẾU LỖI API (Để Frontend dev không bị kẹt)
          setIsSaved(!isSaved); 
          showToast(isSaved ? "(Giả lập) Đã bỏ lưu." : "(Giả lập) ❤️ Đã lưu bài viết!");
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  // --- 2. LOGIC GỬI BÌNH LUẬN (HYBRID: API -> FALLBACK) ---
  const handleCommentSubmit = async (e) => {
    e.preventDefault(); 
    if (!checkAuthGuard()) return;
    if (!newComment.trim()) {
      showToast("⚠️ Vui lòng nhập nội dung bình luận.");
      return;
    }

    setIsSubmittingComment(true);
    try {
      // 1. GỌI API THẬT
      const response = await axiosClient.post(
        `${API_BASE_URL}/api/news/${id}/comments`, 
        { content: newComment },
        { headers: { 'Authorization': `Bearer ${userToken}` } }
      );

      // Nếu Backend trả về object bình luận vừa tạo (có id thật, thời gian thật):
      const createdComment = response.data?.data || response.data;
      
      // Đẩy vào đầu danh sách
      setComments([createdComment, ...comments]); 
      setNewComment(""); 
      showToast("✅ Đã gửi bình luận thành công!");

    } catch (error) {
       if (error.response?.status === 401) {
          showToast("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
          localStorage.removeItem('ACCESS_TOKEN');
          setUserToken(null);
          setTimeout(() => navigate('/login'), 1500);
        } else {
          // 2. FALLBACK KHI API LỖI HOẶC CHƯA CÓ BACKEND
          console.warn("Lỗi gọi API bình luận, chạy giả lập UI.");
          const fallbackCommentObj = {
            id: Date.now(),
            user_name: "Bạn (Local)",
            content: newComment,
            created_at: "Vừa xong"
          };
          setComments([fallbackCommentObj, ...comments]);
          setNewComment("");
          showToast("✅ (Giả lập) Đã gửi bình luận thành công!");
        }
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#fdfdfc] dark:bg-[#0a0a0a]"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!article) return <div className="text-center py-20">Không tìm thấy bài viết.</div>;

  return (
    <div className="min-h-screen bg-[#fdfdfc] dark:bg-[#0a0a0a] font-sans pb-24 relative">
      
      {/* KHUNG TOAST */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-gray-900 text-white px-6 py-3 shadow-xl text-[13px] font-medium tracking-wide">
          {toastMessage}
        </div>
      </div>

      <article className="container mx-auto px-4 sm:px-6 max-w-4xl pt-12 md:pt-20">
        
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-12 text-gray-400">
          <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-blue-600">{article.category || 'TIN TỨC'}</span>
        </div>

        {/* TIÊU ĐỀ */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold italic text-gray-900 dark:text-white leading-[1.15] mb-8 tracking-tight">
          {article.title}
        </h1>

        {/* THÔNG TIN TÁC GIẢ & THANH CÔNG CỤ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-y border-gray-200 dark:border-gray-800 mb-12">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center font-serif italic text-xl font-bold">
              {article.author ? article.author.charAt(0) : 'T'}
            </div>
            <div>
              <div className="text-[13px] font-bold text-gray-900 dark:text-white font-sans">{article.author || 'Tòa soạn'}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1">
                {article.created_at?.split(' ')[0] || 'Vừa cập nhật'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleInteraction('share')} 
              className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] border border-gray-200 dark:border-gray-800 hover:border-blue-600 hover:text-blue-600 transition-colors dark:text-gray-300"
            >
              Chia sẻ
            </button>
            <button 
              onClick={() => handleInteraction('save')} 
              disabled={isSaving} 
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] border transition-colors ${
                isSaved ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 dark:border-gray-800 hover:border-blue-600 hover:text-blue-600 dark:text-gray-300'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSaving ? 'Đang xử lý...' : (isSaved ? 'Đã lưu' : 'Lưu bài')}
            </button>
          </div>
          
        </div>

        {/* ẢNH BÌA */}
        {article.image_url && (
          <div className="mb-12 aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* NỘI DUNG CHÍNH */}
        <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none font-serif text-gray-800 dark:text-gray-300 leading-relaxed mb-16">
          <div className="font-bold italic text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-400 leading-snug">
            {article.summary}
          </div>
          <div dangerouslySetInnerHTML={{ __html: article.content || '<p>Nội dung chi tiết đang được cập nhật...</p>' }} />
        </div>

        {/* KHU VỰC BÌNH LUẬN */}
        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-serif font-bold italic text-gray-900 dark:text-white mb-8">
            Bình luận ({comments.length})
          </h3>

          {/* Form nhập bình luận */}
          <form onSubmit={handleCommentSubmit} className="mb-12">
            <div className="relative">
              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onClick={() => checkAuthGuard()} 
                placeholder="Chia sẻ góc nhìn của bạn về bài viết này..."
                className="w-full min-h-[120px] p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-blue-600 dark:focus:border-blue-600 transition-colors text-gray-900 dark:text-white resize-y"
              ></textarea>
              <div className="flex justify-end mt-4">
                <button 
                  type="submit" 
                  disabled={isSubmittingComment}
                  className={`px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-colors ${isSubmittingComment ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                </button>
              </div>
            </div>
          </form>

          {/* Danh sách bình luận */}
          <div className="space-y-8">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center font-bold text-gray-500">
                    {comment.user_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <h4 className="font-bold text-[14px] text-gray-900 dark:text-white">{comment.user_name}</h4>
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                        {comment.created_at?.split(' ')[0] || comment.created_at}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8 text-[14px] italic">
                Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ ý kiến!
              </div>
            )}
          </div>
        </div>

      </article>
    </div>
  );
}

export default ArticleDetail;