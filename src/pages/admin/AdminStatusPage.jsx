import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileCheck2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import { fetchAdminStatus } from "../../api/adminApi";
import "./AdminPages.css";

const statusContent = {
  PENDING: {
    label: "승인 대기",
    title: "가입 신청을 검토하고 있어요",
    description:
      "신청하신 정보를 담당 관리자가 확인하고 있습니다. 검토가 완료되면 관리자 기능을 이용할 수 있어요.",
    icon: Clock3,
  },
  APPROVED: {
    label: "승인 완료",
    title: "관리자 계정이 승인되었어요",
    description: "이제 AlgoTalk의 관리자 기능을 이용할 수 있습니다.",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "승인 반려",
    title: "가입 신청이 반려되었어요",
    description:
      "아래 반려 사유를 확인해 주세요. 추가 문의가 필요하다면 최고 관리자에게 연락해 주세요.",
    icon: XCircle,
  },
};

export default function AdminStatusPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStatus = async () => {
    setLoading(true);
    setError("");
    try {
      setStatus(await fetchAdminStatus());
    } catch (err) {
      setError(
        err.response?.data?.message || "승인 상태를 불러오지 못했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetchAdminStatus()
      .then((data) => {
        if (active) setStatus(data);
      })
      .catch((err) => {
        if (active)
          setError(
            err.response?.data?.message || "승인 상태를 불러오지 못했습니다.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const content =
    statusContent[status?.approvalStatus] || statusContent.PENDING;
  const StatusIcon = content.icon;

  return (
    <div className="admin-page">
      <Navbar />
      <main className="admin-status-wrap">
        <div className="admin-page-heading">
          <span className="admin-kicker">ADMIN ACCOUNT</span>
          <h1>관리자 가입 현황</h1>
          <p>관리자 계정의 승인 상태를 확인할 수 있습니다.</p>
        </div>
        {loading ? (
          <div className="admin-state-card admin-loading">
            <RefreshCw /> 승인 상태를 확인하고 있어요...
          </div>
        ) : error ? (
          <div className="admin-state-card admin-error-state">
            <AlertCircle />
            <h2>정보를 불러올 수 없어요</h2>
            <p>{error}</p>
            <button onClick={loadStatus}>다시 시도</button>
          </div>
        ) : (
          <section
            className={`admin-state-card status-${status.approvalStatus?.toLowerCase()}`}
          >
            <div className="admin-state-icon">
              <StatusIcon size={34} />
            </div>
            <span className="admin-status-pill">{content.label}</span>
            <h2>{content.title}</h2>
            <p>{content.description}</p>
            <div className="admin-progress">
              <div className="done">
                <span>
                  <CheckCircle2 size={16} />
                </span>
                <strong>가입 신청</strong>
              </div>
              <i />
              <div
                className={
                  status.approvalStatus !== "PENDING" ? "done" : "active"
                }
              >
                <span>
                  <FileCheck2 size={16} />
                </span>
                <strong>관리자 검토</strong>
              </div>
              <i />
              <div
                className={status.approvalStatus === "APPROVED" ? "done" : ""}
              >
                <span>
                  <CheckCircle2 size={16} />
                </span>
                <strong>승인 완료</strong>
              </div>
            </div>
            <dl>
              <div>
                <dt>관리자 등급</dt>
                <dd>{status.adminGradeLabel || "승인 후 부여"}</dd>
              </div>
              {status.approvedAt && (
                <div>
                  <dt>처리 일시</dt>
                  <dd>{new Date(status.approvedAt).toLocaleString("ko-KR")}</dd>
                </div>
              )}
              {status.rejectReason && (
                <div className="reject-reason">
                  <dt>반려 사유</dt>
                  <dd>{status.rejectReason}</dd>
                </div>
              )}
            </dl>
            {status.approvalStatus === "APPROVED" ? (
              <Link className="admin-primary-btn" to="/admin">
                관리자 메인으로 <ArrowRight size={17} />
              </Link>
            ) : (
              <button className="admin-secondary-btn" onClick={loadStatus}>
                <RefreshCw size={16} /> 상태 새로고침
              </button>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
