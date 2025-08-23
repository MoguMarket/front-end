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

        const mappedShop = {
          shopId: ov.storeId,
          name: ov.storeName ?? "상점",
        };

        const original = Number(ov.originalPricePerBaseUnit ?? 0);
        const discounted = Number(ov.appliedUnitPrice ?? original);

        const mappedProduct = {
          id: ov.productId ?? Number(productId),
          name: ov.name ?? "상품",
          imageUrl: ov.imageUrl ?? "/images/placeholder.jpg",
          unit: ov.unit ?? "",

          originalPrice: original,
          discountedPrice: discounted,

          stock: ov.stock ?? 0,

          progressCurrent:
            typeof ov.currentQty === "number" ? ov.currentQty : null,
          progressMax: typeof ov.targetQty === "number" ? ov.targetQty : null,

          groupBuyStatus: ov.groupBuyStatus ?? null,
          maxDiscountPercent: ov.maxDiscountPercent ?? null,
          currentDiscountPercent: ov.currentDiscountPercent ?? null,

          // 기간 관련 필드 추가
          startAt: ov.startAt ?? null,
          endAt: ov.endAt ?? null,
          remainingToNextStage: ov.remainingToNextStage ?? null,
        };

        // ✅ 콘솔로그로 공구 진행 현황 확인
        console.log(
          `[ProductDetail] 공구 진행 현황: ${mappedProduct.progressCurrent} / ${mappedProduct.progressMax}`
        );

        setShop(mappedShop);
        setProduct(mappedProduct);
      } catch (e) {
        console.error("[ProductDetail] fetch failed:", e);
        setShop(null);
        setProduct(null);
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [productId]);

  if (loading) {
    return <div className="p-6 text-sm text-neutral-500">불러오는 중…</div>;
  }

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
    <div className="relative w-full max-w-[390px] mx-auto pt-14 pb-16">
      <Header marketName={shop.name} />

      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full aspect-[4/3] object-cover rounded-b-lg"
      />

      <ProductSale shop={shop} product={product} />
      <MoguProgress
        startAt={product.startAt}
        endAt={product.endAt}
        currentQty={product.progressCurrent}
        targetQty={product.progressMax}
        remainingToNextStage={product.remainingToNextStage}
        currentDiscountPercent={product.currentDiscountPercent}
        appliedUnitPrice={product.discountedPrice}
      />

      <ProductDetailBottom shop={shop} product={product} />
    </div>
  );
}
