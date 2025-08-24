import { FaHome, FaReceipt, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function SellerBottomNav() {
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] mx-auto bg-[#F7F7F7] z-50 font-[Pretendard]">
            <div className="flex justify-around items-center h-16">
                <NavItem
                    icon={<FaHome size={22} />}
                    label="내 상점"
                    to="/seller-home"
                    isActive={location.pathname === "/seller-home"}
                />
                <NavItem
                    icon={<FaReceipt size={22} />}
                    label="공구현황"
                    to="/seller/sales"
                    isActive={location.pathname === "/seller/sales"}
                />
                <NavItem
                    icon={<FaUser size={22} />}
                    label="내 정보"
                    to="/seller/mypage"
                    isActive={location.pathname === "/seller/mypage"}
                />
            </div>
        </nav>
    );
}

function NavItem({ icon, label, to, isActive }) {
    const iconColor = isActive ? "text-[#F5B236]" : "text-gray-500";
    const textColor = isActive ? "text-[#F5B236]" : "text-gray-700";

    return (
        <Link
            to={to}
            className="flex flex-col items-center text-xs tracking-[-0.03em] font-[Pretendard]"
            style={{ fontFeatureSettings: "'tnum'" }}
        >
            <div className={iconColor}>{icon}</div>
            <span className={`mt-1 ${textColor}`}>{label}</span>
        </Link>
    );
}
