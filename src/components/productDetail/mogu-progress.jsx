// src/components/productDetail/mogu-progress.jsx
import { RotateCw, CheckCircle2 } from "lucide-react";

export default function MoguProgress({
    startAt,
    endAt,
    currentQty,
    targetQty,
    remainingToNextStage,
    currentDiscountPercent,
    appliedUnitPrice,
}) {
    const now = new Date();
    const end = endAt ? new Date(endAt) : null;
    const daysLeft = end
        ? Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)))
        : null;

    const currentTotalKg = currentQty ?? 0;
    const targetKg = targetQty ?? 0;
    const nextStepRemainKg = remainingToNextStage ?? 0;

    const size = 132;
    const stroke = 14;
    const r = (size - stroke) / 2;
    const C = 2 * Math.PI * r;

    const progress =
        targetKg > 0 ? Math.min(1, Math.max(0, currentTotalKg / targetKg)) : 0;

    return (
        <div className="w-full p-4">
            <div className="flex items-center">
                <div className="flex-1 text-center">
                    <h3 className="text-[16px] font-semibold text-green-600">
                        모여서 구매가 진행 중이에요!
                    </h3>
                    {startAt && endAt && (
                        <p className="mt-1 text-sm text-gray-400">
                            ({new Date(startAt).toLocaleDateString()} ~{" "}
                            {new Date(endAt).toLocaleDateString()})
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    className="ml-auto shrink-0 rounded-full text-gray-400 hover:bg-gray-50 mt-[-20px] cursor-pointer"
                    aria-label="새로고침"
                >
                    <RotateCw className="h-5 w-5" />
                </button>
            </div>

            <div className="mt-3 flex flex-col items-center">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <svg
                            width={size}
                            height={size}
                            viewBox={`0 0 ${size} ${size}`}
                        >
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={r}
                                stroke="#e5e7eb"
                                strokeWidth={stroke}
                                fill="none"
                            />
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={r}
                                stroke="#4dc554"
                                strokeWidth={stroke}
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={C}
                                strokeDashoffset={C * (1 - progress)}
                                transform={`rotate(-90 ${size / 2} ${
                                    size / 2
                                })`}
                                style={{
                                    transition: "stroke-dashoffset 400ms ease",
                                }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[22px] font-bold text-gray-800">
                                {currentTotalKg}
                                <span className="ml-1 text-base font-semibold text-gray-500">
                                    kg
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-start">
                        {daysLeft != null && (
                            <div className="text-[20px] font-semibold leading-tight text-gray-900">
                                D-{daysLeft}
                            </div>
                        )}
                        <div className="mt-1 text-sm text-gray-500 font-light">
                            현재 할인율
                        </div>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-[20px] font-semibold text-red-500">
                                {currentDiscountPercent ?? 0}%
                            </span>
                            <span className="text-[20px] font-semibold text-gray-900">
                                {appliedUnitPrice
                                    ? `${appliedUnitPrice.toLocaleString()}원`
                                    : "-"}
                            </span>
                        </div>
                    </div>
                </div>

                {nextStepRemainKg != null && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">
                            다음 단계까지
                            <span className="font-extrabold text-gray-900 ml-1">
                                {nextStepRemainKg}kg
                            </span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
