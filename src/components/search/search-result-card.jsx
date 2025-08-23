// src/components/search/SearchResultCard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function SearchResultCard({ item }) {
  const navigate = useNavigate();

  // --- 기본(서치 응답) 정규화
  const baseProductId = item?.productId ?? item?.id;
  const baseStoreId = item?.storeId ?? item?.storeID;

  // --- 표시용 상태(overview로 덮어쓰기)
  const [view, setView] = useState({
    productId: baseProductId,
    storeId: baseStoreId,
    name: item?.name ?? "상품",
    imageUrl: item?.imageUrl || "/images/placeholder.jpg",
    originalPrice: Number(item?.originalPricePerBaseUnit ?? 0),
    discountedPrice: Number(
      item?.appliedUnitPrice ?? item?.originalPricePerBaseUnit ?? 0
    ),
    marketName: item?.storeName ?? "",
    currentQty: item?.currentQty ?? null,
    targetQty: item?.targetQty ?? null,
    currentDiscountPercent: item?.currentDiscountPercent ?? null,
  });

  // --- 리뷰 카운트
  const [reviewCount, setReviewCount] = useState(0);
  const [rating] = useState(0);

  // ✅ overview API 불러오기
  useEffect(() => {
    if (!baseProductId) return;
    let aborted = false;

    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/products/${baseProductId}/overview`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) return;
        const ov = await res.json();
        if (aborted) return;

        setView((prev) => ({
          ...prev,
          productId: ov.productId ?? prev.productId,
          storeId: ov.storeId ?? prev.storeId,
          name: ov.name ?? prev.name,
          imageUrl: ov.imageUrl || prev.imageUrl,
          originalPrice: Number(
            ov.originalPricePerBaseUnit ?? prev.originalPrice
          ),
          discountedPrice: Number(ov.appliedUnitPrice ?? prev.discountedPrice),
          marketName: ov.storeName ?? prev.marketName,
          currentQty: ov.currentQty ?? prev.currentQty,
          targetQty: ov.targetQty ?? prev.targetQty,
          currentDiscountPercent:
            ov.currentDiscountPercent ?? prev.currentDiscountPercent,
        }));
      } catch {}
    })();

    return () => {
      aborted = true;
    };
  }, [baseProductId]);

  // 리뷰 수 API
  useEffect(() => {
    if (!baseProductId) return;
    (async () => {
      try {
        const r = await fetch(
          `${API_BASE}/api/reviews?productId=${baseProductId}&page=0&size=1`
        );
        if (!r.ok) return;
        const j = await r.json();
        setReviewCount(j?.page?.totalElements ?? 0);
      } catch {}
    })();
  }, [baseProductId]);

  // 장바구니 추가
  const handleAddCart = async () => {
    try {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("accessToken");

      const r = await fetch(`${API_BASE}/api/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ productId: view.productId, quantity: 1 }),
      });

      if (r.status === 401) {
        alert("로그인이 필요합니다.");
        navigate(
          `/login?redirect=${encodeURIComponent(
            location.pathname + location.search
          )}`
        );
        return;
      }
      if (!r.ok) throw new Error();
      alert("장바구니에 추가되었습니다.");
    } catch {
      alert("장바구니 추가 실패");
    }
  };

  // 상세 이동
  const handleClickCard = () => {
    navigate(
      `/marketDetailPage/${view.storeId}/product/${view.productId}?shopId=${view.storeId}`
    );
  };

  // 상점명 클릭 → 상점(마켓) 페이지 이동
  const handleClickMarket = (e) => {
    e.stopPropagation();
    navigate(`/marketDetailPage/${view.storeId}?shopId=${view.storeId}`);
  };

  // 계산
  const discountRate =
    view.originalPrice > 0
      ? Math.round(
          ((view.originalPrice - view.discountedPrice) / view.originalPrice) *
            100
        )
      : view.currentDiscountPercent ?? 0;

  const percent =
    typeof view.currentQty === "number" &&
    typeof view.targetQty === "number" &&
    view.targetQty > 0
      ? Math.round((view.currentQty / view.targetQty) * 100)
      : 0;

  const barColorClass = percent >= 80 ? "bg-[#D85C54]" : "bg-[#4CC554]";

  // UI (ProductCard 스타일)
  return (
    <div
      className="bg-white rounded-xl relative border border-gray-200 overflow-hidden cursor-pointer select-none"
      role="button"
      tabIndex={0}
      onClick={handleClickCard}
    >
      <div className="relative w-full aspect-[4/3]">
        <img
          src={view.imageUrl}
          alt={view.name}
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

      <div className="p-3">
        {view.marketName && (
          <button
            type="button"
            onClick={handleClickMarket}
            className="text-sm text-green-600 hover:underline"
          >
            {view.marketName}
          </button>
        )}

        <div className="text-sm font-medium mt-1">{view.name}</div>

        <p className="text-xs text-gray-400 line-through">
          {view.originalPrice.toLocaleString()}원
        </p>

        <div className="mt-1 flex gap-1 items-center">
          <span className="text-[#D85C54] font-bold">{discountRate}%</span>
          <span className="font-semibold">
            {view.discountedPrice.toLocaleString()}원
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
