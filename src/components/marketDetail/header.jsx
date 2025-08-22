// src/components/marketDetail/header.jsx
import { MapPin, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Header({ marketName }) {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const isGift = sp.get("from") === "gift"; // ✅ 쿼리로 판별

  return (
    <header
      className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-50"
      style={{ backgroundColor: isGift ? "#F5B236" : "#4CC554" }}
    >
      <div className="h-14 flex items-center justify-between px-4 text-white">
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
          className="p-1"
        >
          <ArrowLeft size={22} className="font-bold cursor-pointer" />
        </button>
        <span className="text-lg font-semibold">{marketName}</span>
        <MapPin size={20} />
      </div>
    </header>
  );
}
