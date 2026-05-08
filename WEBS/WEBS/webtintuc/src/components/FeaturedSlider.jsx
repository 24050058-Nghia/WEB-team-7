import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const FeaturedSlider = ({ featuredPosts }) => {
  return (
    <div className="w-full mb-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect={'fade'} // Hiệu ứng chuyển cảnh mượt mà
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="h-[400px] md:h-[550px] rounded-xl overflow-hidden shadow-lg"
      >
        {featuredPosts.map((post) => (
          <SwiperSlide key={post.id}>
            <div className="relative w-full h-full group">
              {/* Ảnh nền bài báo */}
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Lớp phủ gradient để làm nổi bật chữ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 md:p-12">
                <span className="bg-blue-600 text-white text-xs font-bold uppercase px-3 py-1 w-fit mb-4">
                  {post.category}
                </span>
                <h2 className="text-white text-2xl md:text-4xl font-bold leading-tight hover:underline cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-gray-200 mt-2 line-clamp-2 max-w-2xl">
                  {post.summary}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedSlider;
