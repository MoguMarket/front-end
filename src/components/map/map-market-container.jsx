import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import MapMarketList from "./map-market-list";

export default function MapMarketContainer({
  title = "시장 선택하기",
  markets = [],
  myLocation, // { lat, lng } (옵션)
  onSelect, // (market) => void
  onClose,
}) {
  const [q, setQ] = useState("");

  // 거리 계산 (없으면 myLocation 기준)
  const data = useMemo(() => {
    const toRad = (x) => (x * Math.PI) / 180;
    const haversineKm = (a, b) => {
      const R = 6371;
      const dLat = toRad(b.lat - a.lat);
      const dLng = toRad(b.lng - a.lng);
      const s =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(a.lat)) *
          Math.cos(toRad(b.lat)) *
          Math.sin(dLng / 2) ** 2;
      return 2 * R * Math.asin(Math.sqrt(s));
    };
    return markets.map((m) => {
      if (m.distanceKm != null) return m;
      if (myLocation && m.lat && m.lng) {
        return { ...m, distanceKm: haversineKm(myLocation, m) };
      }
      return m;
    });
  }, [markets, myLocation]);

  // 검색
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    if (!text) return data;
    return data.filter(
      (m) =>
        m.name?.toLowerCase().includes(text) ||
        m.location?.toLowerCase().includes(text)
    );
  }, [q, data]);

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[390px] z-50">
      <div className="rounded-t-3xl bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.14)] overflow-hidden border border-neutral-100">
        {/* header (sticky) */}
        <div className="sticky top-0 z-10 bg-white">
          <div className="px-5 pt-3 pb-2 text-center text-[18px] font-semibold">
            {title}
          </div>
          <div className="px-5 pb-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                size={18}
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="시장을 검색하세요"
                className="w-full h-10 pl-9 pr-3 rounded-full bg-neutral-100 outline-none placeholder:text-neutral-400 focus:bg-neutral-50"
              />
            </div>
          </div>
        </div>

        {/* list */}
        <MapMarketList items={filtered} onSelect={onSelect} />

        {/* optional bottom action */}
        {onClose && (
          <div className="px-5 pb-4">
            <button
              onClick={onClose}
              className="w-full h-10 rounded-xl border text-sm active:bg-neutral-50"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
