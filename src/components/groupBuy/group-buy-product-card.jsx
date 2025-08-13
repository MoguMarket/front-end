import GroupBuyProgress from "./proup-buy-progress";

// components/groupBuy/group-buy-product-card.jsx
export default function GroupBuyProductCard({ shop, product }) {
  return (
    <div className="pb-4 border-b-9 border-[#f5f5f5]">
      <div className="flex items-center gap-3  pb-3 pt-1">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-16 h-16 rounded-md object-cover"
        />
        <div>
          <div className="text-sm text-green-600 font-medium">{shop.name}</div>
          <div className="text-base font-semibold">
            {product.name} <span className="font-normal">{product.weight}</span>
          </div>
        </div>
      </div>
      {product.progressCurrent !== 0 && <GroupBuyProgress product={product} />}
    </div>
  );
}
