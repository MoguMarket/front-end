// src/lib/webpush.js
import { getToken, onMessage, deleteToken } from "firebase/messaging";
import { messagingPromise } from "./firebase";

const API = import.meta.env.VITE_API_BASE;

/** 알림 권한 요청 + VAPID키 조회 + 토큰 발급 + 서버 등록 */
export async function enableWebPush() {
  try {
    if (!("Notification" in window)) {
      throw new Error("브라우저가 알림을 지원하지 않아요.");
    }
    if (location.protocol !== "https:" && location.hostname !== "localhost") {
      throw new Error("웹 푸시는 HTTPS에서만 동작해요.");
    }

    console.log("[WebPush] 권한 요청 중...");
    const perm = await Notification.requestPermission();
    console.log("[WebPush] 권한 상태:", perm);
    if (perm !== "granted") throw new Error("알림 권한이 허용되지 않았어요.");

    console.log("[WebPush] VAPID 키 요청...");
    const vkRes = await fetch(`${API}/api/fcm/web/vapid-key`, {
      credentials: "include",
    });
    const { vapidKey } = await vkRes.json();
    console.log("[WebPush] VAPID 키(앞 12자):", vapidKey?.slice(0, 12), "…");
    if (!vapidKey) throw new Error("VAPID 키를 가져오지 못했어요.");

    // 루트 스코프로 등록된 SW 보장
    const swReg = await navigator.serviceWorker.ready;
    console.log("[WebPush] SW ready. scope =", swReg.scope);

    console.log("[WebPush] messaging 준비 중...");
    const messaging = await messagingPromise;
    if (!messaging) throw new Error("이 브라우저는 FCM 미지원이에요.");
    console.log("[FB cfg]", messaging.app.options); // projectId/senderId 확인용

    console.log("[WebPush] FCM 토큰 발급 시도...");
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: swReg, // 중요!
    });
    console.log("[WebPush] 발급된 토큰:", token);
    if (!token) throw new Error("FCM 토큰 발급 실패");

    console.log("[WebPush] 서버에 토큰 등록 중...");
    const res = await fetch(`${API}/api/fcm/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ fcmToken: token }),
    });
    console.log("[WebPush] 서버 응답:", res.status);

    localStorage.setItem("fcmToken", token);
    console.log("[WebPush] 토큰 localStorage 저장 완료");

    return token;
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
      { method: "DELETE", credentials: "include" }
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

/** (선택) VAPID 키 비교용 디버그 헬퍼 — 필요시 콘솔에서 호출 */
export async function debugPrintVapid() {
  const r = await fetch(
    `${import.meta.env.VITE_API_BASE}/api/fcm/web/vapid-key`,
    {
      credentials: "include",
    }
  );
  const { vapidKey } = await r.json();
  console.log("[VAPID] from API :", vapidKey);
  // 여기 콘솔에서 Firebase 콘솔 공개키를 붙여 비교하세요
  // console.log('[VAPID] from Firebase 콘솔 :', 'B....');
}
