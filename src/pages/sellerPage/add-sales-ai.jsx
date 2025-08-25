// src/pages/sellerPage/add-sales-ai.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE || "";

// 한글 라벨 매핑
const LABEL_MAP = {
    description: "상품 설명",
    originalPricePerBaseUnit: "정가(1단위당)",
    stock: "재고 수량",
    maxDiscountPercent: "최대 할인율",
    stageCount: "할인 단계 수",
};

export default function AddSalesAI() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        productId,
        name,
        unit,
        originalPricePerBaseUnit,
        stock,
        description: initialDescription = "",
        maxDiscountPercent = 0,
        stageCount = 0,
    } = location.state || {};

    const [description, setDescription] = useState(initialDescription);
    const [maxDiscount, setMaxDiscount] = useState(maxDiscountPercent);
    const [steps, setSteps] = useState(stageCount);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [aiData, setAiData] = useState(null);

    // AI 분석 호출
    useEffect(() => {
        const fetchAIRecommendation = async () => {
            if (!productId) return;
            setLoading(true);
            setErrorMsg("");

            try {
                const payload = {
                    productId,
                    name,
                    description: description || "",
                    unit,
                    originalPricePerBaseUnit: Number(originalPricePerBaseUnit),
                    stock: Number(stock),
                    maxDiscountPercent: Number(maxDiscount) || 0,
                    stageCount: Number(steps) || 0,
                    currency: "KRW",
                };

                const res = await fetch(
                    `${API_BASE}/api/recommend/listing/review`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    }
                );

                const data = await res.json();
                console.log("📥 리뷰 응답:", data);

                if (res.ok) {
                    setAiData(data);
                    setMaxDiscount(data.maxDiscountPercent ?? maxDiscount);
                    setSteps(data.stageCount ?? steps);
                } else {
                    setErrorMsg("AI 추천을 불러오지 못했습니다.");
                }
            } catch (err) {
                setErrorMsg("네트워크 오류 발생");
            } finally {
                setLoading(false);
            }
        };

        fetchAIRecommendation();
    }, [
        productId,
        name,
        unit,
        originalPricePerBaseUnit,
        stock,
        description,
        maxDiscount,
        steps,
    ]);

    // 공동구매 시작하기
    const startGroupBuy = async () => {
        setLoading(true);
        setErrorMsg("");

        try {
            const payload = {
                productId,
                name,
                description: description || "",
                unit,
                originalPricePerBaseUnit: Number(originalPricePerBaseUnit),
                targetQty: Number(stock),
                maxDiscountPercent: Number(maxDiscount) || 0,
                stage: Number(steps) || 1,
                currency: "KRW",
            };

            const res = await fetch(`${API_BASE}/api/groupbuy/open`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log("📥 공동구매 응답:", data);

            if (res.ok) {
                alert("공동구매 등록 완료!");
                navigate("/seller-home", { replace: true });
            } else {
                setErrorMsg(`공동구매 등록 실패 (status ${res.status})`);
            }
        } catch (err) {
            setErrorMsg("네트워크 오류 발생");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full max-w-[390px] mx-auto bg-white min-h-screen pb-16 font-pretendard tracking-[-0.03em] p-4">
            {/* 3. AI 추천 결과 */}
            <section className="mb-6">
                <h2 className="text-sm font-semibold mb-3">
                    AI가 분석한 판매 조건
                </h2>
                {loading ? (
                    <div className="text-gray-500 text-sm">
                        분석 중입니다...
                    </div>
                ) : errorMsg ? (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
                        {errorMsg}
                    </div>
                ) : aiData ? (
                    <div className="space-y-4">
                        {/* 추천 가격 */}
                        <div className="rounded-xl border bg-orange-50 p-4 shadow-sm text-sm">
                            <p className="font-medium">
                                추천 판매가 :{" "}
                                <span className="text-[#F97316] font-bold">
                                    {aiData.recommendedPrice}원
                                </span>
                            </p>
                            <p className="text-gray-600">
                                (최소 {aiData.minRecommendedPrice}원 ~ 최대{" "}
                                {aiData.maxRecommendedPrice}원)
                            </p>
                        </div>

                        {/* 추천 사유 */}
                        {aiData.reasoning && (
                            <div className="rounded-xl border bg-white p-4 shadow-sm text-sm flex gap-2">
                                <FaInfoCircle className="text-[#F97316] mt-0.5" />
                                <p className="text-gray-700">
                                    {aiData.reasoning}
                                </p>
                            </div>
                        )}

                        {/* 세부 추천 항목 */}
                        {aiData.suggestions?.length > 0 && (
                            <div className="rounded-xl border bg-yellow-50 p-4 shadow-sm text-sm">
                                <p className="font-medium mb-2">
                                    세부 추천 항목
                                </p>
                                <ul className="space-y-2">
                                    {aiData.suggestions.map((s, idx) => (
                                        <li
                                            key={idx}
                                            className="flex justify-between items-center bg-white rounded-lg px-3 py-2 shadow-sm"
                                        >
                                            <span className="text-gray-600">
                                                {LABEL_MAP[s.field] || s.field}
                                            </span>
                                            <span className="font-semibold text-gray-800">
                                                {s.suggestedValue}
                                                {s.field ===
                                                    "originalPricePerBaseUnit" &&
                                                    "원"}
                                                {s.field ===
                                                    "maxDiscountPercent" && "%"}
                                                {s.field === "stock" && "개"}
                                                {s.field === "stageCount" &&
                                                    "단계"}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : null}
            </section>

            {/* 4. 경고문구 */}
            <p className="text-sm text-red-500 mb-6">
                ⚠ 공동구매를 시작하면 이후에는 수정할 수 없습니다.
            </p>

            {/* 5. 버튼 */}
            <button
                type="button"
                onClick={startGroupBuy}
                disabled={loading}
                className="w-full h-12 rounded-lg bg-[#F97316] text-white text-base font-semibold transition active:scale-95 hover:bg-[#ea580c] disabled:opacity-50"
            >
                {loading ? "등록 중..." : "공동구매 시작하기"}
            </button>
        </div>
    );
}
