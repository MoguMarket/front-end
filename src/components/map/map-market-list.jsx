import MarketCard from "./map-market-card";

export default function MapMarketList({ items = [], onSelect }) {
  if (!items.length) {
    return (
      <div
        className="overflow-y-auto px-2 pb-3"
        style={{ minHeight: "56vh", maxHeight: "56vh" }} // 높이 고정
      >
        <div className="py-10 text-center text-neutral-500 text-sm">
          검색 결과가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-y-auto px-2 pb-3"
      style={{ minHeight: "42vh", maxHeight: "42vh" }} // 높이 고정
    >
      {items.map((m) => (
        <MarketCard
          key={m.id ?? `${m.name}-${m.lat}-${m.lng}`}
          name={m.name}
          location={m.location}
          distanceKm={m.distanceKm}
          onClick={() => onSelect?.(m)}
        />
      ))}
    </div>
  );
}
