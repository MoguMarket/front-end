// src/components/groupBuy/order-panel.jsx
import { useMemo, useState } from "react";
import PaymentButton from "./payment-button";
import { useNavigate } from "react-router-dom";
import PortOne from "@portone/browser-sdk/v2";

const API_BASE = import.meta.env.VITE_API_BASE || "";
const PORTONE_CHANNEL_KEY = import.meta.env.VITE_PORTONE_CHANNEL_KEY;
const PORTONE_STORE_ID = import.meta.env.VITE_PORTONE_STORE_ID;

const formatWon = (n) =>
  new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(n || 0);

export default function OrderPanel({
  shopId,
  productId,
  groupBuyId, // ✅ 공구 ID 필요
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

  const makePaymentId = () => {
    try {
      return crypto.randomUUID();
    } catch {
      return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
  };

  // 공통 POST 유틸 (세션 쿠키 포함 + 실패 본문 로깅)
  const postJson = async (url, body) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(`[POST] ${url} -> ${res.status}`, text);
    }
    return res;
  };

  // ✅ 눈속임: 버튼 누른 즉시 내부 콜백 3개 실행 (순차)
  const runInternalCallbacks = async ({ qtyUnits, amount }) => {
    try {
      // 1) 공동구매 참여
      if (groupBuyId != null) {
        await postJson(`${API_BASE}/api/groupbuy/participate`, {
          groupBuyId,
          qty: qtyUnits, // 정수
        });
      }

      // 2) 단일상품 주문 확정 → ordersId 획득
      const r2 = await postJson(`${API_BASE}/api/orders/confirm-single`, {
        productId: Number(productId),
        qtyBase: qtyUnits,
        participateInGroupBuy: true,
        ...(groupBuyId != null ? { groupBuyId } : {}),
      });

      let ordersId = null;
      if (r2.ok) {
        const data = await r2.json().catch(() => ({}));
        ordersId =
          data?.ordersId ??
          data?.id ??
          (typeof data === "number" ? data : null);
      }

      // 3) 결제 엔티티 생성 (ordersId가 생겼을 때만)
      if (ordersId != null) {
        await postJson(`${API_BASE}/api/payments`, {
          ordersId,
          paidCashAmount: amount,
          paidPointAmount: 0,
        });
      }

      return ordersId; // 없을 수도 있음 (그래도 뒤로 가지 않음)
    } catch (e) {
      console.warn("[internal callbacks] error", e);
      return null;
    }
  };

  const handlePay = async () => {
    if (!(agreeReserve && agreeCancelFee && agreePickup)) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setPaying(true);

    const qtyUnits = Math.max(1, Math.round(weightKg / stepKg)); // base 단위 정수
    const paymentId = makePaymentId();
    const orderName = `공동구매 #${productId} (${weightKg}kg)`;

    // ✅ 1) 내부 콜백 먼저 실행 (결제 성공 여부 무관)
    const ordersIdPromise = runInternalCallbacks({
      qtyUnits,
      amount: totalPrice,
    });

    // ✅ 2) PortOne 결제창은 "그냥 띄우기" (await 안 함)
    if (PORTONE_CHANNEL_KEY && PORTONE_STORE_ID) {
      try {
        // eslint-disable-next-line no-void
        void PortOne.requestPayment({
          channelKey: PORTONE_CHANNEL_KEY,
          storeId: PORTONE_STORE_ID,
          paymentId,
          orderName,
          totalAmount: totalPrice,
          currency: "KRW",
          payMethod: "CARD",
          redirectUrl: `${location.origin}/order`,
          customer: {
            email: "testuser@example.com",
            fullName: "홍길동",
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
            weightKg,
            unitPricePerKg,
            source: "frontend-direct-mock",
          },
        }).catch((e) => {
          // 취소/오류여도 무시 (눈속임)
          console.warn("[PortOne] ignored error", e);
        });
      } catch (e) {
        console.warn("[PortOne] launch failed", e);
      }
    } else {
      console.warn("PORTONE env 미설정: 결제창은 생략됨(내부 콜백만 실행)");
    }

    // ✅ 3) 내부 콜백 끝나면 주문 페이지로 이동(ordersId가 없으면 그냥 /order)
    try {
      const ordersId = await ordersIdPromise;
      if (ordersId != null) {
        navigate(`/order?ordersId=${encodeURIComponent(ordersId)}`);
      } else {
        navigate(`/order`);
      }
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
