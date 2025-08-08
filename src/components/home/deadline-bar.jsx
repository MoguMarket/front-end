import { useState } from "react";
import Slider from "react-slick";
import deadlineItems from "../data/deadlineItems";
import { useUserContext } from "../contexts/user-context";
import ProductCard from "./product-card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function AiRecommendList() {
    const [items, setItems] = useState(deadlineItems);

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
        <div className="px-2 pt-2 pb-0">
            <h2 className="mt-0 mb-2 text-base md:text-lg font-semibold leading-snug tracking-[-0.025em]">
                마감이 임박한 상품이에요!
            </h2>

            <Slider {...settings}>
                {items.map((item) => (
                    <ProductCard
                        key={item.id}
                        name={item.name}
                        weight={item.weight}
                        price={item.price ?? item.discountedPrice}
                        originalPrice={item.originalPrice}
                        discount={item.discount ?? item.discountRate}
                        rating={item.rating}
                        reviews={item.reviews ?? item.reviewCount}
                        liked={item.liked}
                        imageUrl={
                            item.imageUrl ||
                            "https://www.saenong.com/assets/upload/detailimage1/20240709_7874794413310.jpg"
                        }
                        market={item.marketName ?? "구미새마을중앙시장"}
                        onClickMarket={handleMarketClick}
                        onToggleLike={() => toggleLike(item.id)}
                        daysLeft={item.daysLeft}
                    />
                ))}
            </Slider>
        </div>
    );
}
