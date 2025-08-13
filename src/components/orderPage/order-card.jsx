// file: order-card.jsx

import React from "react";
import { X } from "lucide-react";

export default function OrderCard({ item, onClick, onCancel }) {
    return (
        <div className="rounded-xl border" style={{ borderColor: "#E6E6E6" }}>
            <div className="p-3 flex gap-3">
                <div
                    className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-[#EAEAEA] cursor-pointer"
                    onClick={() => onClick?.(item.id)}
                >
                    <img
                        src={item.thumb}
                        alt="상품 이미지"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div
                            className="text-xs font-semibold"
                            style={{ color: "#4CC554" }}
                        >
                            {item.market}
                        </div>
                        <button
                            className="text-xs flex items-center gap-1"
                            style={{ color: "#B0B0B0" }}
                            onClick={() => onCancel?.(item.id)}
                        >
                            <X className="w-3.5 h-3.5" /> 취소
                        </button>
                    </div>
                    <div className="mt-0.5 text-[13px] font-semibold text-[#1A2530] truncate">
                        {item.product}
                    </div>

                    <div
                        className="mt-2 text-[11px]"
                        style={{ color: "#999999" }}
                    >
                        {item.priceNoteLabel}
                    </div>
                    <div className="mt-0.5 text-sm">
                        <span
                            className="font-bold"
                            style={{ color: "#4CC554" }}
                        >
                            공동할인 {item.discountRate}%{" "}
                        </span>
                        <span className="font-semibold text-[#1A2530]">
                            {item.discountedPrice}
                        </span>
                    </div>

                    <div
                        className="mt-2 flex items-center gap-2 text-xs"
                        style={{ color: "#41484E" }}
                    >
                        <span
                            className="inline-block w-2 h-2 rounded-full"
                            style={{ backgroundColor: "#4CC554" }}
                        ></span>
                        <span>{item.nextTierLeft}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
