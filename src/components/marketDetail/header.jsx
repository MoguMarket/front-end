import { MapPin } from "lucide-react";
import { ArrowLeft } from "lucide-react";

export default function Header({ marketName }) {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-[#4CC554] z-50">
      <div className="h-14 flex items-center justify-between px-4 text-white">
        <ArrowLeft size={22} className="font-bold" color="white" />
        <span className="text-lg font-semibold">{marketName}</span>
        <MapPin size={20} color="white" />
      </div>
    </header>
  );
}
