import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Clock3,
  LockKeyholeOpen,
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import {
  fetchAdminApplications,
  fetchAdminDashboardSummary,
} from "../../api/adminApi";
import useAuthStore from "../../store/authStore";
import "./AdminPages.css";

const initialSummary = {
  userCount: 0,
  adminCount: 0,
  pendingAdminRequestCount: 0,
};

export default function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [summary, setSummary] = useState(initialSummary);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const roles = useMemo(
    () =>
      (user?.roles || [])
        .map((role) =>
          typeof role === "string" ? role : role.role || role.authority,
        )
        .filter(Boolean)
        .map((role) => role.replace(/^ROLE_/, "")),
    [user?.roles],
  );

  const isSuperAdmin = roles.includes("SUPER_ADMIN");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);

      try {
        const summaryData = await fetchAdminDashboardSummary();

        if (!active) {
          return;
        }

        setSummary({
          userCount: summaryData?.userCount || 0,
          adminCount: summaryData?.adminCount || 0,
          pendingAdminRequestCount: summaryData?.pendingAdminRequestCount || 0,
        });

        if (isSuperAdmin) {
          const applications = await fetchAdminApplications({
            status: "PENDING",
            page: 1,
            size: 5,
          });

          if (active) {
            setRecent(applications);
          }
        }
      } catch (error) {
        console.error("관리자 대시보드 조회 실패:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, [isSuperAdmin]);

  return (
    <div className="admin-page">
      <Navbar />

      <main className="admin-dashboard-wrap">
        <section className="admin-dashboard-hero">
          <div>
            <span className="admin-kicker">ADMIN DASHBOARD</span>
            <h1>안녕하세요, {user?.nickname || "관리자"}님.</h1>
            <p>AlgoTalk 회원과 관리자 가입 현황을 확인하세요.</p>
          </div>

          <div className="admin-dashboard-shield">
            <ShieldCheck size={36} />
            <span>{isSuperAdmin ? "SUPER ADMIN" : "ADMIN"}</span>
          </div>
        </section>

        <div className="admin-stat-grid">
          <Stat
            icon={<Users />}
            label="일반 회원 수"
            value={summary.userCount}
            tone="approved"
            loading={loading}
          />
          <Stat
            icon={<UserCog />}
            label="관리자 회원 수"
            value={summary.adminCount}
            tone="rejected"
            loading={loading}
          />
          <Stat
            icon={<Clock3 />}
            label="관리자 가입 요청"
            value={summary.pendingAdminRequestCount}
            tone="pending"
            loading={loading}
          />
        </div>

        {isSuperAdmin && (
          <>
            <section className="admin-dashboard-card">
              <div className="admin-dashboard-card-head">
                <div>
                  <h2>최근 승인 대기 신청</h2>
                  <p>검토가 필요한 관리자 가입 신청입니다.</p>
                </div>

                <Link to="/admin/applications">
                  전체 보기
                  <ArrowRight size={15} />
                </Link>
              </div>

              {recent.length === 0 ? (
                <div className="admin-dashboard-empty">
                  <UserCheck size={28} />
                  <p>현재 승인 대기 중인 신청이 없습니다.</p>
                </div>
              ) : (
                <div className="admin-recent-list">
                  {recent.map((item) => (
                    <Link key={item.userId} to="/admin/applications">
                      <span>{item.name?.slice(0, 1)}</span>
                      <div>
                        <strong>{item.name}</strong>
                        <small>
                          {item.loginId} · {item.nickname}
                        </small>
                      </div>
                      <time>
                        {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                      </time>
                      <ArrowRight size={16} />
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="admin-quick-grid">
              <Link to="/admin/applications">
                <Users />
                <div>
                  <strong>가입 신청 관리</strong>
                  <span>관리자 가입을 승인하거나 반려합니다.</span>
                </div>
                <ArrowRight />
              </Link>

              <Link to="/admin/users/unlock">
                <LockKeyholeOpen />
                <div>
                  <strong>회원 잠금 해제</strong>
                  <span>로그인 잠금 상태를 초기화합니다.</span>
                </div>
                <ArrowRight />
              </Link>

              <Link to="/admin/status">
                <UserCheck />
                <div>
                  <strong>내 관리자 계정</strong>
                  <span>관리자 등급과 승인 정보를 확인합니다.</span>
                </div>
                <ArrowRight />
              </Link>
            </section>
          </>
        )}

        {!isSuperAdmin && (
          <section className="admin-quick-grid">
            <Link to="/admin/users/unlock">
              <LockKeyholeOpen />
              <div>
                <strong>회원 잠금 해제</strong>
                <span>로그인 잠금 상태를 초기화합니다.</span>
              </div>
              <ArrowRight />
            </Link>

            <Link to="/admin/status">
              <UserCheck />
              <div>
                <strong>내 관리자 계정</strong>
                <span>관리자 등급과 승인 정보를 확인합니다.</span>
              </div>
              <ArrowRight />
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}

function Stat({ icon, label, value, tone, loading }) {
  return (
    <div className={`admin-stat-card ${tone}`}>
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>
          {loading ? "-" : Number(value || 0).toLocaleString()}
          <em>명</em>
        </strong>
      </div>
    </div>
  );
}
