import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BottomNavBar from "./components/bottomnavbar";
import Header from "./components/header";

import HomePage from "./pages/homePage";
import GiftPage from "./pages/giftPage";
import ShoppingPage from "./pages/shoppingCartPage";
import OrderPage from "./pages/orderPage";
import MyInfoPage from "./pages/myInfoPage";

function App() {
  return (
    <Router>
      <div className="relative w-full max-w-[390px] mx-auto bg-white">
        <Header />
        <div className="min-h-screen pt-16 pb-16 px-4">
          {/* 헤더에 fixed h-16고정있어서 pt-16주어야 메인영역이 보임. */}
          {/* 추후에 스크롤 관련 디자인 나오면 fixed 관련 부분 수정 필요 */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gift" element={<GiftPage />} />
            <Route path="/shopping" element={<ShoppingPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/myinfo" element={<MyInfoPage />} />
          </Routes>
        </div>
        <BottomNavBar />
      </div>
    </Router>
  );
}

export default App;
