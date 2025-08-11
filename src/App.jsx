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
import ProductDetailPage from "./pages/produckDetailPage/[id]";

function AppContent() {
  const { pathname } = useLocation();
  const isMapPage = pathname === "/marketMapList";

  const matchMarketDetail = useMatch("/marketDetailPage/:id");
  const isDetailPage = Boolean(matchMarketDetail);

  const matchProductDetail = useMatch(
    "/marketDetailPage/:marketId/product/:productId"
  );
  const isProductDetailPage = Boolean(matchProductDetail);

  return (
    <div className="relative w-full max-w-[390px] mx-auto bg-white">
      {!isMapPage && !isDetailPage && !isProductDetailPage && <Header />}
      <div
        className={`min-h-screen ${
          isMapPage || isDetailPage || isProductDetailPage
            ? ""
            : "pt-16 pb-16 px-4"
        }`}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gift" element={<GiftPage />} />
          <Route path="/shopping" element={<ShoppingPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/myinfo" element={<MyInfoPage />} />
          <Route path="/marketMapList" element={<MarketMapList />} />
          <Route
            path="/marketDetailPage/:marketId"
            element={<MarketDetailPage />}
          />
          <Route
            path="/marketDetailPage/:marketId/product/:productId"
            element={<ProductDetailPage />}
          />
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
