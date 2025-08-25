// AIAnalyzingLoader.js
import React from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const DEFAULT_PROMPT = `당신은 전통시장 ‘상품 등록’ 컨설턴트이자 가격 분석가입니다.
아래 입력값을 바탕으로 **가격 추천**과 **필드별 수정 제안**을 생성하세요.
반드시 **아래 JSON 스키마만** 반환하고, JSON 외 텍스트는 금지합니다.
각 reason은 최대 2줄을 넘기지 마세요.`;

export default function AIAnalyzingLoader({
    color = "#F5B236",
    title = "AI가 분석 중이에요…",
    prompt = DEFAULT_PROMPT,
}) {
    console.log("dfffffff");
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

                {/* 진행 막대 */}
                <div className="px-5">
                    <ProgressIndeterminate color={color} />
                </div>

                {/* 본문 */}
                <div className="px-5 pb-5 pt-3">
                    <div className="rounded-xl border bg-neutral-50">
                        <div className="flex items-center justify-between px-4 py-2">
                            <span className="text-[13px] font-medium text-neutral-700">
                                분석 대상 프롬프트
                            </span>
                            <span
                                className="text-[11px] px-2 py-1 rounded-md font-semibold"
                                style={{
                                    backgroundColor: `${color}22`,
                                    color: "#0f172a",
                                }}
                            >
                                AI 검토 중
                            </span>
                        </div>
                        <div className="border-t">
                            <CodePanel color={color} text={prompt} />
                        </div>
                    </div>

                    {/* 웨이브 시각화 */}
                    <div className="mt-5">
                        <WaveBars color={color} />
                    </div>
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

function CodePanel({ text, color }) {
    return (
        <div className="relative">
            <div
                className="absolute inset-x-0 top-0 h-[2px]"
                style={{
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                }}
            />
            <pre className="max-h-48 overflow-auto text-[12.5px] leading-relaxed px-4 py-3 bg-white/90 text-neutral-800 whitespace-pre-wrap">
                {text}
            </pre>
        </div>
    );
}

function WaveBars({ color }) {
    const bars = 24;
    const base = [8, 16, 10, 22, 12, 18, 14, 28];
    return (
        <div className="w-full h-16 flex items-end gap-[6px] rounded-xl bg-gradient-to-b from-white to-neutral-50 p-3 border">
            {Array.from({ length: bars }).map((_, idx) => {
                const h = base[idx % base.length];
                return (
                    <motion.div
                        key={idx}
                        className="w-[6px] rounded-sm"
                        style={{ backgroundColor: color }}
                        initial={{ height: h * 0.6 }}
                        animate={{ height: [h * 0.6, h * 1.5, h * 0.7] }}
                        transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: idx * 0.04,
                        }}
                    />
                );
            })}
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
