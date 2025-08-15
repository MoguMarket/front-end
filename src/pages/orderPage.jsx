// file: orderPage.jsx
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import OrderList from "../components/orderPage/order-list";
import { IN_PROGRESS_ORDERS } from "../components/db/order-info";
import { SHOPS } from "../components/db/shops-db";

const NAME_TO_SHOPID = new Map(SHOPS.map((s) => [s.name, s.shopId]));

const ALIAS_TO_SHOPID = new Map([]);

const resolveShopId = (item) => {
    if (item?.shopId) return String(item.shopId);
    const byName = NAME_TO_SHOPID.get(item?.marketName);
    if (byName) return String(byName);
    const byAlias = ALIAS_TO_SHOPID.get(item?.marketName);
    if (byAlias) return String(byAlias);
    return null;
};

export default function OrderPage() {
    const navigate = useNavigate();

    const handleMarketClick = useCallback(
        (item) => {
            const id = resolveShopId(item);
            if (!id) {
                console.warn(
                    "[OrderPage] shopId not resolved for:",
                    item?.marketName,
                    item
                );
                return;
            }
            navigate(`/marketDetailPage/${encodeURIComponent(id)}`);
        },
        [navigate]
    );

    return (
        <main className="mx-auto max-w-md">
            <OrderList
                items={IN_PROGRESS_ORDERS}
                onItemClick={(id) => console.log("[OrderPage] clicked:", id)}
                onCancelItem={(id) => console.log("[OrderPage] cancel:", id)}
                onMarketClick={handleMarketClick}
            />
        </main>
    );
}
