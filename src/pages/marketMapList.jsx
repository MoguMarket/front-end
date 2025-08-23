// src/pages/MarketMapList.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MapMarketContainer from "../components/map/map-market-container";

// ===== 시연 모드 & 오프셋 =====
const DEMO_MODE = true;
const DEMO_ORIGIN = { lat: 36.1459, lng: 128.393 };
const SHEET_OFFSET_PX = 350;
// ============================

// ✅ env의 API base 사용
const MARKET_API_URL = `${import.meta.env.VITE_API_BASE}/api/market/db`;

export default function MarketMapList() {
  const mapDivRef = useRef(null);
  const mapInstRef = useRef(null);
  const myMarkerRef = useRef(null);
  const [myLocation, setMyLocation] = useState(null);

  // ✅ API로부터 가져온 마켓 저장
  const [markets, setMarkets] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 마켓 데이터 fetch
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const res = await fetch(`${MARKET_API_URL}?page=0&size=500`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        const list = Array.isArray(json?.content) ? json.content : [];
        const mapped = list.map((m) => {
          const id = m?.id ?? m?.marketCode;
          return {
            id,
            marketId: id,
            name: m?.name ?? "",
            location:
              [m?.sido, m?.sigungu].filter(Boolean).join(" ") ||
              m?.roadAddress ||
              m?.landAddress ||
              "",
            lat: Number(m?.latitude),
            lng: Number(m?.longitude),
            // API가 주는 distance(단위 km)를 그대로 쓰되, 없으면 undefined
            distanceKm:
              m?.distance != null && !Number.isNaN(Number(m.distance))
                ? Number(m.distance)
                : undefined,
          };
        });

        setMarkets(mapped);
        console.log("[Market API] mapped:", mapped.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch markets:", err);
      }
    };
    fetchMarkets();
  }, []);

  useEffect(() => {
    const load = () =>
      new Promise((resolve, reject) => {
        if (window.naver?.maps) return resolve();
        const s = document.createElement("script");
        s.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${
          import.meta.env.VITE_NCP_CLIENT_ID
        }`;
        s.async = true;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });

    load().then(() => {
      const { naver } = window;

      const initCenter = new naver.maps.LatLng(36.119, 128.344);
      const map = new naver.maps.Map(mapDivRef.current, {
        center: initCenter,
        zoom: 12,
        zoomControl: false,
        mapDataControl: false,
        scaleControl: false,
      });
      mapInstRef.current = map;

      if (DEMO_MODE) {
        setMyLocation(DEMO_ORIGIN);
        const here = new naver.maps.LatLng(DEMO_ORIGIN.lat, DEMO_ORIGIN.lng);
        map.setCenter(here);
        map.setZoom(14);
        myMarkerRef.current = new naver.maps.Marker({
          map,
          position: here,
          title: "금오공과대학교",
          icon: blueDotIcon(naver),
          zIndex: 1000,
        });
      }
    });
  }, []);

  const handleBack = () => {
    const from = location.state?.from;
    if (from) navigate(from, { replace: true });
    else if (window.history.length > 2) navigate(-1);
    else navigate("/", { replace: true });
  };

  return (
    <div className="relative w-full">
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "100dvh" }}
      >
        <div
          ref={mapDivRef}
          className="w-full"
          style={{
            height: `calc(100dvh + ${SHEET_OFFSET_PX}px)`,
            transform: `translateY(-${SHEET_OFFSET_PX}px)`,
            willChange: "transform",
          }}
        />
      </div>

      <button
        onClick={handleBack}
        className="absolute left-3 top-[max(12px,env(safe-area-inset-top))]"
        aria-label="뒤로가기"
      >
        <ArrowLeft size={24} />
      </button>

      <MapMarketContainer
        markets={markets}
        myLocation={DEMO_MODE ? DEMO_ORIGIN : myLocation}
      />
    </div>
  );
}

/** 파란 동그라미 아이콘 */
function blueDotIcon(naver) {
  return {
    content:
      '<div style="width:14px;height:14px;border-radius:50%;background:#2b6cff;border:3px solid #fff;box-shadow:0 0 0 2px rgba(43,108,255,.35)"></div>',
    anchor: new naver.maps.Point(7, 7),
  };
}
