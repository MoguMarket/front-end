// src/pages/searchPage.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchTopBar from "../components/search/search-top-bar";
import SearchFilterBar from "../components/search/search-filter-bar";
import SearchEmptyState from "../components/search/no-search";
import SearchSuggestions from "../components/search/search-suggestion";
import SearchResultList from "../components/search/search-result-list";

export default function SearchPage() {
    const [sp, setSp] = useSearchParams();
    const navigate = useNavigate();

    const q = sp.get("q") || "";
    const category = sp.get("category") || null;

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

    function extractItemsFromResponse(json) {
        // { success: "true", data: [...] } 형태 가정
        if (Array.isArray(json)) return json;
        const arr = json?.data;
        if (Array.isArray(arr)) return arr;

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

    useEffect(() => {
        const term = (q || "").trim();
        if (!term) {
            setItems([]);
            return;
        }

        const ctrl = new AbortController();
        const t = setTimeout(async () => {
            try {
                setLoading(true);
                const url = `${
                    import.meta.env.VITE_API_BASE
                }/api/search?keyword=${encodeURIComponent(term)}`;
                const res = await fetch(url, {
                    headers: { Accept: "application/json" },
                    signal: ctrl.signal,
                });
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
    }, [q]);

    const showSuggestions = useMemo(() => q.trim() === "", [q]);

    return (
        <>
            <SearchTopBar
                defaultValue={q}
                onSubmit={handleSubmit}
                onBack={handleBack}
                onClear={handleClearQuery}
                categoryLabel={category}
                onClearCategory={handleClearCategory}
            />

            <div className="mt-[-10px]">
                {/* 필터/정렬 바 */}
                <SearchFilterBar />

                {items.length > 0 ? (
                    // 결과가 있으면 최우선으로 리스트
                    <SearchResultList items={items} />
                ) : showSuggestions ? (
                    // q가 비어 있으면 제안
                    <SearchSuggestions />
                ) : loading ? (
                    // 로딩
                    <p className="px-4 py-6 text-sm text-neutral-500">
                        검색 중…
                    </p>
                ) : (
                    // 결과 없음
                    <SearchEmptyState />
                )}
            </div>
        </>
    );
}
