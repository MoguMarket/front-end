import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AiRecommendList from "../components/home/ai-recommend-list";
import DeadlineProductsList from "../components/home/deadline-product-list";
import SearchBar from "../components/home/search-bar";
import CategoryFilterSimple from "../components/home/category";

export default function GiftPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  // URL에서 shopId 유지
  const shopId = sp.get("shopId") || undefined;

  // 카테고리 토글
  const handleToggleCategory = useCallback((name) => {
    setSelectedCategory((prev) => (prev === name ? null : name));
  }, []);

  const clearCategory = useCallback(() => setSelectedCategory(null), []);

  // 검색 제출 -> /search 로 이동 (쿼리 세팅)
  const handleSearchSubmit = useCallback(
    (term) => {
      const params = new URLSearchParams();
      if (term) params.set("q", term);
      if (selectedCategory) params.set("category", selectedCategory);
      if (shopId) params.set("shopId", shopId);
      navigate(`/search?${params.toString()}`);
    },
    [navigate, selectedCategory, shopId]
  );

  return (
    <div>
      <SearchBar
        categoryLabel={selectedCategory}
        onClearCategory={clearCategory}
        onSubmit={handleSearchSubmit}
      />

      <CategoryFilterSimple
        selectedCategory={selectedCategory}
        onToggleCategory={handleToggleCategory}
      />

      <AiRecommendList />
      <DeadlineProductsList />
    </div>
  );
}
