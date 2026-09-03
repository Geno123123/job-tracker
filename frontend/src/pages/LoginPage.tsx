import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { LoginResponse } from "../types";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit() {
        if (!email || !password) {
            setError("이메일과 비밀번호를 입력하세요");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await api.post<LoginResponse>("/api/auth/login", { email, password });
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("userName", res.data.name);
            navigate("/");
        } catch {
            setError("이메일 또는 비밀번호를 확인하세요");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <h1 className="font-display text-2xl">Job Tracker</h1>
                <p className="text-muted mt-1 text-sm">지원 현황을 한 곳에서 관리하세요</p>

                <div className="rounded-card border-line mt-8 space-y-3 border bg-white p-6">
                    <div>
                        <label className="text-sm" htmlFor="email">이메일</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="border-line focus:border-ink/30 mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm" htmlFor="password">비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            className="border-line focus:border-ink/30 mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-ink w-full rounded-xl py-2.5 text-sm text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? "로그인 중" : "로그인"}
                    </button>
                </div>
            </div>
        </div>
    );
}