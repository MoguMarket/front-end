import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchTopBar from "../components/search/search-top-bar";
import SearchFilterBar from "../components/search/search-filter-bar";
import SearchEmptyState from "../components/search/no-search";
import SearchSuggestions from "../components/search/search-suggestion";

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

                {/* 최근/인기 검색어 섹션 */}
                <SearchSuggestions
                    popular={["복숭아", "옥수수", "수박", "흑당근"]}
                />

            </div>
        </>
    );
}
