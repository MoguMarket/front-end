// src/pages/sellerPage/seller-home.jsx
import { useSearchParams } from "react-router-dom";

export default function SellerHomePage() {
    const [sp] = useSearchParams();
    const shopId = sp.get("shopId");

    return (
        <div className="relative w-full max-w-[390px] mx-auto bg-white min-h-screen pt-14">
            {/* 여기부터는 Seller 전용 콘텐츠만 배치 */}
            <section className="p-4">
                <h1 className="text-lg font-semibold">판매자 홈</h1>
                {shopId ? (
                    <p className="text-sm text-neutral-600 mt-1">
                        샵 ID: {shopId}
                    </p>
                ) : (
                    <p className="text-sm text-neutral-600 mt-1">
                        상점 정보를 선택해 주세요.
                    </p>
                )}
                {/* TODO: 판매자 대시보드 위젯들 렌더링 */}
            </section>
        </div>
    );
}
