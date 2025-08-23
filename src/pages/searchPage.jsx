// src/pages/searchPage.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchTopBar from "../components/search/search-top-bar";
import SearchFilterBar from "../components/search/search-filter-bar";
import SearchEmptyState from "../components/search/no-search";
import SearchSuggestions from "../components/search/search-suggestion";
import SearchResultList from "../components/search/search-result-list";

const API_BASE = import.meta.env.VITE_API_BASE;

// 한글 라벨 -> 서버 enum 키
const CATEGORY_MAP = {
  농산: "AGRICULTURE",
  수산: "SEAFOOD",
  축산: "LIVESTOCK",
  가공식품: "SIDE_PROCESSED",
  건강식품: "HEALTH",
  간식류: "RICE_SNACK",
  생활주방: "KITCHEN_DAILY",
  패션: "FASHION",
  뷰티: "BEAUTY",
  "꽃/원예": "FLOWER_GARDEN",
  "공구/철물": "TOOL_HARDWARE",
};
const toCategoryKey = (label) => CATEGORY_MAP[label] || label;

// 응답에서 아이템 배열 추출 (여러 스키마 대응)
function extractItemsFromResponse(json) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  const keys = ["items", "products", "results", "list", "content"];
  for (const k of keys) {
    const v = json?.[k];
    if (Array.isArray(v)) return v;
  }
  const nested = json?.data;
  for (const k of keys) {
    const v = nested?.[k];
    if (Array.isArray(v)) return v;
  }
  return [];
}

export default function SearchPage() {
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();

  const q = sp.get("q") || "";
  const category = sp.get("category") || null;
  const page = sp.get("page") || "1";

  const handleBack = useCallback(() => {
    if (window.history.length > 2) navigate(-1);
    else navigate("/", { replace: true });
  }, [navigate]);

  const handleSubmit = useCallback(
    (term) => {
      const next = new URLSearchParams(sp);
      term ? next.set("q", term) : next.delete("q");
      next.set("page", "1");
      setSp(next, { replace: false });
    },
    [sp, setSp]
  );

  // 인풋 포커스 시 제안 화면으로 (q 제거, category는 유지)
  const handleFocusShowSuggestions = useCallback(() => {
    if ((sp.get("q") || "").trim() === "") return;
    const next = new URLSearchParams(sp);
    next.delete("q");
    next.set("page", "1");
    setSp(next, { replace: true });
  }, [sp, setSp]);

  const handleClearQuery = useCallback(() => {
    const next = new URLSearchParams(sp);
    next.delete("q");
    next.set("page", "1");
    setSp(next, { replace: true });
  }, [sp, setSp]);

  const handleClearCategory = useCallback(() => {
    const next = new URLSearchParams(sp);
    next.delete("category");
    next.set("page", "1");
    setSp(next, { replace: true });
  }, [sp, setSp]);

  // ---------- 검색 API 연결 ----------
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const term = (q || "").trim();
    const catLabel = (category || "").trim();
    const catKey = toCategoryKey(catLabel);

    // 키워드도 없고 카테고리도 없으면 초기 상태
    if (!term && !catKey) {
      setItems([]);
      return;
    }

    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        setLoading(true);

        let url;
        if (term) {
          // 키워드 검색
          url = `${API_BASE}/api/search?keyword=${encodeURIComponent(term)}`;
        } else {
          // 카테고리 검색 (영문 enum 키 사용, 페이지네이션 기본값)
          url = `${API_BASE}/api/products/category/${encodeURIComponent(
            catKey
          )}?page=0&size=50`;
        }

        const res = await fetch(url, {
          headers: { Accept: "application/json" },
          signal: ctrl.signal,
        });

        // 200이 아닐 때 에러 본문 로그
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.warn("[search] HTTP", res.status, text);
          setItems([]);
          return;
        }

        const json = await res.json();
        setItems(extractItemsFromResponse(json));
      } catch (e) {
        if (e.name !== "AbortError") {
          console.warn("search fetch failed", e);
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, category]);

  // q가 비어있고 category도 없으면 제안 화면
  const showSuggestions = useMemo(
    () => q.trim() === "" && !category,
    [q, category]
  );

  return (
    <>
      <SearchTopBar
        defaultValue={q}
        onSubmit={handleSubmit}
        onBack={handleBack}
        onClear={handleClearQuery}
        categoryLabel={category}
        onClearCategory={handleClearCategory}
        onFocusShowSuggestions={handleFocusShowSuggestions}
      />

      <div className="mt-[-10px]">
        <SearchFilterBar />

        {items.length > 0 ? (
          <SearchResultList items={items} />
        ) : showSuggestions ? (
          <SearchSuggestions />
        ) : loading ? (
          <p className="px-4 py-6 text-sm text-neutral-500">검색 중…</p>
        ) : (
          <SearchEmptyState />
        )}
      </div>
    </>
  );
}
