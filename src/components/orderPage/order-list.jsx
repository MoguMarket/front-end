// file: order-list.jsx

import React, { useMemo } from "react";
import {
    ArrowLeft,
    ShoppingBag,
    Gift,
    ClipboardList,
    User2,
    ShoppingCart,
} from "lucide-react";
import OrderCard from "./order-card";

export default function OrderList({ items, onItemClick, onCancelItem }) {
    const pages = useMemo(() => {
        const chunks = [];
        for (let i = 0; i < items.length; i += 4) {
            chunks.push(items.slice(i, i + 4));
        }
        return chunks;
    }, [items]);

    return (
        <div className="mx-auto max-w-sm min-h-screen bg-white flex flex-col">
            <div
                className="relative flex items-center justify-center h-14 text-white rounded-b-2xl shadow-sm"
                style={{ backgroundColor: "#4CC554" }}
            >
                <button className="absolute left-3 p-1 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-sm font-semibold">주문 현황</div>
            </div>

            <div className="px-4 pt-3">
                <div
                    className="grid grid-cols-2 rounded-xl p-1 text-sm"
                    style={{ backgroundColor: "#EAEAEA" }}
                >
                    <button
                        className="h-9 rounded-lg font-semibold shadow-sm"
                        style={{ backgroundColor: "#FFFFFF", color: "#4CC554" }}
                    >
                        진행 중
                    </button>
                    <button
                        className="h-9 rounded-lg cursor-not-allowed"
                        disabled
                        style={{ color: "#B0B0B0" }}
                    >
                        픽업 대기
                    </button>
                </div>
            </div>

            <div className="mt-3 flex-1 overflow-hidden">
                <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth h-full hide-scrollbar">
                    {pages.map((page, idx) => (
                        <section
                            key={idx}
                            className="snap-center shrink-0 w-full px-4"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                {page.map((item) => (
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

                <div className="flex items-center justify-center gap-2 py-3">
                    {pages.map((_, i) => (
                        <span
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{
                                backgroundColor:
                                    i === 0 ? "#4CC554" : "#D9D9D9",
                            }}
                        ></span>
                    ))}
                </div>
            </div>

            <nav
                className="sticky bottom-0 left-0 right-0 border-t bg-white"
                style={{ borderColor: "#E6E6E6" }}
            >
                <div className="mx-auto max-w-sm grid grid-cols-5 h-14 text-[11px]">
                    <NavItem
                        icon={<ShoppingBag className="w-5 h-5" />}
                        label="홈"
                    />
                    <NavItem
                        icon={<Gift className="w-5 h-5" />}
                        label="선물하기"
                    />
                    <NavItem
                        active
                        icon={<ClipboardList className="w-5 h-5" />}
                        label="주문현황"
                    />
                    <NavItem
                        icon={<User2 className="w-5 h-5" />}
                        label="내 정보"
                    />
                    <NavItem
                        icon={<ShoppingCart className="w-5 h-5" />}
                        label="장바구니"
                    />
                </div>
            </nav>

            <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    );
}

function NavItem({ icon, label, active = false }) {
    return (
        <button
            className={`flex flex-col items-center justify-center ${
                active ? "text-emerald-600" : "text-gray-500"
            }`}
            style={{ color: active ? "#4CC554" : "#999999" }}
        >
            {icon}
            <span className="mt-0.5">{label}</span>
        </button>
    );
}
