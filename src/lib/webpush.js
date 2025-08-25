// src/lib/webpush.js
import { getToken, onMessage, deleteToken } from "firebase/messaging";
import { messagingPromise } from "./firebase";

const API = import.meta.env.VITE_API_BASE;

// ---- helpers ---------------------------------------------------------------
function getAccessTokenFromStorage() {
    // 프로젝트마다 키 이름이 다를 수 있어 넓게 탐색
    return (
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("jwt") ||
        null
    );
}

// 필요 시 Authorization 헤더를 넣어주는 유틸
function withAuthHeader(baseHeaders = {}, explicitToken) {
    const t = explicitToken ?? getAccessTokenFromStorage();
    return t ? { ...baseHeaders, Authorization: `Bearer ${t}` } : baseHeaders;
}

// ---- API -------------------------------------------------------------------
/** 내 FCM 토큰 목록 조회 */
export async function fetchMyFcmTokens() {
    const headers = withAuthHeader({ accept: "application/json" });
    const res = await fetch(`${API}/api/fcm/tokens/me`, {
        method: "GET",
        headers,
        credentials: "include", // 세션쿠키도 같이 전송
    });
    if (!res.ok) throw new Error(`토큰 조회 실패: ${res.status}`);
    return res.json(); // 서버 스키마에 맞게 { tokens: [...] } 또는 리스트
}

/**
 * 웹푸시 활성화:
 *  - 권한 요청(필요 시)
 *  - VAPID 키 조회
 *  - FCM 토큰 발급
 *  - 서버 등록( userId/Authorization 헤더 선택 지원 )
 *  - 내 토큰 목록 조회
 *
 * @param {Object} opts
 * @param {number|string} [opts.userId]    Principal 없이 바디 userid 허용 시 사용 (서버 DTO 키는 `userid`)
 * @param {string}       [opts.authToken]  명시적으로 토큰을 넘기고 싶을 때 (미지정 시 localStorage에서 자동 탐색)
 */
export async function enableWebPush(opts = {}) {
    const { userId, authToken } = opts;

    try {
        // 1) 환경 체크
        if (!("Notification" in window)) {
            throw new Error("브라우저가 알림을 지원하지 않아요.");
        }
        if (
            location.protocol !== "https:" &&
            location.hostname !== "localhost"
        ) {
            throw new Error("웹 푸시는 HTTPS에서만 동작해요.");
        }

        // 2) 권한
        let permission = Notification.permission;
        if (permission !== "granted") {
            console.log("[WebPush] 권한 요청 중...");
            permission = await Notification.requestPermission();
            console.log("[WebPush] 권한 상태:", permission);
            if (permission !== "granted") {
                throw new Error("알림 권한이 허용되지 않았어요.");
            }
        } else {
            console.log("[WebPush] 권한 상태: granted (재요청 생략)");
        }

        // 3) VAPID 키 조회
        console.log("[WebPush] VAPID 키 요청...");
        const vkRes = await fetch(`${API}/api/fcm/web/vapid-key`, {
            headers: withAuthHeader(), // 혹시 보호돼 있으면 대비
            credentials: "include",
        });
        if (!vkRes.ok) throw new Error(`VAPID API 응답 오류: ${vkRes.status}`);
        const { vapidKey } = await vkRes.json();
        console.log(
            "[WebPush] VAPID 키(앞 12자):",
            vapidKey?.slice(0, 12),
            "…"
        );
        if (!vapidKey) throw new Error("VAPID 키를 가져오지 못했어요.");

        // 4) Service Worker 준비
        const swReg = await navigator.serviceWorker.ready;
        console.log("[WebPush] SW ready. scope =", swReg.scope);

        // 5) Messaging 준비
        console.log("[WebPush] messaging 준비 중...");
        const messaging = await messagingPromise;
        if (!messaging) throw new Error("이 브라우저는 FCM 미지원이에요.");

        const appInfo = messaging.app?.options ?? null;
        if (appInfo) console.log("[FB cfg]", appInfo);
        else
            console.warn(
                "[FB cfg] Firebase 앱 정보가 없습니다. .env 설정 확인 필요"
            );

        // 6) FCM 토큰 발급
        console.log("[WebPush] FCM 토큰 발급 시도...");
        const token = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: swReg,
        });
        console.log("[WebPush] 발급된 토큰:", token);
        if (!token) throw new Error("FCM 토큰 발급 실패");

        // 7) 서버 등록 (userId/Authorization 지원)
        console.log("[WebPush] 서버에 토큰 등록 중...");
        const headers = withAuthHeader(
            { "Content-Type": "application/json" },
            authToken
        );
        const payload =
            userId != null
                ? { fcmToken: token, userid: Number(userId) } // 서버 DTO: @JsonProperty("userid")
                : { fcmToken: token };

        const regRes = await fetch(`${API}/api/fcm/register`, {
            method: "POST",
            headers,
            credentials: "include", // 세션쿠키도 함께
            body: JSON.stringify(payload),
        });
        console.log("[WebPush] 서버 응답:", regRes.status);

        if (!regRes.ok) {
            if (regRes.status === 401) {
                throw new Error(
                    "토큰 등록 실패: 401 (로그인/세션/Authorization 부재). authToken(localStorage) 또는 userid를 전달하세요."
                );
            }
            const errText = await regRes.text().catch(() => "");
            throw new Error(
                `토큰 등록 실패: ${regRes.status} ${
                    errText ? "- " + errText.slice(0, 200) : ""
                }`
            );
        }

        // 8) 로컬 저장
        localStorage.setItem("fcmToken", token);
        console.log("[WebPush] 토큰 localStorage 저장 완료");

        // 9) 내 토큰 목록 조회 (선택)
        let myTokens;
        try {
            myTokens = await fetchMyFcmTokens();
            console.log("[WebPush] 내 토큰 목록:", myTokens);
        } catch (e) {
            console.warn(
                "[WebPush] 내 토큰 목록 조회 실패(무시 가능):",
                e?.message || e
            );
        }

        return { token, myTokens };
    } catch (err) {
        console.error("[WebPush] enableWebPush 에러:", err);
        throw err;
    }
}

/** 서버/클라이언트에서 푸시 토큰 해제 */
export async function disableWebPush() {
    try {
        const token = localStorage.getItem("fcmToken");
        console.log("[WebPush] 토큰 해제 시도:", token);
        if (!token) return;

        const res = await fetch(
            `${API}/api/fcm/token?token=${encodeURIComponent(token)}`,
            {
                method: "DELETE",
                headers: withAuthHeader(),
                credentials: "include",
            }
        );
        console.log("[WebPush] 서버 토큰 삭제 응답:", res.status);

        const messaging = await messagingPromise;
        if (messaging) {
            await deleteToken(messaging);
            console.log("[WebPush] 클라이언트 구독 해제 완료");
        }

        localStorage.removeItem("fcmToken");
        console.log("[WebPush] localStorage 토큰 삭제 완료");
    } catch (err) {
        console.error("[WebPush] disableWebPush 에러:", err);
    }
}

/** 포그라운드 수신 리스너 등록(앱 구동 시 1회) */
export function listenForeground(callback) {
    messagingPromise.then((messaging) => {
        if (!messaging) {
            console.warn("[WebPush] messaging 미지원");
            return;
        }
        onMessage(messaging, (payload) => {
            console.log("[WebPush] Foreground 알림 수신:", payload);
            callback?.(payload);
        });
    });
}

/** VAPID 키 디버그 출력 */
export async function debugPrintVapid() {
    const r = await fetch(`${API}/api/fcm/web/vapid-key`, {
        headers: withAuthHeader(),
        credentials: "include",
    });
    const { vapidKey } = await r.json();
    console.log("[VAPID] from API:", vapidKey);
}
