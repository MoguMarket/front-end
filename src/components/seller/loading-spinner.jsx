// src/components/seller/loading-spinner.jsx
import React from "react";
import { Bot } from "lucide-react";

export default function AIAnalyzingLoader({
  color = "#F5B236",
  title = "AI가 분석 중이에요…",
}) {
  return (
    <div
      className="w-full min-h-[340px] max-w-[640px] mx-auto p-5"
      aria-live="polite"
      aria-busy="true"
    >
      {/* 카드 */}
      <div className="relative overflow-hidden rounded-2xl border border-black/5 shadow-lg bg-white">
        {/* 상단 헤더 */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-3">
          <div className="relative">
            {/* 로봇 + 펄스 */}
            <motion.div
              className="relative grid place-items-center w-12 h-12 rounded-full"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ backgroundColor: color }}
            >
              <Bot size={22} className="text-white" />
              <div
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: `0 0 24px 6px ${color}55` }}
              />
            </motion.div>
            {/* 외곽 리플 */}
            <Ripple color={color} />
          </div>

          <div className="flex-1">
            <div className="text-[15px] font-semibold text-neutral-900">
              {title}
            </div>
            <ThinkingDots color={color} />
          </div>
        </div>

        {/* 진행 막대 (얇은 상단 바만 유지) */}
        <div className="px-5 pb-5">
          <ProgressIndeterminate color={color} />
        </div>
      </div>
    </div>
  );
}

function ThinkingDots({ color }) {
  return (
    <div className="flex items-center gap-1 mt-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.18,
          }}
        />
      ))}
    </div>
  );
}

function ProgressIndeterminate({ color }) {
  return (
    <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}00, ${color}, ${color}00)`,
        }}
        animate={{ x: ["-120%", "120%"] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

function Ripple({ color }) {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      {[1, 2].map((r) => (
        <motion.span
          key={r}
          className="absolute block rounded-full"
          style={{
            width: 48 + r * 16,
            height: 48 + r * 16,
            border: `2px solid ${color}44`,
          }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.7, 1.05, 1.25] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeOut",
            delay: r * 0.35,
          }}
        />
      ))}
    </div>
  );
}
