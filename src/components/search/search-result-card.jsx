// src/components/search/SearchResultCard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function SearchResultCard({ item }) {
  const navigate = useNavigate();

  // ----- 기본 필드 정규화 -----
  const productId = item?.productId ?? item?.id;
  const storeId = item?.storeId ?? item?.storeID;
  const name = item?.name ?? "상품";
  const imageUrl = item?.imageUrl || "/images/placeholder.jpg";
  const originalPrice = Number(item?.originalPricePerBaseUnit ?? 0);
  const discountedPrice = Number(
    item?.appliedUnitPrice ?? item?.originalPricePerBaseUnit ?? 0
  );
  const marketName = item?.storeName ?? "";
  const progressCurrent = item?.currentQty ?? null;
  const progressMax = item?.targetQty ?? null;

  // ----- 리뷰 수 가져오기 -----
  const [reviewCount, setReviewCount] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/reviews?productId=${productId}&page=0&size=1`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setReviewCount(json?.page?.totalElements ?? 0);
        // TODO: 별점 평균 필드 있으면 setRating()에 반영
      } catch (e) {
        console.warn("리뷰 fetch 실패:", e);
      }
    })();
  }, [productId]);

  // ----- 좋아요 버튼 → 장바구니 추가 -----
  const handleAddCart = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/carts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!res.ok) throw new Error(`Cart HTTP ${res.status}`);
      alert("장바구니에 추가되었습니다.");
    } catch (e) {
      alert("장바구니 추가 실패");
      console.error(e);
    }
  };

  // ----- 상세 페이지 이동 -----
  const handleClickCard = () => {
    navigate(
      `/marketDetailPage/${storeId}/product/${productId}?shopId=${storeId}`
    );
  };

  // ----- 계산 -----
  const discountRate =
    originalPrice > 0
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0;

  const percent =
    progressCurrent && progressMax
      ? Math.round((progressCurrent / progressMax) * 100)
      : null;

  const barColorClass =
    percent != null && percent >= 80 ? "bg-[#D85C54]" : "bg-[#4CC554]";

  // ----- UI (ProductCard 디자인 복사) -----
  return (
    <div
      className="bg-white rounded-xl relative border border-gray-200 overflow-hidden cursor-pointer select-none"
      role="button"
      tabIndex={0}
      onClick={handleClickCard}
    >
      {/* 이미지 */}
      <div className="relative w-full aspect-[4/3]">
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleAddCart();
          }}
          className="absolute bottom-2 right-2 bg-white rounded-full p-1"
          aria-label="장바구니 추가"
        >
          <Heart size={16} className="text-gray-300" />
        </button>
      </div>

      {percent != null && (
        <div className="px-3 pt-2">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="w-full h-2 rounded-full bg-neutral-200"
          >
            <div
              className={`h-full rounded-full ${barColorClass} transition-[width] duration-300`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      <div className="p-3">
        {marketName && (
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-green-600 hover:underline"
          >
            {marketName}
          </button>
        )}

        <div className="text-sm font-medium mt-1">{name}</div>

        <p className="text-xs text-gray-400 line-through">
          {originalPrice.toLocaleString()}원
        </p>

        <div className="mt-1 flex gap-1 items-center">
          <span className="text-[#D85C54] font-bold">{discountRate}%</span>
          <span className="font-semibold">
            {discountedPrice.toLocaleString()}원
          </span>
        </div>

        <div className="flex items-center text-xs text-gray-600 mt-1">
          <Star size={12} className="mr-1 text-[#D85C54]" fill="currentColor" />
          {rating} ({reviewCount})
        </div>
      </div>
    </div>
  );
}
