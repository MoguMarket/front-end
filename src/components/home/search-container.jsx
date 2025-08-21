// src/components/home/search-container.jsx
import { useEffect, useState } from "react";
import SearchBar from "./search-bar.jsx";
import { getTrendingKeywords, searchProducts } from "../../api/search.js";

export default function SearchContainer({ categoryLabel, onClearCategory }) {
    const [defaultValue, setDefaultValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [trending, setTrending] = useState([]);
    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const list = await getTrendingKeywords();
                setTrending(list);
            } catch (e) {
                console.debug("[trending] load failed:", e);
            }
        })();
    }, []);

    const handleSubmit = async (term) => {
        setError("");
        if (!term) return;
        setLoading(true);
        try {
            const { items, total } = await searchProducts(term);
            setResults(items);
            setTotal(total);
        } catch (e) {
            setError("검색 중 문제가 발생했어요.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <SearchBar
                categoryLabel={categoryLabel}
                onClearCategory={onClearCategory}
                defaultValue={defaultValue}
                onSubmit={handleSubmit}
                placeholder="상품을 검색하세요"
            />

            {trending?.length > 0 && results.length === 0 && (
                <div className="max-w-[370px] mx-auto mt-2 text-sm">
                    <div className="flex flex-wrap gap-2">
                        {trending.map((kw) => (
                            <button
                                key={kw}
                                className="px-3 py-1 rounded-full border border-neutral-200 hover:border-[#4CC554]"
                                onClick={() => handleSubmit(kw)}
                            >
                                #{kw}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="max-w-[370px] mx-auto mt-3">
                {loading && <p className="text-sm">검색 중…</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}
                {!loading && results.length > 0 && (
                    <>
                        <p className="text-sm text-neutral-600 mb-2">
                            총 {total}건
                        </p>
                        <ul className="space-y-2">
                            {results.map((p) => (
                                <li
                                    key={p.id}
                                    className="p-3 rounded-xl border flex gap-3 items-center"
                                >
                                    {p.imageUrl ? (
                                        <img
                                            src={p.imageUrl}
                                            alt={p.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-neutral-100" />
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {p.name || "이름 없음"}
                                        </p>
                                        <p className="text-xs text-neutral-500 truncate">
                                            {p.marketName ?? "-"}
                                        </p>
                                        {p.price != null && (
                                            <p className="text-sm">
                                                {new Intl.NumberFormat(
                                                    "ko-KR"
                                                ).format(p.price)}
                                                원
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}
