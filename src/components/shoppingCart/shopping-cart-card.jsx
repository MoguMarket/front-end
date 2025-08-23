import React from "react";
import { X } from "lucide-react";

export default function ShoppingCartCard({ item, onDelete }) {
  if (!item) return null;

  return (
    <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-xl bg-white relative">
      <img
        src={item.imageUrl}
        alt={item.productName}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 line-clamp-1">
          {item.productName}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {item.unitPrice.toLocaleString()}원 × {item.quantity}
        </p>
        <p className="text-sm font-medium text-green-600 mt-1">
          합계: {item.lineTotal.toLocaleString()}원
        </p>
      </div>

      <button
        onClick={() => onDelete?.(item.productId)}
        className="p-1 rounded-full hover:bg-gray-100 transition"
        aria-label="삭제"
      >
        <X size={16} className="text-gray-500" />
      </button>
    </div>
  );
}
