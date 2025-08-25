// src/components/productDetail/product-detail-bottom.jsx
import { Share2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ProductDetailBottom({
    storeInfo,
    basicInfo,
    priceInfo,
    stockInfo,
    onShare = () => {},
}) {
    const fmt = (n) =>
        new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(n);

    const navigate = useNavigate();
    const [sp] = useSearchParams();
    const isGift = sp.get("from") === "gift";

    return (
        <div className="fixed inset-x-0 bottom-0 max-w-[390px] mx-auto border-t border-gray-200">
            <div className="mx-auto w-full max-w-[480px] px-4 pb-1 pt-2">
                <div className="flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onShare}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 active:scale-95 transition"
                        aria-label="공유하기"
                    >
                        <Share2 className="h-6 w-6" />
                    </button>

                    {/* 혼자 구매 */}
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/selfBuy/${storeInfo.storeId}/product/${
                                    basicInfo.productId
                                }?${sp.toString()}`
                            )
                        }
                        className={`flex min-w-[128px] flex-col items-center justify-center rounded-2xl px-4 py-3 text-white ${
                            isGift ? "bg-[#F5B236]" : "bg-[#4CC554]"
                        }`}
                    >
                        <span className="text-[15px] font-semibold leading-none">
                            {fmt(priceInfo?.appliedUnitPrice ?? 0)}원~
                        </span>
                        <span className="mt-1 text-[15px] font-semibold leading-none">
                            혼자 구매
                        </span>
                    </button>

                    {/* 모여서 구매 */}
                    <button
                        type="button"
                        disabled={isGift}
                        onClick={() =>
                            !isGift &&
                            navigate(
                                `/marketDetailPage/${
                                    storeInfo.storeId
                                }/product/${
                                    basicInfo.productId
                                }/groupBuy?${sp.toString()}`
                            )
                        }
                        className={`rounded-2xl px-5 py-2 text-[15px] font-semibold ${
                            isGift
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#37C05E] text-white"
                        }`}
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
