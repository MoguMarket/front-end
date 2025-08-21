// src/components/search/search-result-list.jsx
import React from "react";

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

export default function SearchResultList({ items = [] }) {
    if (!items?.length) return null;

    return (
        <ul className="px-4 py-2 space-y-3">
            {items.map((it, idx) => {
                const key = it?.id ?? it?.productId ?? idx;
                const name = it?.name ?? "이름 미상";
                const desc = it?.description ?? "";
                const updated = formatDate(it?.updatedAt);

                return (
                    <li
                        key={key}
                        className="w-full rounded-2xl border border-neutral-200 bg-white p-3 flex gap-3"
                    >
                        {/* 썸네일 자리 (이미지 필드가 아직 없어서 플레이스홀더) */}
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
            })}
        </ul>
    );
}
