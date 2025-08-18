// src/pages/loginPage/seller-login.jsx
import React, { useState, useEffect } from "react";
import SellerLogo from "../../assets/login/logo-seller.png";
import LoginBanner from "../../assets/login/loginbanner.png";
import ConfirmLocationModal from "../../components/modal/confirm-location-modal";
import KakaoLogo from "../../assets/login/social-logo/kakaotalk-logo.png";

// ✅ react-icons
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
// ✅ 올바른 경로로 SocialLoginButton import
import SocialLoginButton from "../../components/login/social-login-button.jsx";

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
    useEffect(() => setOpenConfirm(true), []);
    const handleYes = () => setOpenConfirm(false);
    const handleNo = () => setOpenConfirm(false);

    return (
        <div className="w-full bg-[#F3F3F3] flex items-center justify-center">
            <div className="h-screen bg-white overflow-hidden">
                {/* 배너 */}
                <div className="relative w-[390px] h-[70px] overflow-hidden">
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
                            width: 350,
                            height: 40,
                            lineHeight: "40px",
                            marginTop: G.afterLogo,
                        }}
                    >
                        상인 로그인
                    </p>

                    {/* 아이디/비번 입력 */}
                    <div
                        className="rounded-xl overflow-hidden flex flex-col justify-center"
                        style={{
                            width: 350,
                            height: 100,
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
                        <div
                            className="h-px"
                            style={{ backgroundColor: "#E6E6E6" }}
                        />
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
                            width: 350,
                            height: 50,
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
                            width: 350,
                            height: 50,
                            border: "1.5px solid #F5B236",
                            color: "#000",
                            marginTop: G.afterLoginBtn,
                            boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
                        }}
                    >
                        상인 회원가입
                    </button>

                    {/* 소셜 로그인 (react-icons) */}
                    <div className="flex items-center justify-between gap-4 mt-[15px]">
                        <SocialLoginButton
                            Icon={FcGoogle}
                            bgColor="#FFFFFF"
                            bordered
                            alt="Google 로그인"
                            size={50}
                            iconSize={25}
                        />
                        <SocialLoginButton
                            Icon={SiNaver}
                            bgColor="#03C75A"
                            iconColor="#FFFFFF"
                            alt="Naver 로그인"
                            size={50}
                            iconSize={18}
                        />
                        <SocialLoginButton
                            imgSrc={KakaoLogo}
                            bgColor="#FEE500"
                            alt="Kakao 로그인"
                            size={50}
                            iconSize={25}
                        />
                    </div>
                    <p
                        className="text-center font-semibold text-[14px] select-none"
                        style={{
                            width: 350,
                            height: 40,
                            lineHeight: "40px",
                            marginTop: G.afterDots,
                        }}
                    >
                        로그인 없이 둘러보기 →
                    </p>
                </div>
            </div>

            <ConfirmLocationModal
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onYes={handleYes}
                onNo={handleNo}
            />
        </div>
    );
}
