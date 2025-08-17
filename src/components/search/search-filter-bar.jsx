import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";

// 정렬 옵션
const SORT_OPTIONS = [
  { value: "ai", label: "AI추천순" },
  { value: "discount", label: "할인율순" },
  { value: "ending", label: "종료임박순" },
  { value: "sales", label: "판매순" },
  { value: "rating", label: "별점순" },
  { value: "new", label: "신상품순" },
];

export default function SearchFilterBar() {
  const [sp, setSp] = useSearchParams();

  // URL에서 초기값 읽기
  const minFromUrl = sp.get("min") ?? "";
  const maxFromUrl = sp.get("max") ?? "";
  const sortFromUrl = sp.get("sort") ?? "ai";
  const priceEnabledFromUrl = (() => {
    const v = sp.get("price");
    return v === "1" || v === "on" || v === "true";
  })();
  const isDomestic = sp.get("origin") === "domestic";

  // 로컬 UI 상태
  const [priceOpen, setPriceOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(minFromUrl);
  const [maxPrice, setMaxPrice] = useState(maxFromUrl);
  const [priceEnabled, setPriceEnabled] = useState(priceEnabledFromUrl);

  // URL이 바뀌면 로컬 값 동기화(뒤로가기 등)
  useEffect(() => {
    if (!priceOpen) {
      setMinPrice(minFromUrl);
      setMaxPrice(maxFromUrl);
      setPriceEnabled(priceEnabledFromUrl);
    }
  }, [minFromUrl, maxFromUrl, priceEnabledFromUrl, priceOpen]);

  const currentSort = useMemo(() => {
    return SORT_OPTIONS.find((o) => o.value === sortFromUrl) ?? SORT_OPTIONS[0];
  }, [sortFromUrl]);

  // 숫자/검증
  const nMin = minPrice === "" ? null : Number(minPrice);
  const nMax = maxPrice === "" ? null : Number(maxPrice);
  const invalidRange =
    (nMin != null && Number.isNaN(nMin)) ||
    (nMax != null && Number.isNaN(nMax)) ||
    (nMin != null && nMax != null && nMin > nMax);

  const canApply =
    priceEnabled && !invalidRange && (nMin != null || nMax != null);

  // URL 갱신 유틸
  const updateParams = (nextMap) => {
    const next = new URLSearchParams(sp);
    Object.entries(nextMap).forEach(([k, v]) => {
      if (v === null || v === undefined || v === "") next.delete(k);
      else next.set(k, String(v));
    });
    setSp(next, { replace: false });
  };

  // 국내산 토글
  const toggleDomestic = () => {
    updateParams({ origin: isDomestic ? "" : "domestic", page: 1 });
  };

  // 가격 적용
  const handleApplyPrice = () => {
    if (priceEnabled) {
      if (invalidRange) return;
      updateParams({
        price: 1,
        min: nMin ?? "",
        max: nMax ?? "",
        page: 1,
      });
    } else {
      // 비활성화면 관련 파라미터 제거
      updateParams({ price: "", min: "", max: "", page: 1 });
    }
    setPriceOpen(false);
  };

  const handleResetPrice = () => {
    setMinPrice("");
    setMaxPrice("");
    updateParams({ min: "", max: "", page: 1 });
  };

  const handleSelectSort = (value) => {
    updateParams({ sort: value, page: 1 });
    setSortOpen(false);
  };

  // 가격 필터 사용 체크 토글 (URL에도 즉시 반영)
  const togglePriceEnabled = () => {
    const next = !priceEnabled;
    setPriceEnabled(next);
    updateParams({ price: next ? 1 : "" });
  };

  return (
    <div className=" pt-3 pb-2 relative bg-white">
      {/* 상단 칩 + 정렬 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 국내산 칩 */}
          <button
            type="button"
            onClick={toggleDomestic}
            className={`px-5 h-9 rounded-full border text-[15px] ${
              isDomestic
                ? "bg-[#4DC554] text-white border-transparent"
                : "text-neutral-800 border-[#e6e6e6]"
            }`}
          >
            국내산
          </button>

          {/* 가격 칩 */}
          <button
            type="button"
            onClick={() => {
              setPriceOpen((v) => !v);
              setSortOpen(false);
            }}
            className={`px-6 h-9 rounded-full text-[15px] ${
              priceEnabled
                ? "bg-[#4DC554] text-white"
                : "bg-white text-neutral-800 border border-[#e6e6e6]"
            }`}
          >
            가격
          </button>
        </div>

        {/* 정렬 드롭다운 토글 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setSortOpen((v) => !v);
              setPriceOpen(false);
            }}
            className="flex items-center gap-1 text-[15px]"
          >
            <span className="text-black">{currentSort.label}</span>
            <ChevronDown size={18} className="text-black" />
          </button>

          {/* 드롭다운 */}
          {sortOpen && (
            <div className="absolute right-0 mt-3 w-40 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 py-2 z-10">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectSort(opt.value)}
                  className={`w-full text-left px-4 py-2.5 text-[15px] ${
                    opt.value === currentSort.value
                      ? "text-[#4CC554] font-semibold"
                      : "text-neutral-700"
                  } hover:bg-neutral-50`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 가격 패널 */}
      {priceOpen && (
        <div className="mt-5 p-4 rounded-3xl bg-white shadow-xl">
          <div className="flex items-center gap-3">
            {/* 최소가 */}
            <div className="flex-1 relative">
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(e.target.value.replace(/[^\d]/g, ""))
                }
                placeholder="최소"
                className="w-full h-10 pl-5 pr-14 rounded-[22px] border-2 border-[#4CC554] text-[16px]  text-neutral-800 outline-none"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[16px] text-neutral-700">
                원
              </span>
            </div>

            <span className="text-2xl text-neutral-500">–</span>

            {/* 최대가 */}
            <div className="flex-1 relative">
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value.replace(/[^\d]/g, ""))
                }
                placeholder="최대"
                className="w-full h-10 pl-5 pr-14 rounded-[22px] border-2 border-[#4CC554] text-[16px] text-neutral-800 outline-none"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[16px] text-neutral-700">
                원
              </span>
            </div>
          </div>

          {/* 가격 필터링 적용하기 체크박스 */}
          <label className="mt-4 flex items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={priceEnabled}
              onChange={togglePriceEnabled}
              className="w-5 h-5 accent-[#4DC554]"
            />
            <span className="text-[15px] text-neutral-700">
              가격 필터링 적용하기
            </span>
          </label>

          {/* 오류 문구 */}
          {invalidRange && priceEnabled && (
            <p className="mt-3 text-[14px] text-red-500 text-center">
              가격 범위가 올바르지 않습니다.
            </p>
          )}

          {/* 하단 버튼들 */}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetPrice}
              className="text-[16px] text-neutral-600"
            >
              초기화
            </button>

            <button
              type="button"
              onClick={handleApplyPrice}
              disabled={!priceEnabled || !canApply}
              className={`px-6 h-10 rounded-2xl text-white text-[16px] transition ${
                !priceEnabled || !canApply
                  ? "bg-neutral-300 cursor-not-allowed"
                  : "bg-[#4CC554]"
              }`}
            >
              적용하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
