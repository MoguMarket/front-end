import AiRecommendList from "../components/home/ai-recommend-list"; // AI상품추천 ui
import DeadlineProductsList from "../components/home/deadline-product-list"; // 마감임박상품 ui
import SearchBar from "../components/home/search-bar";

export default function HomePage() {
    return (
        <div>
            <SearchBar />
            <Category />
            <AiRecommendList />
            <DeadlineProductsList />
        </div>
    );
}
