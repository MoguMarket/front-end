// src/pages/marketDetailPage/[marketId].jsx (파일명은 예시)
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import shops from "../../components/db/shops-db";
import Header from "../../components/marketDetail/header";
import ProductList from "../../components/marketDetail/market-product-list";
import SearchBar from "../../components/home/search-bar";

export default function MarketDetailPage() {
  const { shopId: shopIdParam } = useParams();
  const navigate = useNavigate();

  const shopId = Number(shopIdParam);

  // ✅ shopId로 정확히 매칭
  const shop = useMemo(
    () => shops.find((m) => m.shopId === shopId),
    [shopId, shops]
  );

  if (!shop) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="mb-3 text-sm underline">
          뒤로가기
        </button>
        <div className="text-red-600">
          해당 시장을 찾을 수 없습니다. (shopId: {shopIdParam})
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[390px] mx-auto">
      <Header marketName={shop.name} />
      <div className="h-16" aria-hidden />
      <SearchBar />
      <ProductList shopId={shop.shopId} products={shop.products} />
    </div>
  );
}
