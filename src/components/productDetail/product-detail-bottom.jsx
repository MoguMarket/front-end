// ProductDetailBottom.jsx
import { Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductDetailBottom({
  shop,
  product,
  price = 3780, // 1인 구매 최저가 (원)
  onShare = () => {},
  onSoloBuy = () => {},
}) {
  const fmt = (n) =>
    new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(n);

  const navigate = useNavigate();
  return (
    <div
      className="
        fixed inset-x-0 bottom-0 max-w-[390px] mx-auto border-t border-gray-200"
    >
      <div className="mx-auto w-full max-w-[480px] px-4 pb-1 pt-2">
        <div className="flex items-center justify-between gap-3">
          {/* 공유 버튼 */}
          <button
            type="button"
            onClick={onShare}
            className="
              inline-flex h-10 w-10 items-center justify-center
              rounded-xl text-gray-700 hover:bg-gray-100 active:scale-95 transition
            "
            aria-label="공유하기"
          >
            <Share2 className="h-6 w-6" />
          </button>

          {/* 혼자 구매 */}
          <button
            type="button"
            onClick={onSoloBuy}
            className="
              flex min-w-[128px] flex-col items-center justify-center
              rounded-2xl bg-[#c3c3c4] px-4 py-3
              text-white"
          >
            <span className="text-[15px] font-semibold leading-none">
              {fmt(price)}원~
            </span>
            <span className="mt-1 text-[15px] font-semibold leading-none">
              혼자 구매
            </span>
          </button>

          {/* 모여서 구매 참여하기 */}
          <button
            type="button"
            onClick={() =>
              navigate(
                `/marketDetailPage/${shop.shopId}/product/${product.id}/groupBuy`
              )
            }
            className="
              rounded-2xl bg-[#37C05E] px-5 py-2
              text-white text-[15px] font-semibold
            "
          >
            모여서 구매
            <br />
            참여하기
          </button>
        </div>
      </div>
    </div>
  );
}
