import AiRecommendList from "../components/home/ai-recommend-list"; // AI상품추천 ui
import DeadlineProductsList from "../components/home/deadline-bar"; // 마감임박상품 ui

export default function HomePage() {
    return (
        <div>
            <AiRecommendList />
            <DeadlineProductsList />
        </div>
    );
}
