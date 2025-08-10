import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { Star, Heart } from "lucide-react";
import deadlineItems from "../db/deadlineItems";
import { useNavigate } from "react-router-dom";

const DeadlineProductsList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState(deadlineItems);
  const [likedItems, setLikedItems] = useState(
    deadlineItems.map((item) => ({ id: item.id, liked: item.liked }))
  );

  useEffect(() => {
    axios
      .get("/api/deadline-products")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.products || [];
        if (data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {
        // 더미데이터 유지
      });
  }, []);

  const toggleLike = (id) => {
    setLikedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, liked: !item.liked } : item
      )
    );
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: false,
  };

  return (
    <div className="px-4">
      <h2 className="text-lg font-semibold mb-3">마감이 임박한 상품이에요!</h2>
      <Slider {...settings}>
        {products.map((item, idx) => {
          const likeStatus =
            likedItems.find((l) => l.id === item.id)?.liked || false;
          const discountRate = Math.round(
            ((item.originalPrice - item.discountedPrice) / item.originalPrice) *
              100
          );

          return (
            <div key={idx} className="pr-2 pb-4">
              {/* 상품 카드 */}
              <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {/* 성사임박 뱃지 */}
                <span className="absolute top-2 left-2 bg-red-600 bg-opacity-80 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  성사임박
                </span>

                {/* 상품 이미지 */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />

                {/* 좋아요 버튼 */}
                <button
                  onClick={() => toggleLike(item.id)}
                  className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow"
                >
                  <Heart
                    size={16}
                    className={likeStatus ? "text-red-500" : "text-gray-300"}
                    fill={likeStatus ? "currentColor" : "none"}
                  />
                </button>
              </div>

              {/* 상품 정보 */}
              <div className="mt-2">
                <p
                  className="text-xs text-green-600 font-semibold cursor-pointer"
                  onClick={() => navigate(`/marketDetailPage/${item.id}`)}
                >
                  {item.marketName}
                </p>
                <p className="text-sm font-medium line-clamp-2">
                  {item.name} {item.weight}
                </p>

                {/* 원가 */}
                <p className="text-xs text-gray-400 line-through">
                  {item.originalPrice.toLocaleString()}원
                </p>

                {/* 할인 정보 */}
                <div className="flex items-center gap-1">
                  <span className="text-red-600 text-sm font-bold">
                    {discountRate}%
                  </span>
                  <span className="text-sm font-bold">
                    {item.discountedPrice.toLocaleString()}원
                  </span>
                </div>

                {/* 평점 */}
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  <Star
                    size={12}
                    className="text-red-500 mr-0.5"
                    fill="currentColor"
                  />
                  {item.rating} ({item.reviewCount})
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default DeadlineProductsList;
