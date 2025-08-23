// src/components/header.jsx
import logo from "../assets/header-logo.svg";
import { MapPin, Bell } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  enableWebPush,
  disableWebPush,
  listenForeground,
} from "../lib/webpush";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function Header() {
  const { pathname } = useLocation();
  const [sp] = useSearchParams();
  const shopId = sp.get("shopId"); // ← 여기서는 '시장 id'로 사용
  const fromGift = sp.get("from") === "gift";

  // 헤더에 표시할 시장명
  const [marketName, setMarketName] = useState("시장 선택");

  // ── 시장 이름 가져오기: /api/market/db?page=0&size=500 에서 id 매칭
  useEffect(() => {
    if (!shopId) return;
    const sid = Number(shopId);
    if (!Number.isFinite(sid)) return;

    // 캐시 체크
    const cacheKey = `market:name:${sid}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setMarketName(cached);
      return;
    }

    const ac = new AbortController();
    (async () => {
      try {
        const url = new URL("/api/market/db", API_BASE);
        url.searchParams.set("page", "0");
        url.searchParams.set("size", "500");
        const res = await fetch(url.toString(), { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json?.content) ? json.content : [];
        const found = list.find((m) => Number(m?.id) === sid);
        if (found?.name) {
          setMarketName(found.name);
          sessionStorage.setItem(cacheKey, found.name);
        } else {
          setMarketName("시장 선택");
        }
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("[Header] 시장 조회 실패:", e);
          setMarketName("시장 선택");
        }
      }
    })();
    return () => ac.abort();
  }, [shopId]);

  // ── 웹푸시
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

  const headerColor = pathname === "/gift" || fromGift ? "#F5B236" : "#4CC554";

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

        {/* 오른쪽: 종 아이콘 */}
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
