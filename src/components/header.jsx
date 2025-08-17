import logo from "../assets/header-logo.svg";
import { MapPin } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import MARKETS_PLACE from "../components/db/marketPlace-db";

export default function Header() {
  const location = useLocation();
  const [sp] = useSearchParams();
  const shopId = sp.get("shopId");

  // shopId로 현재 시장 찾기 (id/marketId 둘 다 대응)
  const sid = shopId ? Number(shopId) : null;
  const currentMarket = sid
    ? MARKETS_PLACE.find((m) => m.id === sid || m.marketId === sid)
    : null;

  const marketName = currentMarket?.name ?? "시장 선택";

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-[#4CC554] z-50 mb-[-30px]">
      <div className="h-14 flex items-center justify-between px-4 text-white">
        <img src={logo} alt="Logo" className="h-6" />

        <Link
          to="/marketMapList"
          state={{ from: location.pathname }}
          className="flex items-center space-x-1"
        >
          <MapPin size={16} color="white" />
          <span className="underline text-sm font-medium">{marketName}</span>
        </Link>
      </div>
    </header>
  );
}
