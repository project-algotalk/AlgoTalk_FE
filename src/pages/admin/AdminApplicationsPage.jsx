import { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import {
  approveAdminApplication,
  fetchAdminApplications,
  rejectAdminApplication,
} from "../../api/adminApi";
import "./AdminPages.css";

const PAGE_SIZE = 10;
const FILTERS = [
  { value: "", label: "전체" },
  { value: "PENDING", label: "승인 대기" },
  { value: "APPROVED", label: "승인 완료" },
  { value: "REJECTED", label: "반려" },
];
const statusLabel = {
  PENDING: "승인 대기",
  APPROVED: "승인 완료",
  REJECTED: "반려",
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [reason, setReason] = useState("");
  const [action, setAction] = useState(null);
  const [notice, setNotice] = useState("");

  const loadApplications = async () => {
    setLoading(true);
    setError("");
    try {
      setApplications(
        await fetchAdminApplications({ page, size: PAGE_SIZE, status }),
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "가입 신청 목록을 불러오지 못했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let active = true;
    fetchAdminApplications({ page, size: PAGE_SIZE, status })
      .then((data) => {
        if (active) setApplications(data);
      })
      .catch((err) => {
        if (active)
          setError(
            err.response?.data?.message ||
              "가입 신청 목록을 불러오지 못했습니다.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, status]);

  const totalCount = applications[0]?.totalCount || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const processApproval = async (item) => {
    if (!window.confirm(`${item.name}님의 관리자 가입을 승인할까요?`)) return;
    setAction(item.userId);
    try {
      await approveAdminApplication(item.userId);
      setNotice("관리자 가입을 승인했습니다.");
      await loadApplications();
    } catch (err) {
      setError(err.response?.data?.message || "승인 처리에 실패했습니다.");
    } finally {
      setAction(null);
    }
  };
  const processReject = async (event) => {
    event.preventDefault();
    if (!reason.trim()) return;
    setAction(rejectTarget.userId);
    try {
      await rejectAdminApplication(rejectTarget.userId, reason.trim());
      setRejectTarget(null);
      setReason("");
      setNotice("가입 신청을 반려했습니다.");
      await loadApplications();
    } catch (err) {
      setError(err.response?.data?.message || "반려 처리에 실패했습니다.");
    } finally {
      setAction(null);
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      <main className="admin-app-wrap">
        <div className="admin-page-heading admin-list-heading">
          <div>
            <span className="admin-kicker">ADMIN MANAGEMENT</span>
            <h1>관리자 가입 관리</h1>
            <p>관리자 가입 신청을 검토하고 승인 상태를 관리하세요.</p>
          </div>
          <div className="admin-summary">
            <Users />
            <span>전체 신청</span>
            <strong>{totalCount.toLocaleString()}</strong>
          </div>
        </div>
        {notice && (
          <div className="admin-toast">
            <Check size={17} />
            {notice}
            <button onClick={() => setNotice("")}>
              <X size={16} />
            </button>
          </div>
        )}
        <section className="admin-list-card">
          <div className="admin-list-toolbar">
            <div className="admin-filter-tabs">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  className={status === filter.value ? "active" : ""}
                  onClick={() => {
                    setLoading(true);
                    setError("");
                    setStatus(filter.value);
                    setPage(1);
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <span>
              <Search size={15} /> 총 {totalCount.toLocaleString()}건
            </span>
          </div>
          {error && (
            <div className="admin-inline-error">
              <AlertCircle size={17} /> {error}
              <button onClick={loadApplications}>다시 시도</button>
            </div>
          )}
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>신청자</th>
                  <th>아이디</th>
                  <th>신청일</th>
                  <th>등급</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="admin-empty">
                      목록을 불러오고 있어요...
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="admin-empty">
                      <UserCheck size={30} />
                      <strong>신청 내역이 없습니다.</strong>
                      <span>선택한 상태에 해당하는 가입 신청이 없어요.</span>
                    </td>
                  </tr>
                ) : (
                  applications.map((item) => (
                    <tr key={item.userId}>
                      <td>
                        <div className="admin-user-cell">
                          <span>{item.name?.slice(0, 1)}</span>
                          <div>
                            <strong>{item.name}</strong>
                            <small>{item.nickname}</small>
                          </div>
                        </div>
                      </td>
                      <td>{item.loginId}</td>
                      <td>
                        {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                      </td>
                      <td>{item.adminGradeLabel || "-"}</td>
                      <td>
                        <span
                          className={`table-status ${item.approvalStatus?.toLowerCase()}`}
                        >
                          {item.approvalStatus === "PENDING" && (
                            <Clock3 size={13} />
                          )}
                          {statusLabel[item.approvalStatus] ||
                            item.approvalStatus}
                        </span>
                      </td>
                      <td>
                        {item.approvalStatus === "PENDING" ? (
                          <div className="admin-row-actions">
                            <button
                              disabled={action === item.userId}
                              onClick={() => processApproval(item)}
                            >
                              <Check size={15} /> 승인
                            </button>
                            <button
                              disabled={action === item.userId}
                              onClick={() => setRejectTarget(item)}
                            >
                              <X size={15} /> 반려
                            </button>
                          </div>
                        ) : (
                          <span className="admin-processed">처리 완료</span>
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
              disabled={page === 1}
              onClick={() => {
                setLoading(true);
                setPage((value) => value - 1);
              }}
            >
              <ChevronLeft size={17} />
            </button>
            <span>
              <strong>{page}</strong> / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => {
                setLoading(true);
                setPage((value) => value + 1);
              }}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </section>
        <div className="admin-security-note">
          <ShieldCheck size={17} />
          <span>
            <strong>관리자 권한 안내</strong> 가입 승인 시 관리자 권한이 즉시
            부여됩니다. 신청자 정보를 확인한 후 신중하게 처리해 주세요.
          </span>
        </div>
      </main>
      {rejectTarget && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setRejectTarget(null)
          }
        >
          <form className="admin-reject-modal" onSubmit={processReject}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setRejectTarget(null)}
            >
              <X size={19} />
            </button>
            <div className="reject-icon">
              <X size={22} />
            </div>
            <h2>가입 신청 반려</h2>
            <p>
              <strong>{rejectTarget.name}</strong>님의 가입 신청을 반려합니다.
              <br />
              신청자가 확인할 수 있도록 사유를 입력해 주세요.
            </p>
            <label>
              반려 사유 <span>{reason.length}/300</span>
              <textarea
                autoFocus
                maxLength="300"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="반려 사유를 구체적으로 입력해 주세요."
              />
            </label>
            <div>
              <button type="button" onClick={() => setRejectTarget(null)}>
                취소
              </button>
              <button disabled={!reason.trim() || action}>반려하기</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
