import { useState } from "react";
import { api } from "../api/client";
import { STAGES, type Application, type StageKey } from "../types";

type Props = {
    app: Application;
    onClose: () => void;
    onChanged: () => void;
};

export default function ApplicationDetailModal({ app, onClose, onChanged }: Props) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function changeStatus(status: StageKey) {
        if (status === app.status) return;

        setBusy(true);
        setError("");
        try {
            await api.patch(`/api/applications/${app.id}/status`, { status });
            await onChanged();
            onClose();
        } catch {
            setError("변경에 실패했습니다");
            setBusy(false);
        }
    }

    async function handleDelete() {
        if (!confirm(`${app.companyName} 지원 건을 삭제할까요?`)) return;

        setBusy(true);
        setError("");
        try {
            await api.delete(`/api/applications/${app.id}`);
            await onChanged();
            onClose();
        } catch {
            setError("삭제에 실패했습니다");
            setBusy(false);
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
                <h2 className="font-display text-lg">{app.companyName}</h2>
                <p className="text-muted mt-0.5 text-sm">{app.position}</p>
                {app.deadline && (
                    <p className="text-muted mt-1 text-sm tabular-nums">마감 {app.deadline}</p>
                )}

                <p className="mt-6 text-sm font-medium">단계 변경</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                    {STAGES.map((stage) => {
                        const current = stage.key === app.status;
                        return (
                            <button
                                key={stage.key}
                                onClick={() => changeStatus(stage.key)}
                                disabled={busy}
                                className={`rounded-xl py-2.5 text-sm transition disabled:opacity-50 ${
                                    current
                                        ? `${stage.color} text-ink`
                                        : "border-line hover:bg-paper border"
                                }`}
                            >
                                {stage.label}
                            </button>
                        );
                    })}
                </div>

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

                <div className="border-line mt-6 flex gap-2 border-t pt-4">
                    <button
                        onClick={handleDelete}
                        disabled={busy}
                        className="flex-1 rounded-xl py-2.5 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                        삭제
                    </button>
                    <button
                        onClick={onClose}
                        className="border-line hover:bg-paper flex-1 rounded-xl border py-2.5 text-sm transition"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}