// src/pages/homePage.jsx
import { FilterProvider } from "../components/home/filters-context";
import SearchBar from "../components/home/search-bar";
import CategoryFilter from "../components/home/category-filter";
import AiRecommendList from "../components/home/ai-recommend-list";
import DeadlineProductsList from "../components/home/deadline-bar";

const ALL_CATEGORIES = [
    "농산",
    "수산",
    "축산",
    "떡/과자",
    "가공식품",
    "건강식품",
    "동물용품",
    "반찬",
    "욕실",
    "의류/잡화",
    "주방",
];

export default function HomePage() {
    const initialFavorites = ["농산", "수산", "축산", "떡/과자"];
    const saveFavorites = async (favs) => {
        try {
            console.log("save favorites", favs);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <FilterProvider
            allCategories={ALL_CATEGORIES}
            initialFavorites={initialFavorites}
            onSaveFavorites={saveFavorites}
            userKey="guest"
        >
            <div className="px-4">
                <SearchBar />
                <CategoryFilter />
                <AiRecommendList />
                <DeadlineProductsList />
            </div>
        </FilterProvider>
    );
}
