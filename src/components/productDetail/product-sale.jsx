import { ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductSale({
    storeInfo,
    basicInfo,
    priceInfo,
    discountInfo,
    rating,
    reviewCount,
}) {
    const navigate = useNavigate();

    const discounts = [5, 10, 15, 21]; // % 표시용
    const weights = ["1.5kg", "5kg", "8kg", "10kg", "15kg"]; // 무게 5칸

    // JSON 구조에 맞게 수정
    const basePer100g = Number(priceInfo?.originalPricePerBaseUnit || 0);

    // 각 할인률에 대한 100g당 가격 계산 (반올림)
    const discountedPer100g = discounts.map((d) =>
        Math.round(basePer100g * (1 - d / 100))
    );

    // 그리드 스타일
    const gridColsStyle = {
        gridTemplateColumns: `62px repeat(${weights.length}, minmax(48px, 1fr))`,
    };

    return (
        <div className="w-full bg-white p-4 mt-[-7px] border-b border-gray-200">
            {/* 상단: 상호 + 상품명 */}
            <div className="mb-3">
                <button
                    type="button"
                    onClick={() =>
                        navigate(`/marketDetailPage/${storeInfo.storeId}`)
                    }
                    className="inline-flex items-center text-green-600 text-sm font-semibold cursor-pointer"
                >
                    {storeInfo.storeName}
                    <ChevronRight className="ml-1 h-4 w-4" />
                </button>
                <h2 className="mt-1 text-xl font-bold tracking-tight ">
                    {basicInfo.name}
                </h2>
            </div>

            {/* ===== Row 1: 할인율 ===== */}
            <div className="grid items-center gap-0" style={gridColsStyle}>
                <div className="py-2 text-xs text-gray-500 mb-[-7px]">
                    할인율
                </div>
                {[null, ...discounts].map((d, i) => (
                    <div
                        key={`disc-${i}`}
                        className={[
                            "py-2 px-1 text-start text-[12px] font-semibold mb-[-7px]",
                            i > 0 ? "border-l-[0.5px]" : "",
                        ].join(" ")}
                    >
                        {d == null ? (
                            <span className="opacity-0">-</span>
                        ) : (
                            <span className="text-red-500">{d}%</span>
                        )}
                    </div>
                ))}
            </div>

            {/* ===== Row 2: 100g당 ===== */}
            <div className="grid items-center gap-0" style={gridColsStyle}>
                <div className="py-2 text-xs text-gray-500">100g당</div>
                {[basePer100g, ...discountedPer100g].map((price, i) => (
                    <div
                        key={`p100-${i}`}
                        className={[
                            "py-2 px-1 text-start text-[12px] font-semibold leading-none",
                            i > 0 ? "border-l-[0.5px]" : "",
                        ].join(" ")}
                    >
                        {Number(price).toLocaleString()}원
                    </div>
                ))}
            </div>

            {/* ===== Row 3: 무게 ===== */}
            <div className="grid items-center" style={gridColsStyle}>
                <div className="py-2 text-xs text-gray-500 mt-[-9px]">무게</div>

                {weights.map((w, i) => {
                    const shade = [
                        "#97d59a",
                        "#8bd290",
                        "#76cd7c",
                        "#62c968",
                        "#56c75e",
                    ][i];
                    const rounded =
                        i === 0
                            ? "rounded-l-full"
                            : i === weights.length - 1
                            ? "rounded-r-full"
                            : "";

                    return (
                        <div key={`w-${w}`} className="py-2">
                            <div
                                className={[
                                    "w-full px-2 text-start text-xs font-light text-white mt-[-9px]",
                                    rounded,
                                ].join(" ")}
                                style={{ backgroundColor: shade }}
                            >
                                {w}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 평점 */}
            <div className="mt-3 flex items-center text-sm">
                <Star
                    className="h-4 w-4 mr-1 text-[#D85C54]"
                    fill="currentColor"
                />
                <span className="font-semibold">{rating}</span>
                <span className="ml-1 text-gray-500">({reviewCount})</span>
            </div>
        </div>
    );
}
