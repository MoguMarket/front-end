// src/components/orderPage/orderCard.jsx

import React from "react";

export default function OrderCard({ item, onClick, onCancel }) {
    const {
        id,
        marketName,
        productName,
        weightLabel,
        imageUrl,
        discountRate = 0,
        price = 0,
        originalPrice,
        status,
        stepLabel,
        progress,
        dDayLabel,
        cancellable,
    } = item || {};

    const number = (n) =>
        new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(
            n || 0
        );

    const percent =
        progress && progress.maxKg
            ? Math.min(
                  100,
                  Math.round((progress.currentKg / progress.maxKg) * 100)
              )
            : 0;

    const isReady = status === "READY_FOR_PICKUP";
    const handleClick = () => onClick && onClick(id);
    const handleCancel = (e) => {
        e.stopPropagation();
        onCancel && onCancel(id);
    };

    // 원형 진행 링 계산
    const r = 46;
    const C = 2 * Math.PI * r;
    const dashOffset = C * (1 - percent / 100);

    return (
        <div
            role="button"
            onClick={handleClick}
            className="grid grid-cols-[7rem_1fr] items-center gap-3 rounded-sm border border-gray-200 bg-white py-0 pr-3 pl-0 shadow-sm transition active:scale-[0.99]"
        >
            <div className="relative w-28 aspect-square">
                <div className="absolute inset-0 overflow-hidden rounded-l-sm">
                    <img
                        src={imageUrl}
                        alt={productName}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gray-900/30" />
                </div>

                {/* 원형 진행 아이콘 */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-28 w-28 -translate-x-1/2 -translate-y-1/2">
                    <svg
                        viewBox="0 0 100 100"
                        className="h-full w-full"
                        aria-hidden
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r={r}
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r={r}
                            fill="none"
                            stroke="#4CC554"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={C}
                            strokeDashoffset={dashOffset}
                            transform="rotate(-90 50 50)"
                        />
                    </svg>

                    {/* 링 내부 텍스트 */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center">
                        <div className="leading-tight text-white drop-shadow">
                            {dDayLabel && (
                                <div className="text-[12px] font-bold">
                                    {dDayLabel}
                                </div>
                            )}
                            {progress?.currentKg != null && (
                                <div className="text-[14px] font-semibold">
                                    {progress.currentKg.toFixed(1)}kg
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 오른쪽 본문 */}
            <div className="min-w-0">
                <div className="flex items-start justify-between">
                    <span className="text-[11px] font-medium text-emerald-600">
                        {marketName}
                    </span>
                    {cancellable && !isReady && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="text-xs text-gray-400 hover:text-gray-600"
                            aria-label="주문 취소"
                        >
                            취소 &gt;
                        </button>
                    )}
                </div>

                <div className="mt-0.5 line-clamp-1 text-sm font-medium text-gray-900">
                    {productName}{" "}
                    <span className="text-gray-500">/ {weightLabel}</span>
                </div>

                <div className="mt-1 flex items-baseline gap-2">
                    {originalPrice != null && (
                        <span className="text-xs text-gray-400 line-through">
                            {number(originalPrice)}원
                        </span>
                    )}
                    {discountRate > 0 && (
                        <span className="text-xs text-[#FF5555]">
                            {Math.round(discountRate * 100)}%
                        </span>
                    )}
                    <span className="text-sm font-semibold">
                        {number(price)}원
                    </span>
                </div>

                <div className="mt-1 flex items-center gap-1 text-[11px]">
                    {isReady ? (
                        <span className="text-emerald-600">결제 완료</span>
                    ) : (
                        <>
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                <svg
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-3 w-3"
                                    aria-hidden
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-7.071 7.071a1 1 0 01-1.414 0L3.293 9.95a1 1 0 011.414-1.414l3.09 3.09 6.364-6.364a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                            <span className="text-gray-700">다음 단계까지</span>
                            <span className="font-medium text-gray-900">
                                {stepLabel}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
