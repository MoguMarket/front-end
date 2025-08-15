// file: order-list.jsx

import React, { useMemo, useState } from "react";
import OrderCard from "./order-card";
import { PICKUP_WAITING_ORDERS } from "../db/pickup-info";

export default function OrderList({
    items = [],
    onItemClick,
    onCancelItem,
    onMarketClick,
}) {
    const [activeTab, setActiveTab] = useState("inProgress");

    // 현재 탭에 따라 보여줄 데이터
    const currentItems = useMemo(
        () => (activeTab === "inProgress" ? items : PICKUP_WAITING_ORDERS),
        [activeTab, items]
    );

    // 탭
    const Tabs = (
        <div className="pt-1">
            <div
                className="relative grid grid-cols-2 rounded-xl p-1 text-sm"
                style={{ backgroundColor: "#EAEAEA" }}
                role="tablist"
                aria-label="주문 상태"
            >
                {/* 하얀 박스 인디케이터 */}
                <div
                    aria-hidden="true"
                    className={`absolute inset-y-1 left-1 w-1/2 rounded-lg bg-white shadow-sm transition-transform duration-300 ease-out ${
                        activeTab === "pickup"
                            ? "translate-x-full"
                            : "translate-x-0"
                    }`}
                    style={{ transform: undefined }}
                />

                {/* 진행 중 탭 */}
                <button
                    type="button"
                    onClick={() => setActiveTab("inProgress")}
                    className="relative z-10 h-9 rounded-lg font-semibold"
                    style={{
                        color:
                            activeTab === "inProgress" ? "#4CC554" : "#7C7C7C",
                    }}
                    role="tab"
                    aria-selected={activeTab === "inProgress"}
                >
                    진행 중
                </button>

                {/* 픽업 대기 탭 */}
                <button
                    type="button"
                    onClick={() => setActiveTab("pickup")}
                    className="relative z-10 h-9 rounded-lg font-semibold"
                    style={{
                        color: activeTab === "pickup" ? "#4CC554" : "#7C7C7C",
                    }}
                    role="tab"
                    aria-selected={activeTab === "pickup"}
                >
                    픽업 대기
                </button>
            </div>
        </div>
    );

    return (
        <div className="mx-auto max-w-sm bg-white flex flex-col">
            {Tabs}

            <div className="mt-3">
                <div className="flex flex-col gap-3">
                    {currentItems.map((item) => (
                        <OrderCard
                            key={item.id}
                            item={item}
                            onClick={onItemClick}
                            onCancel={onCancelItem}
                            onMarketClick={onMarketClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
