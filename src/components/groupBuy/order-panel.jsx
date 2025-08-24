// src/components/groupBuy/order-panel.jsx
import { useMemo, useState } from "react";
import PaymentButton from "./payment-button";
import { useNavigate } from "react-router-dom";
import PortOne from "@portone/browser-sdk/v2";

const PORTONE_CHANNEL_KEY = import.meta.env.VITE_PORTONE_CHANNEL_KEY; // channel-key-...
const PORTONE_STORE_ID = import.meta.env.VITE_PORTONE_STORE_ID; // store-...

const formatWon = (n) =>
  new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(n || 0);

export default function OrderPanel({
  shopId,
  productId,
  minKg = 0.5,
  maxKg = 2,
  stepKg = 0.5,
}) {
  const navigate = useNavigate();

  // 데모 단가(실제는 상품 오버뷰/서버 값 사용 권장)
  const PRICE_PER_100G = 214;
  const FEE_ON_CANCEL = 200;

  const [weightKg, setWeightKg] = useState(1.5);
  const [agreeReserve, setAgreeReserve] = useState(false);
  const [agreeCancelFee, setAgreeCancelFee] = useState(false);
  const [agreePickup, setAgreePickup] = useState(false);
  const [showError, setShowError] = useState(false);
  const [paying, setPaying] = useState(false);

  const unitPricePerKg = useMemo(() => PRICE_PER_100G * 10, []);
  const totalPrice = useMemo(
    () => Math.round(weightKg * unitPricePerKg),
    [weightKg, unitPricePerKg]
  );

  const inc = () =>
    setWeightKg((w) => Math.min(maxKg, +(w + stepKg).toFixed(1)));
  const dec = () =>
    setWeightKg((w) => Math.max(minKg, +(w - stepKg).toFixed(1)));

  // 간단 랜덤 결제ID (실무는 서버 발급 권장)
  const makePaymentId = () => {
    try {
      return crypto.randomUUID();
    } catch {
      return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
  };

  const handlePay = async () => {
    if (!(agreeReserve && agreeCancelFee && agreePickup)) {
      setShowError(true);
      return;
    }
    setShowError(false);

    // 프론트 직결: 금액/수량을 그대로 사용
    const quantityGrams = Math.round(weightKg * 1000); // 1.5kg -> 1500 g
    const redirectUrl = `${location.origin}/order`; // 포트원 콘솔/서버 화이트리스트 필수
    const paymentId = makePaymentId();

    // 주문명 간단 구성 (원하면 바꾸세요)
    const orderName = `공동구매 #${productId} (${weightKg}kg)`;

    try {
      setPaying(true);

      if (!PORTONE_CHANNEL_KEY || !PORTONE_STORE_ID) {
        throw new Error(
          "환경변수(VITE_PORTONE_CHANNEL_KEY / VITE_PORTONE_STORE_ID)가 설정되지 않았습니다."
        );
      }

      // PortOne 결제창 바로 호출
      const result = await PortOne.requestPayment({
        channelKey: PORTONE_CHANNEL_KEY,
        storeId: PORTONE_STORE_ID,
        paymentId,
        orderName,
        totalAmount: totalPrice,
        currency: "KRW",
        payMethod: "CARD",
        redirectUrl,
        customer: {
          // ✅ 이니시스 V2 일반결제 필수값들
          email: "testuser@example.com",
          fullName: "홍길동",
          // 일부 환경에서 요구될 수 있어 같이 세팅 권장
          phoneNumber: "01012345678",
        },
        products: [
          {
            id: String(productId),
            name: orderName,
            quantity: 1,
            amount: totalPrice,
          },
        ],
        customData: {
          productId,
          shopId,
          quantityGrams,
          unitPricePerKg,
          source: "frontend-direct",
        },
      });

      // SDK 레벨 에러
      if (result?.code !== undefined) {
        console.error("[PortOne][Error]", result);
        alert(result.message || "결제에 실패했습니다.");
        return;
      }

      // 결제창에서 성공 후 돌아오면 redirectUrl로 이동하지만,
      // SPA 경험 위해 바로 이동시켜도 OK
      navigate(`/order?paymentId=${encodeURIComponent(paymentId)}`);
    } catch (e) {
      console.error("[PAY][Direct] error:", e);
      alert(e.message || "결제 중 오류가 발생했습니다.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="relative">
      <div className="bg-white p-4">
        {/* 수량/무게 */}
        <section className="pb-4">
          <div className="flex items-start justify-between">
            <h3 className="text-[16px] font-medium text-[#41b04d]">
              구매할 수량/무게
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center text-gray-400">
                <button
                  onClick={inc}
                  disabled={paying}
                  className="w-5 h-5 rounded hover:bg-gray-100"
                >
                  ▲
                </button>
                <button
                  onClick={dec}
                  disabled={paying}
                  className="w-5 h-5 rounded hover:bg-gray-100"
                >
                  ▼
                </button>
              </div>
              <div className="text-right">
                <div className="text-[20px] text-gray-900">{weightKg}kg</div>
                <div className="text-sm text-gray-400">{maxKg}kg</div>
              </div>
              <div className="flex flex-col items-center text-gray-400">
                <button
                  onClick={inc}
                  disabled={paying}
                  className="w-5 h-5 rounded hover:bg-gray-100"
                >
                  +
                </button>
                <button
                  onClick={dec}
                  disabled={paying}
                  className="w-5 h-5 rounded hover:bg-gray-100"
                >
                  –
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 결제 금액 */}
        <section className="py-4 flex items-center justify-between">
          <h3 className="text-[16px] text-[#41b04d]">결제 금액</h3>
          <div className="text-[16px] text-gray-900">
            {formatWon(totalPrice)}원
          </div>
        </section>

        {/* 동의 섹션 */}
        <section className="py-4 space-y-10">
          <AgreeRow
            title="결제 예약 동의"
            desc1="모여서 구매 종료일에 해당 금액을 결제하는 것에 동의합니다."
            desc2="할인 달성 없이 종료되면 구매가 취소됩니다."
            checked={agreeReserve}
            onChange={setAgreeReserve}
            disabled={paying}
          />
          <AgreeRow
            title="취소 수수료 동의"
            desc1={`모여서 구매 진행 중 취소 시 수수료 ${formatWon(
              FEE_ON_CANCEL
            )}원이 발생합니다.`}
            checked={agreeCancelFee}
            onChange={setAgreeCancelFee}
            disabled={paying}
          />
          <AgreeRow
            title="픽업 동의"
            desc1="결제 후 해당 시장의 상점에서 n일 내로 픽업해야 하며, 기간 내 미픽업 환불 시 수수료가 발생합니다."
            checked={agreePickup}
            onChange={setAgreePickup}
            disabled={paying}
          />
          {showError && (
            <div className="pt-2 text-[14px] text-red-600">
              모든 동의 항목에 체크해 주세요.
            </div>
          )}
        </section>
      </div>

      {/* 하단 고정 결제 버튼 */}
      <div className="h-20" />
      <PaymentButton onClick={handlePay} disabled={paying} />
    </div>
  );
}

function AgreeRow({ title, desc1, desc2, checked, onChange, disabled }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-[16px] font-medium text-[#41b04d]">{title}</div>
        <p className="mt-1 text-[14px] text-gray-700">{desc1}</p>
        {desc2 && <p className="mt-1 text-[14px] text-red-500">{desc2}</p>}
      </div>
      <label className="shrink-0">
        <input
          type="checkbox"
          className="h-5 w-5 accent-[#4CC554]"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
      </label>
    </div>
  );
}
