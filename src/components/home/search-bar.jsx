import { Search, X } from "lucide-react";

/**
 * props:
 * - placeholder?: string
 * - categoryLabel?: string|null
 * - onClearCategory?: () => void
 */
export default function SearchBar({
  placeholder = "상품을 검색하세요",
  categoryLabel = null,
  onClearCategory,
}) {
  const hasCategory = !!categoryLabel;

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-screen px-4 mt-[-5px]">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative mt-2 md:mt-3 w-full mx-auto
           max-w-[300px] md:max-w-[400px] lg:max-w-[370px]"
      >
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4CC554]"
          size={18}
        />

        {/* 선택된 카테고리 배지 (입력창 안 왼쪽) */}
        {hasCategory && (
          <span
            className="absolute left-9 top-1/2 -translate-y-1/2 h-7 px-3 inline-flex items-center rounded-full border border-[#4CC554] text-[#4CC554] text-sm bg-white"
            title={categoryLabel}
          >
            {categoryLabel}
          </span>
        )}

        {/* 입력창 */}
        <input
          placeholder={placeholder}
          aria-label="상품 검색"
          className={`w-full h-10 md:h-11 ${
            hasCategory ? "pl-28" : "pl-10"
          } pr-9 rounded-xl border border-[#4CC554] bg-white shadow-sm text-sm placeholder:text-neutral-400 focus:outline-none`}
        />

        {/* 카테고리 지우기 버튼 (오른쪽) */}
        {hasCategory && (
          <button
            type="button"
            aria-label="선택된 카테고리 지우기"
            onClick={onClearCategory}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-neutral-200/80 flex items-center justify-center"
          >
            <X size={14} className="text-neutral-600" />
          </button>
        )}
      </form>
    </div>
  );
}
