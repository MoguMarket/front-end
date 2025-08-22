// src/pages/registerPage/register-page.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/login/Logo.png";
import LoginBanner from "../../assets/login/loginbanner.png";

export default function Register() {
  const navigate = useNavigate();

  // 간격(로그인/기존 톤 그대로)
  const G = {
    afterBanner: 100,
    afterLogo: 15,
    afterTitle: 15,
    afterInputs: 15,
    afterSubmit: 20,
    afterAlt: 15,
  };

  // 폼 상태
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
    nickname: "",
    email: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [msg, setMsg] = useState("");

  const onChange = (k) => (e) => {
    const v = k === "agree" ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [k]: v }));
  };

  // 단일 단계 유효성 검사
  const validate = () => {
    if (!form.username.trim()) return "아이디를 입력해 주세요.";
    if (form.password.length < 8) return "비밀번호는 최소 8자 이상이어야 해요.";
    if (form.password !== form.confirm) return "비밀번호가 일치하지 않아요.";
    if (!form.nickname.trim()) return "닉네임을 입력해 주세요.";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) return "올바른 이메일 형식이 아니에요.";
    if (!form.agree) return "약관에 동의해 주세요.";
    return "";
  };

  const safeText = async (res) => {
    try {
      return await res.text();
    } catch {
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setMsg("");

    const v = validate();
    if (v) {
      setApiError(v);
      return;
    }

    try {
      setLoading(true);

      // 단일 API로 가입 (username, password, nickname, email 한 번에 전송)
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/user/sign-up`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: form.username,
            password: form.password,
            nickname: form.nickname,
            email: form.email,
          }),
        }
      );

      if (!res.ok) throw new Error((await safeText(res)) || "회원가입 실패");

      const json = await res.json(); // { success, code, msg, data? } 가정
      const success = json?.success === true || json?.success === "true";

      if (!success) {
        throw new Error(json?.msg || "회원가입에 실패했어요.");
      }

      setMsg("회원가입이 완료되었습니다. 로그인해 주세요.");
      // 필요 시 자동 로그인 로직을 여기에서 추가 가능
      setTimeout(() => navigate("/login"), 600);
    } catch (err) {
      setApiError(err.message || "회원가입 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#F3F3F3] flex items-center justify-center">
      {/* 고정 디바이스 프레임 */}
      <div className="h-screen bg-white w-[390px] mx-auto flex flex-col">
        {/* 상단 배너 */}
        <div className="relative w-full h-[70px] overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#4CC554] to-white" />
          <div className="relative flex justify-center items-center h-full z-10">
            <img
              src={LoginBanner}
              alt="logobanner"
              className="h-[50px] w-auto object-contain"
              draggable="false"
            />
          </div>
        </div>

        {/* 본문 */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center flex-1 overflow-y-auto"
        >
          {/* 로고 */}
          <img
            src={Logo}
            alt="모구시장 로고"
            className="object-contain mt-[16px]"
            style={{
              width: "183.06px",
              height: "42.76px",
              marginTop: G.afterBanner,
            }}
            draggable="false"
          />

          {/* 타이틀 */}
          <p
            className="text-center font-semibold text-[14px]"
            style={{
              color: "#4CC554",
              width: "350px",
              height: "40px",
              lineHeight: "40px",
              marginTop: G.afterLogo,
            }}
          >
            회원가입
          </p>

          {/* 입력 카드 */}
          <div
            className="rounded-xl overflow-hidden flex flex-col justify-center"
            style={{
              width: "350px",
              border: "1px solid #E6E6E6",
              boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
              marginTop: G.afterTitle,
            }}
          >
            {/* 아이디 */}
            <div className="px-4 py-3">
              <input
                type="text"
                placeholder="아이디"
                className="w-full text-sm outline-none placeholder-[#8A8A8E]"
                value={form.username}
                onChange={onChange("username")}
                autoComplete="username"
              />
            </div>
            <div className="h-px" style={{ backgroundColor: "#E6E6E6" }} />

            {/* 비밀번호 */}
            <div className="px-4 py-3">
              <input
                type="password"
                placeholder="비밀번호 (8자 이상)"
                className="w-full text-sm outline-none placeholder-[#8A8A8E]"
                value={form.password}
                onChange={onChange("password")}
                autoComplete="new-password"
              />
            </div>
            <div className="h-px" style={{ backgroundColor: "#E6E6E6" }} />

            {/* 비밀번호 확인 */}
            <div className="px-4 py-3">
              <input
                type="password"
                placeholder="비밀번호 확인"
                className="w-full text-sm outline-none placeholder-[#8A8A8E]"
                value={form.confirm}
                onChange={onChange("confirm")}
                autoComplete="new-password"
              />
            </div>
            <div className="h-px" style={{ backgroundColor: "#E6E6E6" }} />

            {/* 닉네임 */}
            <div className="px-4 py-3">
              <input
                type="text"
                placeholder="닉네임"
                className="w-full text-sm outline-none placeholder-[#8A8A8E]"
                value={form.nickname}
                onChange={onChange("nickname")}
              />
            </div>
            <div className="h-px" style={{ backgroundColor: "#E6E6E6" }} />

            {/* 이메일 */}
            <div className="px-4 py-3">
              <input
                type="email"
                placeholder="이메일"
                className="w-full text-sm outline-none placeholder-[#8A8A8E]"
                value={form.email}
                onChange={onChange("email")}
                autoComplete="email"
              />
            </div>
          </div>

          {/* 약관 동의 */}
          <label
            className="flex items-center text-xs mt-3 select-none"
            style={{ width: "350px" }}
          >
            <input
              type="checkbox"
              className="mr-2"
              checked={form.agree}
              onChange={onChange("agree")}
            />
            <span className="text-[#555]">
              (필수) 서비스 이용약관 및 개인정보 처리방침에 동의합니다.
            </span>
          </label>

          {/* 에러/성공 메시지 */}
          {(apiError || msg) && (
            <p
              className={`text-[12px] mt-3 ${
                apiError ? "text-red-600" : "text-green-600"
              }`}
              style={{ width: "350px" }}
            >
              {apiError || msg}
            </p>
          )}

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="rounded-lg font-semibold transition disabled:opacity-60"
            style={{
              width: "350px",
              height: "50px",
              marginTop: G.afterInputs,
              backgroundColor: "#4CC554",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "처리 중..." : "회원가입"}
          </button>

          {/* 하단 보조 */}
          <button
            type="button"
            className="text-sm font-semibold"
            style={{ width: "150px", height: "40px", marginTop: G.afterSubmit }}
            onClick={() => navigate("/login")}
          >
            이미 계정이 있으신가요? 로그인
          </button>

          <p
            className="text-center font-semibold text-[14px] select-none"
            style={{
              width: "350px",
              height: "40px",
              lineHeight: "40px",
              marginTop: G.afterAlt,
            }}
          >
            로그인 없이 둘러보기
          </p>
        </form>
      </div>
    </div>
  );
}
