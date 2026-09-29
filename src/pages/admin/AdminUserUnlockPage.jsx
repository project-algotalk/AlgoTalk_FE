import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LockKeyholeOpen,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import {
  fetchAdminUsers,
  unlockUserAccount,
} from "../../api/adminApi";
import AlertModal from "../../components/common/AlertModal";
import Navbar from "../../components/common/Navbar";
import useAuthStore from "../../store/authStore";
import "./AdminPages.css";

const PAGE_SIZE = 10;
const initialPage = {
  content: [],
  page: 1,
  size: PAGE_SIZE,
  totalCount: 0,
  totalPages: 0,
};

export default function AdminUserUnlockPage() {
  const user = useAuthStore((state) => state.user);
  const [userPage, setUserPage] = useState(initialPage);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoginId, setActionLoginId] = useState(null);
  const [modal, setModal] = useState(null);

  const hasAdminRole = useMemo(
    () =>
      (user?.roles || [])
        .map((role) =>
          typeof role === "string" ? role : role.role || role.authority,
        )
        .filter(Boolean)
        .map((role) => role.replace(/^ROLE_/, ""))
        .some((role) => role === "ADMIN" || role === "SUPER_ADMIN"),
    [user?.roles],
  );

  useEffect(() => {
    if (!hasAdminRole) {
      return undefined;
    }

    let active = true;

    const loadUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchAdminUsers({
          page,
          size: PAGE_SIZE,
          keyword,
        });

        if (active) {
          setUserPage({
            content: data?.content || [],
            page: data?.page || page,
            size: data?.size || PAGE_SIZE,
            totalCount: data?.totalCount || 0,
            totalPages: data?.totalPages || 0,
          });
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError.response?.data?.message ||
              "일반 회원 목록을 불러오지 못했습니다.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      active = false;
    };
  }, [hasAdminRole, keyword, page, refreshKey]);

  if (!hasAdminRole) {
    return <Navigate to="/admin" replace />;
  }

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setKeyword(searchInput.trim());
  };

  const handleUnlock = async (target) => {
    if (!target.locked || actionLoginId) {
      return;
    }

    const confirmed = window.confirm(
      `${target.name}(${target.loginId})님의 로그인 잠금을 해제할까요?`,
    );
    if (!confirmed) {
      return;
    }

    setActionLoginId(target.loginId);
    setError("");

    try {
      await unlockUserAccount(target.loginId);
      setRefreshKey((value) => value + 1);
      setModal({
        type: "success",
        title: "잠금 해제 완료",
        message: `${target.loginId} 계정의 로그인 실패 횟수와 잠금 상태를 초기화했습니다.`,
      });
    } catch (requestError) {
      const status = requestError.response?.status;
      const fallbackMessage =
        status === 403
          ? "관리자만 회원 계정의 잠금을 해제할 수 있습니다."
          : status === 404
            ? "해당 일반 회원을 찾을 수 없습니다."
            : "회원 계정 잠금 해제에 실패했습니다. 잠시 후 다시 시도해 주세요.";

      setModal({
        type: "error",
        title: "잠금 해제 실패",
        message: requestError.response?.data?.message || fallbackMessage,
      });
    } finally {
      setActionLoginId(null);
    }
  };

  const totalPages = Math.max(1, userPage.totalPages || 0);

  return (
    <div className="admin-page">
      <Navbar />

      <main className="admin-app-wrap">
        <div className="admin-page-heading admin-list-heading">
          <div>
            <span className="admin-kicker">USER MANAGEMENT</span>
            <h1>일반 회원 관리</h1>
            <p>일반 회원의 로그인 잠금 상태를 확인하고 해제할 수 있습니다.</p>
          </div>

          <div className="admin-summary">
            <Users />
            <span>조회 회원</span>
            <strong>{Number(userPage.totalCount || 0).toLocaleString()}</strong>
          </div>
        </div>

        <section className="admin-list-card">
          <form className="admin-user-search" onSubmit={handleSearch}>
            <label htmlFor="admin-user-keyword">
              <Search size={17} />
              <input
                id="admin-user-keyword"
                type="search"
                maxLength="50"
                autoComplete="off"
                placeholder="아이디, 이름, 닉네임 검색"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </label>
            <button type="submit" disabled={loading}>
              검색
            </button>
          </form>

          {error && (
            <div className="admin-inline-error">
              <AlertCircle size={17} />
              {error}
              <button
                type="button"
                onClick={() => setRefreshKey((value) => value + 1)}
              >
                다시 시도
              </button>
            </div>
          )}

          <div className="admin-table-scroll">
            <table className="admin-table admin-user-table">
              <thead>
                <tr>
                  <th>회원</th>
                  <th>로그인 아이디</th>
                  <th>가입일</th>
                  <th>계정 상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="admin-empty">
                      회원 목록을 불러오고 있어요...
                    </td>
                  </tr>
                ) : userPage.content.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="admin-empty">
                      <Users size={30} />
                      <strong>조회된 회원이 없습니다.</strong>
                      <span>검색어를 확인하거나 전체 목록을 조회해 주세요.</span>
                    </td>
                  </tr>
                ) : (
                  userPage.content.map((item) => (
                    <tr key={item.loginId}>
                      <td>
                        <div className="admin-user-cell">
                          <span>{item.name?.slice(0, 1) || "-"}</span>
                          <div>
                            <strong>{item.name || "-"}</strong>
                            <small>{item.nickname || "닉네임 없음"}</small>
                          </div>
                        </div>
                      </td>
                      <td>{item.loginId}</td>
                      <td>{formatDate(item.createdAt)}</td>
                      <td>
                        <span
                          className={`table-status ${item.locked ? "locked" : "normal"}`}
                        >
                          {item.locked ? (
                            <LockKeyholeOpen size={13} />
                          ) : (
                            <CheckCircle2 size={13} />
                          )}
                          {item.locked ? "잠김" : "정상"}
                        </span>
                      </td>
                      <td>
                        {item.locked ? (
                          <button
                            type="button"
                            className="admin-user-unlock-button"
                            disabled={actionLoginId !== null}
                            onClick={() => handleUnlock(item)}
                          >
                            <LockKeyholeOpen size={15} />
                            {actionLoginId === item.loginId
                              ? "처리 중..."
                              : "잠금 해제"}
                          </button>
                        ) : (
                          <span className="admin-processed">처리 없음</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="admin-pagination">
            <button
              type="button"
              aria-label="이전 페이지"
              disabled={loading || page <= 1}
              onClick={() => setPage((value) => value - 1)}
            >
              <ChevronLeft size={17} />
            </button>
            <span>
              <strong>{page}</strong> / {totalPages}
            </span>
            <button
              type="button"
              aria-label="다음 페이지"
              disabled={loading || page >= totalPages}
              onClick={() => setPage((value) => value + 1)}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </section>

        <div className="admin-security-note">
          <ShieldCheck size={17} />
          <span>
            <strong>관리자 권한</strong> 잠금 해제 시 해당 회원의 로그인
            실패 횟수와 잠금 정보가 함께 초기화됩니다.
          </span>
        </div>
      </main>

      {modal && (
        <AlertModal
          type={modal.type}
          title={modal.title}
          message={modal.message}
          confirmText="확인"
          onConfirm={() => setModal(null)}
          onClose={() => setModal(null)}
          align="center"
          zIndex={1000}
        />
      )}
    </div>
  );
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("ko-KR");
}
