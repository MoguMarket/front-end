// src/components/search/search-result-list.jsx
import React from "react";
import SearchResultCard from "./search-result-card";

/**
 * 검색 결과 리스트
 * @param {{ items: any[] }} props
 */
export default function SearchResultList({ items = [] }) {
  if (!items?.length) return null;

  return (
    <ul className=" py-3 grid grid-cols-2 gap-x-3 gap-y-4 list-none m-0">
      {items.map((it, idx) => {
        const key = it?.id ?? it?.productId ?? idx;
        return (
          <li key={key}>
            <SearchResultCard item={it} />
          </li>
        );
      })}
    </ul>
  );
}
