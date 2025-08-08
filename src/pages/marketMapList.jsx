// src/pages/MarketMapList.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MapMarketContainer from "../components/map/map-market-container";
import markets from "../components/db/markets-db";

// ===== 시연 모드 & 오프셋 =====
const DEMO_MODE = true;
const DEMO_ORIGIN = { lat: 36.1459, lng: 128.393 };

// 바텀시트가 가리는 높이(px). 필요시 숫자만 조절 (예: 160~220)
const SHEET_OFFSET_PX = 350;
// ============================

export default function MarketMapList() {
  const mapDivRef = useRef(null);
  const mapInstRef = useRef(null);
  const myMarkerRef = useRef(null);
  const [myLocation, setMyLocation] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

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

      // 지도 생성
      const initCenter = new naver.maps.LatLng(36.119, 128.344);
      const map = new naver.maps.Map(mapDivRef.current, {
        center: initCenter,
        zoom: 12,
        zoomControl: false,
        mapDataControl: false,
        scaleControl: false,
      });
      mapInstRef.current = map;

      // 시장 마커
      const bounds = new naver.maps.LatLngBounds();
      markets.forEach((m) => {
        const pos = new naver.maps.LatLng(m.lat, m.lng);
        new naver.maps.Marker({ position: pos, map, title: m.name });
        bounds.extend(pos);
      });
      if (markets.length > 2) map.fitBounds(bounds);
      else map.setCenter(bounds.getCenter());

      // 내 위치: 시연 모드(금오공대) → 파란 동그라미
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
      } else if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setMyLocation({ lat: latitude, lng: longitude });
            const here = new naver.maps.LatLng(latitude, longitude);

            map.setCenter(here);
            map.setZoom(14);

            myMarkerRef.current = new naver.maps.Marker({
              map,
              position: here,
              title: "내 위치",
              icon: blueDotIcon(naver),
              zIndex: 1000,
            });
          },
          (err) => console.warn("Geolocation error:", err?.message),
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
      }

      // 생성 직후 사이즈 보정
      setTimeout(() => naver.maps.Event.trigger(map, "resize"), 0);
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
      {/* 
        래퍼: 실제 보이는 높이는 100dvh로 유지 
        내부 map div는 높이를 (100dvh + 오프셋)로 키우고 위로 translate 해서
        항상 지도 ‘시각적 중심’을 위쪽에 두도록 함.
      */}
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
        onSelect={(m) => {
          const { naver } = window;
          const map = mapInstRef.current;
          if (!naver || !map) return;

          // 그냥 원하는 좌표로 이동만 하면 됨 (오프셋은 CSS가 항상 적용 중)
          map.panTo(new naver.maps.LatLng(m.lat, m.lng));
        }}
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
