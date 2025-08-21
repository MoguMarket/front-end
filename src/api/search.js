// src/api/search.js
const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function getTrendingKeywords() {
    const res = await fetch(`${API_BASE}/api/search/trending`, {
        headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json().catch(() => ({}));

    const list =
        json?.data?.keywords ||
        json?.data ||
        json?.keywords ||
        json?.result ||
        json?.items ||
        [];

    return Array.isArray(list) ? list.map(String) : [];
}

export async function searchProducts(keyword) {
    const q = (keyword ?? "").trim();
    if (!q) return { items: [], total: 0 };

    const url = `${API_BASE}/api/search?keyword=${encodeURIComponent(q)}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json().catch(() => ({}));

    const data = json?.data ?? json?.result ?? json?.items ?? json;

    let items =
        data?.items ??
        data?.results ??
        data?.list ??
        (Array.isArray(data) ? data : []) ??
        [];

    const total =
        data?.total ??
        data?.count ??
        data?.length ??
        (Array.isArray(items) ? items.length : 0);

    items = Array.isArray(items) ? items : [];
    const normalized = items.map((it) => ({
        id: it.id ?? it.productId ?? it.sku ?? crypto.randomUUID(),
        name: it.name ?? it.productName ?? it.title ?? "",
        price: it.price ?? it.salePrice ?? it.finalPrice ?? null,
        imageUrl:
            it.imageUrl ??
            it.image ??
            it.thumbnail ??
            it.image_url ??
            undefined,
        marketName: it.marketName ?? it.seller ?? it.store ?? undefined,
        raw: it,
    }));

    return {
        items: normalized,
        total: Number(total) || normalized.length,
        raw: json,
    };
}
