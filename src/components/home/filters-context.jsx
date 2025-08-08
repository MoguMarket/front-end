// src/components/home/filters-context.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FiltersContext = createContext(null);
export const MAX_FAV = 4;

const DEFAULT_CATEGORIES = [
    "농산",
    "수산",
    "축산",
    "떡/과자",
    "가공식품",
    "건강식품",
    "동물용품",
    "반찬",
    "욕실",
    "의류/잡화",
    "주방",
];

function loadFavs(lsKey) {
    try {
        const saved = JSON.parse(localStorage.getItem(lsKey) || "[]");
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

export function FilterProvider({
    children,
    allCategories = DEFAULT_CATEGORIES,
    initialFavorites = [],
    onSaveFavorites = async () => {},
    userKey = "guest",
}) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("전체");
    const [isCatPanelOpen, setCatPanelOpen] = useState(false);

    const lsKey = `favCategories:${userKey}`;
    const [favorites, setFavorites] = useState(() => {
        if (initialFavorites?.length) return initialFavorites.slice(0, MAX_FAV);
        return loadFavs(lsKey);
    });

    useEffect(() => {
        if (initialFavorites?.length) {
            setFavorites(initialFavorites.slice(0, MAX_FAV));
        } else {
            setFavorites(loadFavs(lsKey));
        }
    }, [userKey]);

    const commitFavorites = async (next) => {
        const deduped = Array.from(new Set(next)).slice(0, MAX_FAV);
        setFavorites(deduped);
        try {
            localStorage.setItem(lsKey, JSON.stringify(deduped));
        } catch {}
        try {
            await onSaveFavorites(deduped);
        } catch (e) {
            console.error("onSaveFavorites failed:", e);
        }
    };

    const value = useMemo(
        () => ({
            query,
            setQuery,
            category,
            setCategory,
            allCategories,
            favorites,
            setFavorites,
            commitFavorites,
            isCatPanelOpen,
            setCatPanelOpen,
        }),
        [query, category, allCategories, favorites, isCatPanelOpen]
    );

    return (
        <FiltersContext.Provider value={value}>
            {children}
        </FiltersContext.Provider>
    );
}

export function useFilters() {
    const ctx = useContext(FiltersContext);
    if (!ctx)
        throw new Error("useFilters must be used within <FilterProvider>");
    return ctx;
}
