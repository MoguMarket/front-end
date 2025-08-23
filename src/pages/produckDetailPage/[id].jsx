// src/pages/productDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../../components/marketDetail/header";
import ProductSale from "../../components/productDetail/product-sale";
import MoguProgress from "../../components/productDetail/mogu-progress";
import ProductDetailBottom from "../../components/productDetail/product-detail-bottom";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ProductDetailPage() {
  const { shopId, productId } = useParams();
  const navigate = useNavigate();

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
        const res = await fetch(
          `${API_BASE}/api/products/${productId}/overview`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ov = await res.json();
        if (aborted) return;

        const original = Number(ov.originalPricePerBaseUnit ?? 0);
        const discounted = Number(ov.appliedUnitPrice ?? original);

        setShop({ shopId: ov.storeId, name: ov.storeName ?? "상점" });
        setProduct({
          id: ov.productId ?? Number(productId),
          name: ov.name ?? "상품",
          imageUrl: ov.imageUrl ?? "/images/placeholder.jpg",
          unit: ov.unit ?? "KG",
          originalPrice: original,
          discountedPrice: discounted,
          stock: ov.stock ?? 0,
          progressCurrent:
            typeof ov.currentQty === "number" ? ov.currentQty : 0,
          progressMax: typeof ov.targetQty === "number" ? ov.targetQty : 0,
          groupBuyStatus: ov.groupBuyStatus ?? null,
          maxDiscountPercent: ov.maxDiscountPercent ?? null,
          currentDiscountPercent: ov.currentDiscountPercent ?? 0,
          startAt: ov.startAt,
          endAt: ov.endAt,
          remainingToNextStage: ov.remainingToNextStage,
        });
      } catch (e) {
        console.error("[ProductDetail] fetch failed:", e);
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
        if (!r.ok) {
          setRating(0);
          setReviewCount(0);
          return;
        }
        const s = await r.json();
        if (aborted) return;
        setRating(Number(s?.average ?? 0));
        setReviewCount(Number(s?.count ?? 0));
      } catch (e) {
        console.warn("[ProductDetail] review summary fetch failed:", e);
        setRating(0);
        setReviewCount(0);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [productId]);

  if (loading)
    return <div className="p-6 text-sm text-neutral-500">불러오는 중…</div>;

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

  console.log(
    `[Detail] 공구 진행: ${product.progressCurrent ?? 0} / ${
      product.progressMax ?? 0
    }`
  );

  return (
    <div className="relative w-full max-w-[390px] mx-auto pt-14 pb-16">
      <Header marketName={shop.name} />

      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full aspect-[4/3] object-cover rounded-b-lg"
      />

      <ProductSale shop={shop} product={{ ...product, reviewCount, rating }} />

      <MoguProgress
        startAt={product.startAt}
        endAt={product.endAt}
        currentQty={product.progressCurrent}
        targetQty={product.progressMax}
        remainingToNextStage={product.remainingToNextStage}
        currentDiscountPercent={product.currentDiscountPercent}
        appliedUnitPrice={product.discountedPrice}
      />

      <ProductDetailBottom
        shop={shop}
        product={{ ...product, reviewCount, rating }}
      />
    </div>
  );
}
