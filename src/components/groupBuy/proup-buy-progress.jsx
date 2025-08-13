// components/groupBuy/GroupBuyProgress.jsx
import { RotateCw, CheckCircle2, Check } from "lucide-react";

export default function GroupBuyProgress({ product }) {
  const discountPercent = Number(product?.discountRate ?? 15);

  const daysLeft = 7;
  const currentTotalKg = 10.5;
  const targetKg = 15;
  const pricePer100g = 214;

  const nextStepRemainKg = Math.max(0, +(targetKg - currentTotalKg).toFixed(1));

  const size = 100;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const percent = Math.max(
    0,
    Math.min(100, Math.round((currentTotalKg / targetKg) * 100))
  );
  const dash = C;
  const gap = C - (C * percent) / 100;

  return (
    <div className="w-full  mt-[-5px]">
      <div className="mt-3 flex flex-col items-center">
        <div className="flex items-center gap-2">
          {/* 원형 진행 그래프 */}
          <div className="relative">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
                strokeDasharray={`${dash} ${gap}`}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </svg>

            {/* 중앙 텍스트 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[22px] text-gray-800">
                {currentTotalKg}
                <span className="ml-1 text-base font-semibold text-gray-500">
                  kg
                </span>
              </span>
            </div>
          </div>

          {/* 우측 텍스트 정보 */}
          <div className="flex flex-col items-start">
            {/* D-n */}
            <div className="text-[20px] font-semibold leading-tight text-gray-900">
              D-{daysLeft}
            </div>

            {/* 현재 할인율 (같은 줄) */}
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-gray-500 font-light">
                현재 할인율
              </span>
              <span className="text-[20px] font-semibold text-red-500">
                {discountPercent}%
              </span>
            </div>

            {/* 100g당 가격 & 다음 단계까지 (같은 줄) */}
            <div className="mt-1 flex items-center gap-4">
              <span className="text-xs text-gray-500">100g당</span>
              <span className="ml-[-8px] text-sm font-semibold text-gray-900">
                {pricePer100g}원
              </span>

              <div className="flex items-center gap-1 text-gray-700">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-xs">
                  다음 단계까지
                  <span className="font-semibold text-xs text-gray-900 ml-1">
                    {nextStepRemainKg}kg
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
