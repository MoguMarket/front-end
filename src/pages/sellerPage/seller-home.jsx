import { useSearchParams, useNavigate } from "react-router-dom";

export default function SellerHomePage() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const shopId = sp.get("shopId");

  const goAddProduct = () => {
    const q = shopId ? `?shopId=${encodeURIComponent(shopId)}` : "";
    navigate(`/seller/add-product${q}`);
  };

  return (
    <div className="relative w-full max-w-[390px] mx-auto bg-white min-h-screen pt-3">
      {/* 상단 가로 버튼 */}
      <div className="">
        <button
          type="button"
          onClick={goAddProduct}
          className="w-full h-10 rounded-xl bg-[#F5B236] text-white font-semibold text-center"
        >
          + 내상품 등록
        </button>
      </div>

      {/* Seller 전용 콘텐츠 */}
      <section className="p-4">
        <h1 className="text-lg font-semibold">판매자 홈</h1>
        {shopId ? (
          <p className="text-sm text-neutral-600 mt-1">샵 ID: {shopId}</p>
        ) : (
          <p className="text-sm text-neutral-600 mt-1">
            상점 정보를 선택해 주세요.
          </p>
        )}
        {/* TODO: 판매자 대시보드 위젯들 */}
      </section>
    </div>
  );
}
