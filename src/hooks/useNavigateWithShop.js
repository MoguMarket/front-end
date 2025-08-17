// src/hooks/useNavigateWithShop.js
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { currentMarketIdAtom } from "@/atoms/market";

export default function useNavigateWithShop() {
  const navigate = useNavigate();
  const location = useLocation();
  const shopId = useAtomValue(currentMarketIdAtom);

  const appendShop = useCallback(
    (to, options) => {
      // 문자열/객체 모두 지원
      if (typeof to === "string") {
        const url = new URL(to, window.location.origin);
        // 상대경로일 수 있으므로 기존 location의 검색쿼리 참고
        const base = new URL(
          `${location.pathname}${location.search}`,
          window.location.origin
        );
        const params = new URLSearchParams(url.search || base.search);

        if (shopId != null && !params.get("shopId")) {
          params.set("shopId", String(shopId));
        }
        const final =
          url.pathname + (params.toString() ? `?${params.toString()}` : "");
        navigate(final, options);
      } else {
        const params = new URLSearchParams(to.search || location.search);
        if (shopId != null && !params.get("shopId")) {
          params.set("shopId", String(shopId));
        }
        navigate(
          {
            ...to,
            search: params.toString() ? `?${params.toString()}` : "",
          },
          options
        );
      }
    },
    [navigate, location.pathname, location.search, shopId]
  );

  return appendShop;
}
