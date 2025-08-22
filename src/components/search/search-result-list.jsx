import React from "react";
import SearchResultCard from "./search-result-card";

/**
 * 검색 결과 리스트
 * @param {{ items: any[] }} props
 */
export default function SearchResultList({ items = [] }) {
  if (!items?.length) return null;

  return (
    <ul className="px-4 py-2 space-y-3">
      {items.map((it, idx) => {
        const key = it?.id ?? it?.productId ?? idx;
        console.log(it);
        return <SearchResultCard key={key} item={it} />;
      })}
    </ul>
  );
}
