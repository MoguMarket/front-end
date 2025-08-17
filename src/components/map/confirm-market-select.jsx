import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSetAtom } from "jotai";
import { currentMarketIdAtom } from "../../atoms/market";

/**
 * props
 * - open: boolean
 * - marketName: string
 * - shopId: string | number
 * - onCancel: () => void
 * - closeOnBackdrop?: boolean
 * - lockScroll?: boolean
 */
export default function ConfirmMarketSelect({
  open,
  marketName,
  shopId,
  onCancel,
  closeOnBackdrop = true,
  lockScroll = true,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const setCurrentMarketId = useSetAtom(currentMarketIdAtom);

  useEffect(() => {
    if (!lockScroll || !open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, lockScroll]);

  if (!open) return null;

  const handleBackdrop = (e) => {
    if (!closeOnBackdrop) return;
    if (e.target === e.currentTarget) onCancel?.();
  };

  const handleConfirm = () => {
    console.log("[ConfirmModal] confirm click ->", {
      shopId,
      type: typeof shopId,
    });

    // 1) 전역 atom 저장
    setCurrentMarketId(shopId);

    // 2) 저장 직후 localStorage 확인(동기 확인)
    try {
      const raw = localStorage.getItem("currentMarketId");
      console.log("[ConfirmModal] after set (raw) =", raw);
      console.log("[ConfirmModal] after set (parsed) =", JSON.parse(raw));
    } catch (e) {
      console.warn("[ConfirmModal] JSON.parse error:", e);
    }

    // 3) URL에도 shopId를 싣고 홈으로 이동 (ShopIdSync가 되돌리는 것 방지)
    navigate(`/?shopId=${encodeURIComponent(shopId)}`, {
      replace: true,
      state: { from: location.pathname },
    });

    // 4) 이동 직전/직후 추적용 (선택)
    setTimeout(() => {
      const rawLater = localStorage.getItem("currentMarketId");
      console.log("[ConfirmModal] +50ms after navigate (raw) =", rawLater);
      try {
        console.log("[ConfirmModal] +50ms (parsed) =", JSON.parse(rawLater));
      } catch {}
    }, 50);
  };

  return (
    <div
      className="fixed inset-0 z-[2000] "
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2
                   w-[86%]  rounded-2xl bg-white shadow-xl
                   p-5 "
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[16px] font-extrabold leading-snug mb-3">
          <span className="block">{marketName}</span>
          <span className="block font-semibold text-neutral-800">
            픽업 시장으로 선택하시겠습니까?
          </span>
        </h2>

        <div className="mt-2 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-xl bg-neutral-200 text-neutral-700 font-semibold active:translate-y-[1px]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="h-11 rounded-xl bg-emerald-600 text-white font-semibold active:translate-y-[1px]"
          >
            선택하기
          </button>
        </div>
      </div>
    </div>
  );
}
