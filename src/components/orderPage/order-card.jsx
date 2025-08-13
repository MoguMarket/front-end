// file: order-card.jsx

import React from "react";
import { Check } from "lucide-react";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

const KRW = (n) => `${Math.round(n).toLocaleString()}원`;

export default function OrderCard({ item, onClick, onCancel }) {
    const {
        id,
        marketName,
        productName,
        weightLabel,
        imageUrl,
        price,
        originalPrice,
        stepLabel,
        cancellable,
        dDayLabel,
        progress,
    } = item;

    const kgLabel =
        progress && typeof progress.currentKg === "number"
            ? `${progress.currentKg.toFixed(1)}kg`
            : null;

    return (
        <div
            className="rounded-xl border bg-white overflow-hidden"
            style={{ borderColor: "#E6E6E6" }}
        >
            <div className="grid grid-cols-[130px_1fr] min-h-[120px]">
                {/* 왼쪽: 정사각 + 중앙 오버레이(D-n / n kg) */}
                <button
                    type="button"
                    className="relative w-[130px] h-[130px] bg-[#EAEAEA] overflow-hidden rounded-l-xl"
                    onClick={() => onClick?.(id)}
                    aria-label="상품 이미지"
                >
                    <img
                        src={imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-[#00000040]"></div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white leading-tight pointer-events-none">
                        {dDayLabel && (
                            <span className="text-[16px] font-extrabold drop-shadow-md">
                                {dDayLabel}
                            </span>
                        )}
                        {kgLabel && (
                            <span className="mt-0.5 text-[13px] font-semibold drop-shadow-md">
                                {kgLabel}
                            </span>
                        )}
                    </div>
                </button>

                {/* 오른쪽: 정보 영역 */}
                <div className="p-3 pl-3 flex flex-col justify-start">
                    {/* 상단: 마켓 / 취소 */}
                    <div className="flex items-start justify-between">
                        <div
                            className="text-[12px] font-bold"
                            style={{ color: "#4CC554" }}
                        >
                            {marketName}
                        </div>
                        {cancellable && (
                            <button
                                type="button"
                                onClick={() => onCancel?.(id)}
                                className="text-[11px] flex items-center gap-1"
                                style={{ color: "#B0B0B0" }}
                            >
                                취소
                                <ArrowRightIcon className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* 상품명 / 중량 */}
                    <div className="mt-0.2 text-[13px] font-semibold text-[#1A2530] truncate">
                        {productName}{" "}
                        <span className="font-semibold">/ {weightLabel}</span>
                    </div>

                    {/* 원가 / 할인율 / 할인가 */}
                    <div className="mt-1 text-[11.5px] flex items-center gap-2">
                        {originalPrice != null && (
                            <span className="line-through text-[#999999]">
                                {KRW(originalPrice)}
                            </span>
                        )}
                        {originalPrice != null &&
                            price != null &&
                            originalPrice > price && (
                                <span className="font-semibold text-[13px] text-[#FF5555]">
                                    {Math.round(
                                        ((originalPrice - price) /
                                            originalPrice) *
                                            100
                                    )}
                                    %
                                </span>
                            )}
                        {price != null && (
                            <span className="font-semibold text-[13px] text-[#1A2530]">
                                {KRW(price)}
                            </span>
                        )}
                    </div>

                    {/* 결제 예정 금액 */}
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-[#999999]">
                        <span>결제 예정금액</span>
                    </div>

                    {/*  체크 아이콘 + 다음 단계까지 */}
                    <div className="mt-2 -mb-1 flex items-center gap-1 text-[12px] text-[#41484E]">
                        <Check
                            className="w-4 h-4"
                            style={{ color: "#4CC554" }}
                        />
                        <span>다음 단계까지 {stepLabel}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
