// src/pages/loginPage/main-login.jsx
import React from "react";
import Logo from "../../assets/login/Logo.png";
import LoginBanner from "../../assets/login/loginbanner.png";

export default function MainLogin() {
  // 각 요소 사이 간격(px)을 한 곳에서 관리
  const G = {
    afterBanner: 100,
    afterLogo: 15,
    afterTitle: 15,
    afterInputs: 15,
    afterLoginBtn: 20,
    afterSignup: 15,
    afterDots: 15,
  };

  return (
    <div className="min-h-screen w-full bg-[#F3F3F3] flex items-center justify-center">
      {/* 고정 디바이스 프레임 */}
      <div className="w-[390px] h-[844px] rounded-[32px] bg-white shadow-xl overflow-hidden">
        {/* 1. logobanner */}
        {/* logobanner */}
        <div className="relative w-[390px] h-[70px] rounded-t-[32px] overflow-hidden">
          {/* 배경 */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#4CC554] to-white" />

          {/* 아이콘 (중앙 정렬, 배너 전체 높이 채우기) */}
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
          {/* 2. Logo (183.06 x 42.76) */}
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

          {/* 3. 로그인 타이틀 (#4CC554, 350 x 40) */}
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
            로그인
          </p>

          {/* 4. 아이디/비밀번호 (350 x 100) */}
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

          {/* 5. 로그인 버튼 (#C8C8C880, 350 x 50) */}
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
            로그인
          </button>

          {/* 6. 회원가입 (110 x 40) */}
          <button
            type="button"
            className="text-sm font-semibold"
            style={{
              width: "110px",
              height: "40px",
              marginTop: G.afterLoginBtn,
            }}
          >
            회원가입
          </button>

          {/* 7. 점 3개 (컨테이너 163 x 41, 점 색 #D9D9D9) */}
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

          {/* 8. 로그인 없이 둘러보기 (350 x 40) */}
          <p
            className="text-center font-semibold text-[14px] select-none"
            style={{
              width: "350px",
              height: "40px",
              lineHeight: "40px",
              marginTop: G.afterDots,
            }}
          >
            로그인 없이 둘러보기
          </p>
        </div>
      </div>
    </div>
  );
}
