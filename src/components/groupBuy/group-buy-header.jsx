import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GroupBuyHeader() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-[#4CC554] z-50">
      <div className="relative h-14 flex items-center px-4 text-white">
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
          className="absolute left-4 p-1"
        >
          <ArrowLeft size={22} className="text-white cursor-pointer" />
        </button>

        <span className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
          모여서 구매
        </span>
      </div>
    </header>
  );
}
