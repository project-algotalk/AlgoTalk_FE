import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithCredentials } from "../../api/authApi";
import api from "../../api/axiosInstance";
import { fetchAdminStatus } from "../../api/adminApi";
import useAuthStore from "../../store/authStore";
import "./AdminPages.css";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { authStatus, login, logout } = useAuthStore();
  const [form, setForm] = useState({ loginId: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    let active = true;
    fetchAdminStatus()
      .then((status) => {
        if (active)
          navigate(
            status.approvalStatus === "APPROVED" ? "/admin" : "/admin/status",
            { replace: true },
          );
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [authStatus, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.loginId.trim() || !form.password) {
      setError("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const me = await loginWithCredentials(form);
      let adminStatus;
      try {
        adminStatus = await fetchAdminStatus();
      } catch {
        await api.post("/user/v1/logout").catch(() => {});
        logout();
        setError("관리자 계정으로만 로그인할 수 있습니다.");
        return;
      }
      sessionStorage.removeItem("logged-out");
      login({ user: me });
      navigate(
        adminStatus.approvalStatus === "APPROVED" ? "/admin" : "/admin/status",
        { replace: true },
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "아이디 또는 비밀번호를 확인해 주세요.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-brand-panel">
        <Link to="/" className="admin-brand admin-brand-light">
          <span>A</span>AlgoTalk
        </Link>
        <div>
          <div className="admin-intro-badge">
            <ShieldCheck size={18} /> ADMIN PORTAL
          </div>
          <h1>
            AlgoTalk을 더 안전하고
            <br />
            가치 있게 운영하세요.
          </h1>
          <p>
            관리자 전용 서비스입니다.
            <br />
            승인된 관리자 계정으로 로그인해 주세요.
          </p>
        </div>
        <small>© AlgoTalk. Admin access only.</small>
      </section>
      <section className="admin-login-form-panel">
        <button className="admin-login-back" onClick={() => navigate("/")}>
          <ArrowLeft size={18} /> 사용자 서비스로 돌아가기
        </button>
        <form className="admin-login-card" onSubmit={handleSubmit} noValidate>
          <div className="admin-login-icon">
            <LockKeyhole size={24} />
          </div>
          <span className="admin-kicker">ADMIN SIGN IN</span>
          <h2>관리자 로그인</h2>
          <p>관리자 계정 정보를 입력해 주세요.</p>
          <label className="admin-field">
            <span>아이디</span>
            <input
              name="loginId"
              value={form.loginId}
              onChange={(e) => {
                setForm({ ...form, loginId: e.target.value });
                setError("");
              }}
              placeholder="아이디를 입력해 주세요"
              autoComplete="username"
            />
          </label>
          <div className="admin-password-field">
            <label className="admin-field">
              <span>비밀번호</span>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  setError("");
                }}
                placeholder="비밀번호를 입력해 주세요"
                autoComplete="current-password"
              />
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label="비밀번호 표시 전환"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <p className="admin-global-error">{error}</p>}
          <button className="admin-primary-btn" disabled={loading}>
            {loading ? (
              "로그인 중..."
            ) : (
              <>
                관리자 로그인 <ArrowRight size={17} />
              </>
            )}
          </button>
          <div className="admin-login-signup">
            관리자 계정이 없으신가요? <Link to="/admin/signup">가입 신청</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
