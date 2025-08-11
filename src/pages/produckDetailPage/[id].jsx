// src/pages/productDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import SHOPS from "../../components/db/shops-db";
import Header from "../../components/marketDetail/header";
import ProductSale from "../../components/productDetail/product-sale";

export default function ProductDetailPage() {
  const { marketId, productId } = useParams();
  const navigate = useNavigate();

  const shop = SHOPS.find((m) => m.marketId === Number(marketId));
  const product = shop?.products.find((p) => p.id === Number(productId));

  if (!shop || !product) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="mb-3 text-sm underline">
          뒤로가기
        </button>
        <div className="text-red-600">상품을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[390px] mx-auto pt-14  pb-16">
      <Header marketName={shop.name} />
      <img
        src={product.imageUrl}
        alt={shop.name}
        className="w-full aspect-[4/3] object-cover rounded-b-lg"
      />
      <ProductSale shop={shop} product={product} />
      {/* 이미지, 가격, 리뷰 등 상세 UI 구성 */}
    </div>
  );
}
