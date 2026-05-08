import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; 

const LOCAL_ARTICLES = [
  {
    id: 1,
    title: "Lộ diện công nghệ AI mới của Google năm 2026: Gemini 3 Flash",
    summary: "Gemini 3 Flash vừa ra mắt với khả năng xử lý hình ảnh và video siêu tốc, hỗ trợ lập trình viên tối đa.",
    category: "CÔNG NGHỆ",
    author: "Hoàng Triệu",
    created_at: "2026-04-12 08:30:00",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000",
    views: 1024
  },
  {
    id: 2,
    title: "Du lịch nội địa bùng nổ: Phú Quốc và Đà Nẵng 'cháy vé' kỳ nghỉ 30/4",
    summary: "Các tour du lịch biển tại Đà Nẵng và Phú Quốc đã cháy vé từ sớm, dự báo một mùa du lịch bội thu.",
    category: "DU LỊCH",
    author: "Thành Nghĩa",
    created_at: "2026-04-09 10:00:00",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000",
    views: 120
  },
  {
    id: 3,
    title: "FC Online: Cận cảnh thẻ Ronaldo Nazário +8 nghìn tỷ BP gây rúng động",
    summary: "Thương vụ chuyển nhượng lịch sử với thẻ cầu thủ huyền thoại mùa 24TY làm thay đổi hoàn toàn giá trị thị trường game.",
    category: "GIẢI TRÍ",
    author: "Gamer9x",
    created_at: "2026-04-26 08:15:00",
    image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000",
    views: 8900
  },
  {
    id: 4,
    title: "Hành trình 'Zero Waste': Lối sống bền vững dẫn dắt tương lai xanh",
    summary: "Khám phá những câu chuyện thực tế về việc giảm rác thải nhựa và cách người trẻ đang thay đổi thế giới.",
    category: "XÃ HỘI",
    author: "Minh Hòa",
    created_at: "2026-04-26 10:00:00",
    image_url: "https://images.unsplash.com/photo-1542601906970-d4d8153b216d?q=80&w=2000",
    views: 1250
  },
  {
    id: 5,
    title: "Ẩm thực đường phố Sài Gòn: Những câu chuyện kể từ lòng hẻm",
    summary: "Đằng sau những món ăn dân dã là cả một kho tàng văn hóa và lòng hiếu khách đặc trưng của người dân phương Nam.",
    category: "ĐỜI SỐNG",
    author: "FoodieVN",
    created_at: "2026-04-25 18:00:00",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000",
    views: 5600
  },
  {
    id: 6,
    title: "Khi Âm Nhạc Truyền Thống \"Hồi Sinh\" Trong Tay Nghệ Sĩ Trẻ: Cú Hích Cho Giải Trí Việt",
    summary: "Sự kết hợp độc đáo giữa EDM và tiếng đàn bầu, đàn tranh đang tạo nên một làn sóng mới trong giới trẻ Việt Nam.",
    category: "GIẢI TRÍ",
    author: "Thành Nghĩa",
    created_at: "2026-04-26 09:30:00",
    image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2000",
    views: 3400
  },
  {
    id: 7,
    title: "\"Khoảng trống\" kỹ năng mềm: Thách thức lớn cho sinh viên mới ra trường",
    summary: "Nghiên cứu mới nhất cho thấy hơn 70% sinh viên tốt nghiệp đáp ứng được kiến thức chuyên môn nhưng lại lúng túng trong giao tiếp và làm việc nhóm.",
    category: "XÃ HỘI",
    author: "Hoàng Triệu",
    created_at: "2026-04-12 12:00:00",
    image_url: "https://images.unsplash.com/photo-1523240715639-93f8fd0a9840?q=80&w=2000",
    views: 3100
  },
  {
    id: 8,
    title: "Vàng thế giới vượt đỉnh lịch sử: Tâm lý nhà đầu tư Việt đang ở đâu?",
    summary: "Giá vàng biến động mạnh trước những biến số kinh tế toàn cầu khiến tài sản an toàn trở nên đắt đỏ hơn bao giờ hết.",
    category: "KINH TẾ",
    author: "Tòa Soạn",
    created_at: "2026-04-12 07:00:00",
    image_url: "https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=2000",
    views: 4500
  },
  {
    id: 9,
    title: "Nâng tầm phong cách Streetwear cho nam giới có chiều cao vượt trội",
    summary: "Bí quyết phối đồ thông minh giúp các chàng trai cao trên 1m80 luôn nổi bật và cân đối.",
    category: "ĐỜI SỐNG",
    author: "Fashionista",
    created_at: "2026-04-11 09:15:00",
    image_url: "https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=2000",
    views: 280
  },
  {
    id: 10,
    title: "Thị trường xe điện Việt Nam: Khi hạ tầng sạc là chìa khóa của cuộc chơi",
    summary: "Các trạm sạc đang phủ kín mọi nẻo đường, xóa tan nỗi lo 'hết pin giữa chừng' của người dùng xe xanh.",
    category: "THỊ TRƯỜNG",
    author: "Admin",
    created_at: "2026-04-10 16:45:00",
    image_url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2000",
    views: 1900
  },
  {
    id: 11,
    title: "Đêm nhạc hội TP.HCM: Khi âm nhạc xóa nhòa mọi khoảng cách",
    summary: "Hàng nghìn khán giả đã cháy hết mình cùng dàn sao quốc tế và Việt Nam trong một đêm đại nhạc hội không ngủ.",
    category: "GIẢI TRÍ",
    author: "Thành Nghĩa",
    created_at: "2026-04-12 20:00:00",
    image_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000",
    views: 304
  },
  {
    id: 12,
    title: "Khởi nghiệp xanh: Lối đi mới đầy tiềm năng cho Startup Việt năm 2026",
    summary: "Kinh doanh không chỉ là lợi nhuận, mà còn là trách nhiệm với hành tinh xanh thông qua các mô hình kinh tế tuần hoàn.",
    category: "KINH TẾ",
    author: "Minh Hòa",
    created_at: "2026-04-12 14:00:00",
    image_url: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?q=80&w=2000",
    views: 156
  },
  {
    id: 13,
    title: "Lập trình viên trong kỷ nguyên AI: Thay đổi tư duy để không bị bỏ lại phía sau",
    summary: "AI đang định nghĩa lại cách chúng ta viết code, biến lập trình viên thành những 'kiến trúc sư' thực thụ.",
    category: "CÔNG NGHỆ",
    author: "Hoàng Triệu",
    created_at: "2026-04-12 16:30:00",
    image_url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2000",
    views: 86
  },
  {
    id: 14,
    title: "Khám phá phong cách sống tương lai tại các căn hộ thông minh Thủ Thiêm",
    summary: "Khi công nghệ không chỉ là tiện ích, mà là một phần tất yếu của không gian sống hiện đại và an toàn.",
    category: "BẤT ĐỘNG SẢN",
    author: "Admin",
    created_at: "2026-04-11 11:00:00",
    image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000",
    views: 420
  },
  {
    id: 15,
    title: "Hà Giang - Mùa đá nở hoa: Hành trình tìm lại chính mình trên những cung đường huyền thoại",
    summary: "Vẻ đẹp hùng vĩ của cao nguyên đá và tấm lòng nồng hậu của đồng bào vùng cao sẽ khiến bạn say lòng.",
    category: "XÃ HỘI",
    author: "Tuấn Anh",
    created_at: "2026-04-10 08:00:00",
    image_url: "https://images.unsplash.com/photo-1502101872923-d48509bff386?q=80&w=2000",
    views: 950
  }
];

const GLOBAL_FALLBACK = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";
const API_BASE_URL = "http://localhost:5001";

function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const catQuery = searchParams.get('cat'); 
    const searchQuery = searchParams.get('search'); 
    const [articles, setArticles] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [activeCategory, setActiveCategory] = useState('TẤT CẢ');

    // Mật độ bài viết mỗi trang trong layout dọc sidebar
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 7; 

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                // Sử dụng đường dẫn tương đối vì axiosClient đã có baseURL
                const res = await axiosClient.get('/news');
                // axiosClient interceptor đã trả về response.data, nên res chính là mảng bài viết
                const finalData = Array.isArray(res) ? res : (res.data || []);
                setArticles(finalData.length > 0 ? finalData : LOCAL_ARTICLES);
            } catch (err) {
                console.error("Lỗi API, chuyển sang dữ liệu mẫu:", err);
                setArticles(LOCAL_ARTICLES);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    useEffect(() => {
        setActiveCategory(catQuery ? catQuery.toUpperCase() : 'TẤT CẢ');
        setCurrentPage(1);
    }, [catQuery, searchQuery]);

    const normalizeString = (str) => str ? str.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim() : "";

    const featuredArticles = useMemo(() => articles.slice(0, 4), [articles]);

    const mostViewedArticles = useMemo(() => {
        return [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 8);
    }, [articles]);

    const filteredNews = useMemo(() => {
        const safeArticles = Array.isArray(articles) ? articles : [];
        let result = activeCategory === 'TẤT CẢ' 
            ? safeArticles 
            : safeArticles.filter(a => normalizeString(a?.category) === normalizeString(activeCategory));

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(a => 
                (a?.title?.toLowerCase() || "").includes(q) || 
                (a?.summary?.toLowerCase() || "").includes(q)
            );
        }
        // Vừa bỏ qua 4 bài đã ở Top Story nếu đang xem TẤT CẢ (Để tránh trùng lặp)
        if (activeCategory === 'TẤT CẢ' && !searchQuery) {
            return result.slice(4);
        }
        return result;
    }, [articles, activeCategory, searchQuery]);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredNews.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(filteredNews.length / articlesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 400, behavior: 'smooth' }); 
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500 italic">Đang tải Dữ liệu Tòa Soạn...</div>;

    const mainStory = featuredArticles[0];
    const subStories = featuredArticles.slice(1, 4);

    const parseDate = (d) => {
        if (!d) return "Vừa xong";
        const date = new Date(d);
        if (isNaN(date)) return d.split('T')[0] || d.split(' ')[0] || "Vừa xong";
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getImageUrl = (url) => {
        if (!url || url === 'null' || url === 'undefined' || url === '') return GLOBAL_FALLBACK;
        return url;
    };

    return (
        <div className="min-h-screen bg-[#fdfdfc] dark:bg-[#0a0a0a] font-serif transition-colors duration-500">
            {/* Ticker Tin Tức Chạy Ngang */}
            <div className="bg-[#111] h-10 flex items-center border-b border-gray-800">
                <div className="max-w-screen-2xl mx-auto px-6 flex items-center w-full font-sans">
                    <span className="text-[10px] font-black text-red-600 uppercase pr-4 tracking-widest flex items-center relative">
                        <span className="w-2 h-2 rounded-full bg-red-600 mr-2 animate-pulse"></span>
                        Tiêu điểm
                    </span>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex gap-12 animate-marquee">
                            {articles.slice(0, 8).map((art) => (
                                <Link key={art.id || Math.random()} to={`/article/${art.id}`} className="text-[11px] text-gray-400 font-bold tracking-wide whitespace-nowrap hover:text-white transition-colors">
                                    {art?.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 lg:px-12 py-10 max-w-[1440px] animate-fade-in-up">
                
                {/* --- 1. TOP STORY SECTION (EDITORIAL LAYOUT) --- */}
                {(!searchQuery && activeCategory === 'TẤT CẢ' && mainStory) && (
                    <div className="flex flex-col lg:flex-row gap-10 mb-16 pb-16 border-b border-black/5 dark:border-white/5">
                        {/* Main Banner Article (Trái) */}
                        <div className="w-full lg:w-2/3 group flex flex-col">
                            <Link to={`/article/${mainStory.id}`} className="block relative aspect-[16/9] overflow-hidden mb-8 rounded-2xl premium-shadow group-hover:shadow-2xl transition-all duration-500">
                                <img 
                                    src={getImageUrl(mainStory.image_url)} 
                                    alt={mainStory.title} 
                                    className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                                    onError={(e) => { e.target.onerror = null; e.target.src = GLOBAL_FALLBACK; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <span className="absolute top-6 left-6 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 uppercase tracking-[0.2em] rounded-full shadow-lg">
                                    {mainStory.category}
                                </span>
                            </Link>
                            <Link to={`/article/${mainStory.id}`}>
                                <h2 className="text-4xl md:text-6xl font-black dark:text-white leading-[1.05] mb-6 hover:text-blue-600 transition-colors font-serif tracking-tight">
                                    {mainStory.title}
                                </h2>
                            </Link>
                            <p className="text-gray-500 dark:text-gray-400 text-xl line-clamp-3 leading-relaxed w-11/12 font-medium">
                                {mainStory.summary}
                            </p>

                            <div className="mt-8 w-11/12">
                                <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center font-bold text-[10px]">
                                             {mainStory.author?.charAt(0)}
                                         </div>
                                         <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                             {mainStory.author || "Editorial Team"} — {parseDate(mainStory.created_at)}
                                         </div>
                                     </div>
                                     <Link to={`/article/${mainStory.id}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-800 flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                         Đọc chi tiết <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                     </Link>
                                </div>
                            </div>
                        </div>

                        {/* Tiểu mục Article (Phải) */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-8 lg:pl-10 lg:border-l border-black/5 dark:border-white/5">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Đừng bỏ lỡ</h3>
                            {subStories.map(sub => (
                                <div key={sub.id} className="pb-8 border-b border-black/5 dark:border-white/5 last:border-0 last:pb-0 group">
                                    <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                                        <Link to={`/article/${sub.id}`} className="block relative sm:w-1/3 lg:w-full aspect-[16/9] overflow-hidden rounded-xl premium-shadow bg-gray-100 dark:bg-white/5">
                                            <img 
                                                src={getImageUrl(sub.image_url)} 
                                                alt={sub.title} 
                                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => { e.target.onerror = null; e.target.src = GLOBAL_FALLBACK; }}
                                            />
                                        </Link>
                                        <div className="sm:pl-2 lg:pl-0 flex-1">
                                            <span className="text-[9px] text-blue-600 font-black uppercase tracking-[0.2em] mb-2 block">
                                                {sub.category}
                                            </span>
                                            <Link to={`/article/${sub.id}`}>
                                                <h3 className="text-xl font-bold dark:text-white leading-tight hover:text-blue-600 transition-colors line-clamp-2 font-serif">
                                                    {sub.title}
                                                </h3>
                                            </Link>
                                            <div className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span> {parseDate(sub.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- MỤC TIÊU ĐỀ SECTION TÙY CHỌN --- */}
                {searchQuery || activeCategory !== 'TẤT CẢ' ? (
                     <div className="mb-12 pb-6 border-b-2 border-black dark:border-white flex items-baseline gap-4">
                         <h2 className="text-5xl font-black uppercase tracking-tighter dark:text-white font-serif">
                             {searchQuery ? "Kết quả tìm kiếm" : activeCategory}
                         </h2>
                         {searchQuery && <span className="text-gray-400 font-bold italic text-xl">"{searchQuery}"</span>}
                     </div>
                ) : null}


                {/* --- 2. MAIN CONTENT & SIDEBAR (GIAO DIỆN BÁO CHÍ) --- */}
                <div className="flex flex-col lg:flex-row gap-16">
                    
                    {/* CỘT TRÁI (LEFT PANEL - DÒNG THỜI GIAN TIN TỨC) 70% */}
                    <div className="w-full lg:w-[68%]">
                         <div className="flex items-center justify-between mb-10 pb-4 border-b border-black/5 dark:border-white/5">
                             <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                 <span className="w-8 h-[2px] bg-blue-600"></span> Dòng sự kiện
                             </h3>
                         </div>

                         <div className="space-y-12">
                            {currentArticles.length > 0 ? currentArticles.map((item) => (
                                <article key={item.id || Math.random()} className="flex flex-col sm:flex-row gap-8 group animate-fade-in-up bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-black/5 hover:border-blue-600/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1 relative">
                                    {/* Nút Thả tim nhanh */}
                                    <button className="absolute top-6 right-6 z-10 p-2.5 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 text-gray-400 hover:text-red-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                    </button>

                                    <Link to={`/article/${item.id}`} className="relative sm:w-[38%] aspect-[4/3] block overflow-hidden rounded-2xl premium-shadow shrink-0">
                                        <img 
                                            src={getImageUrl(item?.image_url)} 
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                            alt={item?.title} 
                                            onError={(e) => { e.target.onerror = null; e.target.src = GLOBAL_FALLBACK; }}
                                        />
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </Link>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                                                {item?.category}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                {parseDate(item?.created_at)}
                                            </span>
                                        </div>
                                        <Link to={`/article/${item.id}`}>
                                            <h4 className="text-2xl md:text-3xl font-bold dark:text-gray-100 line-clamp-2 hover:text-blue-600 transition-colors leading-tight mb-4 font-serif">
                                                {item?.title || "Tiêu đề đang cập nhật"}
                                            </h4>
                                        </Link>
                                        <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-[15px] leading-relaxed mb-8 hidden sm:block font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                                            {item?.summary || "Nội dung tóm tắt đang được chúng tôi cập nhật vào hệ thống tin tức số..."}
                                        </p>
                                        
                                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-black/5 dark:border-white/5">
                                            <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> 
                                                    {item?.views || 0}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    3 phút đọc
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full text-gray-400 hover:text-blue-600 transition-colors tooltip" title="Lưu bài viết">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                                                </button>
                                                <Link to={`/article/${item.id}`} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-1">
                                                    Đọc chi tiết <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            )) : (
                                <div className="text-center py-32 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-black/5 dark:border-white/5">
                                    <p className="text-gray-400 italic font-medium">Không tìm thấy câu chuyện nào phù hợp.</p>
                                </div>
                            )}
                         </div>

                        {/* THANH PHÂN TRANG */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-20 mb-10 gap-3">
                                <button 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`p-3 rounded-full border transition-all ${currentPage === 1 ? 'text-gray-200 border-gray-100 cursor-not-allowed' : 'hover:bg-blue-600 hover:text-white hover:border-blue-600 border-black/10 dark:border-white/10 dark:text-white'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
                                </button>
                                
                                <div className="hidden sm:flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`w-11 h-11 rounded-full text-[11px] font-black transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-black/5 dark:hover:bg-white/5 dark:text-white'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`p-3 rounded-full border transition-all ${currentPage === totalPages ? 'text-gray-200 border-gray-100 cursor-not-allowed' : 'hover:bg-blue-600 hover:text-white hover:border-blue-600 border-black/10 dark:border-white/10 dark:text-white'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* CỘT PHẢI (SIDEBAR - XEM NHIỀU NHẤT BIẾN THỂ DỌC) 30% */}
                    <aside className="w-full lg:w-[32%] lg:pl-12 lg:border-l border-black/5 dark:border-white/5">
                         <div className="sticky top-32">
                             {/* Information Widgets Dashboard */}
                             <div className="mb-12 p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                                 <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                                 
                                 <h3 className="text-[11px] font-black text-white/80 uppercase tracking-[0.3em] mb-6 flex items-center gap-3 relative z-10">
                                     <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> AI News Summary
                                 </h3>
                                 
                                 <div className="space-y-5 relative z-10">
                                     {featuredArticles.map((article, i) => (
                                         <div 
                                            key={article.id || i} 
                                            onClick={() => window.location.href = `/article/${article.id}`}
                                            className="flex gap-4 group/item cursor-pointer"
                                         >
                                             <span className="text-white/40 font-black text-xs mt-1">0{i+1}</span>
                                             <p className="text-white font-bold text-[13px] leading-snug group-hover/item:text-green-300 transition-colors">
                                                 {article.title}
                                             </p>
                                         </div>
                                     ))}
                                 </div>
                                 
                                 <button 
                                    onClick={() => {
                                        const textLines = ["Chào mừng bạn đến với bản tin tóm tắt bằng AI."];
                                        const prefixes = ["Điểm tin thứ nhất:", "Điểm tin thứ hai:", "Điểm tin thứ ba:", "Điểm tin thứ tư:"];
                                        featuredArticles.slice(0, 4).forEach((article, idx) => {
                                            if (prefixes[idx]) {
                                                textLines.push(`${prefixes[idx]} ${article.title}.`);
                                            }
                                        });
                                        const speech = new SpeechSynthesisUtterance(textLines.join(" "));
                                        speech.lang = 'vi-VN';
                                        speech.rate = 0.9;
                                        window.speechSynthesis.speak(speech);
                                    }}
                                    className="w-full mt-8 py-3.5 bg-white/10 hover:bg-white text-white hover:text-blue-700 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/20 active:scale-95"
                                 >
                                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path></svg>
                                     Nghe tóm tắt tin (AI Voice)
                                 </button>
                             </div>

                             <div className="mb-12">
                                 <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                                     <span className="w-6 h-[2px] bg-black dark:bg-white"></span> Xu hướng
                                 </h3>
                                 <div className="flex flex-col gap-8">
                                     {mostViewedArticles.map((item, index) => (
                                         <Link to={`/article/${item.id}`} key={item.id} className="flex gap-5 group items-start">
                                             <div className="text-4xl font-black text-black/5 dark:text-white/5 group-hover:text-blue-600/20 transition-colors leading-none font-serif">
                                                 0{index + 1}
                                             </div>
                                             <div className="flex-1">
                                                 <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1 block">{item.category}</span>
                                                 <h5 className="font-bold text-base dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug font-serif">
                                                     {item.title}
                                                 </h5>
                                             </div>
                                         </Link>
                                     ))}
                                 </div>
                             </div>
                             
                             {/* Premium Ad Banner */}
                             <div 
                                onClick={() => window.open('https://google.com', '_blank')}
                                className="relative group cursor-pointer overflow-hidden rounded-3xl premium-shadow h-[480px] transition-all duration-500 hover:shadow-blue-500/20"
                             >
                                 <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop" alt="Premium Ad" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8 group-hover:via-black/60 transition-all">
                                     <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                         <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                                         Tài trợ
                                     </span>
                                     <h4 className="text-white font-black text-2xl leading-tight mb-6 font-serif">Nâng tầm phong cách sống 2026</h4>
                                     <button className="w-full bg-white text-black font-black text-[10px] uppercase tracking-widest py-4 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all active:scale-95 shadow-xl">
                                         Khám phá ngay
                                     </button>
                                 </div>
                             </div>
                         </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default Home;
