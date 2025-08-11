// src/pages/productDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import MARKETS from "../../components/db/shops-db";
import Header from "../../components/marketDetail/header";

export default function ProductDetailPage() {
  const { marketId, productId } = useParams();
  const navigate = useNavigate();

  const market = MARKETS.find((m) => m.marketId === Number(marketId));
  const product = market?.products.find((p) => p.id === Number(productId));

  if (!market || !product) {
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
    <div className="relative w-full max-w-[390px] mx-auto pt-14 px-4 pb-16">
      <Header marketName={market.name} />
      <div className="h-14" />

      <h1 className="text-lg font-semibold">{product.name}</h1>
      <p className="text-sm text-gray-500">{market.name}</p>

      {/* 이미지, 가격, 리뷰 등 상세 UI 구성 */}
    </div>
  );
}
