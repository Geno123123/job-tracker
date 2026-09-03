import { useState } from "react";
import { api } from "../api/client";

type Props = {
    onClose: () => void;
    onCreated: () => void;
};

export default function AddApplicationModal({ onClose, onCreated }: Props) {
    const [companyName, setCompanyName] = useState("");
    const [position, setPosition] = useState("");
    const [deadline, setDeadline] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    async function handleSubmit() {
        if (!companyName.trim() || !position.trim()) {
            setError("회사명과 직무를 입력하세요");
            return;
        }

        setSaving(true);
        setError("");

        try {
            await api.post("/api/applications", {
                companyName: companyName.trim(),
                position: position.trim(),
                deadline: deadline || null,
            });
            onCreated();
            onClose();
        } catch {
            setError("등록에 실패했습니다");
            setSaving(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6"
            onClick={onClose}
        >
            <div
                className="rounded-card w-full max-w-sm bg-white p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="font-display text-lg">지원 추가</h2>

                <div className="mt-5 space-y-3">
                    <div>
                        <label className="text-sm" htmlFor="company">회사명</label>
                        <input
                            id="company"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="네이버"
                            autoFocus
                            className="border-line focus:border-ink/30 mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm" htmlFor="position">직무</label>
                        <input
                            id="position"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            placeholder="백엔드 개발"
                            className="border-line focus:border-ink/30 mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm" htmlFor="deadline">마감일</label>
                        <input
                            id="deadline"
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="border-line focus:border-ink/30 mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>

                <div className="mt-6 flex gap-2">
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