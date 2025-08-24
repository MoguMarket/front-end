// src/pages/sellerPage/add-sales.jsx
import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "";

function computeDiscountSteps(maxDiscount, steps) {
    const md = Number(maxDiscount);
    const st = Number(steps);
    if (!md || !st || md <= 0 || st <= 0) return [];
    const unit = md / st;
    return Array.from(
        { length: st },
        (_, i) => Math.round(unit * (i + 1) * 10) / 10
    );
}

export default function AddProduct() {
    const navigate = useNavigate();
    const location = useLocation();

    // 폼 상태
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [unit, setUnit] = useState("KG");
    const [originalPrice, setOriginalPrice] = useState("");
    const [stock, setStock] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // 할인 보조(서버 전송 X)
    const [maxDiscount, setMaxDiscount] = useState("");
    const [steps, setSteps] = useState("");
    const discountSteps = useMemo(
        () => computeDiscountSteps(maxDiscount, steps),
        [maxDiscount, steps]
    );

    // 유효성 (현재 화면 입력 그대로 유지)
    const valid = useMemo(() => {
        const price = Number(originalPrice);
        const stk = Number(stock);
        return (
            name.trim() &&
            description.trim() &&
            unit.trim() &&
            Number.isFinite(price) &&
            price > 0 &&
            Number.isInteger(stk) &&
            stk >= 0
        );
    }, [name, description, unit, originalPrice, stock]);

    // onSubmit: productId 하드코딩 → 공동구매 생성만 호출
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!valid) return;

        setLoading(true);
        setErrorMsg("");

        try {
            // ✅ 업로드/상품등록 모든 로직 제거됨
            // ✅ productId 하드코딩
            const productId = 1; // 필요에 따라 실제 존재하는 ID로 변경

            // 공동구매 생성 payload
            const groupbuyPayload = {
                userId: 1, // 요구사항: userId만 하드코딩
                targetQty: Number(stock),
                maxDiscountPercent: Number(maxDiscount) || 0,
                stage: Number(steps) || 3,
                startAt: new Date().toISOString(),
                endAt: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toISOString(),
            };

            const gbRes = await fetch(
                `${API_BASE}/api/groupbuys/${productId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(groupbuyPayload),
                }
            );

            const gbText = await gbRes.text();
            console.log(
                "[POST /api/groupbuys/%s] status:",
                productId,
                gbRes.status
            );
            console.log("[POST /api/groupbuys body]", groupbuyPayload);
            console.log("[POST /api/groupbuys resp]", gbText);

            if (gbRes.ok) {
                alert("공동구매 등록 완료!");
                navigate(`/seller-home${location.search || ""}`, {
                    replace: true,
                });
            } else if (gbRes.status === 400) {
                setErrorMsg(
                    "요청 파라미터 오류입니다. 입력값을 확인해 주세요."
                );
            } else {
                setErrorMsg(`공동구매 등록 실패 (status ${gbRes.status})`);
            }
        } catch (err) {
            console.error("공동구매 생성 중 에러:", err);
            setErrorMsg(err?.message || "네트워크 오류 발생");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full max-w-[390px] mx-auto bg-white min-h-screen pb-16">
            <form
                onSubmit={onSubmit}
                className="mt-1 px-4 space-y-4 font-[Pretendard]"
            >
                {/* 기본 정보 */}
                <section className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="block text-sm font-medium">
                            *상품명
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="예) 제주 당근 5kg"
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            *설명
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='예) "달달한 봄 당근"'
                            rows={3}
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
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
                                step="1"
                                value={originalPrice}
                                onChange={(e) =>
                                    setOriginalPrice(e.target.value)
                                }
                                placeholder="예) 3200"
                                className="w-full rounded-lg border px-3 py-2 text-sm tracking-[-0.03em]"
                                style={{ fontFeatureSettings: "'tnum'" }}
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
                                step="1"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                placeholder="예) 500"
                                className="w-full rounded-lg border px-3 py-2 text-sm tracking-[-0.03em]"
                                style={{ fontFeatureSettings: "'tnum'" }}
                            />
                        </div>
                    </div>
                </section>

                {/* 할인 단계 보조(서버 전송 X) */}
                <section className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium">
                            최대 할인율(%)
                        </label>
                        <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            step="0.1"
                            value={maxDiscount}
                            onChange={(e) => setMaxDiscount(e.target.value)}
                            placeholder="예) 15"
                            className="w-full rounded-lg border px-3 py-2 text-sm tracking-[-0.03em]"
                            style={{ fontFeatureSettings: "'tnum'" }}
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
                            step="1"
                            value={steps}
                            onChange={(e) => setSteps(e.target.value)}
                            placeholder="예) 5"
                            className="w-full rounded-lg border px-3 py-2 text-sm tracking-[-0.03em]"
                            style={{ fontFeatureSettings: "'tnum'" }}
                        />
                    </div>
                    {discountSteps.length > 0 && (
                        <div className="col-span-2 text-xs text-gray-600">
                            단계별 할인율(누적): {discountSteps.join("%, ")}%
                        </div>
                    )}
                </section>

                <header className="px-3 pt-4 pb-2">
                    <p className="-mt-3 -mb-5 text-sm text-red-400">
                        ** 공동구매를 시작하면 정보를 수정할 수 없습니다.
                    </p>
                </header>

                {errorMsg && (
                    <p className="text-sm text-red-600" role="alert">
                        {errorMsg}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={!valid || loading}
                    className="w-full h-11 rounded-lg bg-[#F5B236] text-white text-sm font-semibold disabled:opacity-50"
                >
                    {loading ? "등록 중..." : "공동구매 등록하기"}
                </button>
            </form>
        </div>
    );
}
