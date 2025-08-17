import { useState } from "react";
import Slider from "react-slick";
import deadlineItems from "../db/deadlineItems";
import { useNavigate } from "react-router-dom";
import ProductCard from "./product-card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function DeadlineProductsList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(deadlineItems);

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

  return (
    <div className="py-3">
      <h2 className="text-md font-semibold mb-2">마감이 임박한 상품이에요!</h2>
      <Slider {...settings}>
        {products.map((item) => (
          <ProductCard
            key={item.id}
            name={item.name}
            weight={item.weight}
            originalPrice={item.originalPrice ?? 0}
            discountedPrice={item.discountedPrice ?? item.price ?? 0}
            rating={item.rating}
            reviewCount={item.reviewCount ?? item.reviews ?? 0}
            liked={!!item.liked}
            imageUrl={item.imageUrl}
            marketName={item.marketName}
            progressCurrent={item.progressCurrent}
            progressMax={item.progressMax}
            onClickMarket={() => navigate(`/marketDetailPage/${item.shopId}`)}
            onClickCard={() =>
              navigate(
                `/marketDetailPage/${item.shopId}/product/${item.productId}`
              )
            }
            onToggleLike={() => toggleLike(item.id)}
          />
        ))}
      </Slider>
    </div>
  );
}
