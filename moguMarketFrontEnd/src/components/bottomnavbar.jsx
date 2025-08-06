import { Home, Gift, ShoppingCart, ClipboardList, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNavBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] mx-auto bg-[#F7F7F7] z-50">
      <div className="flex justify-center items-center h-16 gap-x-8">
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
          icon={<ShoppingCart size={34} />}
          label="장바구니"
          to="/shopping"
          isActive={location.pathname === "/shopping"}
          isShoppingCart
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
      </div>
    </nav>
  );
}

function NavItem({ icon, label, to, isActive, isShoppingCart }) {
  const iconColor = isShoppingCart
    ? "text-white"
    : isActive
    ? "text-green-600"
    : "text-gray-500";

  const textColor = isShoppingCart
    ? "text-transparent"
    : isActive
    ? "text-green-600"
    : "text-gray-700";

  const gradientStyle = isShoppingCart
    ? "bg-[linear-gradient(180deg,#A2E994_0%,#4CC554_100%)]"
    : "";

  return (
    <Link to={to} className="flex flex-col items-center text-xs">
      <div
        className={`${
          isShoppingCart
            ? `p-4 rounded-full -translate-y-3 shadow-[0px_4px_4px_rgba(76,197,84,0.2)] ${gradientStyle}`
            : ""
        }`}
      >
        <div className={iconColor}>{icon}</div>
      </div>
      <span className={`mt-1 ${textColor}`}>{label}</span>
    </Link>
  );
}
