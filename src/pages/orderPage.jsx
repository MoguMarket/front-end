// file: orderPage.jsx

import React from "react";
import OrderList from "../components/orderPage/order-list";
import { IN_PROGRESS_ORDERS } from "../components/db/order-info";

export default function OrderPage() {
  const handleItemClick = (id) => {
    console.log("[OrderPage] clicked:", id);
  };

  const handleCancelItem = (id) => {
    console.log("[OrderPage] cancel:", id);
  };

  return (
    <main className="mx-auto max-w-md">
      <OrderList
        items={IN_PROGRESS_ORDERS}
        onItemClick={handleItemClick}
        onCancelItem={handleCancelItem}
      />
    </main>
  );
}

