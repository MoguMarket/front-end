// src/pages/loginPage/seller-login.jsx
import React, { useState, useEffect } from "react";
import SellerLogo from "../../assets/login/logo-seller.png";
import LoginBanner from "../../assets/login/loginbanner.png";
import ConfirmLocationModal from "../../components/modal/confirm-location-modal";

export default function SellerLogin() {
  const G = {
    afterBanner: 100,
    afterLogo: 15,
    afterTitle: 15,
    afterInputs: 15,
    afterLoginBtn: 20,
    afterSignup: 15,
    afterDots: 15,
  };

  const [openConfirm, setOpenConfirm] = useState(false);

  // 페이지 진입 시 자동 노출 (원하면 버튼 클릭으로만 열도록 바꿔도 됨)
  useEffect(() => {
    setOpenConfirm(true);
  }, []);

  const handleYes = () => {
    // 위치 승인 로직 (예: navigator.geolocation or 상점 위치 저장)
    setOpenConfirm(false);
  };
  const handleNo = () => {
    // 미승인 처리 로직
    setOpenConfirm(false);
  };

  return (
    <div className="w-full bg-[#F3F3F3] flex items-center justify-center">
      <div className="h-screen rounded-[32px] bg-white shadow-xl overflow-hidden">
        {/* 배너(오렌지 → 흰색) */}
        <div className="relative w-[390px] h-[70px] rounded-t-[32px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5B236] to-white" />
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
        <div className="w-full flex flex-col items-center">
          <img
            src={SellerLogo}
            alt="모구시장 상인 로고"
            className="object-contain"
            style={{
              width: "183.06px",
              height: "42.76px",
              marginTop: G.afterBanner,
            }}
            draggable="false"
          />

          <p
            className="text-center font-semibold text-[14px]"
            style={{
              color: "#F5B236",
              width: "350px",
              height: "40px",
              lineHeight: "40px",
              marginTop: G.afterLogo,
            }}
          >
            상인 로그인
          </p>

          <div
            className="rounded-xl overflow-hidden flex flex-col justify-center"
            style={{
              width: "350px",
              height: "100px",
              border: "1px solid #E6E6E6",
              boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
              marginTop: G.afterTitle,
            }}
          >
            <input
              type="text"
              placeholder="아이디"
              className="w-full h-1/2 px-4 text-sm outline-none placeholder-[#8A8A8E]"
            />
            <div className="h-px" style={{ backgroundColor: "#E6E6E6" }} />
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full h-1/2 px-4 text-sm outline-none placeholder-[#8A8A8E]"
            />
          </div>

          <button
            type="button"
            className="rounded-lg font-semibold"
            style={{
              width: "350px",
              height: "50px",
              backgroundColor: "#C8C8C880",
              color: "#000",
              marginTop: G.afterInputs,
            }}
          >
            상인 로그인
          </button>

          <button
            type="button"
            className="rounded-lg font-semibold bg-white"
            style={{
              width: "350px",
              height: "50px",
              border: "1.5px solid #F5B236",
              color: "#000",
              marginTop: G.afterLoginBtn,
              boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
            }}
          >
            상인 회원가입
          </button>

          <div
            className="flex items-center justify-between"
            style={{
              width: "163px",
              height: "41px",
              marginTop: G.afterSignup,
            }}
          >
            <span
              className="w-[41px] h-[41px] rounded-full"
              style={{ backgroundColor: "#D9D9D9" }}
            />
            <span
              className="w-[41px] h-[41px] rounded-full"
              style={{ backgroundColor: "#D9D9D9" }}
            />
            <span
              className="w-[41px] h-[41px] rounded-full"
              style={{ backgroundColor: "#D9D9D9" }}
            />
          </div>

          <p
            className="text-center font-semibold text-[14px] select-none"
            style={{
              width: "350px",
              height: "40px",
              lineHeight: "40px",
              marginTop: G.afterDots,
            }}
          >
            로그인 없이 둘러보기 →
          </p>
        </div>
      </div>

      {/* 위치 확인 모달 */}
      <ConfirmLocationModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onYes={handleYes}
        onNo={handleNo}
      />
    </div>
  );
}
