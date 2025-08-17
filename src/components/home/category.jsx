import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const MAX_FAV = 8;

/**
 * props:
 * - selectedCategory: string|null
 * - onToggleCategory: (name: string) => void
 */
export default function CategoryFilterSimple({
  selectedCategory = null,
  onToggleCategory,
}) {
  // 초기 더미 데이터
  const [favorites, setFavorites] = useState([
    "농산",
    "수산",
    "축산",
    "떡/과자",
  ]);
  const [others, setOthers] = useState([
    "가공식품",
    "건강식품",
    "동물용품",
    "반찬",
    "욕실",
    "의류/잡화",
    "주방",
  ]);

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  // 즐겨찾기 편집 동작
  const addFav = (c) => {
    if (favorites.includes(c) || favorites.length >= MAX_FAV) return;
    setFavorites((prev) => [...prev, c]);
    setOthers((prev) => prev.filter((x) => x !== c));
  };
  const removeFav = (c) => {
    setFavorites((prev) => prev.filter((x) => x !== c));
    setOthers((prev) => (prev.includes(c) ? prev : [...prev, c]));
  };

  // 클릭 시 동작: 편집 모드면 편집, 아니면 선택 토글
  const handleClickFav = (c) => {
    if (edit) return removeFav(c);
    onToggleCategory?.(c);
  };
  const handleClickOther = (c) => {
    if (edit) return addFav(c);
    onToggleCategory?.(c);
  };

  return (
    <section className="mt-5">
      {/* 헤더 */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold">카테고리</h3>
        <button
          type="button"
          aria-label={open ? "카테고리 접기" : "카테고리 더보기"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Minus size={18} /> : <Plus size={18} />}
        </button>
      </div>

      {/* 즐겨찾기(상단 라인) */}
      <div className="flex flex-wrap gap-2 pb-1">
        {favorites.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => handleClickFav(c)}
            className={`px-4 py-2 rounded-full border shrink-0 text-sm
              ${
                edit
                  ? "bg-green-50 text-green-700 border-green-500"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              } ${
              !edit && selectedCategory === c ? "ring-2 ring-[#4CC554]/60" : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 펼침 영역 (추가 카테고리) — 왼쪽 정렬 */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out text-sm py-1 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div>
            <div className="flex flex-wrap gap-2">
              {others.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleClickOther(c)}
                  className={`px-4 py-2 rounded-full border
                    ${
                      edit
                        ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        : "bg-white text-gray-700 border-gray-200"
                    } ${
                    !edit && selectedCategory === c
                      ? "ring-2 ring-[#4CC554]/60"
                      : ""
                  }`}
                  disabled={edit && favorites.length >= MAX_FAV}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* 편집 스위치 */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-gray-700">즐겨찾기 편집</span>
              <button
                type="button"
                onClick={() => setEdit((v) => !v)}
                aria-pressed={edit}
                className={`w-11 h-6 rounded-full relative transition ${
                  edit ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition ${
                    edit ? "translate-x-5" : ""
                  }`}
                />
              </button>
              <span className="text-xs text-gray-400">
                {favorites.length}/{MAX_FAV}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
