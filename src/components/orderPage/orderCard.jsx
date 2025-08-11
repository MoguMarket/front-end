// src/components/orderPage/orderCard.jsx

import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

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

    // 링 계산
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
            {/* 왼쪽 이미지 (링 크기는 유지) */}
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
            <div
                className="min-w-50 pr-10
                [&_p]:leading-tight [&_p]:tracking-[-0.01em] [&_p]:tabular-nums"
            >
                {/* '진골마켓' */}
                <p className="text-xs font-medium text-emerald-600">
                    {marketName}
                </p>

                {/* '국내산 홍당근 / 1.5kg' */}
                <p className="mt-0.5 text-[14px] font-semibold text-gray-900 truncate">
                    {productName}
                    <span className="font-normal text-gray-500">
                        {" "}
                        / {weightLabel}
                    </span>
                </p>

                {/* '결제 예정금액' */}
                <p className="mt-0.5 text-[11px] text-gray-400">
                    결제 예정금액
                </p>

                {/* '3,780원 15%  3,213원' (왼쪽: 원가/할인, 오른쪽: 현재가) */}
                <p className="mt-0.5 grid grid-cols-[1fr_auto] items-baseline gap-2">
                    <span className="min-w-0 flex items-baseline gap-2">
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
                    </span>

                    <span className="shrink-0 text-[16px] font-extrabold whitespace-nowrap">
                        {number(price)}
                        <span className="ml-0.5 font-bold">원</span>
                    </span>
                </p>

                {/* '다음 단계까지 4.5kg' */}
                <p className="mt-1 flex items-center gap-1.5 text-[12px]">
                    <CheckIcon
                        className="h-4 w-4 text-emerald-600 shrink-0"
                        aria-hidden="true"
                    />
                    <span className="text-gray-600">다음 단계까지</span>
                    <span className="font-semibold text-gray-900">
                        {stepLabel}
                    </span>
                </p>
            </div>
        </div>
    );
}
