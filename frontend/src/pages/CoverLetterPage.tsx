import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Application, CoverLetter } from "../types";
import CoverLetterEditor from "../components/CoverLetterEditor";

export default function CoverLetterPage() {
  const [letters, setLetters] = useState<CoverLetter[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<CoverLetter | null>(null);
  const [creating, setCreating] = useState(false);

  function loadLetters(search = "") {
    const url = search.trim()
      ? `/api/cover-letters?keyword=${encodeURIComponent(search.trim())}`
      : "/api/cover-letters";

    return api
      .get<CoverLetter[]>(url)
      .then((res) => setLetters(res.data))
      .catch(() => setError("자기소개서를 불러오지 못했습니다"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadLetters();
    api
      .get<Application[]>("/api/applications")
      .then((res) => setApps(res.data))
      .catch(() => {});
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("이 자기소개서를 삭제할까요?")) return;
    try {
      await api.delete(`/api/cover-letters/${id}`);
      setLetters((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setError("삭제에 실패했습니다");
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">자기소개서</h1>
          <p className="text-muted mt-1 text-sm">한 번 쓴 답변은 다음 지원에서 다시 꺼내 쓰세요</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="bg-ink rounded-full px-5 py-2.5 text-sm text-white transition hover:opacity-90"
        >
          문항 추가
        </button>
      </div>

      <div className="mt-8 flex gap-2">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadLetters(keyword)}
          placeholder="문항 검색 (예: 지원동기)"
          className="border-line focus:border-ink/30 flex-1 rounded-xl border bg-white px-4 py-2.5 text-sm outline-none"
        />
        <button
          onClick={() => loadLetters(keyword)}
          className="border-line hover:bg-white rounded-xl border px-5 py-2.5 text-sm transition"
        >
          검색
        </button>
        {keyword && (
          <button
            onClick={() => {
              setKeyword("");
              loadLetters();
            }}
            className="text-muted hover:text-ink px-3 text-sm transition"
          >
            초기화
          </button>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-muted mt-16 text-center text-sm">불러오는 중</p>
      ) : letters.length === 0 ? (
        <div className="border-line rounded-card mt-6 border border-dashed p-12 text-center">
          <p className="text-muted text-sm">
            {keyword ? "검색 결과가 없습니다" : "첫 자기소개서 문항을 추가해보세요"}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {letters.map((letter) => (
            <article key={letter.id} className="rounded-card border-line border bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {letter.companyName && (
                    <span className="bg-paper text-muted rounded-full px-2.5 py-1 text-xs">
                      {letter.companyName}
                    </span>
                  )}
                  <h2 className={`font-medium ${letter.companyName ? "mt-2" : ""}`}>
                    {letter.question}
                  </h2>
                  <p className="text-muted mt-2 line-clamp-3 text-sm whitespace-pre-wrap">
                    {letter.content}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-muted text-xs tabular-nums">
                    {letter.charCount}
                    {letter.charLimit ? ` / ${letter.charLimit}` : ""}자
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(letter)}
                      className="text-muted hover:text-ink text-sm transition"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(letter.id)}
                      className="text-muted text-sm transition hover:text-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {(creating || editing) && (
        <CoverLetterEditor
          letter={editing}
          apps={apps}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => loadLetters(keyword)}
        />
      )}
    </>
  );
}