import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; 

// --- DỮ LIỆU DỰ PHÒNG (Sẽ bị ẩn nếu API có dữ liệu thật) ---
const LOCAL_ARTICLES = [
  {
    id: "1", 
    title: "Khám phá giao diện báo chí hiện đại 2026",
    summary: "Hệ thống đang kết nối dữ liệu. Nội dung này hiển thị để đảm bảo trải nghiệm người dùng không bị gián đoạn.",
    category: "CÔNG NGHỆ",
    created_at: "2026-04-10 10:00:00",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070" 
  },
  {
    id: "2",
    title: "Thị trường Bất động sản quý II/2026",
    summary: "Làn sóng đầu tư mới đổ bộ vào phân khúc căn hộ cao cấp và xu hướng chuyển dịch ra ngoại ô thành phố.",
    category: "THỊ TRƯỜNG",
    created_at: "2026-04-09 14:30:00",
    image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070" 
  },
  {
    id: "3",
    title: "Nghệ thuật số lên ngôi trong kỷ nguyên AI",
    summary: "Các triển lãm tranh sử dụng trí tuệ nhân tạo đang thu hút hàng ngàn lượt khách tham quan mỗi ngày.",
    category: "GIẢI TRÍ",
    created_at: "2026-04-08 09:15:00",
    image_url: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=2070" 
  },
  {
    id: "4",
    title: "Cập nhật xu hướng kinh tế toàn cầu",
    summary: "Những thay đổi đáng chú ý trong chính sách tiền tệ và ảnh hưởng đến thị trường xuất nhập khẩu.",
    category: "KINH TẾ",
    created_at: "2026-04-07 16:45:00",
    image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a223690?q=80&w=2070" 
  },
  {
    id: "5",
    title: "Đỉnh cao mới của kiến trúc xanh giữa lòng đô thị",
    summary: "Các tòa nhà với thiết kế phủ xanh toàn bộ bề mặt đang trở thành chuẩn mực mới cho quy hoạch đô thị tương lai.",
    category: "ĐỜI SỐNG",
    created_at: "2026-04-06 10:00:00",
    image_url: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070"
  }
];

const CATEGORY_DEFAULT_IMAGES = {
  'XÃ HỘI': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
  'CÔNG NGHỆ': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'GIẢI TRÍ': 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?auto=format&fit=crop&w=1200&q=80',
  'KINH TẾ': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  'THỊ TRƯỜNG': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
  'BẤT ĐỘNG SẢN': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'
};

const GLOBAL_FALLBACK = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";
const API_BASE_URL = "https://tracy-poikilothermic-trancedly.ngrok-free.dev";

function Home() {
  const [searchParams] = useSearchParams();
  const catQuery = searchParams.get('cat'); 
  const searchQuery = searchParams.get('search'); 
  
  const [articles, setArticles] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [activeCategory, setActiveCategory] = useState('TẤT CẢ');
  
  const categories = ['TẤT CẢ', 'XÃ HỘI', 'CÔNG NGHỆ', 'GIẢI TRÍ', 'KINH TẾ', 'THỊ TRƯỜNG', 'BẤT ĐỘNG SẢN'];

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`${API_BASE_URL}/api/news`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const data = res.data?.data || res.data || res;
        
        const apiData = Array.isArray(data) ? data : [];
        
        // LOGIC MỚI: Chỉ dùng dữ liệu thật nếu API trả về có bài viết
        if (apiData.length > 0) {
          setArticles(apiData);
        } else {
          // Nếu API không lỗi nhưng trả về mảng rỗng thì dùng dữ liệu giả để tránh trang trống
          console.log("API không có dữ liệu, sử dụng dữ liệu giả.");
          setArticles(LOCAL_ARTICLES);
        }

      } catch (err) {
        // LOGIC MỚI: API lỗi thì dùng dữ liệu giả
        console.error("Lỗi kết nối API, sử dụng dữ liệu giả:", err);
        setArticles(LOCAL_ARTICLES);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    setActiveCategory(catQuery ? catQuery.toUpperCase() : 'TẤT CẢ');
  }, [catQuery]);

  const normalizeString = (str) => {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
  };

  const getArticleImage = (item) => {
    if (!item) return GLOBAL_FALLBACK;
    const imagePath = item.image_url || item.thumbnail;
    if (imagePath) {
      if (imagePath.startsWith('http')) return imagePath;
      return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    }
    const matchedKey = Object.keys(CATEGORY_DEFAULT_IMAGES).find(
      key => normalizeString(key) === normalizeString(item.category)
    );
    return matchedKey ? CATEGORY_DEFAULT_IMAGES[matchedKey] : GLOBAL_FALLBACK;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Đang cập nhật';
    try {
      const safeDateString = dateString.replace(' ', 'T');
      const dateObj = new Date(safeDateString);
      if (isNaN(dateObj.getTime())) return 'Đang cập nhật';
      return dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch (e) {
      return 'Đang cập nhật';
    }
  };

  // Hàm lấy tin theo Category để render Section
  const getArticlesByCat = (catName, limit = 4) => {
    return articles
      .filter(item => normalizeString(item.category) === normalizeString(catName))
      .slice(0, limit);
  };

  const filteredNews = useMemo(() => {
    const safeArticles = Array.isArray(articles) ? articles : [];
    
    let result = activeCategory === 'TẤT CẢ' ? safeArticles : safeArticles.filter(item => normalizeString(item.category) === normalizeString(activeCategory));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => (item.title && item.title.toLowerCase().includes(q)) || (item.summary && item.summary.toLowerCase().includes(q)));
    }
    return result;
  }, [articles, activeCategory, searchQuery]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-[3px] border-rose-600 border-t-transparent rounded-none animate-spin"></div>
        <span className="font-serif italic text-rose-600 text-lg tracking-[0.2em] animate-pulse">TINTUC24H đang cập nhật...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] transition-colors duration-500 font-sans">
      
      {/* 1. CATEGORY NAV */}
      <nav className="sticky top-0 md:top-[72px] z-30 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-900 shadow-sm dark:shadow-none transition-colors duration-500">
        <div className="container mx-auto px-6 py-4 flex gap-6 overflow-x-auto no-scrollbar items-center justify-start md:justify-center">
          {categories.map(cat => (
            <Link 
              key={cat}
              to={cat === 'TẤT CẢ' ? '/' : `/?cat=${cat}`}
              className={`text-[10px] font-black tracking-[0.25em] transition-all duration-300 whitespace-nowrap px-6 py-2.5 rounded-none uppercase border ${
                activeCategory === cat 
                  ? 'bg-rose-600 text-white border-rose-600 shadow-[0_8px_20px_rgba(225,29,72,0.25)] scale-105' 
                  : 'text-gray-500 border-transparent hover:text-rose-600 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50/50 dark:hover:bg-gray-900/50'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </nav>

      {/* 1.5. NEWS TICKER */}
      <div className="bg-[#111] border-b border-black overflow-hidden relative z-20">
        <div className="max-w-screen-2xl mx-auto px-6 h-12 flex items-center">
          <div className="relative z-30 bg-[#111] pr-8 flex items-center gap-3 h-full shadow-[20px_0_20px_-10px_rgba(17,17,17,1)]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-none h-2 w-2 bg-red-600"></span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-white whitespace-nowrap">
              Tin Mới Nóng:
            </span>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <div className="animate-marquee flex gap-12 items-center pr-12 hover:[animation-play-state:paused]">
              {articles.slice(0, 10).map((art, index) => (
                <div key={`ticker-1-${art.id || index}-${index}`} className="flex items-center shrink-0 gap-12">
                  <Link 
                    to={`/article/${art.id}`}
                    className="text-[13px] font-sans font-medium text-gray-300 tracking-wide hover:text-blue-400 transition-colors whitespace-nowrap"
                  >
                    {art.title || 'Đang cập nhật tiêu đề...'}
                  </Link>
                  <span className="text-gray-700 text-xs font-sans">/</span>
                </div>
              ))}
              {articles.slice(0, 10).map((art, index) => (
                <div key={`ticker-2-${art.id || index}-${index}`} className="flex items-center shrink-0 gap-12">
                  <Link 
                    to={`/article/${art.id}`}
                    className="text-[13px] font-sans font-medium text-gray-300 tracking-wide hover:text-blue-400 transition-colors whitespace-nowrap"
                  >
                    {art.title || 'Đang cập nhật tiêu đề...'}
                  </Link>
                  <span className="text-gray-700 text-xs font-sans">/</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-16 max-w-7xl">
        
        {/* 2. HERO SECTION */}
        {!searchQuery && activeCategory === 'TẤT CẢ' && filteredNews.length > 0 && (
          <section className="mb-24 lg:mb-32">
            <Link to={`/article/${filteredNews[0].id}`} className="group relative block overflow-hidden rounded-none bg-white dark:bg-[#111] shadow-2xl transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              <div className="grid lg:grid-cols-12 min-h-[500px] lg:min-h-[600px]">
                
                {/* Image Side */}
                <div className="lg:col-span-7 relative overflow-hidden bg-gray-900 order-1 lg:order-none min-h-[300px]">
                  <img 
                    src={getArticleImage(filteredNews[0])} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105 opacity-95 group-hover:opacity-100" 
                    alt="Hero Article" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black/40 lg:to-transparent"></div>
                </div>

                {/* Content Side */}
                <div className="lg:col-span-5 p-8 md:p-12 lg:p-16 flex flex-col justify-center border-l border-gray-100 dark:border-gray-800 relative order-2 lg:order-none z-10">
                  <div className="absolute top-0 left-0 w-1.5 h-24 bg-rose-600 -translate-y-1/2 rounded-none hidden lg:block"></div>
                  
                  <span className="bg-rose-600 text-white px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase mb-6 inline-block">Tin Nổi Bật</span>
                  
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold italic leading-[1.25] mb-8 group-hover:text-rose-600 transition-colors dark:text-white tracking-tight text-gray-900">
                    {filteredNews[0].title || 'Chưa có tiêu đề'}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed font-serif italic mb-10 line-clamp-3 opacity-90">
                    {filteredNews[0].summary || 'Đang cập nhật nội dung tóm tắt...'}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-6 group/btn cursor-pointer">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-800 dark:text-gray-200">Khám phá nội dung</span>
                    <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-800 group-hover/btn:bg-rose-600 transition-all duration-500"></div>
                    <div className="w-12 h-12 rounded-none border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover/btn:bg-rose-600 group-hover/btn:border-rose-600 group-hover/btn:text-white transition-all duration-500 text-xl shadow-sm">→</div>
                  </div>
                </div>

              </div>
            </Link>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: MAIN FEED (8 COLUMNS) */}
          <div className="lg:col-span-8">
            <section>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b-2 border-rose-600 pb-2">
                <div className="space-y-1">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold dark:text-white italic text-gray-900 uppercase">
                    {searchQuery ? `Kết quả: "${searchQuery}"` : 'Thời sự mới nhất'}
                  </h3>
                </div>
                <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] pb-1">
                  {filteredNews.length} Bài viết
                </div>
              </div>

              {filteredNews.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-gray-300 dark:border-gray-800 bg-white/50 dark:bg-[#111]/50 shadow-sm">
                   <p className="font-serif italic text-xl text-gray-500">Không tìm thấy nội dung phù hợp...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                  {filteredNews.slice(searchQuery || activeCategory !== 'TẤT CẢ' ? 0 : 1, 5).map((item, index) => (
                    <article key={item.id || index} className="group flex flex-col h-full bg-transparent">
                      <Link to={`/article/${item.id}`} className="relative aspect-video overflow-hidden rounded-lg mb-4 shadow-sm border border-gray-100 dark:border-gray-900 block bg-gray-100">
                        <img 
                          src={getArticleImage(item)} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" 
                          alt={item.title || 'Hình ảnh bài viết'} 
                        />
                      </Link>

                      <div className="flex-1 flex flex-col">
                        <Link to={`/article/${item.id}`} className="block mb-2">
                          <h4 className="text-xl font-serif font-bold leading-tight text-gray-900 group-hover:text-rose-600 transition-colors dark:text-white line-clamp-2">
                            {item.title || 'Chưa có tiêu đề'}
                          </h4>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
                          {item.summary || 'Đang cập nhật nội dung tóm tắt...'}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">
                             {formatDate(item.created_at)}
                           </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* SECTION: THỜI SỰ / CÔNG NGHỆ / KINH TẾ (Dynamic Sections) */}
            {activeCategory === 'TẤT CẢ' && !searchQuery && (
              <div className="mt-20 space-y-24">
                {[
                  { name: 'CÔNG NGHỆ', color: 'border-blue-600' },
                  { name: 'KINH TẾ', color: 'border-emerald-600' },
                  { name: 'GIẢI TRÍ', color: 'border-purple-600' }
                ].map((section) => {
                  const sectionArts = getArticlesByCat(section.name);
                  if (sectionArts.length === 0) return null;

                  return (
                    <section key={section.name}>
                      <div className={`flex justify-between items-end border-b-2 ${section.color} mb-8 pb-2`}>
                        <h2 className="text-2xl font-bold uppercase text-gray-900 dark:text-white">{section.name}</h2>
                        <Link to={`/?cat=${section.name}`} className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-rose-600">Xem thêm +</Link>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {sectionArts.map((art, idx) => (
                          <div key={art.id || idx}>
                            {idx === 0 ? (
                              <Link to={`/article/${art.id}`} className="group block">
                                <img src={getArticleImage(art)} className="w-full h-48 object-cover rounded-lg mb-4" alt="Main" />
                                <h3 className="text-xl font-bold leading-tight group-hover:text-rose-600 dark:text-white">{art.title}</h3>
                              </Link>
                            ) : (
                              <Link to={`/article/${art.id}`} className="flex gap-4 group pt-6 mt-6 border-t border-gray-100 dark:border-gray-900">
                                <img src={getArticleImage(art)} className="w-20 h-20 object-cover rounded flex-shrink-0" alt="Thumb" />
                                <h3 className="font-bold text-sm leading-snug group-hover:text-rose-600 dark:text-white line-clamp-2">{art.title}</h3>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: SIDEBAR (4 COLUMNS) - PHÁT TRIỂN TỪ INPUT HTML */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="bg-white dark:bg-[#111] p-8 border border-gray-100 dark:border-gray-900 shadow-sm sticky top-32">
              <h2 className="text-xl font-serif font-bold mb-8 flex items-center dark:text-white">
                <span className="w-2 h-8 bg-rose-600 mr-3 rounded-none"></span> Tin Đọc Nhiều
              </h2>
              <div className="space-y-8">
                {articles.slice(0, 5).map((item, index) => (
                  <Link key={item.id} to={`/article/${item.id}`} className="flex items-start gap-4 group">
                    <span className="text-4xl font-serif font-black text-gray-100 dark:text-gray-800 group-hover:text-rose-200 transition-colors">
                      0{index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm leading-tight hover:text-rose-600 dark:text-gray-200 transition-colors line-clamp-2">{item.title}</h4>
                      <p className="text-[9px] text-rose-600 mt-1 uppercase font-black tracking-widest">{item.category || 'TIN TỨC'}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-16 bg-rose-50 dark:bg-rose-900/10 p-6 text-center border border-rose-100 dark:border-rose-900/30">
                <h3 className="font-serif font-bold text-rose-900 dark:text-rose-400 mb-2 italic text-lg">Bản tin 24H</h3>
                <p className="text-xs text-rose-700 dark:text-rose-500/80 mb-6 leading-relaxed">Nhận tin tức quan trọng nhất trực tiếp vào hộp thư của bạn mỗi sáng.</p>
                <input type="email" placeholder="Email của bạn..." className="w-full px-4 py-3 text-sm border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-black mb-3 focus:outline-none focus:ring-2 ring-rose-500 transition-all" />
                <button className="w-full bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest py-3 hover:bg-rose-700 transition-all shadow-md">Đăng ký ngay</button>
              </div>
            </div>
          </aside>
        </div>

        {/* 4. TRENDING SECTION */}
        {activeCategory === 'TẤT CẢ' && filteredNews.length > 5 && (
          <section className="mt-28 lg:mt-36 p-10 md:p-16 lg:p-24 rounded-none bg-white dark:bg-[#0a0a0a] transition-colors duration-500 overflow-hidden relative shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="absolute top-0 right-0 text-[10rem] md:text-[18rem] font-black text-gray-50 dark:text-gray-800/30 leading-none -translate-y-10 translate-x-10 md:translate-x-32 select-none pointer-events-none font-sans transition-colors duration-500">
              EDITOR
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <h2 className="text-5xl md:text-6xl lg:text-8xl font-serif font-bold italic leading-none mb-8 md:mb-10 tracking-tighter text-blue-600 dark:text-blue-500">
                  Xu hướng<br/>quan tâm.
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl font-serif italic leading-relaxed max-w-sm">
                  Cập nhật những chủ đề nóng hổi đang dẫn đầu các cuộc thảo luận trong ngày.
                </p>
              </div>
              
              <div className="space-y-8 md:space-y-10">
                {filteredNews.slice(4, 7).map((item, i) => (
                  <Link key={item.id || i} to={`/article/${item.id}`} className="group/item flex gap-6 md:gap-10 items-start border-b border-gray-200 dark:border-gray-800 pb-8 last:border-0 transition-all hover:border-blue-300 dark:hover:border-blue-900">
                    <span className="text-4xl md:text-5xl font-serif italic font-bold text-gray-200 dark:text-gray-800 group-hover/item:text-blue-200 dark:group-hover/item:text-blue-800 transition-colors">
                      0{i+1}
                    </span>
                    <div className="space-y-3">
                      <h5 className="text-lg md:text-2xl font-bold leading-tight text-gray-900 dark:text-gray-200 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-all duration-300 font-sans line-clamp-2">
                        {item.title}
                      </h5>
                      <span className="inline-block text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] py-1.5 px-3 md:px-4 border border-gray-300 dark:border-gray-800 rounded-none text-gray-500 dark:text-gray-400 group-hover/item:border-blue-400 group-hover/item:text-blue-600 dark:group-hover/item:border-blue-900 dark:group-hover/item:text-blue-400 font-sans transition-colors">
                        {item.category || 'TIN TỨC'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-20 md:py-24 border-t border-gray-200 dark:border-gray-900 text-center bg-white dark:bg-[#0a0a0a] transition-colors duration-500">
        <div className="font-serif italic font-bold text-3xl md:text-4xl mb-6 text-gray-900 dark:text-white tracking-tighter">Tintuc.vn</div>
        <div className="w-12 h-1 bg-blue-600 mx-auto mb-8 rounded-none"></div>
        <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-gray-500 dark:text-gray-400 px-4">
          © 2026 Professional Journalism Ecosystem
        </p>
      </footer>
    </div>
  );
}

export default Home;