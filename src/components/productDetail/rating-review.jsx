// src/components/review/rating-review.jsx
import { useMemo, useRef, useState } from "react";
import { Star } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;

/**
 * 별점만 등록하는 리뷰 컴포넌트 (0.5 단위)
 * 서버 명세: { productId: number, userId: number, rating: number }
 *
 * props:
 *  - productId: number (필수)
 *  - onSubmitted?: () => void  (성공 시 콜백)
 *  - userId?: number           (옵션, 외부에서 넘기면 그대로 사용)
 */
export default function RatingReview({
  productId,
  onSubmitted,
  userId: userIdProp,
}) {
  const [myRating, setMyRating] = useState(0); // 0~5, 0.5 단위
  const [hoverRating, setHoverRating] = useState(0);
  const [posting, setPosting] = useState(false);
  const [postMsg, setPostMsg] = useState("");

  // 액세스 토큰
  const token = useMemo(
    () =>
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("accessToken") ||
      "",
    []
  );

  // JWT payload에서 userId 유추
  const jwtUserId = useMemo(() => {
    if (!token || token.split(".").length < 2) return undefined;
    try {
      const payloadB64u = token.split(".")[1];
      const b64 = payloadB64u
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(Math.ceil(payloadB64u.length / 4) * 4, "=");
      const json = atob(b64);
      const p = JSON.parse(json);
      const candidate = p.userId ?? p.id ?? p.uid ?? p.user_id ?? p.sub;
      const n = Number(candidate);
      return Number.isFinite(n) && n > 0 ? n : undefined;
    } catch {
      return undefined;
    }
  }, [token]);

  // 로컬스토리지의 userId (있으면 사용)
  const storedUserId = useMemo(() => {
    const n = Number(localStorage.getItem("userId"));
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }, []);

  // 최종 userId: prop > localStorage > JWT > (fallback:/api/users/me)
  const resolvedUserIdImmediate = userIdProp ?? storedUserId ?? jwtUserId;

  // /api/users/me 호출 중복 방지
  const fetchingUser = useRef(false);

  const displayRating = hoverRating || myRating;

  const handleStarMove = (index, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const half = offsetX < rect.width / 2 ? 0.5 : 1;
    setHoverRating(index - (1 - half));
  };

  const handleStarLeave = () => setHoverRating(0);

  const handleStarClick = (index, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const half = offsetX < rect.width / 2 ? 0.5 : 1;
    const val = index - (1 - half);
    setMyRating(val);
    setPostMsg("");
  };

  const fillFor = (idx, value) => {
    if (value >= idx) return 1;
    if (value >= idx - 0.5) return 0.5;
    return 0;
  };

  // ✅ 백엔드 에러 메시지 파서
  const extractBackendMessage = async (res, fallback) => {
    try {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        let msg =
          data?.msg ||
          data?.message ||
          data?.error ||
          data?.detail ||
          (Array.isArray(data?.errors) && data.errors.length
            ? data.errors
                .map((e) => (typeof e === "string" ? e : e?.message || ""))
                .filter(Boolean)
                .join(", ")
            : "");
        const code = data?.code || data?.errorCode;
        if (!msg) msg = JSON.stringify(data);
        return code ? `[${code}] ${msg}` : msg;
      } else {
        const text = await res.text();
        return text || fallback;
      }
    } catch {
      return fallback;
    }
  };

  // 필요 시에만 /api/users/me 호출 (최후 보루)
  const fetchUserIdFallback = async () => {
    if (fetchingUser.current) return undefined;
    if (!token) return undefined;
    try {
      fetchingUser.current = true;
      const meRes = await fetch(`${API_BASE}/api/users/me`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!meRes.ok) {
        // 원문 먼저 로깅
        console.log(
          "[raw-error][GET /api/users/me]",
          await meRes.clone().text()
        );
        // 서버가 준 에러 메시지 우선 노출
        setPostMsg(
          await extractBackendMessage(
            meRes,
            `유저 조회 실패: HTTP ${meRes.status}`
          )
        );
        return undefined;
      }
      const me = await meRes.json();
      const n = Number(me?.id);
      return Number.isFinite(n) && n > 0 ? n : undefined;
    } catch (e) {
      setPostMsg(e?.message || "유저 조회 중 오류가 발생했습니다.");
      return undefined;
    } finally {
      fetchingUser.current = false;
    }
  };

  const submitRating = async () => {
    if (!myRating) {
      setPostMsg("별점을 선택해 주세요.");
      return;
    }
    if (!token) {
      setPostMsg("로그인이 필요합니다.");
      return;
    }

    try {
      setPosting(true);
      setPostMsg("");

      // userId 결정
      let uid = resolvedUserIdImmediate;
      if (!uid) {
        uid = await fetchUserIdFallback();
      }
      if (!uid) {
        if (!postMsg)
          setPostMsg("사용자 식별에 실패했습니다. 다시 로그인해 주세요.");
        return;
      }

      // 리뷰 등록
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          productId: Number(productId),
          userId: Number(uid),
          rating: myRating, // 0.5 단위 실수
        }),
      });

      // 🔎 에러 처리 분기 바로 위: 서버 원문 응답 로그
      if (!res.ok) {
        console.log("[raw-error][POST /api/reviews]", await res.clone().text());
        setPostMsg(
          await extractBackendMessage(res, `리뷰 등록 실패: HTTP ${res.status}`)
        );
        return;
      }

      setPostMsg("리뷰가 등록되었습니다.");
      onSubmitted && onSubmitted();
      localStorage.setItem("userId", String(uid));
    } catch (e) {
      console.error("[Review][POST] error:", e);
      setPostMsg(e?.message || "리뷰 등록 중 오류가 발생했습니다.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <section className="px-4 py-4 border-b border-neutral-100">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">리뷰 남기기</h3>
      </div>

      {/* 별과 같은 줄에 등록 버튼 배치 */}
      <div className="mt-3 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = fillFor(i, displayRating);
          return (
            <div
              key={i}
              className="relative h-8 w-8 cursor-pointer"
              onMouseMove={(e) => handleStarMove(i, e)}
              onMouseLeave={handleStarLeave}
              onClick={(e) => handleStarClick(i, e)}
              role="button"
              aria-label={`${i}번째 별`}
              title={`${displayRating || 0}점`}
            >
              <Star className="absolute inset-0 text-neutral-300" size={32} />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  className="text-yellow-400 fill-yellow-400"
                  size={32}
                  fill="currentColor"
                />
              </div>
            </div>
          );
        })}

        <span className="ml-2 text-sm text-neutral-700 min-w-[36px] text-center">
          {displayRating ? displayRating.toFixed(1) : "0.0"}
        </span>

        <button
          type="button"
          onClick={submitRating}
          disabled={posting || !myRating}
          className="ml-auto px-4 py-2 rounded-md bg-[#4CC554] text-white text-sm disabled:opacity-50"
        >
          {posting ? "등록 중..." : "평점 등록"}
        </button>
      </div>

      {postMsg && (
        <div className="mt-2 text-sm text-neutral-600">{postMsg}</div>
      )}
    </section>
  );
}
