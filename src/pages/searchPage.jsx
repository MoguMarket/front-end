import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchTopBar from "../components/search/search-top-bar";
import NoSearch from "../components/search/no-search";

export default function SearchPage() {
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();

  // URL 상태
  const q = sp.get("q") || "";
  const category = sp.get("category") || null;
  //   const shopId = sp.get("shopId") || null; // 필요 시 API 등에 사용

  const handleBack = useCallback(() => {
    if (window.history.length > 2) navigate(-1);
    else navigate("/", { replace: true });
  }, [navigate]);

  // 검색어 제출: q만 갱신(카테고리/샵 유지)
  const handleSubmit = useCallback(
    (term) => {
      const next = new URLSearchParams(sp);
      if (term) next.set("q", term);
      else next.delete("q");
      setSp(next, { replace: false });
      // TODO: 여기서 term, category, shopId로 검색 호출
    },
    [sp, setSp]
  );

  // 검색어 지우기
  const handleClearQuery = useCallback(() => {
    const next = new URLSearchParams(sp);
    next.delete("q");
    setSp(next, { replace: true });
  }, [sp, setSp]);

  // 카테고리 지우기 (선택)
  const handleClearCategory = useCallback(() => {
    const next = new URLSearchParams(sp);
    next.delete("category");
    setSp(next, { replace: true });
  }, [sp, setSp]);

  return (
    <>
      <SearchTopBar
        defaultValue={q}
        onSubmit={handleSubmit}
        onBack={handleBack}
        onClear={handleClearQuery}
        categoryLabel={category} // ✅ 카테고리 배지 표시
        onClearCategory={handleClearCategory} // (원치 않으면 prop 빼면 됨)
      />

      {/* 헤더 높이 보정 */}
      <div className="pt-16">{/* 여기에 검색 결과 리스트 렌더링 */}</div>
      <NoSearch />
    </>
  );
}
