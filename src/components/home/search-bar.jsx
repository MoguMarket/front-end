import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

/**
 * props:
 * - placeholder?: string
 * - categoryLabel?: string|null
 * - onClearCategory?: () => void
 * - defaultValue?: string        // 초기 검색어 (URL q 등)
 * - onSubmit?: (term: string) => void   // 엔터/submit 시 호출
 */
export default function SearchBar({
  placeholder = "상품을 검색하세요",
  categoryLabel = null,
  onClearCategory,
  defaultValue = "",
  onSubmit,
}) {
  const [value, setValue] = useState(defaultValue);

  // URL에서 바뀐 q 반영
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const hasCategory = !!categoryLabel;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value.trim());
  };

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-screen px-4 mt-[-5px]">
      <form
        onSubmit={handleSubmit}
        className="relative mt-2 md:mt-3 w-full mx-auto
           max-w-[300px] md:max-w-[400px] lg:max-w-[370px]"
      >
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4CC554]"
          size={18}
        />

        {hasCategory && (
          <span
            className="absolute left-9 top-1/2 -translate-y-1/2 h-7 px-3 inline-flex items-center rounded-full border border-[#4CC554] text-[#4CC554] text-sm bg-white"
            title={categoryLabel}
          >
            {categoryLabel}
          </span>
        )}

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label="상품 검색"
          className={`w-full h-10 md:h-11 ${
            hasCategory ? "pl-32" : "pl-10"
          } pr-9 rounded-xl border border-[#4CC554] bg-white shadow-sm text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#4CC554] focus:border-[#4CC554]`}
        />

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
