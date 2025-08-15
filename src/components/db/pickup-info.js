// file: pickup-info.js

export const PICKUP_WAITING_ORDERS = [
    {
        id: "201",
        shopId: 101, // 신평 과일가게
        marketName: "신평 과일가게",
        productName: "국내산 감자",
        weightLabel: "2kg",
        imageUrl:
            "https://www.saenong.com/assets/upload/detailimage1/20240709_7874794413310.jpg",
        discountRate: 0.1,
        price: 5480,
        originalPrice: 6089,
        status: "READY_FOR_PICKUP",
        stepLabel: "3.0kg",
        progress: { currentKg: 12.0, maxKg: 15 },
        cancellable: true,
    },
    {
        id: "202",
        shopId: 102, // 새마을 채소가게
        marketName: "새마을 채소가게",
        productName: "유기농 당근",
        weightLabel: "1kg",
        imageUrl:
            "https://www.saenong.com/assets/upload/detailimage1/20240709_7874794413310.jpg",
        discountRate: 0.15,
        price: 4500,
        originalPrice: 5290,
        status: "READY_FOR_PICKUP",
        stepLabel: "2.0kg",
        progress: { currentKg: 5.0, maxKg: 8 },
        cancellable: true,
    },
    {
        id: "203",
        shopId: 103, // 공단 청과점
        marketName: "공단 청과점",
        productName: "신선한 상추",
        weightLabel: "500g",
        imageUrl:
            "https://www.saenong.com/assets/upload/detailimage1/20240709_7874794413310.jpg",
        discountRate: 0.05,
        price: 1980,
        originalPrice: 2080,
        status: "READY_FOR_PICKUP",
        stepLabel: "1.0kg",
        progress: { currentKg: 3.5, maxKg: 4 },
        cancellable: false,
    },
    {
        id: "204",
        shopId: 104, // 금오 버섯가게
        marketName: "금오 버섯가게",
        productName: "손질한 오징어",
        weightLabel: "1kg",
        imageUrl:
            "https://www.saenong.com/assets/upload/detailimage1/20240709_7874794413310.jpg",
        discountRate: 0.2,
        price: 8800,
        originalPrice: 11000,
        status: "READY_FOR_PICKUP",
        stepLabel: "5.0kg",
        progress: { currentKg: 6.0, maxKg: 10 },
        cancellable: true,
    },
    {
        id: "205",
        shopId: 105, // 선산봉황 과일가게
        marketName: "선산봉황 과일가게",
        productName: "아카시아 꿀",
        weightLabel: "500g",
        imageUrl:
            "https://www.saenong.com/assets/upload/detailimage1/20240709_7874794413310.jpg",
        discountRate: 0.12,
        price: 7200,
        originalPrice: 8200,
        status: "READY_FOR_PICKUP",
        stepLabel: "1.5kg",
        progress: { currentKg: 2.0, maxKg: 3 },
        cancellable: false,
    },
    {
        id: "206",
        shopId: 106, // 원평 채소가게
        marketName: "원평 채소가게",
        productName: "활전복",
        weightLabel: "1kg",
        imageUrl:
            "https://www.saenong.com/assets/upload/detailimage1/20240709_7874794413310.jpg",
        discountRate: 0.18,
        price: 32000,
        originalPrice: 39000,
        status: "READY_FOR_PICKUP",
        stepLabel: "2.5kg",
        progress: { currentKg: 4.0, maxKg: 6 },
        cancellable: true,
    },
    {
        id: "207",
        shopId: 107, // 인동 채소가게
        marketName: "인동 채소가게",
        productName: "청송 사과",
        weightLabel: "3kg",
        imageUrl:
            "https://www.saenong.com/assets/upload/detailimage1/20240709_7874794413310.jpg",
        discountRate: 0.08,
        price: 9800,
        originalPrice: 10600,
        status: "READY_FOR_PICKUP",
        stepLabel: "6.0kg",
        progress: { currentKg: 8.0, maxKg: 12 },
        cancellable: true,
    },
    {
        id: "208",
        shopId: 108, // 옥계 농산물가게
        marketName: "옥계 농산물가게",
        productName: "찰옥수수",
        weightLabel: "10개입",
        imageUrl:
            "https://www.saenong.com/assets/upload/detailimage1/20240709_7874794413310.jpg",
        discountRate: 0.25,
        price: 12000,
        originalPrice: 16000,
        status: "READY_FOR_PICKUP",
        stepLabel: "4.0kg",
        progress: { currentKg: 7.0, maxKg: 9 },
        cancellable: false,
    },
];
