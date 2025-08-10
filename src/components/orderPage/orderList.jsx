// src/components/orderPage/orderList.jsx

import React from "react";
import OrderCard from "./orderCard";
export default function OrderList({
    items = [],
    loading = false,
    error = null,
    onItemClick,
    onCancelItem,
    showSectionHeader = true,
}) {
    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-24 animate-pulse rounded-2xl bg-gray-100"
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
            </div>
        );
    }

    if (!items.length) {
        return (
            <div className="rounded-xl border border-gray-200 p-6 text-center text-sm text-gray-500">
                주문 내역이 없습니다.
            </div>
        );
    }

    const inProgress = items.filter((i) => i.status === "IN_PROGRESS");
    const ready = items.filter((i) => i.status === "READY_FOR_PICKUP");

    return (
        <div className="space-y-6">
            {inProgress.length > 0 && (
                <section>
                    {showSectionHeader && (
                        <h2 className="mb-3 text-sm font-semibold text-emerald-600">
                            진행 중
                        </h2>
                    )}
                    <div className="space-y-3">
                        {inProgress.map((item) => (
                            <OrderCard
                                key={item.id}
                                item={item}
                                onClick={onItemClick}
                                onCancel={onCancelItem}
                            />
                        ))}
                    </div>
                </section>
            )}

            {ready.length > 0 && (
                <section>
                    {showSectionHeader && (
                        <h2 className="mb-3 text-sm font-semibold text-emerald-600">
                            픽업 대기
                        </h2>
                    )}
                    <div className="space-y-3">
                        {ready.map((item) => (
                            <OrderCard
                                key={item.id}
                                item={item}
                                onClick={onItemClick}
                                onCancel={onCancelItem}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
