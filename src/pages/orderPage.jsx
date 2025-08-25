// file: src/pages/orderPage.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderList from "../components/orderPage/order-list";
import { IN_PROGRESS_ORDERS } from "../components/db/order-info";
import { SHOPS } from "../components/db/shops-db";

const API_BASE = import.meta.env.VITE_API_BASE;

// ── 기존 매핑 로직 유지 ─────────────────────────────────────────
const NAME_TO_SHOPID = new Map(SHOPS.map((s) => [s.name, s.shopId]));
const ALIAS_TO_SHOPID = new Map([]); // 필요 시 별칭 추가

const resolveShopId = (item) => {
  if (item?.shopId) return String(item.shopId);
  const byName = NAME_TO_SHOPID.get(item?.marketName);
  if (byName) return String(byName);
  const byAlias = ALIAS_TO_SHOPID.get(item?.marketName);
  if (byAlias) return String(byAlias);
  return null;
};

// ── 결제 확인용 작은 배너 컴포넌트(옵션) ─────────────────────────
function PaymentConfirmBanner({ paymentId }) {
  const [status, setStatus] = useState("확인 중…");
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("accessToken");

  const canCall = useMemo(() => Boolean(API_BASE && paymentId), [paymentId]);

  useEffect(() => {
    if (!canCall) {
      setLoading(false);
      return;
    }
    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        const r = await fetch(
          `${API_BASE}/api/payments/${encodeURIComponent(paymentId)}/status`,
          {
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
          }
        );
        const j = await r.json().catch(() => null);
        if (aborted) return;
        if (r.ok && j) {
          setStatus(j.status ?? j.state ?? "확인 완료");
          setDetail(j);
        } else {
          setStatus("확인 실패");
          setDetail(j);
        }
      } catch {
        if (!aborted) {
          setStatus("확인 실패");
          setDetail(null);
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [canCall, paymentId]);

  return (
    <section className="mx-auto max-w-md px-4 pt-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold">결제 처리 확인</h2>
          <span
            className={`text-xs px-2 py-[2px] rounded-full ${
              loading
                ? "bg-gray-100 text-gray-500"
                : status === "PAID" || status === "DONE" || status === "SUCCESS"
                ? "bg-green-100 text-green-700"
                : status === "PENDING"
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {loading ? "확인 중…" : status}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          주문번호: <span className="font-medium">{paymentId}</span>
        </p>

        {!loading && detail?.approvedAt && (
          <p className="mt-1 text-xs text-gray-500">
            승인시각: {new Date(detail.approvedAt).toLocaleString()}
          </p>
        )}

        {!loading && detail?.amount != null && (
          <p className="mt-1 text-sm text-gray-700">
            금액:{" "}
            {new Intl.NumberFormat("ko-KR").format(Number(detail.amount) || 0)}
            원
          </p>
        )}
      </div>
    </section>
  );
}

export default function OrderPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const paymentId = sp.get("paymentId"); // 포트원 리다이렉트 파라미터

  // ✅ 여기서 /api/orders를 조회해서 콘솔에만 로그
  useEffect(() => {
    let aborted = false;

    (async () => {
      try {
        const token =
          localStorage.getItem("accessToken") ||
          localStorage.getItem("token") ||
          sessionStorage.getItem("accessToken");

        const res = await fetch(`${API_BASE}/api/orders`, {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });

        const raw = await res.text().catch(() => "");
        if (aborted) return;

        if (!res.ok) {
          console.log("[/api/orders] HTTP", res.status, raw);
          return;
        }

        let json = null;
        try {
          json = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.log("[/api/orders] JSON parse error:", e, raw);
          return;
        }

        const list = Array.isArray(json) ? json : [];
        console.log("[/api/orders] 총 개수:", list.length);
        console.log("[/api/orders] 원본:", json);
        if (list.length) console.log("[/api/orders] 첫 주문:", list[0]);
      } catch (e) {
        if (!aborted) console.log("[/api/orders] fetch error:", e);
      }
    })();

    return () => {
      aborted = true;
    };
  }, []);

  const handleMarketClick = useCallback(
    (item) => {
      const id = resolveShopId(item);
      if (!id) {
        console.warn(
          "[OrderPage] shopId not resolved for:",
          item?.marketName,
          item
        );
        return;
      }
      navigate(`/marketDetailPage/${encodeURIComponent(id)}`);
    },
    [navigate]
  );

  return (
    <main className="mx-auto max-w-md">
      {/* 결제 확인 배너 (paymentId 있을 때만 표시) */}
      {paymentId && <PaymentConfirmBanner paymentId={paymentId} />}

      {/* 기존 더미 리스트 렌더링 유지 */}
      <OrderList
        items={IN_PROGRESS_ORDERS}
        onItemClick={(id) => console.log("[OrderPage] clicked:", id)}
        onCancelItem={(id) => console.log("[OrderPage] cancel:", id)}
        onMarketClick={handleMarketClick}
      />
    </main>
  );
}
