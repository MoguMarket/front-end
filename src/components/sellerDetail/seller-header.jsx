// src\components\sellerDetail\seller-header.jsx

import { useMemo } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Share2, Heart } from "lucide-react";
import MARKETS_PLACE from "../../components/db/marketPlace-db";

/**
 * 판매자 상세 전용 헤더
 *
 * props:
 * - title?: string          // 우선 표시할 제목(없으면 shopId로 시장/상점 이름 조회)
 * - showBack?: boolean      // 뒤로가기 버튼 표시 여부 (기본 true)
 * - onShare?: () => void    // 공유 버튼 클릭 핸들러
 * - onToggleLike?: () => void // 좋아요 버튼 클릭 핸들러
 * - liked?: boolean         // 좋아요 상태 (하트 채우기)
 * - className?: string      // 추가 클래스
 */
export default function SellerHeader({
  title,
  showBack = true,
  onShare,
  onToggleLike,
  liked = false,
  className = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();

  // query에서 shopId 읽고, DB에서 이름 조회
  const shopId = sp.get("shopId");
  const sid = shopId ? Number(shopId) : null;

  const marketName = useMemo(() => {
    if (title) return title;
    if (!sid) return "판매자 정보";
    const market =
      MARKETS_PLACE.find((m) => m.id === sid || m.marketId === sid) || null;
    return market?.name ?? "판매자 정보";
  }, [sid, title]);

  return (
    <header
      className={[
        "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-50",
        "bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70",
        "border-b border-neutral-100",
        className,
      ].join(" ")}
      role="banner"
    >
      {/* 안전 영역 여백(iOS 노치 대응) */}
      <div className="h-[env(safe-area-inset-top)]" />

      <div className="h-12 px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              type="button"
              aria-label="뒤로가기"
              onClick={() => {
                if (window.history.length > 2) navigate(-1);
                else navigate("/", { replace: true });
              }}
              className="p-2 -ml-2 rounded-full hover:bg-neutral-100 active:scale-95 transition"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <span className="w-8" />
          )}

          <h1 className="text-[15px] font-semibold line-clamp-1">{marketName}</h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="공유"
            onClick={
              onShare ??
              (() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: document.title || marketName,
                      url: window.location.href,
                    })
                    .catch(() => {});
                } else {
                  navigator.clipboard?.writeText(window.location.href);
                  // 토스트 시스템이 있으면 여기서 노출
                }
              })
            }
            className="p-2 rounded-full hover:bg-neutral-100 active:scale-95 transition"
          >
            <Share2 size={18} />
          </button>

          <button
            type="button"
            aria-label="좋아요"
            onClick={onToggleLike}
            className="p-2 rounded-full hover:bg-neutral-100 active:scale-95 transition"
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
          </button>

          {/* 홈 링크: 현재 쿼리 유지 */}
          <Link
            to={{ pathname: "/", search: location.search }}
            aria-label="홈으로"
            className="p-2 rounded-full hover:bg-neutral-100 active:scale-95 transition"
          >
            <span className="sr-only">홈으로</span>
            {/* 간단한 점 3개 아이콘 대체 텍스트 버튼 */}
            <div className="w-1 h-1 bg-neutral-800 rounded-full" />
          </Link>
        </div>
      </div>
    </header>
  );
}
