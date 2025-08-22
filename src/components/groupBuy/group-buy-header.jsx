// src/components/common/group-buy-header.jsx
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GroupBuyHeader({ title = "모여서 구매" }) {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const isGift = sp.get("from") === "gift";

  if (isGift) title = "선물하기";

  return (
    <header
      className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-50 ${
        isGift ? "bg-[#F5B236]" : "bg-[#4CC554]"
      }`}
    >
      <div className="relative h-14 flex items-center px-4 text-white">
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
          className="absolute left-4 p-1"
        >
          <ArrowLeft size={22} className="text-white cursor-pointer" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
          {title}
        </span>
      </div>
    </header>
  );
}
