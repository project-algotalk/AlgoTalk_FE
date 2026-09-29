import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { signUpAdmin } from "../../api/adminApi";
import "./AdminPages.css";

const initialForm = {
  loginId: "",
  password: "",
  passwordConfirm: "",
  name: "",
  nickname: "",
};

export default function AdminSignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const next = {};
    if (!/^[a-zA-Z0-9]{4,20}$/.test(form.loginId))
      next.loginId = "영문과 숫자로 4~20자를 입력해 주세요.";
    if (
      form.password.length < 8 ||
      !/[A-Za-z]/.test(form.password) ||
      !/\d/.test(form.password) ||
      !/[\W_]/.test(form.password)
    )
      next.password = "영문, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요.";
    if (form.password !== form.passwordConfirm)
      next.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    if (!form.name.trim() || form.name.trim().length > 50)
      next.name = "이름을 50자 이하로 입력해 주세요.";
    if (!/^[a-zA-Z0-9가-힣]{2,10}$/.test(form.nickname))
      next.nickname = "영문, 숫자, 한글로 2~10자를 입력해 주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setGlobalError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setGlobalError("");
    try {
      await signUpAdmin({
        ...form,
        loginId: form.loginId.trim(),
        name: form.name.trim(),
        nickname: form.nickname.trim(),
      });
      setSubmitted(true);
    } catch (error) {
      const response = error.response?.data;
      if (response?.fieldErrors) {
        setErrors(
          Object.fromEntries(
            response.fieldErrors.map(({ field, reason }) => [field, reason]),
          ),
        );
      } else {
        setGlobalError(
          response?.message ||
            "가입 신청을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="admin-auth-page">
        <header className="admin-auth-nav">
          <Link to="/" className="admin-brand">
            <span>A</span>AlgoTalk
          </Link>
        </header>
        <section className="admin-result-card">
          <div className="admin-result-icon">
            <Check size={31} />
          </div>
          <span className="admin-kicker">APPLICATION COMPLETE</span>
          <h1>가입 신청이 완료되었어요</h1>
          <p>
            관리자의 검토가 끝날 때까지 조금만 기다려 주세요.
            <br />
            승인 후 관리자 서비스를 이용할 수 있습니다.
          </p>
          <div className="admin-result-meta">
            <span>승인 상태</span>
            <strong className="pending">승인 대기</strong>
          </div>
          <button
            className="admin-primary-btn"
            onClick={() => navigate("/admin/login")}
          >
            관리자 로그인으로 <ArrowRight size={17} />
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-auth-page">
      <header className="admin-auth-nav">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="이전 화면"
        >
          <ArrowLeft size={20} />
        </button>
        <Link to="/" className="admin-brand">
          <span>A</span>AlgoTalk
        </Link>
        <div />
      </header>
      <div className="admin-signup-layout">
        <aside className="admin-signup-intro">
          <div className="admin-intro-badge">
            <ShieldCheck size={18} /> ADMIN PORTAL
          </div>
          <h1>
            더 나은 면접 경험을
            <br />
            함께 만들어 주세요.
          </h1>
          <p>
            AlgoTalk 운영을 위한 관리자 계정을 신청하세요.
            <br />
            안전한 서비스 운영을 위해 가입 후 승인이 필요합니다.
          </p>
          <ol>
            <li>
              <span>1</span>
              <div>
                <strong>정보 입력</strong>
                <small>관리자 계정 정보를 입력합니다.</small>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>승인 검토</strong>
                <small>최고 관리자가 신청 내용을 검토합니다.</small>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>서비스 시작</strong>
                <small>승인 완료 후 관리 기능을 이용합니다.</small>
              </div>
            </li>
          </ol>
        </aside>
        <section className="admin-form-card">
          <div className="admin-form-heading">
            <span className="admin-kicker">ADMIN SIGN UP</span>
            <h2>관리자 가입 신청</h2>
            <p>가입에 필요한 정보를 정확히 입력해 주세요.</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <AdminField
              label="아이디"
              name="loginId"
              value={form.loginId}
              onChange={handleChange}
              error={errors.loginId}
              placeholder="영문, 숫자 4~20자"
              autoComplete="username"
            />
            <div className="admin-password-field">
              <AdminField
                label="비밀번호"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label="비밀번호 표시 전환"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <AdminField
              label="비밀번호 확인"
              name="passwordConfirm"
              type="password"
              value={form.passwordConfirm}
              onChange={handleChange}
              error={errors.passwordConfirm}
              placeholder="비밀번호를 다시 입력해 주세요"
              autoComplete="new-password"
            />
            <div className="admin-form-row">
              <AdminField
                label="이름"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="실명을 입력해 주세요"
              />
              <AdminField
                label="닉네임"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                error={errors.nickname}
                placeholder="2~10자"
              />
            </div>
            {globalError && <p className="admin-global-error">{globalError}</p>}
            <button className="admin-primary-btn" disabled={loading}>
              {loading ? (
                "신청 중..."
              ) : (
                <>
                  가입 신청하기 <ArrowRight size={17} />
                </>
              )}
            </button>
            <p className="admin-login-link">
              이미 관리자 계정이 있으신가요?{" "}
              <Link to="/admin/login">관리자 로그인</Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

function AdminField({ label, error, ...inputProps }) {
  return (
    <label className="admin-field">
      <span>
        {label}
        <em>*</em>
      </span>
      <input className={error ? "error" : ""} {...inputProps} />
      {error && <small>{error}</small>}
    </label>
  );
}
