import React, { useState } from "react";
import Slider from "react-slick";
import recommendedItems from "../../data/recommendedItems";
import { useUserContext } from "../../contexts/userContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaHeart } from "react-icons/fa";

function RecommendedSlider() {
    const { name } = useUserContext();
    const [items, setItems] = useState(recommendedItems);

    const toggleLike = (id) => {
        const updated = items.map((item) =>
            item.id === id ? { ...item, liked: !item.liked } : item
        );
        setItems(updated);
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
    };

    return (
        <div className="px-4 py-6 font-[Pretendard] tracking-[-0.025em]">
            <h3 className="text-lg font-semibold mb-4">
                {name}님을 위한{" "}
                <span className="text-green-600">AI 추천 상품</span>
            </h3>

            <Slider {...settings}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="p-2 bg-white rounded-lg shadow-md relative mx-2"
                    >
                        <img
                            src={
                                "https://www.saenong.com/assets/upload/detailimage1/20240709_7874794413310.jpg"
                            }
                            alt={item.name}
                            className="rounded-md"
                        />

                        <div
                            className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow cursor-pointer"
                            onClick={() => toggleLike(item.id)}
                        >
                            <FaHeart
                                className={`text-sm ${
                                    item.liked
                                        ? "text-red-500"
                                        : "text-gray-300"
                                }`}
                            />
                        </div>

                        <div className="mt-2 text-sm text-green-600">
                            구미새마을중앙시장
                        </div>
                        <div className="text-sm font-medium">
                            {item.name} {item.weight}
                        </div>
                        <div className="mt-1 flex gap-1 items-center">
                            <span className="text-red-600 font-bold">
                                {item.discount}%
                            </span>
                            <span className="font-semibold">
                                {item.price.toLocaleString()}원
                            </span>
                        </div>
                        <div className="text-xs text-yellow-500 mt-1">
                            ⭐ {item.rating} ({item.reviews})
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default RecommendedSlider;
