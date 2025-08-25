// src/pages/sellerPage/add-product.jsx
import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCamera } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE || "";
const UPLOAD_ENDPOINT =
  import.meta.env.VITE_UPLOAD_ENDPOINT || `${API_BASE}/api/images`; // 필요시 변경

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

  // 본문 폼 상태
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("KG");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("");

  // 이미지 관련
  const [imageUrl, setImageUrl] = useState(""); // 대표 URL 수동 입력(옵션)
  const [imagePreviews, setImagePreviews] = useState([]); // 파일 미리보기용 URL[]
  const [imageFiles, setImageFiles] = useState([]); // 실제 파일 목록(대표는 첫 칸)
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 할인 보조(서버 전송 X)
  const [maxDiscount, setMaxDiscount] = useState("");
  const [steps, setSteps] = useState("");
  const discountSteps = useMemo(
    () => computeDiscountSteps(maxDiscount, steps),
    [maxDiscount, steps]
  );

  // 파일 선택 → 미리보기/파일 보관(최대 4칸, 수동 URL 있으면 1칸 차지)
  const handleImageFile = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const used = (imageUrl?.trim() ? 1 : 0) + imagePreviews.length;
    const remaining = Math.max(0, 4 - used);
    if (remaining === 0) return;

    const selected = files.slice(0, remaining);
    const newPreviews = selected.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setImageFiles((prev) => [...prev, ...selected]);

    e.target.value = ""; // 같은 파일 재선택 가능
  };

  const handleRemoveImage = (index) => {
    // index는 프리뷰 그리드 기준(수동 URL이 있으면 0번째는 URL)
    if (imageUrl.trim() && index === 0) {
      setImageUrl("");
      return;
    }
    const offset = imageUrl.trim() ? 1 : 0;
    const fileIdx = index - offset;
    if (fileIdx >= 0) {
      setImagePreviews((prev) => prev.filter((_, i) => i !== fileIdx));
      setImageFiles((prev) => prev.filter((_, i) => i !== fileIdx));
    }
  };

  // 미리보기 그리드(대표 URL + 파일 미리보기) 최대 4
  const previewList = useMemo(() => {
    const list = [];
    if (imageUrl.trim()) list.push(imageUrl.trim()); // 첫 칸(대표)
    return [...list, ...imagePreviews].slice(0, 4);
  }, [imageUrl, imagePreviews]);

  // 유효성: 파일 1개 이상 또는 imageUrl 둘 중 하나만 있어도 OK
  const valid = useMemo(() => {
    const price = Number(originalPrice);
    const stk = Number(stock);
    const hasImage = imageFiles.length > 0 || imageUrl.trim();
    return (
      name.trim() &&
      description.trim() &&
      unit.trim() &&
      hasImage &&
      Number.isFinite(price) &&
      price > 0 &&
      Number.isInteger(stk) &&
      stk >= 0
    );
  }, [
    name,
    description,
    unit,
    originalPrice,
    stock,
    imageFiles.length,
    imageUrl,
  ]);

  // 이미지 업로드 → 업로드 URL 반환 (대표 1장만)
  const uploadImageAndGetUrl = async () => {
    if (imageFiles.length === 0) {
      return imageUrl.trim(); // 파일 없으면 수동입력 URL 사용
    }
    const form = new FormData();
    form.append("file", imageFiles[0]); // 서버 필드명이 'file'이라고 가정
    const res = await fetch(UPLOAD_ENDPOINT, { method: "POST", body: form });
    if (!res.ok) throw new Error("이미지 업로드 실패");
    const data = await res.json();
    const uploadedUrl = data?.imageUrl || data?.url;
    if (!uploadedUrl) throw new Error("업로드 응답에 이미지 URL 없음");
    return uploadedUrl;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;

    setLoading(true);
    setErrorMsg("");

    try {
      // 1) 대표 이미지 URL 확보
      const finalImageUrl = await uploadImageAndGetUrl();

      // 2) 상품 등록 POST
      const payload = {
        storeId: 1,
        name: name.trim(),
        description: description.trim(),
        unit: unit.trim(),
        originalPrice: Number(originalPrice),
        stock: Number(stock),
        imageUrl: finalImageUrl, // 대표 1장
      };

      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        const createdId = await res.json(); // 생성된 ID나 객체
        alert(`상품이 등록되었습니다. (ID: ${createdId})`);
        // 현재 쿼리(예: ?shopId=...) 유지하여 셀러 홈으로 복귀
        navigate(`/seller-home${location.search || ""}`, { replace: true });
      } else if (res.status === 400) {
        setErrorMsg("요청 바디 유효성 오류입니다. 입력값을 확인하세요.");
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
    <div className="relative w-full max-w-[390px] mx-auto bg-white min-h-screen pb-24">
      {/* 헤더 */}
      <header className=" pt-3 pb-3">
        <p className="text-xs text-gray-500">
          *필수 정보를 반드시 입력해 주세요.
        </p>
      </header>

      <form onSubmit={onSubmit} className="mt-1 space-y-6 font-[Pretendard]">
        {/* 이미지 업로드 영역 */}
        <section className="space-y-4">
          <label className="block text-[15px] font-semibold mb-1">
            *상품 사진
          </label>

          {/* 큰 업로드 박스 */}
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
            className="block w-full rounded-3xl border-2 border-gray-300 px-5 py-8 text-center cursor-pointer hover:border-[#F5B236] hover:bg-[#FFF8E6] transition"
            aria-label="상품 사진 촬영 또는 업로드"
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center">
                <FaCamera className="text-gray-600" />
              </div>
              <div className="text-[15px] font-medium">
                사진 촬영/업로드 (최대 4장)
              </div>
              <p className="text-sm text-gray-500">
                첫번째 사진이 대표 이미지로 설정됩니다
              </p>
            </div>
          </label>

          {/* 하단 썸네일 4칸 */}
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => {
              const src = previewList[i];
              const isRep = i === 0 && !!src;
              return src ? (
                <div
                  key={i}
                  className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 ${
                    isRep ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  {/* 삭제 버튼 */}
                  <div className="absolute top-1 right-1 z-20">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-black/60 text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  {/* 대표 라벨 */}
                  {isRep && (
                    <span className="absolute left-1.5 top-1.5 z-10 rounded-md bg-blue-600 px-2 py-[3px] text-[11px] font-semibold text-white">
                      대표
                    </span>
                  )}

                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  key={i}
                  className="w-full aspect-square rounded-xl border-2 border-gray-200 flex items-center justify-center text-[12px] text-gray-400"
                >
                  빈 슬롯
                </div>
              );
            })}
          </div>

          {/* 고급 설정: 대표 이미지 URL(옵션) */}
          <details className="mt-1">
            <summary className="cursor-pointer text-xs text-gray-500">
              고급 설정 (대표 이미지 URL 입력)
            </summary>
            <div className="mt-3">
              <input
                type="url"
                placeholder="https://... 대표 이미지 URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 text-[15px] tracking-[-0.03em]"
                style={{ fontFeatureSettings: "'tnum'" }}
              />
              <p className="mt-2 text-[11px] text-gray-500">
                ※ 파일 업로드가 어려울 때만 사용하세요. 입력 시 첫 칸(대표)로
                표시됩니다.
              </p>
            </div>
          </details>
        </section>

        {/* 기본 정보 */}
        <section className="space-y-5">
          {/* 상품명 */}
          <div>
            <label className="block text-[15px] font-semibold mb-2">
              *상품명
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예) 제주 당근 5kg"
              className="w-full h-12 rounded-xl border border-gray-300 px-4 text-[15px]"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-[15px] font-semibold mb-2">
              *설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예) 달달한 봄 당근"
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[15px] min-h-[120px]"
            />
          </div>

          {/* 단위·정가 (2열) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[15px] font-semibold mb-2">
                *단위
              </label>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="KG"
                className="w-full h-12 rounded-xl border border-gray-300 px-4 text-[15px] uppercase"
              />
            </div>

            <div>
              <label className="block text-[15px] font-semibold mb-2">
                *정가
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step="1"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="예) 3200"
                  className="w-full h-12 rounded-xl border border-gray-300 pl-4 pr-12 text-[15px] tracking-[-0.03em]"
                  style={{ fontFeatureSettings: "'tnum'" }}
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  원
                </span>
              </div>
            </div>
          </div>

          {/* 재고 */}
          <div>
            <label className="block text-[15px] font-semibold mb-2">
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
              className="w-full h-12 rounded-xl border border-gray-300 px-4 text-[15px]"
              style={{ fontFeatureSettings: "'tnum'" }}
            />
          </div>
        </section>

        {/* (선택) 할인 단계 보조 → 값 있을 때만 */}
        {discountSteps.length > 0 && (
          <section className="mt-1">
            <div className="text-sm text-gray-600">
              단계별 할인율(누적): {discountSteps.join("%, ")}%
            </div>
          </section>
        )}

        {/* 오류/버튼 */}
        {errorMsg && (
          <p className="text-sm text-red-600" role="alert">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={!valid || loading}
          className="w-full h-12 rounded-xl bg-[#F5B236] text-white text-[15px] font-semibold disabled:opacity-50 mt-3"
        >
          {loading ? "등록 중..." : "등록하기"}
        </button>
      </form>
    </div>
  );
}
