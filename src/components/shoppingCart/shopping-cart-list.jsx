import React, { useEffect, useMemo, useState } from "react";
import ShoppingCartCard from "./shopping-cart-card";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ShoppingCartList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const authHeaders = useMemo(() => {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        const listRes = await fetch(`${API_BASE}/api/carts`, {
          headers: { Accept: "application/json", ...authHeaders },
          credentials: "include",
        });
        if (listRes.status === 401) {
          nav(
            `/login?redirect=${encodeURIComponent(
              location.pathname + location.search
            )}`
          );
          return;
        }
        if (!listRes.ok) throw new Error(`GET /api/carts ${listRes.status}`);
        const cart = await listRes.json();

        // 이미지 보강
        const enriched = await Promise.all(
          cart.map(async (row) => {
            try {
              const pRes = await fetch(
                `${API_BASE}/api/products/${row.productId}`,
                {
                  headers: { Accept: "application/json", ...authHeaders },
                  credentials: "include",
                }
              );
              if (!pRes.ok) throw new Error();
              const p = await pRes.json();
              return {
                ...row,
                imageUrl: p?.imageUrl || "/images/placeholder.jpg",
              };
            } catch {
              return { ...row, imageUrl: "/images/placeholder.jpg" };
            }
          })
        );
        if (!aborted) setItems(enriched);
      } catch (e) {
        console.error("[Cart] fetch error:", e);
        if (!aborted) setItems([]);
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [authHeaders, nav]);

  // ✅ 삭제 API 연동
  const handleDelete = async (productId) => {
    // 낙관적 업데이트
    const prev = items;
    setItems((cur) => cur.filter((x) => x.productId !== productId));
    try {
      const res = await fetch(`${API_BASE}/api/carts/${productId}`, {
        method: "DELETE",
        headers: { ...authHeaders },
        credentials: "include",
      });
      if (res.status === 401) {
        alert("로그인이 필요합니다.");
        nav(
          `/login?redirect=${encodeURIComponent(
            location.pathname + location.search
          )}`
        );
        setItems(prev);
        return;
      }
      if (!res.ok)
        throw new Error(`DELETE /api/carts/${productId} ${res.status}`);
      // 성공 시 그대로 유지
    } catch (e) {
      console.error("[Cart] delete error:", e);
      alert("삭제에 실패했습니다.");
      setItems(prev); // 실패 시 롤백
    }
  };

  if (loading)
    return (
      <p className="text-center text-neutral-500 text-sm py-6">불러오는 중…</p>
    );
  if (!items.length)
    return (
      <p className="text-center text-gray-500 text-sm py-6">
        장바구니가 비어 있습니다.
      </p>
    );

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ShoppingCartCard
          key={item.productId}
          item={item}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
