// components/common/payment-button.jsx
export default function PaymentButton({ onClick }) {
  return (
    <div className="fixed bottom-0 max-w-[390px] mx-auto w-full bg-[#f5f5f5] py-2 px-4">
      <button
        type="button"
        onClick={onClick}
        className="w-full bg-[#4CC554] text-white font-bold py-3 rounded-xl"
      >
        결제하기
      </button>
    </div>
  );
}
