// src/components/common/payment-button.jsx
import { useSearchParams } from "react-router-dom";

export default function PaymentButton({ onClick }) {
  const [sp] = useSearchParams();
  const isGift = sp.get("from") === "gift";

  return (
    <div className="fixed inset-x-0 bottom-0">
      <div className="mx-auto w-full max-w-[360px] bg-[#f5f5f5] py-2 px-4">
        <button
          type="button"
          onClick={onClick}
          className={`w-full font-bold py-3 rounded-xl ${
            isGift ? "bg-[#F5B236] text-white" : "bg-[#4CC554] text-white"
          }`}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}
