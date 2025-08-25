// src/pages/sellerPage/add-sales.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// ✅ 로딩 컴포넌트 import
import AIAnalyzingLoader from "../../components/seller/loading-spinner.jsx";

export default function AddSales() {
    const navigate = useNavigate();

    const [myProducts] = useState([
        { id: 101, name: "제주 당근 5kg" },
        { id: 102, name: "강원 감자 10kg" },
    ]);

    const [selectedProduct, setSelectedProduct] = useState("");
    const [unit, setUnit] = useState("KG");
    const [originalPricePerBaseUnit, setOriginalPricePerBaseUnit] =
        useState("");
    const [stock, setStock] = useState("");
    const [description, setDescription] = useState("");
    const [maxDiscountPercent, setMaxDiscountPercent] = useState("");
    const [stageCount, setStageCount] = useState("");
    const [loading, setLoading] = useState(false); // ✅ 로딩 상태 추가

    const goNext = () => {
        if (!selectedProduct || !unit || !originalPricePerBaseUnit || !stock) {
            alert("모든 항목을 입력해 주세요.");
            return;
        }

        const product = myProducts.find(
            (p) => p.id.toString() === selectedProduct
        );

        if (!product) {
            alert("상품을 선택해 주세요.");
            return;
        }

        // ✅ 로딩 시작
        setLoading(true);

        // 로딩 화면을 1~2초 정도 보여준 후 실제 페이지 이동
        setTimeout(() => {
            setLoading(false);
            navigate("/seller/add-sales-ai", {
                state: {
                    productId: Number(product.id),
                    name: product.name,
                    unit,
                    originalPricePerBaseUnit: Number(originalPricePerBaseUnit),
                    stock: Number(stock),
                    description,
                    maxDiscountPercent: Number(maxDiscountPercent) || 0,
                    stageCount: Number(stageCount) || 0,
                },
            });
        }, 1500); // 1.5초 후 이동 (원하면 시간 조절 가능)
    };

    if (loading) {
        // ✅ 로딩 화면 표시
        return (
            <div className="flex items-center justify-center min-h-screen">
                <AIAnalyzingLoader />
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-[390px] mx-auto bg-white min-h-screen pb-16 font-pretendard tracking-[-0.03em]">
            <form className="mt-4 px-4 space-y-4">
                {/* 상품 선택 */}
                <div>
                    <label className="block text-sm font-medium">
                        *상품 선택
                    </label>
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                    >
                        <option value="">상품을 선택하세요</option>
                        {myProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 단위, 정가, 목표 수량 */}
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="block text-sm font-medium">
                            *단위
                        </label>
                        <input
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            *정가(원)
                        </label>
                        <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            value={originalPricePerBaseUnit}
                            onChange={(e) =>
                                setOriginalPricePerBaseUnit(e.target.value)
                            }
                            placeholder="예) 3200"
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            *목표 수량
                        </label>
                        <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="예) 500"
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                {/* 상품 설명 */}
                <div>
                    <label className="block text-sm font-medium">
                        상품 설명
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='예) "달달한 봄 당근"'
                        rows={2}
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                    />
                </div>

                {/* 최대 할인율 + 단계 수 */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium">
                            최대 할인율(%)
                        </label>
                        <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            value={maxDiscountPercent}
                            onChange={(e) =>
                                setMaxDiscountPercent(e.target.value)
                            }
                            placeholder="예) 15"
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            단계 수
                        </label>
                        <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            value={stageCount}
                            onChange={(e) => setStageCount(e.target.value)}
                            placeholder="예) 5"
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                {/* 다음 단계 버튼 */}
                <button
                    type="button"
                    onClick={goNext}
                    className="w-full h-11 rounded-lg bg-[#F5B236] text-white text-sm font-semibold mt-6"
                >
                    다음 단계로 넘어가기
                </button>
            </form>
        </div>
    );
}
