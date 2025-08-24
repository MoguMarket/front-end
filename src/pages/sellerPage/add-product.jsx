// src/pages/sellerPage/add-product.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaCamera,
    FaChevronLeft,
    FaChevronRight,
    FaStar,
} from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE || "";
const UPLOAD_ENDPOINT =
    import.meta.env.VITE_UPLOAD_ENDPOINT || `${API_BASE}/api/uploads/images`;

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

    // 이미지: 파일(최대 4장) + 미리보기
    const [imageFiles, setImageFiles] = useState([]); // File[]
    const [imagePreviews, setImagePreviews] = useState([]); // string[] (objectURL)

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // 할인 보조 입력(서버 전송 X, 화면용)
    const [maxDiscount, setMaxDiscount] = useState("");
    const [steps, setSteps] = useState("");
    const discountSteps = useMemo(
        () => computeDiscountSteps(maxDiscount, steps),
        [maxDiscount, steps]
    );

    // 파일 선택 → 미리보기(최대 4장)
    const handleImageFile = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const remaining = Math.max(0, 4 - imageFiles.length);
        if (remaining === 0) return;

        const selected = files.slice(0, remaining);
        setImageFiles((prev) => [...prev, ...selected]);

        const newPreviews = selected.map((f) => URL.createObjectURL(f));
        setImagePreviews((prev) => [...prev, ...newPreviews]);

        e.target.value = ""; // 같은 파일 재선택 가능
    };

    // 재배치 유틸
    const reorderPair = (arr, from, to) => {
        const next = [...arr];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        return next;
    };

    const makePrimary = (idx) => {
        if (idx === 0) return;
        setImageFiles((prev) => reorderPair(prev, idx, 0));
        setImagePreviews((prev) => reorderPair(prev, idx, 0));
    };

    const moveLeft = (idx) => {
        if (idx <= 0) return;
        setImageFiles((prev) => reorderPair(prev, idx, idx - 1));
        setImagePreviews((prev) => reorderPair(prev, idx, idx - 1));
    };

    const moveRight = (idx) => {
        if (idx >= imageFiles.length - 1) return;
        setImageFiles((prev) => reorderPair(prev, idx, idx + 1));
        setImagePreviews((prev) => reorderPair(prev, idx, idx + 1));
    };

    // 미리보기 목록(파일 기준) 최대 4개
    const previewList = useMemo(
        () => imagePreviews.slice(0, 4),
        [imagePreviews]
    );

    // 업로드 (여러 장 병렬 업로드, 현재 순서를 유지)
    async function uploadImages(files) {
        const uploads = files.map(async (file) => {
            const form = new FormData();
            form.append("file", file);
            const res = await fetch(UPLOAD_ENDPOINT, {
                method: "POST",
                body: form,
            });
            if (!res.ok) throw new Error("이미지 업로드 실패");
            const data = await res.json();
            const url =
                data?.url || (Array.isArray(data?.urls) ? data.urls[0] : null);
            if (!url) throw new Error("업로드 응답에 URL 없음");
            return url;
        });
        return Promise.all(uploads);
    }

    // 유효성: 기본 필드 + 파일 최소 1장
    const valid = useMemo(() => {
        const price = Number(originalPrice);
        const stk = Number(stock);
        const baseOk =
            name.trim() &&
            description.trim() &&
            unit.trim() &&
            Number.isFinite(price) &&
            price > 0 &&
            Number.isInteger(stk) &&
            stk >= 0;

        return Boolean(baseOk && imageFiles.length > 0);
    }, [name, description, unit, originalPrice, stock, imageFiles.length]);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!valid) return;

        setLoading(true);
        setErrorMsg("");

        try {
            // 1) 현재 순서대로 업로드
            const uploadedUrls = await uploadImages(imageFiles);

            // 2) 대표 이미지 = 업로드된 배열의 첫 번째
            const primaryImageUrl = uploadedUrls[0] || "";
            if (!primaryImageUrl) {
                setErrorMsg(
                    "이미지 업로드에 실패했습니다. 다시 시도해 주세요."
                );
                setLoading(false);
                return;
            }

            // 3) 상품 등록 POST
            const payload = {
                storeId: 1,
                name: name.trim(),
                description: description.trim(),
                unit: unit.trim(),
                originalPrice: Number(originalPrice),
                stock: Number(stock),
                imageUrl: primaryImageUrl, // 명세상 대표 1장만 전송
                // 추가 이미지 저장이 필요하면 백엔드 스펙 확장(ex: images: uploadedUrls)
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
            setErrorMsg(err?.message || "네트워크/업로드 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full max-w-[390px] mx-auto bg-white min-h-screen pb-16">
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
                            썸네일을 탭하면 대표이미지로 설정됩니다.
                            좌/우 버튼으로 순서 조정 가능.
                        </p>
                    </label>

                    {/* 미리보기 그리드(최대 4칸) + 순서 변경 */}
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
                                <div key={idx} className="relative group">
                                    {/* 썸네일 */}
                                    <button
                                        type="button"
                                        onClick={() => makePrimary(idx)}
                                        className="w-full aspect-square rounded-md overflow-hidden border focus:outline-none focus:ring-2 focus:ring-[#F5B236]"
                                        aria-label={
                                            idx === 0
                                                ? "대표 이미지"
                                                : "대표로 설정"
                                        }
                                        title={
                                            idx === 0
                                                ? "대표 이미지"
                                                : "대표로 설정"
                                        }
                                    >
                                        <img
                                            src={src}
                                            alt={`preview-${idx}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>

                                    {/* 순서 배지 */}
                                    <div
                                        className={`absolute top-1 left-1 px-1.5 py-[2px] rounded text-[10px] ${
                                            idx === 0
                                                ? "bg-[#F5B236] text-white"
                                                : "bg-black/60 text-white"
                                        }`}
                                    >
                                        {idx === 0 ? (
                                            <span className="flex items-center gap-1">
                                                <FaStar className="inline-block" />{" "}
                                                대표
                                            </span>
                                        ) : (
                                            <span>{idx + 1}</span>
                                        )}
                                    </div>

                                    {/* 좌/우 이동 버튼 (호버 시 노출, 모바일도 탭 영역 큼) */}
                                    {previewList.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => moveLeft(idx)}
                                                className="absolute inset-y-0 left-0 flex items-center justify-center w-6 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition"
                                                aria-label="왼쪽으로 이동"
                                                disabled={idx === 0}
                                            >
                                                <FaChevronLeft />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveRight(idx)}
                                                className="absolute inset-y-0 right-0 flex items-center justify-center w-6 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition"
                                                aria-label="오른쪽으로 이동"
                                                disabled={
                                                    idx ===
                                                    previewList.length - 1
                                                }
                                            >
                                                <FaChevronRight />
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}

                            {/* 빈 슬롯 표시 */}
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
