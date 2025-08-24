// src/components/groupBuy/proup-buy-progress.jsx
import { Check } from "lucide-react";

/**
 * 기대 입력(product):
 * - progressCurrent: number (현재 수량, kg 기준이라 가정)
 * - progressMax: number (목표 수량)
 * - currentDiscountPercent: number
 * - discountedPrice: number (현재 단가: 1kg 기준이라 가정)
 * - remainingToNextStage: number | null
 * - endAt: ISO string | null
 * - unit: "KG" | ...  (없으면 KG로 가정)
 */
export default function GroupBuyProgress({ product }) {
  const unit = (product?.unit || "KG").toUpperCase();

  // 진행도 계산
  const current = Number(product?.progressCurrent ?? 0);
  const target = Number(product?.progressMax ?? 0);
  const percent =
    target > 0
      ? Math.max(0, Math.min(100, Math.round((current / target) * 100)))
      : 0;

  // D-day
  const now = new Date();
  const endAt = product?.endAt ? new Date(product.endAt) : null;
  const daysLeft =
    endAt != null
      ? Math.max(
          0,
          Math.ceil((endAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        )
      : null;

  // 현재 할인율 / 현재 100g 단가
  const discountPercent = Number(product?.currentDiscountPercent ?? 0);
  // discountedPrice를 1kg 기준으로 보고 100g 단가로 환산 (단위가 KG인 경우)
  const pricePer100g =
    unit === "KG" && Number.isFinite(product?.discountedPrice)
      ? Math.round(Number(product.discountedPrice) / 10)
      : null;

  // 다음 단계까지 남은 kg
  const remainToNext =
    product?.remainingToNextStage != null
      ? Number(product.remainingToNextStage)
      : target > 0
      ? Math.max(0, +(target - current).toFixed(1))
      : null;

  // ---- 원형 그래프 값 ----
  const size = 100;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const filled = (C * percent) / 100;
  const empty = C - filled;

  return (
    <div className="w-full mt-[-5px]">
      <div className="mt-3 flex flex-col items-center">
        <div className="flex items-center gap-2">
          {/* 원형 진행 그래프 */}
          <div className="relative">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              {/* 배경 */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke="#e5e7eb"
                strokeWidth={stroke}
                fill="none"
              />
              {/* 진행 */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke="#4dc554"
                strokeWidth={stroke}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${filled} ${empty}`}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </svg>

            {/* 중앙 텍스트 (현재 수량 + 단위 kg 가정) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[22px] text-gray-800">
                {Number.isFinite(current) ? current : 0}
                <span className="ml-1 text-base font-semibold text-gray-500">
                  {unit === "KG" ? "kg" : unit}
                </span>
              </span>
            </div>
          </div>

          {/* 우측 텍스트 정보 */}
          <div className="flex flex-col items-start">
            {/* D-n */}
            {daysLeft != null && (
              <div className="text-[20px] font-semibold leading-tight text-gray-900">
                D-{daysLeft}
              </div>
            )}

            {/* 현재 할인율 */}
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-gray-500 font-light">
                현재 할인율
              </span>
              <span className="text-[20px] font-semibold text-red-500">
                {discountPercent}%
              </span>
            </div>

            {/* 100g당 가격 & 다음 단계까지 */}
            <div className="mt-1 flex items-center gap-4">
              {pricePer100g != null && (
                <>
                  <span className="text-xs text-gray-500">100g당</span>
                  <span className="ml-[-8px] text-sm font-semibold text-gray-900">
                    {pricePer100g.toLocaleString()}원
                  </span>
                </>
              )}

              {remainToNext != null && (
                <div className="flex items-center gap-1 text-gray-700">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-xs">
                    다음 단계까지
                    <span className="font-semibold text-xs text-gray-900 ml-1">
                      {remainToNext}
                      {unit === "KG" ? "kg" : unit}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* 목표치 표시 (선택) */}
            {Number.isFinite(target) && target > 0 && (
              <div className="mt-1 text-xs text-gray-500">
                목표: {target}
                {unit === "KG" ? "kg" : unit} / 진행률 {percent}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
