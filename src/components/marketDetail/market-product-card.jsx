import { Heart, Star } from "lucide-react";

export default function MarketProductCard({
  name,
  weight,
  originalPrice,
  discountedPrice,
  rating,
  reviewCount,
  liked,
  imageUrl,
  marketName,
  progressCurrent, // ✅ 추가
  progressMax, // ✅ 추가
  onClickMarket,
  onToggleLike,
  onClickCard,
}) {
  const discountRate = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  // ✅ 진행도 계산 (0~100 보정)
  const percent =
    typeof progressCurrent === "number" &&
    typeof progressMax === "number" &&
    progressMax > 0
      ? Math.max(
          0,
          Math.min(100, Math.round((progressCurrent / progressMax) * 100))
        )
      : null;

  const barColorClass =
    percent != null && percent >= 80 ? "bg-[#D85C54]" : "bg-[#4CC554]";

  return (
    // 고정폭/좌우 마진 제거 → 부모 grid 셀을 꽉 채움
    <div className="bg-white rounded-xl relative border border-gray-200 overflow-hidden w-[180px]">
      <div
        onClick={onClickCard}
        role="button"
        className="cursor-pointer select-none"
      >
        <div className="relative w-full aspect-[4/3]">
          <img
            src={imageUrl}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike?.();
            }}
            className="absolute bottom-2 right-2 bg-white rounded-full p-1"
            aria-label="좋아요"
          >
            <Heart
              size={16}
              className={liked ? "text-red-500" : "text-gray-300"}
              fill={liked ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* ✅ 진행 바: 이미지 바로 아래 */}
        {percent != null && (
          <div className="px-3 pt-2">
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              className="w-full h-2 rounded-full bg-neutral-200"
            >
              <div
                className={`h-full rounded-full ${barColorClass} transition-[width] duration-300`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}

        <div className="p-3">
          {marketName && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClickMarket?.();
              }}
              className="text-sm text-green-600 hover:underline"
            >
              {marketName}
            </button>
          )}

          <div className="text-sm font-medium mt-1">
            {name} {weight}
          </div>

          <p className="text-xs text-gray-400 line-through">
            {originalPrice.toLocaleString()}원
          </p>

          <div className="mt-1 flex gap-1 items-center">
            <span className="text-[#D85C54] font-bold">~{discountRate}%</span>
            <span className="font-semibold">
              {discountedPrice.toLocaleString()}원
            </span>
          </div>

          <div className="flex items-center text-xs text-gray-600 mt-1">
            <Star
              size={12}
              className="mr-1 text-[#D85C54]"
              fill="currentColor"
            />
            {rating} ({reviewCount})
          </div>
        </div>
      </div>
    </div>
  );
}
