import { MapPin, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({ marketName }) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-[#4CC554] z-50">
      <div className="h-14 flex items-center justify-between px-4 text-white">
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
          className="p-1"
        >
          <ArrowLeft
            size={22}
            className="font-bold cursor-pointer"
            color="white "
          />
        </button>
        <span className="text-lg font-semibold">{marketName}</span>
        <MapPin size={20} color="white" />
      </div>
    </header>
  );
}
