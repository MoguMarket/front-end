import { useMemo } from "react";
import { useParams } from "react-router-dom";
import GroupBuyHeader from "../../components/groupBuy/group-buy-header";
import SHOPS from "../../components/db/shops-db";
import GroupBuyProductCard from "../../components/groupBuy/group-buy-product-card";
import OrderPanel from "../../components/groupBuy/order-panel";

export default function SelfBuyPage() {
  const { shopId: shopIdParam, productId: productIdParam } = useParams();

  const shopId = Number(shopIdParam);
  const productId = Number(productIdParam);

  const shop = useMemo(() => SHOPS.find((s) => s.shopId === shopId), [shopId]);
  const product = useMemo(
    () => shop?.products.find((p) => p.id === productId),
    [shop, productId]
  );

  if (!shop || !product) {
    return (
      <>
        <GroupBuyHeader />
        <div className="p-4">데이터를 찾을 수 없습니다.</div>
      </>
    );
  }

  return (
    <>
      <GroupBuyHeader />
      <GroupBuyProductCard shop={shop} product={product} />
      <OrderPanel shopId={shopId} productId={productId} />
    </>
  );
}
