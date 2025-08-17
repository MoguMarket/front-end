import React from "react";

/**
 * 아무 결과 없을 때 표시하는 일러스트/문구
 * props:
 * - message?: string (기본: "검색 결과가 없습니다")
 * - className?: string
 */
export default function NoSearch({
  message = "검색 결과가 없습니다",
  className = "",
}) {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center py-50 ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* 일러스트 (가방 + 얼굴) */}
      <svg
        width="230"
        height="180"
        viewBox="0 0 512 512"
        aria-hidden="true"
        className="mb-6"
      >
        {/* 가방 몸통 (사다리꼴 느낌) */}
        <path
          d="M128 224h256l-36 240H164L128 224z"
          fill="none"
          stroke="#4DC554"
          strokeWidth="23"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* 손잡이 */}
        <path
          d="M176 224c0-49 39-88 80-88s80 39 80 88"
          fill="none"
          stroke="#4DC554"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* 눈 */}
        <circle cx="208" cy="316" r="14" fill="#4DC554" />
        <circle cx="304" cy="316" r="14" fill="#4DC554" />
        {/* 입(하락 곡선) */}
        <path
          d="M208 388 Q256 430 304 388"
          fill="none"
          stroke="#4DC554"
          strokeWidth="16"
          strokeLinecap="round"
        />
      </svg>

      <p className="text-[17px] text-neutral-500">{message}</p>
    </div>
  );
}
