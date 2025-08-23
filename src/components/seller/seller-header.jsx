// src/components/seller/seller-header.jsx
import React, { useEffect, useState } from "react";
import logo from "../../assets/header-logo.svg";
import { MapPin, Bell, ArrowLeft, Home } from "lucide-react";
import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import {
    enableWebPush,
    disableWebPush,
    listenForeground,
} from "../../lib/webpush";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function SellerHeader() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [sp] = useSearchParams();
    const shopId = sp.get("shopId");

    // 1) add-product 여부
    const isAddProduct =
        pathname === "/seller/add-product" || pathname === "/add-product";

    // 2) 시장명 (두번째 헤더 방식과 동일)
    const [marketName, setMarketName] = useState("시장 선택");
    useEffect(() => {
        if (!shopId) return;
        const sid = Number(shopId);
        if (!Number.isFinite(sid)) return;

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
                const name = found?.name ?? "시장 선택";
                setMarketName(name);
                sessionStorage.setItem(cacheKey, name);
            } catch (e) {
                if (e.name !== "AbortError") {
                    console.error("[SellerHeader] 시장 조회 실패:", e);
                    setMarketName("시장 선택");
                }
            }
        })();
        return () => ac.abort();
    }, [shopId]);

    // 3) 웹푸시 (두번째 헤더 방식과 동일)
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

    // 셀러 헤더는 항상 노란색 고정
    const headerColor = "#F5B236";
    const SELLER_HOME_PATH = "/seller-home";

    // ① add-product 전용 헤더
    if (isAddProduct) {
        return (
            <header
                className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-50"
                style={{ backgroundColor: headerColor }}
            >
                <div className="h-14 flex items-center justify-between px-4 text-white">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        aria-label="뒤로가기"
                        className="p-1"
                    >
                        <ArrowLeft size={22} />
                    </button>

                    <h1 className="text-base font-semibold select-none">
                        상품 등록
                    </h1>

                    <button
                        type="button"
                        onClick={() => navigate(SELLER_HOME_PATH)}
                        aria-label="내 상점으로 이동"
                        className="p-1"
                    >
                        <Home size={22} />
                    </button>
                </div>
            </header>
        );
    }

    // ② 셀러 공용 노란 헤더
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
                    <span className="underline text-sm font-medium">
                        {marketName}
                    </span>
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
