import { useState, useCallback } from "react";
import AiRecommendList from "../components/home/ai-recommend-list";
import DeadlineProductsList from "../components/home/deadline-product-list";
import SearchBar from "../components/home/search-bar";
import CategoryFilterSimple from "../components/home/category";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 토글 로직: 같은 걸 누르면 해제, 다른 걸 누르면 교체
  const handleToggleCategory = useCallback((name) => {
    setSelectedCategory((prev) => (prev === name ? null : name));
  }, []);

  const clearCategory = useCallback(() => setSelectedCategory(null), []);

  return (
    <div>
      <SearchBar
        categoryLabel={selectedCategory}
        onClearCategory={clearCategory}
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
