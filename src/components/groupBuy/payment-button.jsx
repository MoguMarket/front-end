// components/common/payment-button.jsx
export default function PaymentButton({ onClick }) {
  return (
    <div className="fixed inset-x-0 bottom-0">
      {" "}
      {/* ← 좌우 0으로 고정 */}
      <div className="mx-auto w-full max-w-[360px] bg-[#f5f5f5] py-2 px-4">
        <button
          type="button"
          onClick={onClick}
          className="w-full bg-[#4CC554] text-white font-bold py-3 rounded-xl"
        >
          결제하기
        </button>
      </div>
    </div>
  );
}
