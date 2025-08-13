// GroupBuyPage.jsx
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GroupBuyHeader from "../../components/groupBuy/group-buy-header";
import SHOPS from "../../components/db/shops-db";

export default function GroupBuyPage() {
  const navigate = useNavigate();

  // 1) 파라미터 이름을 라우트와 맞춘다
  const { shopId: shopIdParam, productId: productIdParam } = useParams();

  console.log(shopIdParam, productIdParam);

  // 2) 숫자로 변환 (useParams는 문자열 반환)
  const shopId = Number(shopIdParam);
  const productId = Number(productIdParam);

  // 3) shop / product 찾기
  const shop = useMemo(() => SHOPS.find((s) => s.shopId === shopId), [shopId]);

  const product = useMemo(
    () => shop?.products.find((p) => p.id === productId),
    [shop, productId]
  );

  if (!shop || !product) {
    return (
      <>
        <GroupBuyHeader />
        <div className="mx-auto mt-20 w-full max-w-[480px] p-4">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            데이터를 찾을 수 없습니다.
            <div className="mt-2 text-sm text-red-600">
              shopId: {shopIdParam}, productId: {productIdParam}
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 rounded-lg bg-gray-800 px-4 py-2 text-white"
          >
            뒤로가기
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <GroupBuyHeader />
      {/* ...여기에 실제 UI 렌더링 */}
    </>
  );
}
