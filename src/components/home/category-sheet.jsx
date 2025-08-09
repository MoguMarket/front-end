import { createPortal } from "react-dom";
import { Minus } from "lucide-react";
import { useEffect, useState, useLayoutEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MAX_FAV, useFilters } from "./filters-context";

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

    const closeWithSave = async () => {
        await commitFavorites(draft);
        setCatPanelOpen(false);
    };

    const [geom, setGeom] = useState({ left: 8, width: 360, top: 64 });

    const recompute = useCallback(() => {
        const container =
            document.querySelector("[data-home-container]") ||
            document.querySelector("main");
        const topbar =
            document.querySelector("[data-topbar]") ||
            document.querySelector("header");

        const cr = container?.getBoundingClientRect();
        const tr = topbar?.getBoundingClientRect();

        const top = (tr?.bottom ?? 0) + 8;
        const left = cr ? cr.left : 8;
        const width = cr
            ? cr.width
            : Math.max(320, window.innerWidth - left * 2);

        setGeom({ left, width, top });
    }, []);

    useLayoutEffect(() => {
        if (!isCatPanelOpen) return;
        recompute();
        window.addEventListener("resize", recompute);
        window.addEventListener("scroll", recompute, true);
        return () => {
            window.removeEventListener("resize", recompute);
            window.removeEventListener("scroll", recompute, true);
        };
    }, [isCatPanelOpen, recompute]);

    useEffect(() => {
        if (!isCatPanelOpen) return;
        const onKey = (e) => e.key === "Escape" && setCatPanelOpen(false);
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [isCatPanelOpen, setCatPanelOpen]);

    const sheet = (
        <AnimatePresence>
            {isCatPanelOpen && (
                <>
                    <motion.div
                        key="overlay"
                        className="fixed inset-x-0 bottom-0 bg-transparent z-40"
                        style={{ top: geom.top }}
                        onClick={closeWithSave}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <motion.div
                        key="panel"
                        className="fixed z-50 rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden"
                        style={{
                            left: geom.left,
                            width: geom.width,
                            top: geom.top,
                        }}
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
                        <div className="px-3 pt-3 pb-3">
                            <div className="mb-2 flex items-center justify-between flex-nowrap">
                                <h3 className="text-base font-semibold m-0">
                                    카테고리
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setCatPanelOpen(false)}
                                    aria-label="카테고리 패널 최소화"
                                    className="p-1 text-gray-600 hover:opacity-70 shrink-0"
                                >
                                    <Minus size={16} />
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 py-1">
                                {allCategories.map((c) => {
                                    const active = draft.includes(c);
                                    const base =
                                        "px-3 py-1.5 rounded-full border text-[13px] leading-none text-center transition whitespace-nowrap";
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
                                            type="button"
                                            className={`${base} ${cls} shrink-0`}
                                            onClick={() => toggle(c)}
                                            disabled={disabled}
                                        >
                                            {c}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-3 mb-1">
                                <label className="inline-flex items-center gap-2 text-sm select-none">
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
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    return createPortal(sheet, document.body);
}
