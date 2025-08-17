// 검색 페이지 전용 상단 검색바 (헤더 스타일 고정 바)
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function SearchTopBar({
  defaultValue = "",
  placeholder = "상품을 검색하세요",
  onSubmit, // (term: string) => void
  onBack, // () => void
  categoryLabel = null,
}) {
  const [value, setValue] = useState(defaultValue);
  const hasCategory = !!categoryLabel;

  useEffect(() => setValue(defaultValue), [defaultValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value.trim());
  };

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-[#4dc554] z-50">
      <div className="h-14 flex items-center px-4">
        {/* 뒤로가기 */}
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={onBack}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer"
        >
          <ArrowLeft size={23} />
        </button>

        {/* 검색 인풋 */}
        <form onSubmit={handleSubmit} className="flex-1 relative ml-2">
          {/* 카테고리 배지 (입력창 안 왼쪽) */}
          {hasCategory && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 h-6 px-3  inline-flex items-center rounded-full border border-[#4DC554] text-sm bg-white"
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
            className={`w-full h-9 rounded-2xl bg-white ${
              hasCategory ? "pl-22" : "pl-4"
            } pr-10 text-base placeholder:text-neutral-400 focus:outline-none`}
          />
          {/* 검색어 지우기(X) 버튼 제거됨 */}
        </form>
      </div>
    </header>
  );
}
