// src/components/router/ShopIdSync.jsx
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAtom } from "jotai";
import { currentMarketIdAtom } from "../../atoms/market";

// 여기에 shopId를 강제하지 않을 경로들을 정의 (필요시 추가/수정)
const EXCLUDED_PATHS = new Set([
  "/login",
  "/main-login",
  "/seller-login",
  "/firstpage",
]);

export default function ShopIdSync() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentShopId, setCurrentShopId] = useAtom(currentMarketIdAtom);

  const pathname = location.pathname;
  const isExcluded = useMemo(() => EXCLUDED_PATHS.has(pathname), [pathname]);

  useEffect(() => {
    if (isExcluded) return;

    const urlShopId = searchParams.get("shopId");

    // 1) URL에 shopId가 있으면 전역에 반영
    if (urlShopId && urlShopId !== String(currentShopId ?? "")) {
      setCurrentShopId(urlShopId);
      return;
    }

    // 2) URL에 shopId가 없고, 전역엔 값이 있으면 URL에 자동 부착
    if (!urlShopId && currentShopId != null) {
      const next = new URLSearchParams(searchParams);
      next.set("shopId", String(currentShopId));
      navigate({ pathname, search: `?${next.toString()}` }, { replace: true });
    }
  }, [
    isExcluded,
    pathname,
    searchParams,
    currentShopId,
    setCurrentShopId,
    navigate,
  ]);

  return null; // UI 없음
}
