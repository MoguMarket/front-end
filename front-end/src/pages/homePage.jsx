import Header from "../components/header";
import Bottomnavbar from "../components/bottomnavbar";
import RecommendedSlider from "../components/recommended/recommendedSlider";

export default function HomePage() {
    return (
        <div>
            <Header />
            <p className="px-4 py-2">홈 페이지입니다.</p>

            <RecommendedSlider />

            <Bottomnavbar />
        </div>
    );
}
