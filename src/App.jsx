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
import SellerHeader from "./components/seller/seller-header.jsx";

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
import SellerHomePage from "./pages/sellerPage/seller-home.jsx";
import SelfBuyPage from "./pages/produckDetailPage/selfBuyPage.jsx";
import SellerBottomNav from "./components/seller/seller-navbar.jsx";
import AddProduct from "./pages/sellerPage/add-product.jsx";
import SellerSalesPage from "./pages/sellerPage/seller-sales.jsx";
import AddSales from "./pages/sellerPage/add-sales.jsx";
import AddSalesAI from "./pages/sellerPage/add-sales-ai.jsx"; // ✅ 추가

import PageGuard from "./components/router/PageGaurd.jsx";
import Register from "./pages/loginPage/register.jsx";

function AppContent() {
    const { pathname } = useLocation();

    const isMapPage = pathname === "/marketMapList";

    const matchMarketDetail = useMatch("/marketDetailPage/:shopId");
    const isDetailPage = Boolean(matchMarketDetail);

    const isSellerPage =
        pathname === "/seller-home" || pathname.startsWith("/seller");

    const matchProductDetail = useMatch(
        "/marketDetailPage/:shopId/product/:productId"
    );
    const isProductDetailPage = Boolean(matchProductDetail);

    const matchGroupBuyPage = useMatch(
        "/marketDetailPage/:shopId/product/:productId/groupBuy"
    );
    const isGroupBuyPage = Boolean(matchGroupBuyPage);

    const matchSelfBuyPage = useMatch("/selfBuy/:shopId/product/:productId");
    const isSelfBuyPage = Boolean(matchSelfBuyPage);

    const isSearchPage = pathname === "/search";

    // 인증 관련 경로
    const AUTH_PATHS = new Set([
        "/login",
        "/main-login",
        "/seller-login",
        "/firstpage",
        "/register",
    ]);
    const isAuthPage = AUTH_PATHS.has(pathname);

    // add-product 플래그
    const isAddProduct =
        pathname === "/seller/add-product" || pathname === "/add-product";

    // 헤더 노출 여부
    const showHeader =
        !isAuthPage &&
        !isMapPage &&
        !isDetailPage &&
        !isProductDetailPage &&
        !isSearchPage;

    return (
        <div className="relative w-full max-w-[390px] mx-auto bg-white">
            <ShopIdSync />

            {/* 헤더 분기 */}
            {showHeader &&
                (isAddProduct || isSellerPage ? <SellerHeader /> : <Header />)}

            <div
                className={`min-h-screen ${showHeader ? "pt-16" : ""} ${
                    isAuthPage ||
                    isMapPage ||
                    isDetailPage ||
                    isProductDetailPage
                        ? ""
                        : "pb-16 px-4"
                }`}
            >
                <Routes>
                    {/* 공개 경로 */}
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/firstpage" element={<FirstPageLogin />} />
                    <Route path="/login" element={<MainLogin />} />
                    <Route path="/seller-login" element={<SellerLogin />} />
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
                    {/* 셀러 영역 */}
                    <Route path="/seller-home" element={<SellerHomePage />} />
                    <Route
                        path="/seller/add-product"
                        element={<AddProduct />}
                    />
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route path="/seller/sales" element={<SellerSalesPage />} />
                    <Route path="/seller/add-sales" element={<AddSales />} />
                    <Route
                        path="/seller/add-sales-ai"
                        element={<AddSalesAI />}
                    />{" "}
                    {/* ✅ 추가 */}
                    {/* 셀프바이 */}
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

            {/* 바텀네비 */}
            {!isAuthPage &&
                !isProductDetailPage &&
                !isGroupBuyPage &&
                !isSelfBuyPage &&
                !isAddProduct &&
                (isSellerPage ? <SellerBottomNav /> : <BottomNavBar />)}
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
