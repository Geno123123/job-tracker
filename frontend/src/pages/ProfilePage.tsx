import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Profile, PortfolioLink } from "../types";

const FIELDS = [
  { key: "school", label: "학교", placeholder: "세종대학교" },
  { key: "major", label: "전공", placeholder: "컴퓨터공학" },
  { key: "studentId", label: "학번", placeholder: "21012811" },
  { key: "phone", label: "연락처", placeholder: "010-0000-0000" },
  { key: "desiredPosition", label: "희망 직무", placeholder: "백엔드 개발" },
] as const;

type Form = {
  school: string;
  major: string;
  studentId: string;
  phone: string;
  desiredPosition: string;
  introduction: string;
};

const EMPTY: Form = {
  school: "",
  major: "",
  studentId: "",
  phone: "",
  desiredPosition: "",
  introduction: "",
};

export default function ProfilePage() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [links, setLinks] = useState<PortfolioLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    Promise.all([
      api
        .get<Profile>("/api/profile")
        .then((res) => {
          const p = res.data;
          setForm({
            school: p.school ?? "",
            major: p.major ?? "",
            studentId: p.studentId ?? "",
            phone: p.phone ?? "",
            desiredPosition: p.desiredPosition ?? "",
            introduction: p.introduction ?? "",
          });
        })
        .catch(() => {
          // 프로필이 아직 없으면 빈 폼으로 시작
        }),
      api
        .get<PortfolioLink[]>("/api/portfolio-links")
        .then((res) => setLinks(res.data))
        .catch(() => setError("포트폴리오 링크를 불러오지 못했습니다")),
    ]).finally(() => setLoading(false));
  }, []);

  function update(key: keyof Form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await api.put("/api/profile", form);
      setSaved(true);
    } catch {
      setError("저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  }

  async function addLink() {
    if (!newLabel.trim() || !newUrl.trim()) return;
    try {
      await api.post("/api/portfolio-links", {
        label: newLabel.trim(),
        url: newUrl.trim(),
      });
      const res = await api.get<PortfolioLink[]>("/api/portfolio-links");
      setLinks(res.data);
      setNewLabel("");
      setNewUrl("");
    } catch {
      setError("링크 추가에 실패했습니다");
    }
  }

  async function deleteLink(id: number) {
    try {
      await api.delete(`/api/portfolio-links/${id}`);
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setError("링크 삭제에 실패했습니다");
    }
  }

  if (loading) {
    return <p className="text-muted mt-16 text-center text-sm">불러오는 중</p>;
  }

  return (
    <>
      <h1 className="font-display text-2xl">내 정보</h1>
      <p className="text-muted mt-1 text-sm">지원서에 반복해서 쓰는 정보를 저장해두세요</p>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <section className="rounded-card bg-white p-6 lg:col-span-2">
          <h2 className="font-medium">기본 정보</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <div key={field.key}>
                <label className="text-sm" htmlFor={field.key}>
                  {field.label}
                </label>
                <input
                  id={field.key}
                  value={form[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="border-line focus:border-ink/30 mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
                />
              </div>
            ))}
          </div>

          <div className="mt-3">
            <label className="text-sm" htmlFor="introduction">
              한 줄 소개
            </label>
            <textarea
              id="introduction"
              value={form.introduction}
              onChange={(e) => update("introduction", e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="어떤 개발자인지 짧게 적어보세요"
              className="border-line focus:border-ink/30 mt-1.5 w-full resize-none rounded-xl border px-3 py-2.5 text-sm outline-none"
            />
            <p className="text-muted mt-1 text-right text-xs tabular-nums">
              {form.introduction.length} / 500
            </p>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-ink rounded-xl px-6 py-2.5 text-sm text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "저장 중" : "저장"}
            </button>
            {saved && <span className="text-muted text-sm">저장됨</span>}
          </div>
        </section>

        <section className="rounded-card bg-white p-6">
          <h2 className="font-medium">포트폴리오 링크</h2>

          <div className="mt-4 space-y-2">
            {links.length === 0 ? (
              <p className="text-muted text-sm">아직 등록한 링크가 없습니다</p>
            ) : (
              links.map((link) => (
                <div
                  key={link.id}
                  className="border-line flex items-center gap-2 rounded-xl border px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted hover:text-ink block truncate text-xs transition"
                    >
                    {link.url}
                    </a>
                  </div>
                  <button
                    onClick={() => deleteLink(link.id)}
                    aria-label={`${link.label} 삭제`}
                    className="text-muted shrink-0 text-sm transition hover:text-red-600"
                  >
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="border-line mt-4 space-y-2 border-t pt-4">
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="GitHub"
              className="border-line focus:border-ink/30 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
            />
            <input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addLink()}
              placeholder="https://github.com/..."
              className="border-line focus:border-ink/30 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
            />
            <button
              onClick={addLink}
              className="border-line hover:bg-paper w-full rounded-xl border py-2.5 text-sm transition"
            >
              링크 추가
            </button>
          </div>
        </section>
      </div>
    </>
  );
}