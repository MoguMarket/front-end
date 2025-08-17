// src/pages/loginPage/first-page-login.jsx
import React from "react";
import LoginBanner from "../../assets/login/loginbanner.png";
import LogoOrigin from "../../assets/login/logo-origin.png"; // 파일명/경로 확인

import { useNavigate } from "react-router-dom";

export default function FirstPageLogin() {
  const nav = useNavigate();

  // 간격 모음 (필요 시 숫자만 바꾸면 전체 간격 조정)
  const G = {
    afterBanner: 100,
    afterLogo: 20,
    afterSubtitle: 20,
    betweenButtons: 15,
  };

  return (
    <div className="w-full bg-[#F3F3F3] flex items-center justify-center">
      <div className="h-screen rounded-[32px] bg-white shadow-xl overflow-hidden">
        {/* 상단 배너 (main-login과 동일) */}
        <div className="relative w-[390px] h-[70px] rounded-t-[32px] overflow-hidden">
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
        <div className="w-full flex flex-col items-center px-5">
          {/* 로고: logo-origin 사용 */}
          <img
            src={LogoOrigin}
            alt="모구시장 로고"
            className="object-contain"
            style={{
              width: "350px",
              height: "27.56px",
              marginTop: G.afterBanner,
            }}
            draggable="false"
          />

          {/* 가이드 문구 */}
          <div
            className="text-center"
            style={{ marginTop: G.afterLogo, width: 350 }}
          >
            <p className="text-[14px] font-semibold text-[#3B3B3B]">
              에 오신 것을 환영합니다!
            </p>
            <p className="mt-2 text-[14px] font-semibold text-[#3B3B3B]">
              어떤 목적으로 오셨나요?
            </p>
          </div>

          {/* 버튼 */}
          <div
            className="w-full flex flex-col items-center"
            style={{ marginTop: G.afterSubtitle }}
          >
            {/* 상인 버튼 */}
            <button
              type="button"
              onClick={() => nav("/seller-login")}
              className="w-[350px] h-[50px] rounded-lg font-semibold"
              style={{
                backgroundColor: "#F5B23680",
                color: "#000",
                boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
              }}
            >
              시장에서 판매중인 상인
            </button>

            {/* 일반인 버튼 */}
            <button
              type="button"
              onClick={() => nav("/login")}
              className="w-[350px] h-[50px] rounded-lg font-semibold"
              style={{
                backgroundColor: "#4CC55480",
                color: "#000",
                marginTop: 12,
                boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
              }}
            >
              상품을 구입하는 사용자
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
