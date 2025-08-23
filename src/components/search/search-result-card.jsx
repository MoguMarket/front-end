// src/components/search/SearchResultCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

/**
 * 단일 검색 결과 카드
 * @param {{ item: {
 *   id:number, name:string, description?:string, imageUrl?:string|null,
 *   originalPricePerBaseUnit?:number, stock?:number, storeID:number,
 *   createdAt?:string
 * } }} props
 */
export default function SearchResultCard({ item }) {
  const navigate = useNavigate();
  if (!item) return null;

  const name = item?.name ?? "이름 미상";
  const desc = item?.description ?? "";
  const updated = formatDate(item?.updatedAt ?? item?.createdAt);

  console.log("item:", item);

  async function handleClick() {
    try {
      // 1) 스토어 조회해서 marketId 확보
      const res = await fetch(`${API_BASE}/api/stores/${item.storeID}`);
      if (!res.ok) throw new Error(`store HTTP ${res.status}`);
      const store = await res.json();

      // 2) 현재 라우팅 규칙에 맞춰 이동
      //    /marketDetailPage/:shopId/product/:productId?shopId=...
      const shopId = store?.marketId ?? store?.id; // 안전장치
      navigate(
        `/marketDetailPage/${shopId}/product/${item.id}?shopId=${shopId}`
      );
    } catch (e) {
      console.error("[SearchResultCard] 이동 중 오류:", e);
      // 필요 시 토스트/알럿
    }
  }

  return (
    <li
      onClick={handleClick}
      className="w-full rounded-2xl border border-neutral-200 bg-white p-3 flex gap-3 cursor-pointer active:opacity-80"
      role="button"
      aria-label={`${name} 상세보기`}
    >
      {/* 썸네일 */}
      <div className="w-20 h-20 shrink-0 rounded-xl bg-neutral-100 overflow-hidden flex items-center justify-center text-xs text-neutral-400">
        {item?.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          "no image"
        )}
      </div>

      {/* 정보 */}
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium text-neutral-900 line-clamp-2">
          {name}
        </p>

        {desc && (
          <p className="mt-1 text-[13px] text-neutral-600 line-clamp-2">
            {desc}
          </p>
        )}

        {updated && (
          <p className="mt-1 text-[12px] text-neutral-400">
            {updated} 업데이트
          </p>
        )}
      </div>
    </li>
  );
}
