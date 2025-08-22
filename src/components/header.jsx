// src/components/header.jsx
import logo from "../assets/header-logo.svg";
import { MapPin, Bell } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import MARKETS_PLACE from "../components/db/marketPlace-db";
import React, { useEffect, useState } from "react";
import { enableWebPush, disableWebPush, listenForeground } from "../lib/webpush";

export default function Header() {
  const { pathname } = useLocation();
  const [sp] = useSearchParams();
  const shopId = sp.get("shopId");
  const fromGift = sp.get("from") === "gift";

  // SellerPage 여부(하위 경로 포함): /seller, /seller/... 모두 매칭
  const isSellerPage = pathname.startsWith("/seller");

  const sid = shopId ? Number(shopId) : null;
  const currentMarket = sid
    ? MARKETS_PLACE.find((m) => m.id === sid || m.marketId === sid)
    : null;

  const marketName = currentMarket?.name ?? "시장 선택";

  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState(
    () => localStorage.getItem("fcmToken") || null
  );
  const enabled = Boolean(fcmToken);

  useEffect(() => {
    listenForeground(() => {});
  }, []);

  const togglePush = async () => {
    if (loading) return;
    try {
      setLoading(true);
      if (enabled) {
        await disableWebPush();
        setFcmToken(null);
      } else {
        const t = await enableWebPush();
        setFcmToken(t);
      }
    } catch (e) {
      alert(e.message || "웹 푸시 처리 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ GiftPage(from=gift 포함) 또는 SellerPage일 때 노랑(#F5B236), 그 외 초록(#4CC554)
  const headerColor =
    pathname === "/gift" || fromGift || isSellerPage ? "#F5B236" : "#4CC554";

  return (
    <header
      className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-50"
      style={{ backgroundColor: headerColor }}
    >
      <div className="h-14 flex items-center justify-between px-4 text-white">
        {/* 왼쪽: 시장 선택 */}
        <Link
          to="/marketMapList"
          state={{ from: pathname }}
          className="flex items-center space-x-1"
        >
          <MapPin size={16} color="white" />
          <span className="underline text-sm font-medium">{marketName}</span>
        </Link>

        {/* 가운데: 로고 */}
        <Link to={{ pathname: "/", search: location.search }}>
          <img src={logo} alt="Logo" className="h-6 ml-[-15px]" />
        </Link>

        {/* 오른쪽: 종 아이콘 (토글) */}
        <button
          type="button"
          onClick={togglePush}
          disabled={loading}
          className="relative p-1 cursor-pointer disabled:opacity-60"
          aria-label={enabled ? "웹 푸시 비활성화" : "웹 푸시 활성화"}
          title={enabled ? "웹 푸시 비활성화" : "웹 푸시 활성화"}
        >
          <Bell size={20} color="white" />
          {enabled && (
            <span className="absolute top-0.5 right-0.5 inline-block w-2 h-2 bg-green-400 rounded-full" />
          )}
          {loading && (
            <span className="absolute -bottom-1 right-0 inline-block w-2 h-2 rounded-full animate-pulse bg-white/80" />
          )}
        </button>
      </div>
    </header>
  );
}
