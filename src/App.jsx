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

function AppContent() {
    const { pathname } = useLocation();
    const isMapPage = pathname === "/marketMapList";

    // ✅ 실제 라우트와 맞추기 (:shopId)
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

    const AUTH_PATHS = new Set([
        "/login",
        "/main-login",
        "/seller-login",
        "/firstpage",
    ]);
    const isAuthPage = AUTH_PATHS.has(pathname);

    return (
        <div className="relative w-full max-w-[390px] mx-auto bg-white">
            {!isAuthPage &&
                !isMapPage &&
                !isDetailPage &&
                !isProductDetailPage && <Header />}

            <div
                className={`min-h-screen ${
                    isAuthPage ||
                    isMapPage ||
                    isDetailPage ||
                    isProductDetailPage
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
                        path="/marketDetailPage/:shopId"
                        element={<MarketDetailPage />}
                    />
                    <Route
                        path="/marketDetailPage/:shopId/product/:productId"
                        element={<ProductDetailPage />}
                    />
                    <Route
                        path="/marketDetailPage/:shopId/product/:productId/groupBuy"
                        element={<GroupBuyPage />}
                    />
                    <Route path="/firstpage" element={<FirstPageLogin />} />
                    <Route path="/login" element={<MainLogin />} />
                    <Route path="/seller-login" element={<SellerLogin />} />
                </Routes>
            </div>
            {!isAuthPage && !isProductDetailPage && !isGroupBuyPage && (
                <BottomNavBar />
            )}
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
