// components/home/search-bar.jsx
import { Search } from "lucide-react";
import { useFilters } from "./filters-context";

export default function SearchBar({ placeholder = "상품을 검색하세요" }) {
    const { query, setQuery } = useFilters();

    return (
        <form onSubmit={(e) => e.preventDefault()} className="relative">
            <Search
                className="absolute left-3 top-1/2 -translate-y-1/2"
                size={18}
            />
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                aria-label="상품 검색"
                className="w-full h-12 pl-10 pr-3 rounded-xl border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
        </form>
    );
}
