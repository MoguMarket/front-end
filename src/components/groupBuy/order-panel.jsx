// components/groupBuy/order-panel.jsx
import { useMemo, useState } from "react";
import PaymentButton from "./payment-button";
import { useNavigate } from "react-router-dom";

// 숫자 포맷터
const formatWon = (n) =>
  new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(n || 0);

export default function OrderPanel({
  shopId,
  productId,
  // 선택 단위와 범위(필요에 따라 props로 조절 가능)
  minKg = 0.5,
  maxKg = 2,
  stepKg = 0.5,
}) {
  const navigate = useNavigate();

  // 💰 가격 상수(하드코딩)
  const PRICE_PER_100G = 214; // 원
  const FEE_ON_CANCEL = 200; // 원(표시용 문구)

  // 🧮 상태: 무게/수량
  const [weightKg, setWeightKg] = useState(1.5);

  // ✅ 동의 체크
  const [agreeReserve, setAgreeReserve] = useState(false);
  const [agreeCancelFee, setAgreeCancelFee] = useState(false);
  const [agreePickup, setAgreePickup] = useState(false);
  const [showError, setShowError] = useState(false);

  // 총액 계산: 100g 단가 → 1kg = 10 * 100g
  const unitPricePerKg = useMemo(() => PRICE_PER_100G * 10, []);
  const totalPrice = useMemo(
    () => Math.round(weightKg * unitPricePerKg),
    [weightKg, unitPricePerKg]
  );

  // 증감
  const inc = () =>
    setWeightKg((w) => Math.min(maxKg, +(w + stepKg).toFixed(1)));
  const dec = () =>
    setWeightKg((w) => Math.max(minKg, +(w - stepKg).toFixed(1)));

  const handlePay = () => {
    const allChecked = agreeReserve && agreeCancelFee && agreePickup;
    navigate(`/order`);
    if (!allChecked) {
      setShowError(true);
      return;
    }
    setShowError(false);
    // ✅ 실제에선 API POST 예정. 지금은 console.log로 테스트 출력
    const payload = {
      shopId,
      productId,
      weightKg,
      unitPricePer100g: PRICE_PER_100G,
      unitPricePerKg,
      totalPrice,
    };
    console.log("PAYMENT_REQUEST_PAYLOAD", payload);
    // TODO: fetch("/api/pay", { method:"POST", body: JSON.stringify(payload) })
  };

  return (
    <div className="relative">
      {/* 카드 래퍼 */}
      <div className="bg-white  p-4">
        {/* 1) 구매할 수량/무게 */}
        <section className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[16px] font-medium text-[#41b04d]">
                구매할 수량/무게
              </h3>
            </div>

            {/* 우측: 증감 컨트롤 + 표시 */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center text-gray-400">
                <button
                  type="button"
                  onClick={inc}
                  className="w-5 h-5 grid place-items-center rounded hover:bg-gray-100"
                  aria-label="증가"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={dec}
                  className="w-5 h-5 grid place-items-center rounded hover:bg-gray-100"
                  aria-label="감소"
                >
                  ▼
                </button>
              </div>

              <div className="text-right">
                <div className="text-[20px] text-gray-900 leading-tight">
                  {weightKg}kg
                </div>
                <div className="text-sm text-gray-400">{maxKg}kg</div>
              </div>

              {/* + / - (옵션) */}
              <div className="flex flex-col items-center text-gray-400">
                <button
                  type="button"
                  onClick={inc}
                  className="w-5 h-5 grid place-items-center rounded hover:bg-gray-100"
                  aria-label="플러스"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={dec}
                  className="w-5 h-5 grid place-items-center rounded hover:bg-gray-100"
                  aria-label="마이너스"
                >
                  –
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2) 결제 금액 */}
        <section className="py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px]text-[#41b04d]">결제 금액</h3>
            <div className="text-[16px] text-gray-900">
              {formatWon(totalPrice)}원
            </div>
          </div>
        </section>

        {/* 3) 동의 섹션들 */}
        <section className="py-4 space-y-10">
          {/* 결제 예약 동의 */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[16px] font-medium text-[#41b04d]">
                결제 예약 동의
              </div>
              <p className="mt-1 text-[14px] text-gray-700 leading-relaxed">
                모여서 구매 종료일에 해당 금액을 결제하는 것에 동의합니다.
              </p>
              <p className="mt-1 text-[14px] text-red-500">
                할인 달성 없이 종료되면 구매가 취소됩니다.
              </p>
            </div>
            <label className="shrink-0">
              <input
                type="checkbox"
                className="h-5 w-5 accent-[#4CC554]"
                checked={agreeReserve}
                onChange={(e) => setAgreeReserve(e.target.checked)}
              />
            </label>
          </div>

          {/* 취소 수수료 동의 */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[16px] font-medium text-[#41b04d]">
                취소 수수료 동의
              </div>
              <p className="mt-1 text-[14px] text-gray-700 leading-relaxed">
                모여서 구매 진행 중 취소 시 수수료 {formatWon(FEE_ON_CANCEL)}
                원이 발생합니다.
              </p>
            </div>
            <label className="shrink-0">
              <input
                type="checkbox"
                className="h-5 w-5 accent-[#4CC554]"
                checked={agreeCancelFee}
                onChange={(e) => setAgreeCancelFee(e.target.checked)}
              />
            </label>
          </div>

          {/* 픽업 동의 */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[16px] font-medium text-[#41b04d]">
                픽업 동의
              </div>
              <p className="mt-1 text-[14px] text-gray-700 leading-relaxed">
                결제 후 해당 시장의 상점에서 n일 내로 픽업해야 하며, 기간 내
                픽업을 못하고 환불 시 수수료가 발생합니다.
              </p>
            </div>
            <label className="shrink-0">
              <input
                type="checkbox"
                className="h-5 w-5 accent-[#4CC554]"
                checked={agreePickup}
                onChange={(e) => setAgreePickup(e.target.checked)}
              />
            </label>
          </div>

          {/* 미체크 경고 */}
          {showError && (
            <div className="pt-2 text-[14px] text-red-600">
              모든 동의 항목에 체크해 주세요.
            </div>
          )}
        </section>
      </div>
      {/* 하단 고정 결제 버튼 */}
      <div className="h-20" /> {/* 버튼 영역만큼 여백 확보 */}
      <PaymentButton onClick={handlePay} />
    </div>
  );
}
