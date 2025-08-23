// src/components/home/deadline-product-list.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Slider from "react-slick";
import ProductCard from "./product-card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function DeadlineProductsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isGiftPage = location.pathname === "/gift";
  const currentShopId = sp.get("shopId") || undefined;

  // 1) 마감 임박 공구 리스트
  useEffect(() => {
    let aborted = false;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE}/api/groupbuy/closing-soon?page=0&size=20`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        const list = Array.isArray(json)
          ? json
          : Array.isArray(json?.content)
          ? json.content
          : [];

        if (aborted) return;

        const mapped = list.map((it, idx) => ({
          productId: it.productId,
          shopId: it.storeId,
          id: it.productId ?? idx,
          name: it.name ?? "상품",
          weight: "",
          originalPrice: Number(it.originalPricePerBaseUnit ?? 0),
          discountedPrice: Number(
            it.appliedUnitPrice ?? it.originalPricePerBaseUnit ?? 0
          ),
          imageUrl:
            it.imageUrl ||
            "https://via.placeholder.com/600x450.png?text=No+Image",
          marketName: it.storeName ?? "",
          progressCurrent:
            typeof it.currentQty === "number" ? it.currentQty : null,
          progressMax: typeof it.targetQty === "number" ? it.targetQty : null,
          rating: 0,
          reviewCount: 0,
          liked: false,
        }));

        setProducts(mapped);
      } catch (e) {
        console.warn("[DeadlineProductsList] fetch failed:", e);
        setProducts([]);
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, []);

  // 2) 리뷰 수 병렬 조회 (보여주는 상위 N개만)
  useEffect(() => {
    if (!products.length) return;
    let aborted = false;

    const TOP_N = Math.min(products.length, 10);
    const targets = products.slice(0, TOP_N).filter((p) => p.productId);

    (async () => {
      try {
        const results = await Promise.all(
          targets.map(async (p) => {
            try {
              const r = await fetch(
                `${API_BASE}/api/reviews?productId=${p.productId}&page=0&size=1`,
                { headers: { Accept: "application/json" } }
              );
              if (!r.ok) return { productId: p.productId, count: 0 };
              const j = await r.json();
              const count =
                j?.page?.totalElements ??
                j?.totalElements ??
                (Array.isArray(j?.content) ? j.content.length : 0) ??
                0;
              return { productId: p.productId, count };
            } catch {
              return { productId: p.productId, count: 0 };
            }
          })
        );

        if (aborted) return;

        const countMap = new Map(
          results.map((x) => [String(x.productId), x.count])
        );

        setProducts((prev) =>
          prev.map((p) => {
            const c = countMap.get(String(p.productId));
            return typeof c === "number" ? { ...p, reviewCount: c } : p;
          })
        );
      } catch {
        /* 무시 */
      }
    })();

    return () => {
      aborted = true;
    };
  }, [products.length]);

  const toggleLike = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p))
    );
  };

  const settings = useMemo(
    () => ({
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 2.2,
      slidesToScroll: 2,
      arrows: false,
    }),
    []
  );

  const buildDetailQuery = (shopId) => {
    const qs = new URLSearchParams(location.search);
    if (shopId) qs.set("shopId", shopId);
    if (isGiftPage) qs.set("from", "gift");
    return qs.toString();
  };
  const buildMarketQuery = (shopId) => {
    const qs = new URLSearchParams(location.search);
    if (shopId) qs.set("shopId", shopId);
    return qs.toString();
  };

  if (loading) {
    return (
      <div className="py-3">
        <h2 className="text-md font-semibold mb-2">
          마감이 임박한 상품이에요!
        </h2>
        <p className="px-1 text-sm text-neutral-500">불러오는 중…</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="py-3">
        <h2 className="text-md font-semibold mb-2">
          마감이 임박한 상품이에요!
        </h2>
        <p className="px-1 text-sm text-neutral-500">표시할 상품이 없어요.</p>
      </div>
    );
  }

  return (
    <div className="py-3">
      <h2 className="text-md font-semibold mb-2">마감이 임박한 상품이에요!</h2>
      <Slider {...settings}>
        {products.map((item) => {
          const shopId = item.shopId || currentShopId;

          return (
            <ProductCard
              key={item.id}
              name={item.name}
              weight={item.weight}
              originalPrice={item.originalPrice}
              discountedPrice={item.discountedPrice}
              rating={item.rating}
              reviewCount={item.reviewCount} // ← 리뷰 수 반영
              liked={item.liked}
              imageUrl={item.imageUrl}
              marketName={item.marketName}
              progressCurrent={item.progressCurrent}
              progressMax={item.progressMax}
              onToggleLike={() => toggleLike(item.id)}
              onClickMarket={() => {
                const qs = buildMarketQuery(shopId);
                navigate(`/marketDetailPage/${shopId}${qs ? `?${qs}` : ""}`);
              }}
              onClickCard={() => {
                const qs = buildDetailQuery(shopId);
                navigate(
                  `/marketDetailPage/${shopId}/product/${item.productId}${
                    qs ? `?${qs}` : ""
                  }`
                );
              }}
            />
          );
        })}
      </Slider>
    </div>
  );
}
