import { Home, Gift, ShoppingCart, ClipboardList, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNavBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] mx-auto bg-[#F7F7F7] z-50">
      <div className="flex justify-center items-center h-16 gap-x-10">
        <NavItem
          icon={<Home size={26} />}
          label="홈"
          to="/"
          isActive={location.pathname === "/"}
        />
        <NavItem
          icon={<Gift size={26} />}
          label="선물하기"
          to="/gift"
          isActive={location.pathname === "/gift"}
        />
        <NavItem
          icon={<ClipboardList size={26} />}
          label="주문내역"
          to="/order"
          isActive={location.pathname === "/order"}
        />
        <NavItem
          icon={<User size={26} />}
          label="내 정보"
          to="/myinfo"
          isActive={location.pathname === "/myinfo"}
        />
        <NavItem
          icon={<ShoppingCart size={26} />}
          label="장바구니"
          to="/shopping"
          isActive={location.pathname === "/shopping"}
        />
      </div>
    </nav>
  );
}

function NavItem({ icon, label, to, isActive }) {
  const iconColor = isActive ? "text-green-600" : "text-gray-500";
  const textColor = isActive ? "text-green-600" : "text-gray-700";

  return (
    <Link to={to} className="flex flex-col items-center text-xs">
      <div className={iconColor}>{icon}</div>
      <span className={`mt-1 ${textColor}`}>{label}</span>
    </Link>
  );
}
