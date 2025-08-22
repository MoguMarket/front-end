import React from "react";
import { useNavigate } from "react-router-dom";

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
 * @param {{ item: any }} props
 */
export default function SearchResultCard({ item }) {
  if (!item) return null;

  const name = item?.name ?? "이름 미상";
  const desc = item?.description ?? "";
  const updated = formatDate(item?.updatedAt);

  return (
    <li className="w-full rounded-2xl border border-neutral-200 bg-white p-3 flex gap-3">
      {/* 썸네일 자리 */}
      <div className="w-20 h-20 shrink-0 rounded-xl bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">
        no image
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
