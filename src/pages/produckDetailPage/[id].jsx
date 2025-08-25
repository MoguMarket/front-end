// src/pages/productDetailPage.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/marketDetail/header";
import ProductSale from "../../components/productDetail/product-sale";
import MoguProgress from "../../components/productDetail/mogu-progress";
import ProductDetailBottom from "../../components/productDetail/product-detail-bottom";
import RatingReview from "../../components/productDetail/rating-review";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ProductDetailPage() {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [basicInfo, setBasicInfo] = useState(null);
    const [storeInfo, setStoreInfo] = useState(null);
    const [groupBuyInfo, setGroupBuyInfo] = useState(null);
    const [priceInfo, setPriceInfo] = useState(null);
    const [discountInfo, setDiscountInfo] = useState(null);
    const [stockInfo, setStockInfo] = useState(null);
    const [orderInfo, setOrderInfo] = useState(null);
    const [progressInfo, setProgressInfo] = useState(null);

    const [reviewCount, setReviewCount] = useState(0);
    const [rating, setRating] = useState(0);

    const refetchSummary = useRef(async () => {});

    useEffect(() => {
        let aborted = false;

        (async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `${API_BASE}/api/products/${productId}/overview`,
                    { headers: { Accept: "application/json" } }
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const ov = await res.json();
                if (aborted) return;

                if (!ov.storeInfo) throw new Error("storeInfo 없음");

                setBasicInfo(ov.basicInfo);
                setStoreInfo(ov.storeInfo);
                setGroupBuyInfo(ov.groupBuyInfo);
                setPriceInfo(ov.priceInfo);
                setDiscountInfo(ov.discountInfo);
                setStockInfo(ov.stockInfo);
                setOrderInfo(ov.orderInfo);
                setProgressInfo(ov.progressInfo);
            } catch (e) {
                console.error("[ProductDetail] fetch failed:", e);
                setBasicInfo(null);
                setStoreInfo(null);
                setGroupBuyInfo(null);
                setPriceInfo(null);
                setDiscountInfo(null);
                setStockInfo(null);
                setOrderInfo(null);
                setProgressInfo(null);
            } finally {
                if (!aborted) setLoading(false);
            }
        })();

        refetchSummary.current = async () => {
            try {
                const r = await fetch(
                    `${API_BASE}/api/reviews/summary?productId=${productId}`,
                    { headers: { Accept: "application/json" } }
                );
                if (!r.ok) {
                    setRating(0);
                    setReviewCount(0);
                    return;
                }
                const s = await r.json();
                if (aborted) return;
                setRating(Number(s?.average ?? 0));
                setReviewCount(Number(s?.count ?? 0));
            } catch (e) {
                console.warn("[ProductDetail] review summary fetch failed:", e);
                setRating(0);
                setReviewCount(0);
            }
        };

        refetchSummary.current();

        return () => {
            aborted = true;
        };
    }, [productId]);

    if (loading)
        return <div className="p-6 text-sm text-neutral-500">불러오는 중…</div>;

    if (!basicInfo || !storeInfo) {
        return (
            <div className="p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-3 text-sm underline"
                >
                    뒤로가기
                </button>
                <div className="text-red-600">상품을 찾을 수 없습니다.</div>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-[390px] mx-auto pt-14 pb-16">
            <Header marketName={storeInfo.storeName} />

            <img
                src={basicInfo.imageUrl}
                alt={basicInfo.name}
                className="w-full aspect-[4/3] object-cover rounded-b-lg"
            />

            <ProductSale
                storeInfo={storeInfo}
                basicInfo={basicInfo}
                priceInfo={priceInfo}
                discountInfo={discountInfo}
                rating={rating}
                reviewCount={reviewCount}
            />

            <RatingReview
                productId={basicInfo.productId}
                onSubmitted={() =>
                    refetchSummary.current && refetchSummary.current()
                }
            />

            <MoguProgress
                startAt={groupBuyInfo?.startAt}
                endAt={groupBuyInfo?.endAt}
                currentQty={orderInfo?.currentQty}
                targetQty={groupBuyInfo?.targetQty}
                remainingToNextStage={progressInfo?.remainingToNextStage}
                currentDiscountPercent={discountInfo?.discountPercent}
                appliedUnitPrice={priceInfo?.appliedUnitPrice}
            />

            <ProductDetailBottom
                storeInfo={storeInfo}
                basicInfo={basicInfo}
                priceInfo={priceInfo}
                stockInfo={stockInfo}
            />
        </div>
    );
}
