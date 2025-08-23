// src/pages/selfBuy/index.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GroupBuyHeader from "../../components/groupBuy/group-buy-header";
import GroupBuyProductCard from "../../components/groupBuy/group-buy-product-card";
import OrderPanel from "../../components/groupBuy/order-panel";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function SelfBuyPage() {
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
        const r = await fetch(
          `${API_BASE}/api/products/${productId}/overview`,
          {
            headers: { Accept: "application/json" },
          }
        );
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const ov = await r.json();
        if (aborted) return;

        setShop({ shopId: ov.storeId, name: ov.storeName ?? "상점" });

        const original = Number(ov.originalPricePerBaseUnit ?? 0);
        const discounted = Number(ov.appliedUnitPrice ?? original);

        // 혼자구매: 진행바 관련 값이 와도 화면에선 숨길 거라 그대로 둬도 OK
        setProduct({
          id: ov.productId ?? productId,
          name: ov.name ?? "상품",
          imageUrl: ov.imageUrl ?? "/images/placeholder.jpg",
          unit: ov.unit ?? "KG",
          originalPrice: original,
          discountedPrice: discounted,
          progressCurrent: ov.currentQty ?? 0,
          progressMax: ov.targetQty ?? 0,
          currentDiscountPercent: ov.currentDiscountPercent ?? 0,
          remainingToNextStage: ov.remainingToNextStage ?? null,
        });
      } catch (e) {
        console.error("[SelfBuyPage] overview fetch failed:", e);
        setShop(null);
        setProduct(null);
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    (async () => {
      try {
        const r = await fetch(
          `${API_BASE}/api/reviews/summary?productId=${productId}`,
          { headers: { Accept: "application/json" } }
        );
        if (!r.ok) {
          setRating(0);
          setReviewCount(0);
          return;
        }
        const s = await r.json();
        if (aborted) return;
        setRating(Number(s?.average ?? 0));
        setReviewCount(Number(s?.count ?? 0));
      } catch {
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

  const productWithReview = { ...product, rating, reviewCount };

  return (
    <>
      <GroupBuyHeader />
      {/* 👇 혼자구매: 진행바 숨김 */}
      <GroupBuyProductCard
        shop={shop}
        product={productWithReview}
        hideProgress
      />
      <OrderPanel shopId={shop.shopId} productId={product.id} />
    </>
  );
}
