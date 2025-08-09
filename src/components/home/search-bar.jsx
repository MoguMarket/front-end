// components/home/search-bar.jsx
import { Search } from "lucide-react";
import { useFilters } from "./filters-context";

export default function SearchBar({ placeholder = "상품을 검색하세요" }) {
    const { query, setQuery } = useFilters();

    return (
        <div className="relative left-1/2 -translate-x-1/2 w-screen px-4">
            <form
                onSubmit={(e) => e.preventDefault()}
                className="relative mt-2 md:mt-3 w-full mx-auto
           max-w-[300px] md:max-w-[400px] lg:max-w-[370px]"
            >
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4CC554]"
                    size={18}
                />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    aria-label="상품 검색"
                    className="w-full h-10 md:h-11 pl-10 pr-3 rounded-xl border border-[#4CC554] bg-white shadow-sm text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#4CC554] focus:border-[#4CC554]"
                />
            </form>
        </div>
    );
}
