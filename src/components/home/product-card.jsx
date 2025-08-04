import { FaHeart } from "react-icons/fa";

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
}) {
    return (
        <div className="p-2 bg-white rounded-lg shadow-md relative mx-2">
            <img
                src={imageUrl}
                alt={name}
                className="rounded-md w-full h-auto object-cover"
            />

            <div
                className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow cursor-pointer"
                onClick={onToggleLike}
            >
                <FaHeart
                    className={`text-sm ${
                        liked ? "text-red-500" : "text-gray-300"
                    }`}
                />
            </div>

            <div
                className="mt-2 text-sm text-green-600 cursor-pointer hover:underline"
                onClick={onClickMarket}
            >
                {market}
            </div>
            <div className="text-sm font-medium">
                {name} {weight}
            </div>
            <div className="mt-1 flex gap-1 items-center">
                <span className="text-red-600 font-bold">{discount}%</span>
                <span className="font-semibold">
                    {price.toLocaleString()}원
                </span>
            </div>
            <div className="text-xs text-yellow-500 mt-1">
                ⭐ {rating} ({reviews})
            </div>
        </div>
    );
}
