export default function MarketCard({
  name,
  location,
  distanceKm,
  onClick,
  onSelect,
}) {
  const fmtDistance = (km) => {
    if (km == null || Number.isNaN(km)) return "-";
    if (km < 1) return `${Math.round(km * 1000)}m`;
    return `${km.toFixed(1)}km`;
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors cursor-pointer"
    >
      <div className="flex-1 text-left min-w-0">
        <div className="text-[15px] font-medium truncate">
          {name}
          {location && (
            <span className="text-neutral-500 ml-1 font-normal text-xs">
              {location}
            </span>
          )}
        </div>
      </div>

      <div className="ml-3 flex items-center gap-2 shrink-0">
        <div className="text-emerald-600 text-[15px] font-semibold tabular-nums">
          {fmtDistance(distanceKm)}
        </div>

        {/* ✅ 선택 버튼 (모달 트리거) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // 카드 클릭 이벤트 막기
            onSelect?.();
          }}
          className="ml-1 h-8 px-3 rounded-lg bg-emerald-600 text-white text-sm font-semibold active:translate-y-[1px]"
        >
          선택
        </button>
      </div>
    </div>
  );
}
