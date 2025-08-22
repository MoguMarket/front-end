// src/components/home/deadline-product-list.jsx
import { useState } from "react";
import Slider from "react-slick";
import deadlineItems from "../db/deadlineItems";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import ProductCard from "./product-card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function DeadlineProductsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();

  const [products, setProducts] = useState(deadlineItems);

  const isGiftPage = location.pathname === "/gift";
  const currentShopId = sp.get("shopId") || undefined;

  const toggleLike = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p))
    );
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2.2,
    slidesToScroll: 2,
    arrows: false,
  };

  // 쿼리 빌더
  const buildDetailQuery = (shopId) => {
    const qs = new URLSearchParams(location.search);
    if (shopId) qs.set("shopId", shopId);
    if (isGiftPage) qs.set("from", "gift");
    return qs.toString();
  };

  const buildMarketQuery = (shopId) => {
    const qs = new URLSearchParams(location.search);
    if (shopId) qs.set("shopId", shopId);
    // 마켓 이동에는 from=gift 굳이 불필요 -> 미부착
    return qs.toString();
  };

  return (
    <div className="py-3">
      <h2 className="text-md font-semibold mb-2">마감이 임박한 상품이에요!</h2>
      <Slider {...settings}>
        {products.map((item) => {
          const shopId = item.shopId || currentShopId;

          return (
            <ProductCard
              key={item.id}
              name={item.name}
              weight={item.weight}
              originalPrice={item.originalPrice ?? 0}
              discountedPrice={item.discountedPrice ?? item.price ?? 0}
              rating={item.rating}
              reviewCount={item.reviewCount ?? item.reviews ?? 0}
              liked={!!item.liked}
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
                    "[DeadlineProductsList] shopId 없음. URL에 ?shopId=... 또는 item.shopId 제공 필요"
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
