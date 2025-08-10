// src/pages/orderPage.jsx

import React from "react";
import OrderList from "../components/orderPage/orderList";
import orderInfo from "../components/db/orderInfo";

export default function OrderPage() {
    const handleItemClick = (id) => {
        console.log("[OrderPage] clicked:", id);
    };

    const handleCancelItem = (id) => {
        console.log("[OrderPage] cancel:", id);
    };

    return (
        <main className="mx-auto max-w-md p-4">
            <header> </header>

            <OrderList
                items={orderInfo}
                onItemClick={handleItemClick}
                onCancelItem={handleCancelItem}
            />
        </main>
    );
}
