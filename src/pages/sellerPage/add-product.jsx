// src/pages/sellerPage/add-product.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";

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

    // 본문 폼 상태
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [unit, setUnit] = useState("KG");
    const [originalPrice, setOriginalPrice] = useState("");
    const [stock, setStock] = useState("");
    const [imageUrl, setImageUrl] = useState(""); // 대표 이미지 URL(서버 전송용, 필수)
    const [imagePreviews, setImagePreviews] = useState([]); // 파일 업로드 미리보기(최대 4장)
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // 할인 보조 입력(서버 전송 X, 화면용)
    const [maxDiscount, setMaxDiscount] = useState("");
    const [steps, setSteps] = useState("");
    const discountSteps = useMemo(
        () => computeDiscountSteps(maxDiscount, steps),
        [maxDiscount, steps]
    );

    // 파일 선택 → 미리보기(최대 4장까지)
    const handleImageFile = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        // 대표 URL이 있으면 1칸 차지한다고 보고 남은 슬롯 계산
        const used = (imageUrl?.trim() ? 1 : 0) + imagePreviews.length;
        const remaining = Math.max(0, 4 - used);
        if (remaining === 0) return;

        const selected = files.slice(0, remaining);
        const newPreviews = selected.map((f) => URL.createObjectURL(f));
        setImagePreviews((prev) => [...prev, ...newPreviews]);

        // 같은 파일을 다시 선택할 수 있도록 input 초기화
        e.target.value = "";
    };

    // 미리보기 그리드에 표시할 목록(대표 URL + 파일 미리보기) 최대 4개
    const previewList = useMemo(() => {
        const list = [];
        if (imageUrl.trim()) list.push(imageUrl.trim());
        return [...list, ...imagePreviews].slice(0, 4);
    }, [imageUrl, imagePreviews]);

    const valid = useMemo(() => {
        const price = Number(originalPrice);
        const stk = Number(stock);
        return (
            name.trim() &&
            description.trim() &&
            unit.trim() &&
            imageUrl.trim() && // 서버 전송용 대표 이미지 URL 필요
            Number.isFinite(price) &&
            price > 0 &&
            Number.isInteger(stk) &&
            stk >= 0
        );
    }, [name, description, unit, originalPrice, stock, imageUrl]);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!valid) return;

        setLoading(true);
        setErrorMsg("");

        try {
            const payload = {
                storeId: 1,
                name: name.trim(),
                description: description.trim(),
                unit: unit.trim(),
                originalPrice: Number(originalPrice),
                stock: Number(stock),
                imageUrl: imageUrl.trim(), // 대표 이미지 한 장만 서버 전송
            };

            const res = await fetch(`${API_BASE}/api/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.status === 201) {
                const createdId = await res.json(); // 명세 예시: createdId
                alert(`상품이 등록되었습니다. (ID: ${createdId})`);
                navigate("/seller-home", { replace: true });
            } else if (res.status === 400) {
                setErrorMsg(
                    "요청 바디 유효성 오류입니다. 입력값을 확인하세요."
                );
            } else if (res.status === 404) {
                setErrorMsg("가게(스토어) 미존재 등 참조 무결성 실패.");
            } else {
                setErrorMsg("서버 오류가 발생했습니다.");
            }
        } catch (err) {
            setErrorMsg("네트워크 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full max-w-[390px] mx-auto bg-white min-h-screen pb-16">
            {/* 페이지 헤더가 따로 있다면 생략 가능 */}
            <header className="px-3 pt-4 pb-2">
                <p className="mt-1 px-[2px] text-xs text-gray-500">
                *필수 정보를 반드시 입력해 주세요.
                </p>
            </header>

            <form
                onSubmit={onSubmit}
                className="mt-1 px-4 space-y-4 font-[Pretendard]"
            >
                {/* 이미지 영역 */}
                <section className="space-y-2">
                    <label className="block text-sm font-medium">
                        *상품 사진
                    </label>

                    {/* 촬영/업로드 - 상자형 버튼 */}
                    <input
                        id="productImage"
                        type="file"
                        accept="image/*"
                        multiple
                        capture="environment"
                        onChange={handleImageFile}
                        className="hidden"
                    />
                    <label
                        htmlFor="productImage"
                        className="block w-full rounded-xl border-2 border-dashed border-gray-300 px-4 py-5 text-center cursor-pointer hover:border-[#F5B236] hover:bg-[#FFF8E6] transition"
                        aria-label="상품 사진 촬영 또는 업로드"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <FaCamera size={18} className="text-gray-600" />
                            <span className="text-sm font-medium">
                                사진 촬영/업로드 (최대 4장)
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            (대표 이미지 URL 1장 + 파일 미리보기 최대 3장 권장)
                        </p>
                    </label>

                    {/* 대표 이미지 URL(필수) */}
                    <div className="mt-2">
                        <label className="block text-xs text-gray-600 mb-1">
                            대표 이미지 URL
                        </label>
                        <input
                            type="url"
                            placeholder="https://... 대표 이미지 URL"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-sm tracking-[-0.03em]"
                            style={{ fontFeatureSettings: "'tnum'" }}
                        />
                    </div>

                    {/* 미리보기 그리드(최대 4칸) */}
                    <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">
                                미리보기
                            </span>
                            <span className="text-[11px] text-gray-500">
                                {previewList.length}/4
                            </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {previewList.map((src, idx) => (
                                <img
                                    key={idx}
                                    src={src}
                                    alt={`preview-${idx}`}
                                    className="w-full aspect-square object-cover rounded-md border"
                                />
                            ))}
                            {Array.from({
                                length: Math.max(0, 4 - previewList.length),
                            }).map((_, i) => (
                                <div
                                    key={`ph-${i}`}
                                    className="w-full aspect-square rounded-md border-2 border-dashed border-gray-200 flex items-center justify-center text-[11px] text-gray-400"
                                >
                                    빈 슬롯
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

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
                                *재고
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
                            단계별 할인율
                        </label>
                        <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            step="0.1"
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

                {/* 오류/버튼 */}
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
                    {loading ? "등록 중..." : "등록하기"}
                </button>
            </form>
        </div>
    );
}
