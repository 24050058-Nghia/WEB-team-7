import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const API_BASE_URL = "http://localhost:5001";

// BỘ 15 BÀI BÁO MẪU
const LOCAL_ARTICLES = [
  {
    id: 1,
    title: "Lộ diện công nghệ AI mới của Google năm 2026: Gemini 3 Flash",
    summary: "Gemini 3 Flash vừa ra mắt với khả năng xử lý hình ảnh và video siêu tốc, hỗ trợ lập trình viên tối đa.",
    content: `
      <p>Trong sự kiện công nghệ sáng nay tại California, Google đã chính thức giới thiệu thế hệ AI tiếp theo mang tên Gemini 3 Flash. Đây được xem là bước tiến lớn nhất của gã khổng lồ tìm kiếm trong việc thương mại hóa AI ở quy mô cực lớn, nhắm thẳng vào hiệu năng và tốc độ xử lý.</p>
      <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000" style="width:100%; border-radius: 20px; margin: 30px 0; box-shadow: 0 20px 40px rgba(0,0,0,0.1);"/>
      <p>Điểm đáng chú ý nhất là khả năng đọc hiểu code và xử lý video thời gian thực cực nhanh. Với Gemini 3 Flash, lập trình viên có thể yêu cầu AI review toàn bộ repo hàng triệu dòng code chỉ trong vài giây. Các lỗi logic phức tạp hay các lỗ hổng bảo mật tiềm ẩn sẽ được phát hiện ngay lập tức với độ chính xác lên tới 98%, giúp tiết kiệm hàng nghìn giờ làm việc thủ công.</p>
      <h3 style="color: #1e293b; margin-top: 32px;">Cuộc cách mạng trong cộng đồng lập trình</h3>
      <p>Không chỉ dừng lại ở việc fix bug, Gemini 3 còn có khả năng tự động viết unit test và tài liệu hướng dẫn (documentation) cho toàn bộ dự án. Điều này giúp giảm thiểu 40% thời gian phát triển phần mềm, cho phép các startup đưa sản phẩm ra thị trường nhanh hơn bao giờ hết. Hệ thống này cũng được tích hợp sâu vào các IDE phổ biến như VS Code và Cursor, biến nó thành một cộng sự thực thụ thay vì chỉ là một công cụ tra cứu.</p>
      <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000" style="width:100%; border-radius: 20px; margin: 30px 0;"/>
      <p>Ông Sundar Pichai, CEO của Google, khẳng định: "Chúng tôi không chỉ xây dựng một mô hình ngôn ngữ lớn, chúng tôi đang xây dựng một nền tảng trí tuệ có thể hiểu và tương tác với thế giới thực thông qua video và âm thanh theo cách tự nhiên nhất."</p>
      <div style="background: #eff6ff; padding: 24px; border-radius: 16px; border-left: 4px solid #2563eb; margin: 24px 0;">
         <h4 style="margin-top: 0; color: #1d4ed8;">Những thông số ấn tượng của Gemini 3 Flash:</h4>
         <ul style="line-height: 2;">
            <li>Xử lý đa phương thức (hình ảnh, âm thanh, video) đồng thời với độ trễ dưới 50ms.</li>
            <li>Cửa sổ ngữ cảnh lên đến 2 triệu token, tương đương khả năng ghi nhớ toàn bộ mã nguồn của một hệ điều hành nhỏ.</li>
            <li>Tiết kiệm 70% điện năng tiêu thụ, giúp các trung tâm dữ liệu vận hành xanh hơn.</li>
         </ul>
      </div>
    `,
    category: "CÔNG NGHỆ",
    author: "Hoàng Triệu",
    created_at: "2026-04-12 08:30:00",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000",
    views: 1024
  },
  {
    id: 2,
    title: "Du lịch nội địa bùng nổ: Phú Quốc và Đà Nẵng 'cháy vé' kỳ nghỉ 30/4",
    summary: "Các tour du lịch biển tại Đà Nẵng và Phú Quốc đã cháy vé từ sớm, dự báo một mùa du lịch bội thu cho thị trường trong nước.",
    content: `
      <p>Kỳ nghỉ lễ 30/4 và 1/5 năm nay kéo dài 5 ngày đã tạo điều kiện lý tưởng cho người dân lên kế hoạch du lịch dài ngày. Theo ghi nhận của các hãng hàng không và công ty lữ hành lớn như Vietravel và Saigontourist, lượng khách đặt chỗ đã tăng vọt 150% so với cùng kỳ năm ngoái.</p>
      <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000" style="width:100%; border-radius: 20px; margin: 30px 0;"/>
      <p>Phú Quốc vẫn giữ vững ngôi vương là điểm đến được săn đón nhất. Công suất phòng tại các khu nghỉ dưỡng cao cấp ven biển đã đạt ngưỡng tối đa. Du khách năm nay không chỉ tắm biển mà còn hào hứng tham gia các hoạt động bảo tồn san hô và trekking rừng quốc gia - một xu hướng du lịch bền vững đang lên ngôi.</p>
      <h3 style="color: #1e293b; margin-top: 32px;">Đà Nẵng - Tâm điểm của những lễ hội rực rỡ</h3>
      <p>Trong khi đó, "thành phố của những cây cầu" Đà Nẵng lại quyến rũ du khách bằng chuỗi Lễ hội Pháo hoa Quốc tế (DIFF) hoành tráng. Các khách sạn dọc sông Hàn đã được đặt kín chỗ từ nhiều tuần trước. Không khí lễ hội bao trùm khắp các nẻo đường, từ các quán ăn hải sản sầm uất đến những bãi cát trắng mịn của biển Mỹ Khê.</p>
      <img src="https://images.unsplash.com/photo-1559592481-74153c49ec18?q=80&w=2000" style="width:100%; border-radius: 20px; margin: 30px 0;"/>
      <blockquote style="border-left: 5px solid #2563eb; padding-left: 20px; font-style: italic; color: #475569; margin: 30px 0;">
        "Chúng tôi đã tăng cường thêm 20 chuyến bay mỗi ngày đến các điểm du lịch trọng điểm nhưng vẫn chưa đủ đáp ứng nhu cầu cực lớn của người dân. Đây thực sự là tín hiệu đáng mừng cho sự phục hồi hoàn toàn của ngành du lịch Việt Nam." - Đại diện một hãng hàng không chia sẻ.
      </blockquote>
      <p>Bên cạnh đó, các địa danh như Hội An, Quy Nhơn và Nha Trang cũng ghi nhận lượng khách tăng đột biến, hứa hẹn một kỳ nghỉ lễ nhộn nhịp và tràn đầy sức sống.</p>
    `,
    category: "DU LỊCH",
    author: "Thành Nghĩa",
    created_at: "2026-04-09 10:00:00",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000",
    views: 120
  }
];

// --- HÀM TẠO BÌNH LUẬN NGẪU NHIÊN CHO TÒA SOẠN ---
const generateRandomComments = () => {
    const names = ["Minh Tuấn", "Thu Hà", "Thành Vinh", "Hoàng Nam", "Bảo Châu", "Gia Khiêm", "Vân Anh", "Quốc Bảo", "Mai Phương", "Đức Huy", "Ngọc Diệp", "Hữu Phước"];
    const phrases = [
        "Bài viết rất hay, cảm ơn tác giả đã chia sẻ thông tin kịp thời!",
        "Thông tin rất hữu ích, mình đã học được nhiều điều mới từ vấn đề này.",
        "Mong có thêm nhiều bài viết phân tích sâu như thế này nữa.",
        "Rất đúng với tình hình thực tế hiện nay, cảm ơn tòa soạn.",
        "Tuyệt vời, thiết kế giao diện web xem tin tức này đẹp và mượt quá!",
        "Mình rất thích cách trình bày hình ảnh và nội dung của trang báo này.",
        "Một góc nhìn rất thú vị, mình sẽ chia sẻ bài viết này cho bạn bè."
    ];
    
    const count = Math.floor(Math.random() * 3) + 2; 
    const shuffledNames = [...names].sort(() => 0.5 - Math.random());
    const shuffledPhrases = [...phrases].sort(() => 0.5 - Math.random());
    
    return Array.from({ length: count }).map((_, i) => ({
        id: Date.now() + i,
        user_name: shuffledNames[i],
        content: shuffledPhrases[i],
        created_at: `${Math.floor(Math.random() * 23)} giờ trước`,
        replies: []
    }));
};

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(localStorage.getItem('ACCESS_TOKEN') || localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null); 
  const [toastMessage, setToastMessage] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); 
  const [replyContent, setReplyContent] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({ id: payload.id, username: payload.username, role: payload.role });
      } catch (e) {
        setCurrentUser(null);
      }
    }
  }, [userToken]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (article) {
      const savedArticles = JSON.parse(localStorage.getItem('saved_articles') || '[]');
      setIsSaved(savedArticles.some(item => String(item.id) === String(article.id)));
    }
  }, [article]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSaveArticle = () => {
    if (!userToken) {
      showToast("🔒 Vui lòng đăng nhập để lưu bài viết!");
      return;
    }
    const savedArticles = JSON.parse(localStorage.getItem('saved_articles') || '[]');
    if (isSaved) {
      const newSaved = savedArticles.filter(item => String(item.id) !== String(article.id));
      localStorage.setItem('saved_articles', JSON.stringify(newSaved));
      setIsSaved(false);
      showToast("Đã bỏ lưu bài viết");
    } else {
      savedArticles.unshift({ ...article });
      localStorage.setItem('saved_articles', JSON.stringify(savedArticles));
      setIsSaved(true);
      showToast("Đã lưu bài viết");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/news/${id}`);
        const data = Array.isArray(res) ? res[0] : (res.data || res);
        const fallback = LOCAL_ARTICLES.find(item => String(item.id) === String(id));
        setArticle({
          ...data,
          content: (data.content && data.content.length > 200) ? data.content : (fallback?.content || data.content),
          image_url: (data.image_url && !data.image_url.includes('placeholder')) ? data.image_url : (fallback?.image_url || data.image_url)
        });
        
        // Load comments
        const commentData = await axiosClient.get(`/news/${id}/comments`);
        setComments(Array.isArray(commentData) && commentData.length > 0 ? commentData : generateRandomComments());
      } catch (err) {
        const fallback = LOCAL_ARTICLES.find(item => String(item.id) === String(id)) || LOCAL_ARTICLES[0];
        setArticle(fallback);
        setComments(generateRandomComments());
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleCommentSubmit = async (e, parentId = null) => {
    if (e) e.preventDefault();
    const token = localStorage.getItem('token') || localStorage.getItem('ACCESS_TOKEN');
    if (!token) {
      showToast("🔒 Vui lòng đăng nhập để bình luận!");
      return;
    }
    const content = parentId ? replyContent : newComment;
    if (!content.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await axiosClient.post(`/news/${id}/comments`, { 
        content: content.trim(),
        parent_id: parentId
      });
      const newCommentData = res.comment || res;
      
      if (parentId) {
        setComments(prev => prev.map(c => {
          if (c.id === parentId) return { ...c, replies: [...(c.replies || []), newCommentData] };
          return c;
        }));
        setReplyContent("");
        setReplyingTo(null);
      } else {
        setComments(prev => [newCommentData, ...prev]);
        setNewComment("");
      }
      showToast("✅ Thành công!");
    } catch (err) {
      showToast("❌ Lỗi gửi bình luận");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Xóa bình luận này?")) return;
    try {
      await axiosClient.delete(`/comments/${commentId}`);
      setComments(prev => {
        // Xóa bình luận cha hoặc lọc trong replies
        return prev.filter(c => c.id !== commentId).map(c => ({
          ...c,
          replies: (c.replies || []).filter(r => r.id !== commentId)
        }));
      });
      showToast("✅ Đã xóa");
    } catch (err) {
      showToast("❌ Lỗi xóa");
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title || "Tin tức";
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
    else if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank', 'width=600,height=400');
    else if (platform === 'copy') { navigator.clipboard.writeText(url); showToast("🔗 Đã sao chép!"); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif italic">Đang tải...</div>;
  if (!article) return <div className="text-center py-20 font-bold">404 - Không tìm thấy bài viết.</div>;

  return (
    <div className="min-h-screen bg-[#fdfdfc] dark:bg-[#0d0d0d] font-sans transition-colors duration-500 relative pb-20">
      <div className="fixed top-0 left-0 h-1 bg-blue-600 z-[1000]" style={{ width: `${scrollProgress}%` }}></div>

      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-8 py-3 rounded-full shadow-2xl font-black uppercase text-[10px] tracking-widest animate-in fade-in slide-in-from-top-4">
          {toastMessage}
        </div>
      )}

      <article className="container mx-auto px-6 lg:px-0 pt-16 max-w-[800px] animate-fade-in-up">
        <div className="mb-10 flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
           <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
           <span className="w-1 h-1 rounded-full bg-gray-300"></span>
           <span className="text-blue-600">{article?.category}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black dark:text-white mb-10 leading-[1.1] font-serif tracking-tight">{article?.title}</h1>

        <div className="flex justify-between items-center py-8 border-y border-black/5 dark:border-white/5 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center font-black text-xl rounded-full shadow-lg">{article?.author?.charAt(0)}</div>
            <div>
              <div className="font-black text-[11px] dark:text-white uppercase tracking-widest">{article?.author}</div>
              <div className="flex items-center gap-3 mt-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đăng ngày {article?.created_at}</div>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  {article?.views?.toLocaleString() || 0} lượt xem
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleSaveArticle} className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${isSaved ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-white/5'}`}>
            {isSaved ? "Đã lưu ✓" : "Lưu bài +"}
          </button>
        </div>

        <div className="mb-12 rounded-3xl overflow-hidden premium-shadow">
          <img src={article.image_url} alt={article.title} className="w-full object-cover" />
        </div>

        <div className="prose prose-xl dark:prose-invert max-w-none">
          <div className="font-bold text-2xl mb-12 text-gray-500 dark:text-gray-400 leading-relaxed italic border-l-4 border-blue-600 pl-8 font-serif">{article?.summary}</div>
          <div className="leading-[1.8] text-[19px] dark:text-gray-300 font-medium space-y-6" dangerouslySetInnerHTML={{ __html: article?.content }} />
        </div>

        {/* SHARE */}
        <div className="mt-16 pt-10 border-t border-black/5 flex justify-between items-center">
             <div className="flex gap-2">
                 <button onClick={() => handleShare('facebook')} className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center">f</button>
                 <button onClick={() => handleShare('twitter')} className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center">t</button>
                 <button onClick={() => handleShare('copy')} className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center">🔗</button>
             </div>
        </div>

        {/* COMMENTS */}
        <div className="mt-20 pt-10 border-t border-black/5">
          <h3 className="text-3xl font-black mb-10 font-serif">Bình luận ({comments.length})</h3>
          
          <form onSubmit={handleCommentSubmit} className="mb-12">
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={userToken ? "Chia sẻ ý kiến..." : "Đăng nhập để bình luận"}
              disabled={!userToken}
              className="w-full p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-black/5 outline-none focus:border-blue-500 transition-all min-h-[120px]"
            />
            <div className="flex justify-end mt-4">
                <button type="submit" disabled={isSubmittingComment || !userToken} className="px-8 py-3 bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest rounded-full">
                  Gửi thảo luận
                </button>
            </div>
          </form>

          <div className="space-y-10">
            {comments.map((c) => (
              <div key={c.id} className="group">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex-shrink-0 flex items-center justify-center font-black">{c?.user_name?.charAt(0)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-sm uppercase">{c?.user_name}</span>
                      <div className="flex gap-4">
                         <button onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)} className="text-[9px] font-black uppercase text-blue-600">Trả lời</button>
                         {currentUser && (currentUser.id === c.user_id || currentUser.role === 1) && (
                            <button onClick={() => handleDeleteComment(c.id)} className="text-[9px] font-black uppercase text-red-400">Xóa</button>
                         )}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{c.content}</p>

                    {replyingTo === c.id && (
                      <div className="mt-2 mb-4">
                        <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} className="w-full p-4 bg-gray-100 rounded-xl text-sm outline-none" placeholder="Nhập câu trả lời..." />
                        <button onClick={() => handleCommentSubmit(null, c.id)} className="mt-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase">Gửi</button>
                      </div>
                    )}

                    {/* Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="mt-4 ml-6 pl-6 border-l-2 border-black/5 space-y-6">
                        {c.replies.map(r => (
                          <div key={r.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-[10px] font-black">{r.user_name?.charAt(0)}</div>
                            <div className="flex-1">
                               <div className="flex justify-between items-center mb-1">
                                  <span className="font-black text-[11px] uppercase">{r.user_name}</span>
                                  {currentUser && (currentUser.id === r.user_id || currentUser.role === 1) && (
                                    <button onClick={() => handleDeleteComment(r.id)} className="text-[8px] font-black uppercase text-red-400">Xóa</button>
                                  )}
                               </div>
                               <p className="text-xs text-gray-500">{r.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
      
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-10 right-10 p-4 bg-white dark:bg-[#111] shadow-2xl rounded-full border border-black/5 transition-all ${scrollProgress > 20 ? 'opacity-100' : 'opacity-0'}`}>
        ↑
      </button>
    </div>
  );
}

export default ArticleDetail;
