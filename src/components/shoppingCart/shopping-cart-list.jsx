import React from "react";
import ShoppingCartCard from "./shopping-cart-card";

const dummyCartItems = [
  {
    productId: 1,
    productName: "국내산 흙당근",
    unitPrice: 3000,
    quantity: 2,
    lineTotal: 6000,
    imageUrl: "/images/carrot.jpg",
  },
  {
    productId: 2,
    productName: "신선한 대파",
    unitPrice: 2500,
    quantity: 3,
    lineTotal: 7500,
    imageUrl: "/images/carrot.jpg",
  },
];

export default function ShoppingCartList() {
  if (!dummyCartItems.length) {
    return (
      <p className="text-center text-gray-500 text-sm py-6">
        장바구니가 비어 있습니다.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {dummyCartItems.map((item) => (
        <ShoppingCartCard key={item.productId} item={item} />
      ))}
    </div>
  );
}
