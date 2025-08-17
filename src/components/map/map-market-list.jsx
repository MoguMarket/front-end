// src/components/map-market-list.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MarketCard from "./map-market-card";
import { useSetAtom } from "jotai";
import { currentMarketIdAtom } from "../../atoms/market";
import ConfirmMarketSelect from "./confirm-market-select";

export default function MapMarketList({ items = [], onSelect }) {
  const setCurrentMarketId = useSetAtom(currentMarketIdAtom);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingMarket, setPendingMarket] = useState(null); // { id, name, ... }

  if (!items.length) {
    return (
      <div
        className="overflow-y-auto px-2 pb-3"
        style={{ minHeight: "56vh", maxHeight: "56vh" }}
      >
        <div className="py-10 text-center text-neutral-500 text-sm">
          검색 결과가 없습니다.
        </div>
      </div>
    );
  }

  // ✅ 카드 전체 클릭: "기존 동작"만 수행 (모달 열지 않음)
  const handleCardClick = (m) => {
    onSelect?.(m); // 예: 지도 패닝 등 기존 로직 유지
  };

  // ✅ 카드 안의 "선택" 버튼 클릭: 모달만 연다
  const handleOpenConfirm = (m) => {
    setPendingMarket(m);
    setModalOpen(true);
  };

  // 모달 "선택하기": 전역 저장 후 홈으로 이동 (필요시 onSelect 호출 유지)
  const handleConfirm = () => {
    if (!pendingMarket?.id) {
      setModalOpen(false);
      return;
    }

    // 전역 atom 저장
    setCurrentMarketId(pendingMarket.id);

    // 원래 onSelect를 확정 시점에 호출하고 싶다면 주석 해제
    // onSelect?.(pendingMarket);

    setModalOpen(false);

    // 홈으로 이동 (뒤로가기로 돌아오지 않게 replace)
    navigate("/", { replace: true });
  };

  return (
    <>
      <div
        className="overflow-y-auto px-2 pb-3"
        style={{ minHeight: "42vh", maxHeight: "42vh" }}
      >
        {items.map((m) => (
          <MarketCard
            key={m.id ?? `${m.name}-${m.lat}-${m.lng}`}
            name={m.name}
            location={m.location}
            distanceKm={m.distanceKm}
            onClick={() => handleCardClick(m)} // ← 카드 클릭: 모달 X
            onSelect={() => handleOpenConfirm(m)} // ← "선택" 버튼: 모달 O
          />
        ))}
      </div>

      {/* 모달 (디자인 변경 없음) */}
      <ConfirmMarketSelect
        open={modalOpen}
        shopId={pendingMarket?.id} // ✅ 선택된 시장 id
        marketName={pendingMarket?.name || ""}
        onCancel={() => setModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
