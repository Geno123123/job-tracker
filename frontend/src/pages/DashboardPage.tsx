import { useEffect, useState } from "react";
import { api } from "../api/client";
import { STAGES, type Application, type StageKey } from "../types";
import AddApplicationModal from "../components/AddApplicationModal";
import ApplicationDetailModal from "../components/ApplicationDetailModal";

const ORDER: StageKey[] = ["DOCUMENT", "CODING_TEST", "INTERVIEW", "PASSED"];

function daysLeft(deadline: string | null) {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - new Date().setHours(0, 0, 0, 0);
    return Math.ceil(diff / 86400000);
}

function ProgressTrack({ status }: { status: StageKey }) {
    const reached = status === "FAILED" ? -1 : ORDER.indexOf(status);
    return (
        <div className="mt-3 flex gap-1">
            {ORDER.map((stage, i) => {
                const color = STAGES.find((s) => s.key === stage)!.color;
                return (
                    <span
                        key={stage}
                        className={`h-1 flex-1 rounded-full ${i <= reached ? color : "bg-line"}`}
                    />
                );
            })}
        </div>
    );
}

function Card({ app, onClick }: { app: Application; onClick: () => void }) {
    const d = daysLeft(app.deadline);
    const urgent = d !== null && d >= 0 && d <= 7;

    return (
        <button
            onClick={onClick}
            className="rounded-card border-line hover:border-ink/20 block w-full border bg-white p-4 text-left transition"
        >
            <div className="flex items-start justify-between gap-2">
                <h3 className="leading-snug font-medium">{app.companyName}</h3>
                {d !== null && (
                    <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs tabular-nums ${
                            urgent ? "bg-stage-document text-ink" : "text-muted"
                        }`}
                    >
                        D-{d}
                    </span>
                )}
            </div>
            <p className="text-muted mt-0.5 text-sm">{app.position}</p>
            <ProgressTrack status={app.status} />
        </button>
    );
}

function Metric({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
    return (
        <div className="rounded-card bg-white p-5">
            <p className="text-muted text-sm">{label}</p>
            <p className="font-display mt-1 text-3xl tabular-nums">
                {value}
                {suffix && <span className="text-muted ml-0.5 text-lg">{suffix}</span>}
            </p>
        </div>
    );
}

export default function DashboardPage() {
    const [apps, setApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState<Application | null>(null);

    function loadApplications() {
        return api
            .get<Application[]>("/api/applications")
            .then((res) => setApps(res.data))
            .catch(() => setError("지원 현황을 불러오지 못했습니다"))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        loadApplications();
    }, []);

    const active = apps.filter((a) => a.status !== "PASSED" && a.status !== "FAILED").length;
    const soon = apps.filter((a) => {
        const d = daysLeft(a.deadline);
        return d !== null && d >= 0 && d <= 7;
    }).length;
    const passRate = apps.length
        ? Math.round(
            (apps.filter((a) => a.status !== "DOCUMENT" && a.status !== "FAILED").length / apps.length) * 100
        )
        : 0;

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl">지원 현황</h1>
                    <p className="text-muted mt-1 text-sm">지원한 곳이 지금 어디까지 왔는지 한눈에</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-ink rounded-full px-5 py-2.5 text-sm text-white transition hover:opacity-90"
                >
                    지원 추가
                </button>
            </div>

            {loading ? (
                <p className="text-muted mt-16 text-center text-sm">불러오는 중</p>
            ) : error ? (
                <p className="mt-16 text-center text-sm text-red-600">{error}</p>
            ) : (
                <>
                    <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                        <Metric label="전체 지원" value={apps.length} suffix="곳" />
                        <Metric label="진행 중" value={active} suffix="곳" />
                        <Metric label="이번 주 마감" value={soon} suffix="건" />
                        <Metric label="서류 통과율" value={passRate} suffix="%" />
                    </section>

                    <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        {STAGES.map((stage) => {
                            const list = apps.filter((a) => a.status === stage.key);
                            return (
                                <div key={stage.key}>
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                                        <h2 className="text-sm font-medium">{stage.label}</h2>
                                        <span className="text-muted text-sm tabular-nums">{list.length}</span>
                                    </div>

                                    <div className="space-y-2">
                                        {list.length === 0 ? (
                                            <p className="border-line text-muted rounded-card border border-dashed p-4 text-center text-sm">
                                                없음
                                            </p>
                                        ) : (
                                            list.map((app) => (
                                                <Card key={app.id} app={app} onClick={() => setSelected(app)} />
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                </>
            )}

            {modalOpen && (
                <AddApplicationModal
                    onClose={() => setModalOpen(false)}
                    onCreated={loadApplications}
                />
            )}

            {selected && (
                <ApplicationDetailModal
                    app={selected}
                    onClose={() => setSelected(null)}
                    onChanged={loadApplications}
                />
            )}
        </>
    );
}