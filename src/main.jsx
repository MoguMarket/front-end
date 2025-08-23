import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./components/contexts/user-context"; // 추가

// --- 서비스워커 등록 추가 ---
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((reg) => console.log("SW 등록 완료:", reg.scope))
    .catch((err) => console.error("SW 등록 실패:", err));
}
// --------------------------

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
