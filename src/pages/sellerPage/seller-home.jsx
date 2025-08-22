import SellerHeader from "../../components/sellerDetail/seller-header.jsx";

export default function SellerHomePage() {
    return (
        <>
            <SellerHeader
                liked
                onToggleLike={() => console.log("like toggle")}
            />
            <main className="pt-12 max-w-[390px] mx-auto">
                <p>판매자 상세 내용...</p>
            </main>
        </>
    );
}
