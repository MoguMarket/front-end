import { Heart, Star } from "lucide-react";

export default function ProductCard({
  name,
  weight,
  originalPrice,
  discountedPrice,
  rating,
  reviewCount,
  liked,
  imageUrl,
  marketName,
  onClickMarket,
  onToggleLike,
  onClickCard, // ⬅️ 추가
}) {
  const discountRate = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  const handleKey = (e) => {
    if ((e.key === "Enter" || e.key === " ") && onClickCard) {
      e.preventDefault();
      onClickCard();
    }
  };

  return (
    // 카드 전체를 클릭 타겟으로
    <div
      className="bg-white rounded-xl relative border border-gray-200 overflow-hidden mx-1 cursor-pointer select-none"
      role="button"
      tabIndex={0}
      onClick={onClickCard}
      onKeyDown={handleKey}
    >
      {/* 이미지: 가로 전체 + 비율 유지 */}
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
            e.stopPropagation(); // 카드 클릭으로 전파 방지
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

      {/* 내용 영역만 패딩 */}
      <div className="p-3">
        {marketName && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭으로 전파 방지
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
          <span className="text-[#D85C54] font-bold">{discountRate}%</span>
          <span className="font-semibold">
            {discountedPrice.toLocaleString()}원
          </span>
        </div>

        <div className="flex items-center text-xs text-gray-600 mt-1">
          <Star size={12} className="mr-1 text-[#D85C54]" fill="currentColor" />
          {rating} ({reviewCount})
        </div>
      </div>
    </div>
  );
}
