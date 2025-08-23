// src/pages/marketDetailPage/[id].jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

import Header from "../../components/marketDetail/header";
import ProductList from "../../components/marketDetail/market-product-list";
import SearchBar from "../../components/home/search-bar";

const API_BASE = import.meta.env.VITE_API_BASE;

// API 응답 → 카드용 필드 매핑
function mapToCardProduct(row) {
  const id = row?.productId ?? row?.id;

  // 가격 필드 유연 처리
  const original = Number(
    row?.originalPricePerBaseUnit ?? row?.originalPrice ?? 0
  );
  const discounted = Number(
    row?.appliedUnitPrice ?? row?.originalPricePerBaseUnit ?? original
  );

  return {
    id,
    name: row?.name ?? "상품",
    weight: row?.unit ?? "",

    originalPrice: original,
    discountedPrice: discounted,

    rating: row?.rating ?? 0,
    reviewCount: row?.reviewCount ?? 0,
    liked: false,

    imageUrl: row?.imageUrl ?? "/images/placeholder.jpg",

    // 공구 진행도(해당 API가 주지 않으면 null → 바 숨김)
    progressCurrent:
      typeof row?.currentQty === "number" ? row.currentQty : null,
    progressMax: typeof row?.targetQty === "number" ? row.targetQty : null,
  };
}

export default function MarketDetailPage() {
  const { shopId: pathShopId } = useParams();
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  // 우선순위: ?shopId= 쿼리 → 경로 파라미터
  const shopIdFromQuery = Number(sp.get("shopId"));
  const sid = Number.isFinite(shopIdFromQuery)
    ? shopIdFromQuery
    : Number(pathShopId);

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]); // ProductList로 전달할 배열
  const [loading, setLoading] = useState(true);

  // 상점 정보 + 상품 목록 로드
  useEffect(() => {
    if (!Number.isFinite(sid)) return;
    let aborted = false;

    (async () => {
      try {
        setLoading(true);

        // 1) 상점 정보
        const resStore = await fetch(`${API_BASE}/api/stores/${sid}`, {
          headers: { Accept: "application/json" },
        });
        if (!resStore.ok)
          throw new Error(`stores/${sid} HTTP ${resStore.status}`);
        const jsonStore = await resStore.json();
        if (!aborted) setStore(jsonStore);

        // 2) 상점 상품 목록
        const resList = await fetch(
          `${API_BASE}/api/stores/products/${sid}?page=0&size=20`,
          { headers: { Accept: "application/json" } }
        );
        if (!resList.ok)
          throw new Error(`stores/products/${sid} HTTP ${resList.status}`);
        const jsonList = await resList.json();

        const rows = Array.isArray(jsonList)
          ? jsonList
          : Array.isArray(jsonList?.content)
          ? jsonList.content
          : [];

        const mapped = rows.map(mapToCardProduct);
        if (!aborted) setProducts(mapped);
      } catch (e) {
        console.error("[MarketDetailPage] fetch failed:", e);
        if (!aborted) {
          setStore(null);
          setProducts([]);
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [sid]);

  const marketName = useMemo(() => store?.name ?? "시장", [store]);

  if (!Number.isFinite(sid)) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="mb-3 text-sm underline">
          뒤로가기
        </button>
        <div className="text-red-600">유효하지 않은 상점 ID입니다.</div>
      </div>
    );
  }

  if (loading && !store) {
    return <div className="p-6 text-sm text-neutral-500">불러오는 중…</div>;
  }

  if (!store) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="mb-3 text-sm underline">
          뒤로가기
        </button>
        <div className="text-red-600">
          해당 상점을 찾을 수 없습니다. (shopId: {sid})
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[390px] mx-auto">
      <Header marketName={marketName} />
      <div className="h-16" aria-hidden />
      <SearchBar />

      {/* ✅ ProductList는 기존 props 그대로 사용 */}
      <ProductList shopId={sid} products={products} />
    </div>
  );
}
