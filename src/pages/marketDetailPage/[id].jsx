import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import markets from "../../components/db/markets-db";
import Header from "../../components/marketDetail/header";

export default function MarketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const marketId = Number(id);
  const market = useMemo(
    () => markets.find((m) => m.id === marketId),
    [marketId]
  );

  if (!market) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="mb-3 text-sm underline">
          뒤로가기
        </button>
        <div className="text-red-600">
          해당 시장을 찾을 수 없습니다. (id: {id})
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[390px] mx-auto">
      <Header marketName={market.name} />
    </div>
  );
}
