import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NAV = [
  { to: "/", label: "지원 현황" },
  { to: "/cover-letters", label: "자기소개서" },
  { to: "/profile", label: "내 정보" },
];

export default function Layout() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") ?? "";

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    navigate("/login");
  }

  return (
    <div className="min-h-screen">
      <header className="border-line border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <span className="font-display text-lg">Job Tracker</span>
            <nav className="flex gap-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm transition ${
                      isActive ? "bg-paper text-ink" : "text-muted hover:text-ink"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {userName && <span className="text-muted text-sm">{userName}님</span>}
            <button
              onClick={handleLogout}
              className="text-muted hover:text-ink text-sm transition"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}