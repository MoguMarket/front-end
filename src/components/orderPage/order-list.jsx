// file: order-list.jsx

import React, {
    useMemo,
    useRef,
    useState,
    useEffect,
    useCallback,
} from "react";
import OrderCard from "./order-card";

export default function OrderList({ items = [], onItemClick, onCancelItem }) {
    // 4개씩 페이지 분할 (1×4)
    const pages = useMemo(() => {
        const chunks = [];
        for (let i = 0; i < items.length; i += 4)
            chunks.push(items.slice(i, i + 4));
        return chunks.length ? chunks : [[]];
    }, [items]);

    // 스크롤 & 페이지 인덱스 상태
    const scrollerRef = useRef(null);
    const [page, setPage] = useState(0);

    // 현재 페이지 계산 (스크롤 이벤트)
    const handleScroll = useCallback(() => {
        const el = scrollerRef.current;
        if (!el) return;
        const w = el.clientWidth;
        const idx = Math.round(el.scrollLeft / (w || 1));
        setPage(Math.max(0, Math.min(idx, pages.length - 1)));
    }, [pages.length]);

    // 도트 클릭 이동
    const goToPage = useCallback((i) => {
        const el = scrollerRef.current;
        if (!el) return;
        const w = el.clientWidth;
        el.scrollTo({ left: i * w, behavior: "smooth" });
        setPage(i);
    }, []);

    useEffect(() => {
        const onResize = () => handleScroll();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [handleScroll]);

    // ========= 마우스 드래그 스크롤
    const dragRef = useRef({ isDown: false, startX: 0, startLeft: 0 });

    const onMouseDown = useCallback((e) => {
        const el = scrollerRef.current;
        if (!el) return;
        dragRef.current.isDown = true;
        dragRef.current.startX = e.pageX - el.offsetLeft;
        dragRef.current.startLeft = el.scrollLeft;
        el.classList.add("cursor-grabbing");
    }, []);

    const endDrag = useCallback(() => {
        const el = scrollerRef.current;
        dragRef.current.isDown = false;
        if (el) el.classList.remove("cursor-grabbing");
    }, []);

    const onMouseMove = useCallback((e) => {
        const el = scrollerRef.current;
        if (!el || !dragRef.current.isDown) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = x - dragRef.current.startX;
        el.scrollLeft = dragRef.current.startLeft - walk;
    }, []);
    // ===========================================

    // 탭(진행 중만 활성)
    const Tabs = (
        <div className="px-4 pt-1">
            <div
                className="grid grid-cols-2 rounded-xl p-1 text-sm"
                style={{ backgroundColor: "#EAEAEA" }}
            >
                <button
                    type="button"
                    className="h-9 rounded-lg font-semibold shadow-sm bg-white"
                    style={{ color: "#4CC554" }}
                >
                    진행 중
                </button>
                <button
                    type="button"
                    className="h-9 rounded-lg cursor-not-allowed"
                    style={{ color: "#B0B0B0" }}
                    disabled
                >
                    픽업 대기
                </button>
            </div>
        </div>
    );

    return (
        <div className="mx-auto max-w-sm bg-white flex flex-col">
            {Tabs}

            {/* 가로 스와이프 */}
            <div className="mt-3 flex-1 overflow-hidden">
                <div
                    ref={scrollerRef}
                    onScroll={handleScroll}
                    onMouseDown={onMouseDown}
                    onMouseUp={endDrag}
                    onMouseLeave={endDrag}
                    onMouseMove={onMouseMove}
                    className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth h-full hide-scrollbar cursor-grab select-none"
                    role="region"
                    aria-label="주문 진행중 슬라이더"
                    style={{ WebkitOverflowScrolling: "touch" }}
                >
                    {pages.map((pageItems, idx) => (
                        <section
                            key={idx}
                            className="snap-start shrink-0 min-w-full px-0"
                        >
                            <div className="flex flex-col gap-3">
                                {pageItems.map((item) => (
                                    <OrderCard
                                        key={item.id}
                                        item={item}
                                        onClick={onItemClick}
                                        onCancel={onCancelItem}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* 도트 인디케이터 (실시간 활성 페이지 반영 + 클릭 이동) */}
                <div className="flex items-center justify-center gap-2 py-3">
                    {pages.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => goToPage(i)}
                            className="w-2 h-2 rounded-full transition-all"
                            style={{
                                backgroundColor:
                                    i === page ? "#4CC554" : "#D9D9D9",
                            }}
                            aria-label={`페이지 ${i + 1}로 이동`}
                        />
                    ))}
                </div>
            </div>

            {/* 스크롤바 숨김 */}
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
