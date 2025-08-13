// MoguProgress.jsx
import { RotateCw, CheckCircle2 } from "lucide-react";

export default function MoguProgress() {
  const periodStart = "25.08.06.";
  const periodEnd = "25.08.13.";
  const daysLeft = 7; // D-7

  // 진행 현황
  const currentTotalKg = 10.5; // 현재 모인 무게(kg)
  const targetKg = 15; // 목표/최대 무게(kg)
  const nextStepRemainKg = 4.5; // 다음 단계까지 남은 무게(kg)

  // 할인 정보
  const discountPercent = 15; // 현재 할인율 %
  const pricePer100g = 214; // 현재 100g당 가격(원)

  /** ====== 원형 프로그레스 계산 ====== */
  const size = 132; // SVG 전체 크기
  const stroke = 14; // 선 두께
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const percent = Math.max(
    0,
    Math.min(100, Math.round((currentTotalKg / targetKg) * 100))
  );
  const dash = C;
  const gap = C - (C * percent) / 100;

  return (
    <div className="w-full p-4">
      {/* 헤더 */}
      <div className="flex items-center">
        {/* 제목 영역 */}
        <div className="flex-1 text-center">
          <h3 className="text-[16px] font-semibold text-green-600">
            모여서 구매가 진행 중이에요!
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            ({periodStart} ~ {periodEnd})
          </p>
        </div>

        {/* 새로고침 버튼 */}
        <button
          type="button"
          className="ml-auto shrink-0 rounded-full text-gray-400 hover:bg-gray-50 mt-[-20px] cursor-pointer"
          aria-label="새로고침"
        >
          <RotateCw className="h-5 w-5" />
        </button>
      </div>
      {/* 본문: 그래프 + 텍스트 */}
      <div className="mt-3 flex flex-col items-center">
        {/* 상단: 그래프 + 우측 정보 */}
        <div className="flex items-center gap-4">
          {/* 원형 진행 그래프 */}
          <div className="relative">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="block"
            >
              {/* 배경 원 */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke="#e5e7eb"
                strokeWidth={stroke}
                fill="none"
              />
              {/* 진행 원 */}
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
              <span className="text-[22px] font-bold text-gray-800">
                {currentTotalKg}
                <span className="ml-1 text-base font-semibold text-gray-500">
                  kg
                </span>
              </span>
            </div>
          </div>

          {/* 우측 텍스트 정보 */}
          <div className="flex flex-col items-start">
            <div className="text-[20px] font-semibold leading-tight text-gray-900">
              D-{daysLeft}
            </div>
            <div className="mt-1 text-sm text-gray-500 font-light">
              현재 할인율
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-[20px] font-semibold text-red-500">
                {discountPercent}%
              </span>
              <span className="text-[20px] font-semibold text-gray-900">
                {pricePer100g}원
              </span>
            </div>
          </div>
        </div>

        {/* 하단: 다음 단계까지 */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="text-gray-700">
            다음 단계까지
            <span className="font-extrabold text-gray-900 ml-1">
              {nextStepRemainKg}kg
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
