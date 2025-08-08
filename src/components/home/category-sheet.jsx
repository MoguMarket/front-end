// src/components/home/category-sheet.jsx
import { createPortal } from "react-dom";
import { Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion"; // ← 이 한 줄만
import { MAX_FAV, useFilters } from "./filters-context";
import SearchBar from "./search-bar";

export default function CategorySheet() {
    const {
        allCategories,
        favorites,
        commitFavorites,
        setCategory,
        isCatPanelOpen,
        setCatPanelOpen,
    } = useFilters();

    const [editMode, setEditMode] = useState(false);
    const [draft, setDraft] = useState(favorites);
    useEffect(() => setDraft(favorites), [favorites, isCatPanelOpen]);

    const canAdd = draft.length < MAX_FAV;
    const toggle = (c) => {
        if (!editMode) {
            setCategory(c);
            setCatPanelOpen(false);
            return;
        }
        if (draft.includes(c)) setDraft(draft.filter((x) => x !== c));
        else if (canAdd) setDraft([...draft, c]);
    };

    const onSave = async () => {
        await commitFavorites(draft);
        setCatPanelOpen(false);
    };

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setCatPanelOpen(false);
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [setCatPanelOpen]);

    const sheet = (
        <AnimatePresence>
            {isCatPanelOpen && (
                <>
                    <motion.div
                        key="overlay"
                        className="fixed inset-0 bg-black/30 z-40"
                        onClick={() => setCatPanelOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <motion.div
                        key="panel"
                        className="fixed left-1/2 -translate-x-1/2 top-3 z-50 w-[calc(100%-20px)] max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden"
                        initial={{ y: -12, opacity: 0, scale: 0.98 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -12, opacity: 0, scale: 0.98 }}
                        transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 28,
                        }}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label="카테고리 선택"
                    >
                        <div className="p-3 bg-[#62c05a]">
                            <SearchBar placeholder="상품을 검색하세요" />
                        </div>

                        <div className="p-3">
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-base font-semibold">
                                    카테고리
                                </h3>
                                <button
                                    className="p-1 rounded-md hover:bg-gray-100"
                                    onClick={() => setCatPanelOpen(false)}
                                    aria-label="카테고리 패널 닫기"
                                >
                                    <Minus size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2">
                                {allCategories.map((c) => {
                                    const active = draft.includes(c);
                                    const base =
                                        "px-4 py-2 rounded-full border text-sm text-center transition";
                                    const cls = editMode
                                        ? active
                                            ? "bg-green-50 text-green-700 border-green-500"
                                            : `bg-white text-gray-700 border-gray-200 ${
                                                  canAdd
                                                      ? "hover:bg-gray-50"
                                                      : "opacity-50 cursor-not-allowed"
                                              }`
                                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50";
                                    const disabled =
                                        editMode && !active && !canAdd;

                                    return (
                                        <button
                                            key={c}
                                            className={`${base} ${cls}`}
                                            onClick={() => toggle(c)}
                                            disabled={disabled}
                                        >
                                            {c}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-3 mb-1 flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm select-none">
                                    <span>즐겨찾기 편집</span>
                                    <span
                                        onClick={() => setEditMode(!editMode)}
                                        className={`w-11 h-6 rounded-full relative cursor-pointer transition ${
                                            editMode
                                                ? "bg-green-500"
                                                : "bg-gray-300"
                                        }`}
                                        aria-checked={editMode}
                                        role="switch"
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition ${
                                                editMode ? "translate-x-5" : ""
                                            }`}
                                        />
                                    </span>
                                </label>

                                <button
                                    onClick={onSave}
                                    className="px-5 py-2 rounded-full bg-green-500 text-white font-medium"
                                >
                                    저장
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    return createPortal(sheet, document.body);
}
