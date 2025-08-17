import React, { useEffect } from "react";

export default function ConfirmLocationModal({
    open,
    title = "상점 위치 확인이 필요합니다.",
    message = "현재 위치가 상점입니까?",
    onYes,
    onNo,
    onClose,
}) {
    // ESC 키로 닫기
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            {/* 반투명 배경 */}
            <div className="absolute inset-0 bg-black/20" />

            {/* 카드 */}
            <div
                className="relative z-10 w-[360px] rounded-2xl bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()} // 카드 클릭은 닫히지 않게
            >
                {/* 상단 닫기 버튼 */}
                <button
                    onClick={onClose}
                    aria-label="닫기"
                    className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
                >
                    ✕
                </button>

                {/* 본문 */}
                <div className="p-5">
                    <p className="text-[15px] font-semibold text-neutral-800">
                        {title}
                    </p>
                    <p className="mt-1 text-[14px] text-neutral-600">
                        {message}
                    </p>

                    {/* 액션 버튼 */}
                    <div className="mt-4 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onNo}
                            className="h-10 flex-1 rounded-lg bg-[#3B3B3B] text-white text-[14px] font-semibold"
                        >
                            아니오
                        </button>
                        <button
                            type="button"
                            onClick={onYes}
                            className="h-10 flex-1 rounded-lg bg-[#4CC554] text-white text-[14px] font-semibold"
                        >
                            네
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
