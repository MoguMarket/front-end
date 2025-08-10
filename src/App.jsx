import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useMatch,
} from "react-router-dom";
import BottomNavBar from "./components/bottomnavbar";
import Header from "./components/header";

import HomePage from "./pages/homePage";
import GiftPage from "./pages/giftPage";
import ShoppingPage from "./pages/shoppingCartPage";
import OrderPage from "./pages/orderPage";
import MyInfoPage from "./pages/myInfoPage";
import MarketMapList from "./pages/marketMapList";
import MarketDetailPage from "./pages/marketDetailPage/[id]";

function AppContent() {
  const { pathname } = useLocation();
  const isMapPage = pathname === "/marketMapList";

  const matchDetail = useMatch("/marketDetailPage/:id");
  const isDetailPage = Boolean(matchDetail);

  return (
    <div className="relative w-full max-w-[390px] mx-auto bg-white">
      {!isMapPage && !isDetailPage && <Header />}
      <div
        className={`min-h-screen ${
          isMapPage || isDetailPage ? "" : "pt-16 pb-16 px-4"
        }`}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gift" element={<GiftPage />} />
          <Route path="/shopping" element={<ShoppingPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/myinfo" element={<MyInfoPage />} />
          <Route path="/marketMapList" element={<MarketMapList />} />
          <Route path="/marketDetailPage/:id" element={<MarketDetailPage />} />
        </Routes>
      </div>
      {!isMapPage && <BottomNavBar />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
