import logo from "../assets/header-logo.svg";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header
            data-topbar
            className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-[#4CC554] z-50"
            role="banner"
        >
            <div className="h-16 flex items-center justify-between px-4 text-white">
                <img src={logo} alt="Logo" className="h-6" />
                <Link to="/location" className="flex items-center space-x-1">
                    <MapPin size={16} color="white" />
                    <span className="underline text-sm font-medium">
                        구미새마을중앙시장
                    </span>
                </Link>
            </div>
        </header>
    );
}
