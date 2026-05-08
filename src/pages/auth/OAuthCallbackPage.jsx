import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { fetchMe } from "../../api/authApi";

export default function OAuthCallbackPage() {
    const navigate = useNavigate();
    const { login, setUnauthenticated } = useAuthStore();

    useEffect(() => {
        const resolveSocialLogin = async () => {
            try {
                const me = await fetchMe();
                sessionStorage.removeItem("logged-out");
                login({ user: me });
                navigate("/", { replace: true });
            } catch {
                setUnauthenticated();
                navigate("/login", { replace: true });
            }
        }
        resolveSocialLogin();
    }, [login, navigate, setUnauthenticated]);

    return (
        <div
        style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            fontSize: "0.9rem",
            color: "#888",
            fontFamily: "Noto Sans KR, sans-serif",
        }}
        >
        로그인 처리 중...
        </div>
    );
}
