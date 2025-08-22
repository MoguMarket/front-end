// src/components/home/ai-recommend-list.jsx
import { useState } from "react";
import Slider from "react-slick";
import recommendedItems from "../db/recommendedItems";
import { useUserContext } from "../contexts/user-context";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import ProductCard from "./product-card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function AiRecommendList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();

  const { name } = useUserContext();
  const [items, setItems] = useState(recommendedItems);

  const isGiftPage = location.pathname === "/gift";
  const currentShopId = sp.get("shopId") || undefined;

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

  // 상세로 이동할 때 쿼리 구성: shopId 유지 + (GiftPage면) from=gift
  const buildDetailQuery = (shopId) => {
    const qs = new URLSearchParams(location.search);
    if (shopId) qs.set("shopId", shopId);
    if (isGiftPage) qs.set("from", "gift");
    return qs.toString();
  };

  // 마켓으로 이동할 때도 shopId 유지
  const buildMarketQuery = (shopId) => {
    const qs = new URLSearchParams(location.search);
    if (shopId) qs.set("shopId", shopId);
    // from=gift 는 마켓 리스트엔 필요 없어서 미부착 (원하면 붙이세요)
    return qs.toString();
  };

  return (
    <div className="py-3 font-[Pretendard] tracking-[-0.025em]">
      <h3 className="text-md font-semibold mb-2">
        {name}님을 위한 <span className="text-green-600">AI 추천 상품</span>
      </h3>

      <Slider {...settings} className="ai-slider">
        {items.map((item) => {
          const shopId = item.shopId || currentShopId;

          return (
            <ProductCard
              tCard
              key={item.id}
              name={item.name}
              weight={item.weight}
              originalPrice={item.originalPrice ?? item.originPrice ?? 0}
              discountedPrice={item.discountedPrice ?? item.price ?? 0}
              rating={item.rating}
              reviewCount={item.reviewCount ?? item.reviews ?? 0}
              liked={item.liked}
              imageUrl={
                item.imageUrl ??
                "https://www.saenong.com/assets/upload/detailimage1/20240709_7874794413310.jpg"
              }
              marketName={item.marketName}
              progressCurrent={item.progressCurrent}
              progressMax={item.progressMax}
              onToggleLike={() => toggleLike(item.id)}
              onClickMarket={() => {
                const qs = buildMarketQuery(shopId);
                navigate(`/marketDetailPage/${shopId}${qs ? `?${qs}` : ""}`);
              }}
              onClickCard={() => {
                if (!shopId) {
                  console.warn(
                    "[AiRecommendList] shopId 없음. URL에 ?shopId=... 또는 item.shopId 제공 필요"
                  );
                }
                const qs = buildDetailQuery(shopId);
                navigate(
                  `/marketDetailPage/${shopId}/product/${item.productId}${
                    qs ? `?${qs}` : ""
                  }`
                );
              }}
            />
          );
        })}
      </Slider>
    </div>
  );
}
