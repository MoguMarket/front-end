// src/components/home/category-filter.jsx
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useFilters } from "./filters-context";
import CategorySheet from "./category-sheet";

export default function CategoryFilter({ title = "카테고리" }) {
    const { favorites, setCategory, isCatPanelOpen, setCatPanelOpen } =
        useFilters();

    return (
        <div className="mt-5 relative">
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-base font-semibold">{title}</h3>
                <button
                    type="button"
                    aria-label="카테고리 전체보기"
                    onClick={() => setCatPanelOpen(true)}
                    className="p-1.5 rounded-full border border-gray-200"
                >
                    <Plus size={18} />
                </button>
            </div>

            <div className="flex gap-2 overflow-x-auto">
                {favorites.map((c) => (
                    <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className="px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shrink-0"
                    >
                        {c}
                    </button>
                ))}
            </div>
            {isCatPanelOpen && <CategorySheet />}
        </div>
    );
}
