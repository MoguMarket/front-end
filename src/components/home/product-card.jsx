import { FaHeart } from "react-icons/fa";
import { Star } from "lucide-react";

export default function ProductCard({
    name,
    weight,
    price,
    originalPrice,
    discount,
    rating,
    reviews,
    liked,
    imageUrl,
    market,
    onClickMarket,
    onToggleLike,
    daysLeft,
}) {
    // 할인율 계산
    const discountRate = Math.round(
        ((originalPrice - price) / originalPrice) * 100
    );

    const showBadge = typeof daysLeft === "number";
    const badgeText = daysLeft === 0 ? "D-DAY" : `D-${daysLeft}`;
    const badgeBg = daysLeft === 0 ? "#F5292DB2" : "#4CC554B2";

    return (
        <div className="p-2 bg-white rounded-lg shadow-md relative mx-2 pb-4 border border-gray-200">
            {/* 상품 이미지 */}
            <div className="relative">
                {/* 마감 D-Day 뱃지 */}
                {showBadge && (
                    <span
                        className="absolute top-2 left-2 text-white text-xs font-normal px-2 py-[2px] rounded-full z-10"
                        style={{ backgroundColor: badgeBg }}
                    >
                        {badgeText}
                    </span>
                )}

                <img
                    src={imageUrl}
                    alt={name}
                    className="rounded-md w-full h-auto object-cover"
                />

                {/* 좋아요 버튼 */}
                <div
                    className="absolute bottom-2 right-2 bg-gray-200 rounded-full p-1 shadow cursor-pointer"
                    onClick={onToggleLike}
                >
                    <FaHeart
                        className={`text-sm ${
                            liked ? "text-red-500" : "text-gray-300"
                        }`}
                    />
                </div>
            </div>

            {/* 마켓명 */}
            <div
                className="mt-2 text-sm text-green-600 cursor-pointer hover:underline"
                onClick={onClickMarket}
            >
                {market}
            </div>

            {/* 상품명 */}
            <div className="text-sm font-medium">
                {name} {weight}
            </div>

            {/* 정가 */}
            <p className="text-xs text-gray-400 line-through">
                {originalPrice.toLocaleString()}원
            </p>

            {/* 할인율 + 할인가 */}
            <div className="mt-1 flex gap-1 items-center">
                <span className="text-[#D85C54] font-bold">
                    {discountRate}%
                </span>
                <span className="font-semibold">
                    {price.toLocaleString()}원
                </span>
            </div>

            {/* 평점 */}
            <div className="flex items-center text-xs text-gray-600 mt-1">
                <Star
                    size={12}
                    className="mr-1"
                    style={{ color: "#D85C54" }}
                    fill="currentColor"
                />
                {rating} ({reviews})
            </div>
        </div>
    );
}
