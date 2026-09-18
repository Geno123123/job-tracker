import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit() {
    if (!email || !password || !name) {
      setError("모든 항목을 입력하세요");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/api/auth/signup", { email, password, name });
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("userName", res.data.name);
      navigate("/");
    } catch (err: any) {
      const message = err.response?.data?.message ?? "회원가입에 실패했습니다";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl">Job Tracker</h1>
        <p className="text-muted mt-1 text-sm">계정을 만들고 지원 현황을 관리하세요</p>

        <div className="rounded-card border-line mt-8 space-y-3 border bg-white p-6">
          <div>
            <label className="text-sm" htmlFor="name">이름</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이승준"
              autoFocus
              className="border-line focus:border-ink/30 mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
            />
          </div>

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
              placeholder="8자 이상"
              className="border-line focus:border-ink/30 mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-ink w-full rounded-xl py-2.5 text-sm text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "가입 중" : "회원가입"}
          </button>
        </div>

        <p className="text-muted mt-4 text-center text-sm">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="text-ink underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}