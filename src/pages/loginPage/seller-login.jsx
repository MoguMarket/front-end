// src/pages/loginPage/seller-login.jsx
import { Link } from "react-router-dom";

export default function SellerLogin() {
    return (
        <div className="min-h-screen w-full bg-neutral-100 flex items-center justify-center p-4">
            <div className="w-full max-w-[390px] rounded-3xl overflow-hidden shadow-xl bg-white">
                <div className="px-5 py-8">
                    <h1 className="text-2xl font-bold text-[#36B04B] text-center">
                        상인 로그인
                    </h1>
                    <p className="text-center text-[14px] text-black/60 mt-2">
                        상인 전용 로그인 페이지입니다.
                    </p>
                    <div className="mt-6 text-center">
                        <Link
                            to="/main-login"
                            className="text-[14px] underline underline-offset-4"
                        >
                            메인 로그인으로 이동
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
