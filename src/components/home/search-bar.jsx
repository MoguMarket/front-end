// src/components/SearchBar.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

export default function SearchBar({
  categoryLabel,
  onClearCategory,
  defaultValue = "",
  onSubmit,
  placeholder = "상품을 검색하세요",
  autoFocus = false,
  asStandalone = false,
  onStandaloneFocus,
}) {
  const [value, setValue] = useState(defaultValue);
  const nav = useNavigate();
  const inputRef = useRef(null);
  const { search } = useLocation(); // ✅ 기존 쿼리 보존 (shopId 등)
  const hasCategory = !!categoryLabel;

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleFocus = () => {
    if (asStandalone) {
      onStandaloneFocus?.();
    } else {
      // ✅ 기존 쿼리 + category 동봉해서 /search 이동
      const sp = new URLSearchParams(search);
      if (hasCategory) sp.set("category", categoryLabel);
      sp.set("page", "1");
      // q는 제안 화면을 보여주기 위해 비움
      sp.delete("q");
      nav(`/search?${sp.toString()}`);
    }
  };

  const submit = (e) => {
    e?.preventDefault();
    const term = value.trim();

    if (asStandalone) {
      onSubmit?.(term);
    } else {
      // ✅ 기존 쿼리 + category 유지 + q 설정
      const sp = new URLSearchParams(search);
      if (hasCategory) sp.set("category", categoryLabel);
      if (term) sp.set("q", term);
      else sp.delete("q");
      sp.set("page", "1");
      nav(`/search?${sp.toString()}`);
    }
  };

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-screen px-4 mt-[-5px]">
      <form
        onSubmit={submit}
        className="relative mt-2 md:mt-3 w-full mx-auto max-w-[300px] md:max-w-[400px] lg:max-w-[370px]"
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
          ref={inputRef}
          onFocus={handleFocus}
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
