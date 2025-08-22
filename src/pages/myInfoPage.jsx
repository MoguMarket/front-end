// src/pages/myInfoPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyInfoPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    async function fetchMe() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("내 정보를 불러오지 못했습니다.");

        const json = await res.json();

        console.log(json);

        setUser(json || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  if (loading) return <p className="p-4">불러오는 중…</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!user) return <p className="p-4">사용자 정보를 찾을 수 없습니다.</p>;

  return (
    <div className="p-6">
      <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
          🙂
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-800">
            {user.nickname || "닉네임 없음"}
          </p>
          <p className="text-sm text-gray-500">{user.email || "이메일 없음"}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 w-full rounded-lg bg-red-500 text-white py-3 font-semibold hover:bg-red-600 transition"
      >
        로그아웃
      </button>
    </div>
  );
}
