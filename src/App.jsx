// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useMatch,
  Navigate,
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
import GroupBuyPage from "./pages/produckDetailPage/groupBuyPage";
import MainLogin from "./pages/loginPage/main-login";
import SellerLogin from "./pages/loginPage/seller-login.jsx";
import FirstPageLogin from "./pages/loginPage/first-page-login";
import ShopIdSync from "./components/router/ShopIdSync.js";
import SearchPage from "./pages/searchPage.jsx";

import PageGuard from "./components/router/PageGaurd.jsx";

import Register from "./pages/loginPage/register.jsx";
import SelfBuyPage from "./pages/produckDetailPage/selfBuyPage.jsx";

function AppContent() {
  const { pathname } = useLocation();
  const isMapPage = pathname === "/marketMapList";

  const matchMarketDetail = useMatch("/marketDetailPage/:shopId");
  const isDetailPage = Boolean(matchMarketDetail);

  const matchProductDetail = useMatch(
    "/marketDetailPage/:shopId/product/:productId"
  );
  const isProductDetailPage = Boolean(matchProductDetail);

  const matchGroupBuyPage = useMatch(
    "/marketDetailPage/:shopId/product/:productId/groupBuy"
  );
  const isGroupBuyPage = Boolean(matchGroupBuyPage);
  const isSearchPage = pathname === "/search";

  const matchSelfBuyPage = useMatch("/selfBuy/:shopId/product/:productId");
  const isSelfBuyPage = Boolean(matchSelfBuyPage);

  // ✅ 인증 관련 경로에 /register 추가
  const AUTH_PATHS = new Set([
    "/login",
    "/main-login",
    "/seller-login",
    "/firstpage",
    "/register",
  ]);
  const isAuthPage = AUTH_PATHS.has(pathname);

  return (
    <div className="relative w-full max-w-[390px] mx-auto bg-white">
      <ShopIdSync />
      {!isAuthPage &&
        !isMapPage &&
        !isDetailPage &&
        !isProductDetailPage &&
        !isSearchPage && <Header />}

      <div
        className={`min-h-screen ${
          isAuthPage || isMapPage || isDetailPage || isProductDetailPage
            ? ""
            : "pt-16 pb-16 px-4"
        }`}
      >
        <Routes>
          {/* 공개 경로 */}
          <Route path="/search" element={<SearchPage />} />
          <Route path="/firstpage" element={<FirstPageLogin />} />
          <Route path="/login" element={<MainLogin />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          {/* ✅ 회원가입 공개 경로 */}
          <Route path="/register" element={<Register />} />

          {/* 보호 경로 */}
          <Route
            path="/"
            element={
              <PageGuard>
                <HomePage />
              </PageGuard>
            }
          />
          <Route
            path="/gift"
            element={
              <PageGuard>
                <GiftPage />
              </PageGuard>
            }
          />
          <Route
            path="/shopping"
            element={
              <PageGuard>
                <ShoppingPage />
              </PageGuard>
            }
          />
          <Route
            path="/order"
            element={
              <PageGuard>
                <OrderPage />
              </PageGuard>
            }
          />
          <Route
            path="/myinfo"
            element={
              <PageGuard>
                <MyInfoPage />
              </PageGuard>
            }
          />
          <Route
            path="/marketMapList"
            element={
              <PageGuard>
                <MarketMapList />
              </PageGuard>
            }
          />
          <Route
            path="/marketDetailPage/:shopId"
            element={
              <PageGuard>
                <MarketDetailPage />
              </PageGuard>
            }
          />
          <Route
            path="/marketDetailPage/:shopId/product/:productId"
            element={
              <PageGuard>
                <ProductDetailPage />
              </PageGuard>
            }
          />
          <Route
            path="/marketDetailPage/:shopId/product/:productId/groupBuy"
            element={
              <PageGuard>
                <GroupBuyPage />
              </PageGuard>
            }
          />
          <Route
            path="/selfBuy/:shopId/product/:productId"
            element={
              <PageGuard>
                <SelfBuyPage />
              </PageGuard>
            }
          />

          {/* 없는 경로 → 홈으로 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isAuthPage &&
        !isProductDetailPage &&
        !isGroupBuyPage &&
        !isSelfBuyPage && <BottomNavBar />}
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
