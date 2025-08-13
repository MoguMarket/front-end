// src/components/product-list.jsx
import { useNavigate } from "react-router-dom";
import MarketProductCard from "./market-product-card";

export default function ProductList({ products, shopId }) {
  const navigate = useNavigate();

  const handleMarketClick = () => console.log("시장 페이지로 이동");
  const toggleLike = (id) => console.log(`${id} 상품 좋아요 토글`);

  const goProductDetail = (productId) => {
    navigate(`/marketDetailPage/${shopId}/product/${productId}`);
  };

  return (
    <div className="grid grid-cols-2 gap-0 gap-y-3 pt-5 mx-auto justify-items-center">
      {products.map((item) => (
        <MarketProductCard
          key={item.id}
          name={item.name}
          weight={item.weight}
          originalPrice={item.originalPrice}
          discountedPrice={item.discountedPrice}
          rating={item.rating}
          reviewCount={item.reviewCount}
          liked={item.liked}
          imageUrl={item.imageUrl}
          marketName={null}
          onClickMarket={handleMarketClick}
          onToggleLike={() => toggleLike(item.id)}
          onClickCard={() => goProductDetail(item.id)}
        />
      ))}
    </div>
  );
}
