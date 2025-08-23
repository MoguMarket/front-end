// src/pages/groupBuy/index.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GroupBuyHeader from "../../components/groupBuy/group-buy-header";
import GroupBuyProductCard from "../../components/groupBuy/group-buy-product-card";
import OrderPanel from "../../components/groupBuy/order-panel";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function GroupBuyPage() {
  const { shopId: shopIdParam, productId: productIdParam } = useParams();
  const shopId = Number(shopIdParam);
  const productId = Number(productIdParam);

  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState(null);
  const [product, setProduct] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    let aborted = false;

    (async () => {
      try {
        setLoading(true);
        // ✅ 상품 + 공구 현황
        const r = await fetch(
          `${API_BASE}/api/products/${productId}/overview`,
          {
            headers: { Accept: "application/json" },
          }
        );
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const ov = await r.json();
        if (aborted) return;

        // 상점 헤더용
        setShop({
          shopId: ov.storeId,
          name: ov.storeName ?? "상점",
        });

        // 카드/주문 패널용 제품 매핑
        const original = Number(ov.originalPricePerBaseUnit ?? 0);
        const discounted = Number(ov.appliedUnitPrice ?? original);

        setProduct({
          id: ov.productId ?? productId,
          name: ov.name ?? "상품",
          imageUrl: ov.imageUrl ?? "/images/placeholder.jpg",
          unit: ov.unit ?? "KG",
          // 가격
          originalPrice: original,
          discountedPrice: discounted,
          // 진행도
          progressCurrent:
            typeof ov.currentQty === "number" ? ov.currentQty : 0,
          progressMax: typeof ov.targetQty === "number" ? ov.targetQty : 0,
          currentDiscountPercent: ov.currentDiscountPercent ?? 0,
          remainingToNextStage: ov.remainingToNextStage ?? null,
          startAt: ov.startAt ?? null,
          endAt: ov.endAt ?? null,
        });
      } catch (e) {
        console.error("[GroupBuyPage] overview fetch failed:", e);
        setShop(null);
        setProduct(null);
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    // ✅ 리뷰 요약(평균/개수)
    (async () => {
      try {
        const r = await fetch(
          `${API_BASE}/api/reviews/summary?productId=${productId}`,
          { headers: { Accept: "application/json" } }
        );
        if (!r.ok) return;
        const s = await r.json();
        if (aborted) return;
        setRating(Number(s?.average ?? 0));
        setReviewCount(Number(s?.count ?? 0));
      } catch (e) {
        console.warn("[GroupBuyPage] review summary fetch failed:", e);
        setRating(0);
        setReviewCount(0);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [API_BASE, productId]);

  if (loading) {
    return (
      <>
        <GroupBuyHeader />
        <div className="p-4 text-sm text-neutral-500">불러오는 중…</div>
      </>
    );
  }

  if (!shop || !product) {
    return (
      <>
        <GroupBuyHeader />
        <div className="p-4 text-red-600">데이터를 찾을 수 없습니다.</div>
      </>
    );
  }

  // 리뷰 값 주입(필요 시 카드에서 사용)
  const productWithReview = { ...product, rating, reviewCount };

  return (
    <>
      <GroupBuyHeader />
      <GroupBuyProductCard shop={shop} product={productWithReview} />
      <OrderPanel shopId={shopId} productId={product.id} />
    </>
  );
}
