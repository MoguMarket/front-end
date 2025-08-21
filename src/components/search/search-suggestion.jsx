// src/components/search/search-suggestions.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const RECENT_KEY = "mm_recent_searches";
const RECENT_LIMIT = 10;

export default function SearchSuggestions({ popular = [] }) {
    const [sp, setSp] = useSearchParams();
    const q = sp.get("q") || "";

    const [recent, setRecent] = useState(() => {
        try {
            const raw = localStorage.getItem(RECENT_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    // q가 변할 때 최근 검색어 저장 (최신순, 중복 제거, 최대 10개)
    useEffect(() => {
        const term = q.trim();
        if (!term) return;
        setRecent((prev) => {
            const next = [term, ...prev.filter((t) => t !== term)].slice(
                0,
                RECENT_LIMIT
            );
            try {
                localStorage.setItem(RECENT_KEY, JSON.stringify(next));
            } catch {}
            return next;
        });
    }, [q]);

    const hasRecent = useMemo(() => recent.length > 0, [recent]);
    const hasPopular = useMemo(() => (popular?.length || 0) > 0, [popular]);

    const selectTerm = (term) => {
        const next = new URLSearchParams(sp);
        term ? next.set("q", term) : next.delete("q");
        next.set("page", "1");
        setSp(next, { replace: false });
    };

    const clearRecent = () => {
        setRecent([]);
        try {
            localStorage.removeItem(RECENT_KEY);
        } catch {}
    };

    return (
        <div className="px-4 pb-8">
            <p className="mt-5 mb-4 text-sm text-neutral-500 text-center">
                빈 검색어는 전체 상품이 나옵니다.
            </p>

            {/* 최근 검색어 (칩 UI) */}
            <div className="mt-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-semibold text-neutral-900">
                        최근 검색어
                    </h3>
                    {hasRecent && (
                        <button
                            type="button"
                            onClick={clearRecent}
                            className="text-[13px] text-neutral-500 hover:text-neutral-700"
                        >
                            전체 삭제
                        </button>
                    )}
                </div>

                {hasRecent ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {recent.map((term) => (
                            <button
                                key={term}
                                type="button"
                                onClick={() => selectTerm(term)}
                                className="px-4 h-9 rounded-full bg-neutral-100 text-[14px] text-neutral-800 hover:bg-neutral-200"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="mt-2 text-[14px] text-neutral-500">
                        기록이 없어요.
                    </p>
                )}
            </div>

            {/* 인기 검색어 (동일 칩 UI) */}
            <div className="mt-6">
                <h3 className="text-[15px] font-semibold text-neutral-900">
                    인기 검색어
                </h3>

                {hasPopular ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {popular.map((term) => (
                            <button
                                key={term}
                                type="button"
                                onClick={() => selectTerm(term)}
                                className="px-4 h-9 rounded-full bg-neutral-100 text-[14px] text-neutral-800 hover:bg-neutral-200"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="mt-2 text-[14px] text-neutral-500">
                        준비 중입니다.
                    </p>
                )}
            </div>
        </div>
    );
}
