// src/components/orderPage/orderCard.jsx

import React from "react";
import { CheckIcon } from "@heroicons/react/20/solid";

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

    // 원형 진행 링
    const r = 46;
    const C = 2 * Math.PI * r;
    const dashOffset = C * (1 - percent / 100);

    return (
        <div
            role="button"
            onClick={handleClick}
            className="-mx-[12px] w-[calc(100%+24px)] max-w-[calc(100vw-24px)]
                 grid grid-cols-[11rem_minmax(0,1fr)] items-center gap-3
                 rounded-sm border border-gray-200 bg-white py-0 pr-4 pl-0
                 shadow-sm transition active:scale-[0.99] overflow-hidden"
        >
            {/* 왼쪽 이미지 (링은 그대로) */}
            <div className="relative w-40 h-[9.5rem]">
                <div className="absolute inset-0 overflow-hidden rounded-l-sm">
                    <img
                        src={imageUrl}
                        alt={productName}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gray-900/30" />
                </div>

                {/* 원형 진행 링 */}
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
                {/* 상단 라벨/취소 */}
                <div className="flex items-start justify-between">
                    <span className="text-xs font-medium text-emerald-600">
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

                {/* 상품명 */}
                <div className="mt-0.5 truncate text-[14px] leading-snug font-semibold text-gray-900">
                    {productName}{" "}
                    <span className="font-normal text-gray-500">
                        / {weightLabel}
                    </span>
                </div>

                {/* 보조 라벨 */}
                <div className="mt-0.5 text-[11px] text-gray-400">
                    결제 예정금액
                </div>

                {/* 가격 라인: 왼쪽(원가/할인) + 오른쪽(현재가) */}
                <div className="mt-0.5 grid grid-cols-[1fr_auto] items-baseline gap-2">
                    {/* 왼쪽: 공간이 모자라면 '원가'만 먼저 잘림, 할인율은 항상 노출 */}
                    <div className="min-w-0 flex items-baseline gap-2">
                        {originalPrice != null && (
                            <span className="max-w-[8rem] truncate text-[12px] text-gray-400 line-through">
                                {number(originalPrice)}원
                            </span>
                        )}
                        {discountRate > 0 && (
                            <span className="flex-shrink-0 text-[12px] font-semibold text-[#FF5555] whitespace-nowrap">
                                {Math.round(discountRate * 100)}%
                            </span>
                        )}
                    </div>

                    {/* 오른쪽: 현재가는 항상 한 줄 유지 */}
                    <span className="shrink-0 text-[16px] font-extrabold whitespace-nowrap">
                        {number(price)}
                        <span className="ml-0.5 font-bold">원</span>
                    </span>
                </div>

                {/* 진행 상태 */}
                <div className="mt-1 flex items-center gap-1.5 text-[12px]">
                    <CheckIcon
                        className="h-4 w-4 text-emerald-600 shrink-0"
                        aria-hidden="true"
                    />
                    <span className="text-gray-600">다음 단계까지</span>
                    <span className="font-semibold text-gray-900">
                        {stepLabel}
                    </span>
                </div>
            </div>
        </div>
    );
}
