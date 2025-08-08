import { useMemo } from "react";
import { useFilters } from "./filters-context";
import { useState } from "react";
import Slider from "react-slick";
import recommendedItems from "../data/recommendedItems";
import { useUserContext } from "../contexts/user-context";
import ProductCard from "./product-card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function AiRecommendList() {
    const { name } = useUserContext();
    const [items, setItems] = useState(recommendedItems);

    const toggleLike = (id) => {
        const updated = items.map((item) =>
            item.id === id ? { ...item, liked: !item.liked } : item
        );
        setItems(updated);
    };

    const handleMarketClick = () => {
        console.log("시장 페이지로 이동");
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
    };

    return (
        <div className="px-2 py-6 font-[Pretendard] tracking-[-0.025em]">
            <h3 className="text-lg font-semibold mb-4">
                {name}님을 위한{" "}
                <span className="text-green-600">AI 추천 상품</span>
            </h3>

            <Slider {...settings}>
                {items.map((item) => (
                    <ProductCard
                        key={item.id}
                        name={item.name}
                        weight={item.weight}
                        price={item.price}
                        originalPrice={item.originalPrice}
                        discount={item.discount}
                        rating={item.rating}
                        reviews={item.reviews}
                        liked={item.liked}
                        imageUrl={
                            "https://www.saenong.com/assets/upload/detailimage1/20240709_7874794413310.jpg"
                        }
                        market="구미새마을중앙시장"
                        onClickMarket={handleMarketClick}
                        onToggleLike={() => toggleLike(item.id)}
                        daysLeft={item.daysLeft}
                    />
                ))}
            </Slider>
        </div>
    );
}
