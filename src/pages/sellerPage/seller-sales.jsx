// src/pages/sellerPage/seller-sales.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, XCircle, ChevronRight, Package } from "lucide-react";

// 더미데이터 (상대 경로)
import SALES from "../../components/db/seller-sales";

const THEME = "#F5B236";

// 상태 → 탭 분류 (대문자/공백 정규화해서 비교)
const ONGOING_STATUSES = ["OPEN", "IN_PROGRESS", "READY_FOR_PICKUP"];
const DONE_STATUSES = ["COMPLETED", "CLOSED", "CANCELLED"];
const normalize = (s) => (s ?? "").toString().trim().toUpperCase();

export default function SellerSales() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("ongoing"); // 'ongoing' | 'done'

    const ongoingData = useMemo(
        () =>
            (Array.isArray(SALES) ? SALES : []).filter((x) =>
                ONGOING_STATUSES.includes(normalize(x.groupBuyStatus))
            ),
        []
    );
    const doneData = useMemo(
        () =>
            (Array.isArray(SALES) ? SALES : []).filter((x) =>
                DONE_STATUSES.includes(normalize(x.groupBuyStatus))
            ),
        []
    );

    const list = useMemo(
        () => (activeTab === "ongoing" ? ongoingData : doneData),
        [activeTab, ongoingData, doneData]
    );

    const goCreate = () => navigate("/seller/add-sales");
    const goDetail = (id) => navigate(`/seller/sales/${id}`);
    const onClose = (id, e) => {
        e?.stopPropagation();
    };

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] pb-28 font-pretendard">
            {/* 상단 고정바 (공통 헤더 높이에 맞춤) */}
            <div
                className="sticky z-50 w-full bg-white/95 backdrop-blur"
                style={{ top: "var(--app-header-h, 56px)" }}
            >
                <div className="mx-auto max-w-[390px] px-4">
                    <div className="h-12 flex items-center gap-3">
                        <div className="flex gap-8">
                            <Tab
                                active={activeTab === "ongoing"}
                                onClick={() => setActiveTab("ongoing")}
                                label="진행 중"
                            />
                            <Tab
                                active={activeTab === "done"}
                                onClick={() => setActiveTab("done")}
                                label="진행 완료"
                            />
                        </div>
                        <button
                            onClick={goCreate}
                            className="ml-auto flex items-center gap-1.5 h-9 px-3 rounded-xl text-sm font-semibold shadow active:scale-[0.98] transition"
                            style={{ backgroundColor: THEME, color: "#ffffff" }}
                        >
                            <Plus size={18} />
                            생성하기
                        </button>
                    </div>
                </div>
            </div>

            {/* 컨텐츠 */}
            <div className="mx-auto max-w-[390px] px-4">
                {list.length === 0 ? (
                    <EmptyState
                        title={
                            activeTab === "ongoing"
                                ? "진행 중인 공동구매가 없어요"
                                : "완료된 공동구매가 없어요"
                        }
                    />
                ) : (
                    <ul className="mt-3 space-y-3">
                        {list.map((item) => (
                            <li key={item.groupBuyId}>
                                <SalesCard
                                    data={item}
                                    onClick={() => goDetail(item.groupBuyId)}
                                    onClose={(e) => onClose(item.groupBuyId, e)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function Tab({ active, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`relative pb-2 text-[15px] ${
                active ? "font-semibold" : "text-gray-500"
            }`}
        >
            {label}
            <span
                className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-full"
                style={{ backgroundColor: active ? THEME : "transparent" }}
            />
        </button>
    );
}

function SalesCard({ data, onClick, onClose }) {
    const {
        name,
        storeName,
        imageUrl,
        originalPricePerBaseUnit,
        appliedUnitPrice,
        currentDiscountPercent,
        groupBuyStatus,
        targetQty,
        currentQty,
        remainingToNextStage,
    } = data;

    const statusLabel = ONGOING_STATUSES.includes(normalize(groupBuyStatus))
        ? "진행 중"
        : "진행 완료";

    const percent = targetQty
        ? Math.min(
              100,
              Math.round(
                  (Number(currentQty || 0) / Number(targetQty || 1)) * 100
              )
          )
        : 0;

    return (
        <div
            className="bg-white rounded-2xl p-3 shadow-sm active:scale-[0.995] transition"
            role="button"
            onClick={onClick}
        >
            <div className="flex gap-3">
                {/* 썸네일 */}
                <div className="w-[86px] h-[86px] rounded-xl overflow-hidden shrink-0 bg-gray-100">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full grid place-items-center text-gray-400 text-xs">
                            No Image
                        </div>
                    )}
                </div>

                {/* 본문 */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <p className="text-[13px] text-gray-500">{storeName}</p>
                        <span
                            className="text-[11px] px-2 py-[2px] rounded-full border"
                            style={{ borderColor: THEME, color: THEME }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {statusLabel}
                        </span>
                    </div>

                    <h3 className="mt-0.5 text-[15px] font-semibold line-clamp-1">
                        {name}
                    </h3>

                    {/* 가격/할인 */}
                    <div className="mt-0.5 flex items-center gap-2">
                        {originalPricePerBaseUnit ? (
                            <del className="text-[12px] text-gray-400 num-tight">
                                {toWon(originalPricePerBaseUnit)}
                            </del>
                        ) : null}
                        {appliedUnitPrice != null ? (
                            <span
                                className="text-[12px] font-semibold num-tight"
                                style={{ color: THEME }}
                            >
                                {isFinite(currentDiscountPercent)
                                    ? `${Math.round(currentDiscountPercent)}% `
                                    : ""}
                                {toWon(appliedUnitPrice)}
                            </span>
                        ) : null}
                    </div>

                    {/* 진행 정보 */}
                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[12px] text-gray-600">
                            <Users size={14} />
                            <span className="num-tight">
                                {currentQty ?? 0}/{targetQty ?? 0}kg
                            </span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                    </div>

                    {/* 프로그레스 + 다음 단계 */}
                    {targetQty ? (
                        <div className="mt-2">
                            <ProgressBar value={percent} />
                            {typeof remainingToNextStage === "number" ? (
                                remainingToNextStage > 0 ? (
                                    <div className="mt-1.5 text-[12px] text-gray-600">
                                        공동구매 마감까지{" "}
                                        <b className="num-tight">
                                            {remainingToNextStage}kg
                                        </b>{" "}
                                        남았어요
                                    </div>
                                ) : (
                                    <div className="mt-1.5 text-[12px] text-gray-600">
                                        진행이 완료된 상품이에요
                                    </div>
                                )
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function ProgressBar({ value }) {
    return (
        <div className="w-full h-[8px] rounded-full bg-gray-200 overflow-hidden">
            <div
                className="h-full rounded-full"
                style={{
                    width: `${value}%`,
                    backgroundColor: THEME,
                    transition: "width .25s ease",
                }}
            />
        </div>
    );
}

function IconButton({ children, onClick, label, type = "default" }) {
    const isDanger = type === "danger";
    return (
        <button
            onClick={onClick}
            className={`h-8 px-2.5 rounded-lg text-[12px] font-medium flex items-center gap-1 border active:scale-[0.98] transition ${
                isDanger
                    ? "text-red-500 border-red-200"
                    : "text-gray-700 border-gray-200"
            } bg-white`}
            aria-label={label}
            title={label}
        >
            {children}
            <span>{label}</span>
        </button>
    );
}

function EmptyState({ title }) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <div
                className="w-16 h-16 rounded-2xl grid place-items-center mb-3"
                style={{ backgroundColor: "#FFF3DA" }}
            >
                <Package size={28} style={{ color: THEME }} />
            </div>
            <p className="text-sm text-gray-700 font-medium">{title}</p>
        </div>
    );
}

function toWon(n) {
    try {
        return Number(n).toLocaleString() + "원";
    } catch {
        return "";
    }
}
