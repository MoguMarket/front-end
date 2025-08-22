// src/pages/giftPage.jsx
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

  const shopId = sp.get("shopId") || undefined;

  const handleToggleCategory = useCallback((name) => {
    setSelectedCategory((prev) => (prev === name ? null : name));
  }, []);
  const clearCategory = useCallback(() => setSelectedCategory(null), []);

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

  // ✅ 상품 카드 클릭 시 상세로 이동 (from=gift 부착)
  const goProductDetailFromGift = useCallback(
    (productId) => {
      if (!shopId) {
        // 필요한 경우 shopId가 필수면 가드
        console.warn("shopId 없음. URL에 shopId를 붙여주세요.");
      }
      const params = new URLSearchParams();
      if (shopId) params.set("shopId", shopId);
      params.set("from", "gift");
      navigate(
        `/marketDetailPage/${shopId}/product/${productId}?${params.toString()}`
      );
    },
    [navigate, shopId]
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

      {/* 리스트 컴포넌트에 클릭 핸들러 prop으로 내려주면 좋음 */}
      <AiRecommendList onItemClick={(p) => goProductDetailFromGift(p.id)} />
      <DeadlineProductsList
        onItemClick={(p) => goProductDetailFromGift(p.id)}
      />
    </div>
  );
}
