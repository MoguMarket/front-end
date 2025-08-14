// file: orderPage.jsx

import React from "react";
import OrderList from "../components/orderPage/order-list";
import { IN_PROGRESS_ORDERS } from "../components/db/order-info";

export default function OrderPage() {
    return (
        <main className="mx-auto max-w-md">
            <OrderList
                items={IN_PROGRESS_ORDERS}
                onItemClick={(id) => console.log("[OrderPage] clicked:", id)}
                onCancelItem={(id) => console.log("[OrderPage] cancel:", id)}
            />
        </main>
    );
}
