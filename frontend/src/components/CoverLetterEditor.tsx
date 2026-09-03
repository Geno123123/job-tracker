import { useState } from "react";
import { api } from "../api/client";
import type { Application, CoverLetter } from "../types";

type Props = {
  letter: CoverLetter | null;
  apps: Application[];
  onClose: () => void;
  onSaved: () => void;
};

export default function CoverLetterEditor({ letter, apps, onClose, onSaved }: Props) {
  const [question, setQuestion] = useState(letter?.question ?? "");
  const [content, setContent] = useState(letter?.content ?? "");
  const [charLimit, setCharLimit] = useState(letter?.charLimit?.toString() ?? "");
  const [applicationId, setApplicationId] = useState(letter?.applicationId?.toString() ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const limit = charLimit ? Number(charLimit) : null;
  const over = limit !== null && content.length > limit;

  async function handleSubmit() {
    if (!question.trim() || !content.trim()) {
      setError("문항과 답변을 모두 입력하세요");
      return;
    }

    setSaving(true);
    setError("");

    const body = {
      applicationId: applicationId ? Number(applicationId) : null,
      question: question.trim(),
      content: content.trim(),
      charLimit: limit,
    };

    try {
      if (letter) {
        await api.put(`/api/cover-letters/${letter.id}`, body);
      } else {
        await api.post("/api/cover-letters", body);
      }
      await onSaved();
      onClose();
    } catch {
      setError("저장에 실패했습니다");
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6 py-10"
      onClick={onClose}
    >
      <div
        className="rounded-card max-h-full w-full max-w-2xl overflow-y-auto bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-lg">{letter ? "자기소개서 수정" : "문항 추가"}</h2>

        <div className="mt-5 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm" htmlFor="app">연결할 지원 건</label>
              <select
                id="app"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                className="border-line focus:border-ink/30 mt-1.5 w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none"
              >
                <option value="">연결 안 함 (공통 문항)</option>
                {apps.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.companyName} · {app.position}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm" htmlFor="limit">글자수 제한</label>
              <input
                id="limit"
                type="number"
                value={charLimit}
                onChange={(e) => setCharLimit(e.target.value)}
                placeholder="500"
                className="border-line focus:border-ink/30 mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm" htmlFor="question">문항</label>
            <input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="지원 동기를 작성해주세요"
              autoFocus
              className="border-line focus:border-ink/30 mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-sm" htmlFor="content">답변</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="border-line focus:border-ink/30 mt-1.5 w-full resize-none rounded-xl border px-3 py-2.5 text-sm leading-relaxed outline-none"
            />
            <p
              className={`mt-1 text-right text-xs tabular-nums ${
                over ? "text-red-600" : "text-muted"
              }`}
            >
              {content.length}
              {limit !== null && ` / ${limit}`}자
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="border-line hover:bg-paper flex-1 rounded-xl border py-2.5 text-sm transition"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-ink flex-1 rounded-xl py-2.5 text-sm text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "저장 중" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}