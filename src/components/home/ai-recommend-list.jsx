import { useState } from "react";
import Slider from "react-slick";
import recommendedItems from "../db/recommendedItems";
import { useUserContext } from "../contexts/user-context";
import { useNavigate } from "react-router-dom";
import ProductCard from "./product-card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function AiRecommendList() {
  const navigate = useNavigate();
  const { name } = useUserContext();
  const [items, setItems] = useState(recommendedItems);

  const toggleLike = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, liked: !item.liked } : item
      )
    );
  };

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2.2,
    slidesToScroll: 2,
  };

  return (
    <div className="py-3 font-[Pretendard] tracking-[-0.025em]">
      <h3 className=" text-md font-semibold mb-2">
        {name}님을 위한 <span className="text-green-600">AI 추천 상품</span>
      </h3>

      {/* 여백 제거용 커스텀 클래스 */}
      <Slider {...settings} className="ai-slider">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            name={item.name}
            weight={item.weight}
            originalPrice={item.originalPrice}
            discountedPrice={item.price}
            rating={item.rating}
            reviewCount={item.reviews}
            liked={item.liked}
            imageUrl={
              item.imageUrl ??
              "https://www.saenong.com/assets/upload/detailimage1/20240709_7874794413310.jpg"
            }
            marketName={item.marketName}
            onClickMarket={() =>
              navigate(`/marketDetailPage/${item.marketId ?? item.id}`)
            }
            onToggleLike={() => toggleLike(item.id)}
          />
        ))}
      </Slider>
    </div>
  );
}
