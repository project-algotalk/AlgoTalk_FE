import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
/* src/styles/variables.css */
:root {
  --z-popover: 400;
  --z-modal: 600;
  --z-toast: 700;
}

/* src/index.css */
*, *::before, *::after {
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Noto Sans KR', sans-serif;
  color: #1a1a1a;
  background: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
}

p {
  margin: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

/* src/components/common/AlertModal.css */
.alert-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.alert-modal-box {
  background: #fff;
  border-radius: 14px;
  padding: 36px 34px;
  width: 340px;
  max-width: 90vw;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
}

.alert-modal-box--left { text-align: left; }
.alert-modal-box--center { text-align: center; }

.alert-modal-icon { margin-bottom: 16px; }
.alert-modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}
.alert-modal-message {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 24px;
  line-height: 1.6;
}
.alert-modal-confirm {
  float: right;
  background: #0f2854;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 9px 22px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
}
.alert-modal-confirm:hover { background: #1c4d8d; }

.alert-modal-box--center .alert-modal-confirm {
  float: none;
  width: 100%;
  height: 44px;
  border-radius: 8px;
}

/* src/components/common/AnalyzingLoader.css */
.al-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 480px;
    padding: 40px 24px;
}
.al-spinner {
    width: 72px;
    height: 72px;
    border: 3px solid #f0f0f0;
    border-top: 3px solid #534AB7;
    border-radius: 50%;
    animation: al-spin 0.9s linear infinite;
    margin-bottom: 32px;
}
@keyframes al-spin { to { transform: rotate(360deg); } }
.al-title {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 10px;
}
.al-sub {
    font-size: 14px;
    color: #888;
    margin: 0 0 40px;
    text-align: center;
    line-height: 1.6;
}
.al-steps {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 280px;
}
.al-step {
    display: flex;
    align-items: center;
    gap: 12px;
}
.al-step-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 14px;
}
.al-step-icon.done  { background: #E1F5EE; color: #0F6E56; }
.al-step-icon.wait  { background: #f5f5f5; color: #bbb; }
.al-step-icon.active {
    background: #EEEDFE;
    color: #534AB7;
    animation: al-pulse 1.2s ease-in-out infinite;
}
@keyframes al-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}
.al-step-label       { font-size: 14px; color: #888; }
.al-step-label.done  { color: #1a1a1a; font-weight: 600; }
.al-step-label.active{ color: #534AB7; font-weight: 600; }

/* src/components/interview/ScrapSelectModal.css */
.ssm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.ssm-modal {
    background: white;
    border-radius: 14px;
    width: 620px;
    max-width: 95vw;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.ssm-title {
    font-size: 1rem;
    font-weight: 700;
    color: #1a1a1a;
    padding: 20px 24px 16px;
    border-bottom: 1.5px solid #f0f0f0;
}

.ssm-loading,
.ssm-empty {
    padding: 40px;
    text-align: center;
    color: #aaa;
    font-size: 0.875rem;
}

.ssm-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
}

.ssm-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    cursor: pointer;
    transition: background 0.1s;
    border-bottom: 1px solid #f5f5f5;
}

.ssm-item:last-child {
    border-bottom: none;
}

.ssm-item:hover {
    background: #fafafa;
}

.ssm-item.selected {
    background: #f5f5ff;
}

.ssm-checkbox {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    cursor: pointer;
    accent-color: #3a3a3a;
}

.ssm-item-info {
    flex: 1;
    min-width: 0;
}

.ssm-item-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.ssm-item-meta {
    font-size: 0.75rem;
    color: #aaa;
}

.ssm-item-counts {
    display: flex;
    gap: 10px;
    font-size: 0.75rem;
    color: #aaa;
    flex-shrink: 0;
}

/* 페이징 */
.ssm-paging {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 12px;
    border-top: 1.5px solid #f0f0f0;
}

.ssm-paging button {
    width: 28px;
    height: 28px;
    border: 1.5px solid #e8e8e8;
    border-radius: 6px;
    background: white;
    font-size: 0.78rem;
    cursor: pointer;
    transition: all 0.1s;
    color: #555;
}

.ssm-paging button:hover:not(:disabled) {
    border-color: #3a3a3a;
    color: #1a1a1a;
}

.ssm-paging button.active {
    background: #3a3a3a;
    color: white;
    border-color: #3a3a3a;
}

.ssm-paging button:disabled {
    opacity: 0.3;
    cursor: default;
}

/* 푸터 */
.ssm-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 16px 24px;
    border-top: 1.5px solid #f0f0f0;
}

.ssm-btn-cancel {
    padding: 9px 20px;
    border: 1.5px solid #e0e0e0;
    border-radius: 8px;
    background: white;
    font-size: 0.875rem;
    color: #555;
    cursor: pointer;
    transition: all 0.1s;
    font-family: 'Noto Sans KR', sans-serif;
}

.ssm-btn-cancel:hover {
    border-color: #999;
    color: #333;
}

.ssm-btn-confirm {
    padding: 9px 20px;
    border: none;
    border-radius: 8px;
    background: #3a3a3a;
    font-size: 0.875rem;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: background 0.1s;
    font-family: 'Noto Sans KR', sans-serif;
}

.ssm-btn-confirm:hover:not(:disabled) {
    background: #1a1a1a;
}

.ssm-btn-confirm:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* src/pages/auth/SignupStep1Page.css */
/* src/pages/auth/SignupStep1Page.css */

.su-page {
  width: 100%;
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

/* ── Navbar ── */
.su-nav {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
}
.su-nav-back {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}
.su-nav-back:hover {
  background: #f5f5f5;
}
.su-nav-logo {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f2854;
  letter-spacing: -0.5px;
}

/* ── 컨테이너 ── */
.su-container {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 32px 24px 60px;
  box-sizing: border-box;
}

/* ── 스텝 인디케이터 ── */
.su-steps {
  display: flex;
  align-items: center;
  margin-bottom: 36px;
}
.su-step {
  display: flex;
  align-items: center;
  gap: 8px;
}
.su-step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #aaa;
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.su-step-circle.active {
  background: #1a1a1a;
  color: #fff;
}
.su-step-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #aaa;
}
.su-step-label.active {
  color: #1a1a1a;
}
.su-step-line {
  flex: 1;
  height: 1px;
  background: #e0e0e0;
  margin: 0 12px;
}

/* ── 필드 ── */
.su-field {
  margin-bottom: 20px;
}
.su-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
}
.su-required {
  color: #d32f2f;
  margin-left: 2px;
}

/* ── 인풋 ── */
.su-input {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: "Noto Sans KR", sans-serif;
  color: #1a1a1a;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}
.su-input::placeholder {
  color: #bbb;
}
.su-input:focus {
  border-color: #1c4d8d;
}
.su-input--error {
  border-color: #d32f2f !important;
}
.su-input--ok {
  border-color: #1a7f4b;
}
.su-input:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

/* ── 힌트 ── */
.su-hint {
  font-size: 0.78rem;
  color: #999;
  margin-top: 4px;
  margin-bottom: 0;
}
.su-hint--error {
  color: #d32f2f;
}
.su-hint--ok {
  color: #1a7f4b;
}

/* ── 인풋 + 버튼 행 ── */
.su-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.su-input-row .su-input {
  flex: 1;
}

.su-side-btn {
  flex-shrink: 0;
  height: 46px;
  padding: 0 16px;
  background: #555;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: "Noto Sans KR", sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}
.su-side-btn:hover:not(:disabled) {
  background: #0f2854;
}
.su-side-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── 이메일 행 ── */
.su-email-row {
  display: flex;
  gap: 6px;
  align-items: center;
}
.su-email-local {
  flex: 2;
  min-width: 0;
}
.su-at {
  font-size: 1rem;
  color: #666;
  flex-shrink: 0;
}
.su-email-domain-input {
  flex: 1.5;
  min-width: 0;
}
.su-select-wrap {
  flex: 1.5;
  min-width: 0;
  position: relative;
}
.su-select {
  width: 100%;
  height: 46px;
  padding: 0 32px 0 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: "Noto Sans KR", sans-serif;
  color: #1a1a1a;
  background: #fff;
  outline: none;
  appearance: none;
  cursor: pointer;
  box-sizing: border-box;
}
.su-select-wrap::after {
  content: "▾";
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #888;
  font-size: 0.8rem;
}

/* ── 다음 버튼 ── */
.su-next-btn {
  width: 100%;
  height: 52px;
  margin-top: 12px;
  background: #555;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Noto Sans KR", sans-serif;
  cursor: pointer;
  transition: background 0.15s;
  letter-spacing: 0.1em;
}
.su-next-btn:hover {
  background: #0f2854;
}

/* src/pages/auth/SignupStep2Page.css */
/* src/pages/auth/SignupStep2Page.css */

.su2-page {
  width: 100%;
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

/* ── Navbar ── */
.su2-nav {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
}
.su2-nav-back {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}
.su2-nav-back:hover {
  background: #f5f5f5;
}
.su2-nav-logo {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f2854;
  letter-spacing: -0.5px;
}

/* ── 컨테이너 ── */
.su2-container {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 32px 24px 60px;
  box-sizing: border-box;
}

/* ── 스텝 인디케이터 ── */
.su2-steps {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
}
.su2-step {
  display: flex;
  align-items: center;
  gap: 8px;
}
.su2-step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #aaa;
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.su2-step-circle.active {
  background: #1a1a1a;
  color: #fff;
}
.su2-step-circle.done {
  background: #1a7f4b;
  color: #fff;
}
.su2-step-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #aaa;
}
.su2-step-label.active {
  color: #1a1a1a;
}
.su2-step-label.done {
  color: #1a7f4b;
}
.su2-step-line {
  flex: 1;
  height: 1px;
  background: #e0e0e0;
  margin: 0 12px;
}
.su2-step-line.done {
  background: #1a7f4b;
}

/* ── 안내 문구 ── */
.su2-guide-desc {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 20px;
}
.su2-guide-em {
  font-weight: 600;
  color: #1a1a1a;
}

/* ── 버튼 행 ── */
.su2-btn-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;
}
.su2-btn {
  height: 52px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Noto Sans KR", sans-serif;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.05em;
}
.su2-btn--prev {
  background: #fff;
  color: #444;
  border: 1.5px solid #d0d0d0;
}
.su2-btn--prev:hover {
  border-color: #888;
}
.su2-btn--next {
  background: #555;
  color: #fff;
  border: none;
}
.su2-btn--next:hover {
  background: #0f2854;
}

/* src/pages/auth/SignupStep3Page.css */
/* src/pages/auth/SignupStep3Page.css */
.su3-page {
  width: 100%;
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}
/* ── Navbar ── */
.su3-nav {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
}
.su3-nav-back {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}
.su3-nav-back:hover {
  background: #f5f5f5;
}
.su3-nav-logo {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f2854;
  letter-spacing: -0.5px;
}

/* ── 컨테이너 ── */
.su3-container {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 32px 24px 60px;
  box-sizing: border-box;
}
/* ── 스텝 인디케이터 ── */
.su3-steps {
  display: flex;
  align-items: center;
  margin-bottom: 28px;
}
.su3-step {
  display: flex;
  align-items: center;
  gap: 8px;
}
.su3-step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #aaa;
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.su3-step-circle.active {
  background: #1a1a1a;
  color: #fff;
}
.su3-step-circle.done {
  background: #1a7f4b;
  color: #fff;
}
.su3-step-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #aaa;
}
.su3-step-label.active {
  color: #1a1a1a;
}
.su3-step-label.done {
  color: #1a7f4b;
}
.su3-step-line {
  flex: 1;
  height: 1px;
  background: #e0e0e0;
  margin: 0 12px;
}
.su3-step-line.done {
  background: #1a7f4b;
}

/* ── 안내 ── */
.su3-guide {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
}
.su3-guide-sub {
  font-size: 0.875rem;
  font-weight: 400;
  color: #888;
}

/* ── 재직 기간 ── */
.su3-period-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.su3-period-dash {
  font-size: 1rem;
  color: #888;
  flex-shrink: 0;
}

/* ── 버튼 행 ── */
.su3-btn-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;
}
.su3-btn {
  height: 52px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Noto Sans KR", sans-serif;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.05em;
}
.su3-btn--prev {
  background: #fff;
  color: #444;
  border: 1.5px solid #d0d0d0;
}
.su3-btn--prev:hover {
  border-color: #888;
}
.su3-btn--submit {
  background: #555;
  color: #fff;
  border: none;
}
.su3-btn--submit:hover:not(:disabled) {
  background: #0f2854;
}
.su3-btn--submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* src/pages/auth/SignupCompletePage.css */
/* src/pages/auth/SignupCompletePage.css */

.sc-page {
  width: 100%; min-height: 100vh;
  background: #fff; display: flex; flex-direction: column;
}
.sc-nav {
  width: 100%; height: 56px;
  display: flex; align-items: center; justify-content: center;
  border-bottom: 1px solid #e0e0e0;
}
.sc-nav-logo { font-size: 1.2rem; font-weight: 800; color: #0F2854; letter-spacing: -0.5px; }

.sc-body {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 40px 24px; text-align: center;
}
.sc-icon { margin-bottom: 24px; }
.sc-title {
  font-size: 1.8rem; font-weight: 800;
  color: #1a1a1a; margin-bottom: 14px; letter-spacing: -0.5px;
}
.sc-desc {
  font-size: 1rem; color: #555;
  line-height: 1.8; margin-bottom: 24px;
}
.sc-redirect {
  font-size: 0.85rem; color: #aaa; margin-bottom: 28px;
}
.sc-btn {
  background: #0F2854; color: #fff; border: none;
  border-radius: 8px; padding: 13px 36px;
  font-size: 1rem; font-weight: 700;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer; transition: background 0.15s;
}
.sc-btn:hover { background: #1C4D8D; }

/* src/pages/auth/LoginPage.css */
/* src/pages/auth/LoginPage.css */

.login-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}

/* ── 로그인 전용 Navbar ── */
.login-nav {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #e8edf5;
  box-sizing: border-box;
}

.login-nav-close {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  font-size: 1.1rem;
  color: #444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.15s;
}

.login-nav-close:hover {
  background: #f5f5f5;
}

.login-nav-logo {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0F2854;
  letter-spacing: -0.5px;
}

/* ── 폼 컨테이너 ── */
.login-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px 60px;
}

.login-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 32px;
  letter-spacing: -0.3px;
}

/* ── 폼 ── */
.login-form {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.login-input {
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 1.5px solid #d8d8d8;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: 'Noto Sans KR', sans-serif;
  color: #1a1a1a;
  background: #fff;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.login-input::placeholder {
  color: #aaa;
}

.login-input:focus {
  border-color: #1C4D8D;
}

.login-input--error {
  border-color: #e53935;
}

/* 에러 메시지 */
.login-error {
  font-size: 0.8rem;
  color: #e53935;
  margin: 0;
  padding-left: 2px;
}

.login-error--global {
  text-align: center;
  padding: 8px 12px;
  background: #fff5f5;
  border: 1px solid #ffcdd2;
  border-radius: 6px;
}

/* 아이디 저장 */
.login-save-id {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.875rem;
  color: #555;
  cursor: pointer;
  margin-top: -2px;
}

.login-save-id input[type='checkbox'] {
  width: 15px;
  height: 15px;
  accent-color: #0F2854;
  cursor: pointer;
}

/* ── 버튼 ── */
.login-btn {
  width: 100%;
  height: 52px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
}

.login-btn--primary {
  background: #555;
  color: #fff;
}

.login-btn--primary:hover:not(:disabled) {
  background: #0F2854;
}

.login-btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-btn--outline {
  background: #fff;
  color: #1a1a1a;
  border: 1.5px solid #d8d8d8;
}

.login-btn--outline:hover {
  border-color: #0F2854;
  color: #0F2854;
}

/* ── 소셜 로그인 ── */
.login-social {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.social-btn {
  width: 100%;
  height: 52px;
  border-radius: 8px;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: opacity 0.15s;
}

.social-btn:hover {
  opacity: 0.9;
}

.social-icon {
  position: absolute;
  left: 16px;
  font-size: 1rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
}

.social-icon--naver {
  font-size: 0.9rem;
}

.social-btn--google {
  background: #e53935;
  color: #fff;
}

.social-btn--kakao {
  background: #FEE500;
  color: #1a1a1a;
}

.social-btn--naver {
  background: #03C75A;
  color: #fff;
}

/* ── 찾기 링크 ── */
.login-find {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  font-size: 0.85rem;
  color: #888;
}

.login-find a {
  color: #888;
  text-decoration: none;
  transition: color 0.15s;
}

.login-find a:hover {
  color: #0F2854;
}

.login-find-divider {
  color: #ccc;
}

/* src/pages/auth/FindAccountPage.css */
/* src/pages/auth/FindAccountPage.css */

.fa-page {
  min-height: 100vh;
  background: #fff;
  font-family: "Noto Sans KR", sans-serif;
}

/* 네비바 */
.fa-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 56px;
  border-bottom: 1px solid #e5e7eb;
}
.fa-nav-close {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #374151;
  width: 40px;
}
.fa-nav-logo {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f2854;
  letter-spacing: 0.02em;
}

/* 컨테이너 */
.fa-container {
  max-width: 560px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

.fa-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 28px;
}

/* 탭 */
.fa-tabs {
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 32px;
}
.fa-tab {
  flex: 1;
  padding: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  background: #fff;
  border: none;
  cursor: pointer;
  color: #6b7280;
  transition:
    background 0.15s,
    color 0.15s;
}
.fa-tab.active {
  background: #4b5563;
  color: #fff;
  font-weight: 600;
}

/* 콘텐츠 */
.fa-content {
  min-height: 200px;
}

/* 전체 에러 */
.fa-global-error {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin-bottom: 16px;
}

/* 필드 */
.fa-field {
  margin-bottom: 20px;
}
.fa-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}
.fa-required {
  color: #ef4444;
  margin-left: 2px;
}

/* 인풋 */
.fa-input {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #111827;
  background: #fff;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.15s;
}
.fa-input:focus {
  border-color: #1c4d8d;
}
.fa-input--error {
  border-color: #ef4444 !important;
}
.fa-input:disabled {
  background: #f9fafb;
  color: #9ca3af;
}

/* 인풋 + 버튼 가로 */
.fa-input-row {
  display: flex;
  gap: 8px;
}
.fa-input-row .fa-input {
  flex: 1;
}

/* 이메일 행 */
.fa-email-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.fa-email-local {
  flex: 1;
  min-width: 100px;
}
.fa-at {
  font-size: 0.95rem;
  color: #6b7280;
  flex-shrink: 0;
}
.fa-email-domain-input {
  flex: 1;
  min-width: 80px;
}
.fa-select-wrap {
  position: relative;
}
.fa-select {
  height: 44px;
  padding: 0 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #374151;
  background: #fff;
  cursor: pointer;
  outline: none;
}
.fa-select:focus {
  border-color: #1c4d8d;
}

/* 옆 버튼 */
.fa-side-btn {
  height: 44px;
  padding: 0 14px;
  background: #4b5563;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s;
}
.fa-side-btn:hover:not(:disabled) {
  background: #374151;
}
.fa-side-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* 힌트 */
.fa-hint {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 4px;
}
.fa-hint--error {
  color: #ef4444;
}
.fa-hint--ok {
  color: #16a34a;
}

/* 제출 버튼 */
.fa-submit-btn {
  width: 100%;
  height: 48px;
  background: #4b5563;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.15s;
}
.fa-submit-btn:hover:not(:disabled) {
  background: #374151;
}
.fa-submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* 아이디 찾기 결과 */
.fa-result {
  text-align: center;
  padding: 32px 0;
}
.fa-result-text {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 32px;
}
.fa-result-name {
  font-weight: 600;
}
.fa-result-id {
  color: #ef4444;
  font-weight: 700;
}

/* 비밀번호 재설정 타이틀 */
.fa-reset-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin-bottom: 24px;
}

/* 하단 링크 */
.fa-bottom-links {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}
.fa-bottom-links a {
  font-size: 0.85rem;
  color: #6b7280;
  text-decoration: none;
}
.fa-bottom-links a:hover {
  color: #374151;
}

/* src/pages/interview/DeviceCheckPage.css */
.dc-page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

/* 헤더 */
.dc-header {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.dc-back {
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  padding: 0;
  line-height: 1;
}

.dc-header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
}

/* 컨테이너 */
.dc-container {
  max-width: 660px;
  margin: 0 auto;
  padding: 40px 24px 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dc-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  text-align: center;
}

.dc-subtitle {
  font-size: 0.875rem;
  color: #888;
  margin-bottom: 28px;
  text-align: center;
}

/* 미리보기 */
.dc-preview {
  width: 100%;
  max-width: 560px;
  aspect-ratio: 16/9;
  background: #888;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin-bottom: 12px;
}

.dc-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dc-preview-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #ccc;
}

.dc-rec-dot {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 10px;
  height: 10px;
  background: #e53935;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.dc-hint {
  font-size: 0.8rem;
  color: #aaa;
  margin-bottom: 16px;
  text-align: center;
}

/* 마이크 레벨 바 */
.dc-mic-level {
  width: 100%;
  max-width: 560px;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin-bottom: 16px;
  overflow: hidden;
}

.dc-mic-bar {
  height: 100%;
  background: #4caf50;
  border-radius: 4px;
  transition: width 0.1s;
}

/* 체크 버튼 */
.dc-check-btns {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  width: 100%;
  max-width: 560px;
}

.dc-check-btn {
  flex: 1;
  padding: 10px;
  border: 1.5px solid #d0d0d0;
  border-radius: 8px;
  background: #fff;
  font-size: 0.875rem;
  color: #333;
  cursor: pointer;
  transition: all 0.15s;
}

.dc-check-btn:hover {
  border-color: #999;
}

.dc-check-btn.ok {
  border-color: #4caf50;
  color: #4caf50;
  background: #f1f8f1;
}

.dc-check-btn.error {
  border-color: #e57373;
  color: #e57373;
  background: #fff5f5;
}

/* 하단 버튼 */
.dc-footer {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 560px;
}

.dc-prev-btn {
  flex: 1;
  padding: 13px;
  border: 1.5px solid #d0d0d0;
  border-radius: 8px;
  background: #fff;
  font-size: 0.95rem;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}

.dc-prev-btn:hover {
  border-color: #999;
}

.dc-start-btn {
  flex: 2;
  padding: 13px;
  background: #3a3a3a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.dc-start-btn:hover {
  background: #1a1a1a;
}

.dc-start-btn:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
}

.dc-start-btn:disabled:hover {
  background: #bdbdbd;
}

/* src/pages/interview/InterviewResultPage.css */
.ir-page {
  min-height: 100vh;
  background: #fafafa;
}

.ir-container {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

/* 헤더 */
.ir-header {
  margin-bottom: 28px;
}

.ir-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.ir-subtitle {
  font-size: 0.85rem;
  color: #888;
}

/* 종합 점수 */
.ir-score-section {
  display: flex;
  align-items: center;
  gap: 24px;
  background: #fff;
  border: 1.5px solid #e8e8e8;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.ir-total-score-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.ir-score-main-label {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.ir-score-main-sub {
  font-size: 0.78rem;
  color: #aaa;
}

.ir-score-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.ir-score-cards-row {
  display: flex;
  gap: 10px;
}

.ir-score-card {
  flex: 1;
  min-width: 90px;
  background: #fafafa;
  border: 1.5px solid #efefef;
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ir-score-card-label {
  font-size: 0.78rem;
  color: #888;
}

.ir-score-card-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

.ir-score-card-max {
  font-size: 0.75rem;
  color: #bbb;
}

/* 섹션 공통 */
.ir-section {
  background: #fff;
  border: 1.5px solid #e8e8e8;
  border-radius: 14px;
  padding: 20px 24px;
  margin-bottom: 16px;
}

.ir-section-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

/* 바 차트 */
.ir-bar-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ir-bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ir-bar-label {
  font-size: 0.82rem;
  color: #555;
  width: 80px;
  flex-shrink: 0;
}

.ir-bar-track {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.ir-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
}

.ir-bar-value {
  font-size: 0.82rem;
  font-weight: 600;
  color: #333;
  width: 28px;
  text-align: right;
  flex-shrink: 0;
}

/* 질문 카드 목록 */
.ir-question-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ir-question-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #fff;
  border: 1.5px solid #efefef;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.ir-question-card:hover {
  border-color: #ccc;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.ir-q-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.ir-q-num {
  font-size: 0.8rem;
  font-weight: 700;
  color: #888;
  flex-shrink: 0;
  padding-top: 2px;
}

.ir-q-content {
  min-width: 0;
}

.ir-q-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ir-q-preview {
  font-size: 0.8rem;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ir-q-preview--muted {
  color: #bbb;
}

.ir-q-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.ir-status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid;
  white-space: nowrap;
}

.ir-q-score {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a1a1a;
  white-space: nowrap;
}

.ir-q-arrow {
  font-size: 1.1rem;
  color: #ccc;
}

/* 푸터 */
.ir-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.ir-btn-home {
  padding: 12px 40px;
  background: #3a3a3a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.ir-btn-home:hover {
  background: #1a1a1a;
}

/* src/pages/interview/InterviewFeedbackPage.css */
.if-page {
  min-height: 100vh;
  background: #fafafa;
}

.if-loading {
  text-align: center;
  padding: 80px 24px;
  color: #888;
  font-size: 0.9rem;
}

.if-container {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

/* 질문 헤더 */
.if-question-header {
  background: #fff;
  border: 1.5px solid #e8e8e8;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 12px;
}

.if-question-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.if-q-order {
  font-size: 0.85rem;
  font-weight: 700;
  color: #888;
}

.if-status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid;
}

.if-question-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  justify-content: space-between;
}

.if-question-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.5;
  flex: 1;
}

.if-circle-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.if-circle-label {
  font-size: 0.72rem;
  color: #aaa;
}

/* 이전/다음 네비 */
.if-nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.if-nav-btn {
  font-size: 0.85rem;
  color: #555;
  background: #fff;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  padding: 7px 16px;
  cursor: pointer;
  transition: all 0.15s;
}

.if-nav-btn:hover {
  border-color: #bbb;
  color: #1a1a1a;
}

/* 내 답변 / 모범 답변 */
.if-answer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 16px;
}

.if-answer-box {
  background: #fff;
  border: 1.5px solid #e8e8e8;
  border-radius: 12px;
  padding: 18px;
}

.if-answer-box--model {
  background: #f8fbff;
  border-color: #c8dff8;
}

.if-answer-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: #888;
  margin-bottom: 10px;
}

.if-answer-text {
  font-size: 0.875rem;
  color: #333;
  line-height: 1.7;
}

/* 섹션 공통 */
.if-section {
  background: #fff;
  border: 1.5px solid #e8e8e8;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 14px;
}

.if-section--tip {
  background: #fffbf0;
  border-color: #ffe8a0;
}

.if-section-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 14px;
}

/* 항목별 점수 그리드 */
.if-score-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.if-score-row {
  display: flex;
  gap: 10px;
}

.if-score-card {
  flex: 1;
  background: #fafafa;
  border: 1.5px solid #efefef;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.if-score-card-label {
  font-size: 0.78rem;
  color: #888;
}

.if-score-card-bottom {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.if-score-card-value {
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1;
}

.if-score-card-max {
  font-size: 0.75rem;
  color: #bbb;
}

/* 발화·침묵 바 */
.if-speech-bar-wrap {
  margin-bottom: 14px;
}

.if-speech-bar {
  display: flex;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  background: #f0f0f0;
  margin-bottom: 8px;
}

.if-speech-fill {
  height: 100%;
  transition: width 0.8s ease;
}

.if-speech-fill--speech {
  background: #5c6bc0;
}

.if-speech-fill--silence {
  background: #ef9a9a;
}

.if-speech-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.8rem;
  color: #666;
}

.if-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}

.if-legend-dot--speech { background: #5c6bc0; }
.if-legend-dot--silence { background: #ef9a9a; }

.if-speech-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.if-speech-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.if-speech-stat-label {
  font-size: 0.75rem;
  color: #aaa;
}

.if-speech-stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.if-empty-notice {
  font-size: 0.875rem;
  color: #aaa;
  padding: 8px 0;
  margin-bottom: 12px;
}

/* 자세·제스처 상세 */
.if-gesture-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.if-gesture-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #fafafa;
  border-radius: 8px;
  font-size: 0.875rem;
}

.if-gesture-type {
  flex: 1;
  color: #333;
  font-weight: 500;
}

.if-gesture-count {
  color: #888;
  font-size: 0.82rem;
}

.if-gesture-deduction {
  color: #e57373;
  font-weight: 600;
  font-size: 0.82rem;
}

/* AI 피드백 */
.if-feedback-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.if-feedback-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border-radius: 10px;
}

.if-feedback-item--good {
  background: #f1f8f1;
  border: 1px solid #c8e6c9;
}

.if-feedback-item--improve {
  background: #fffde7;
  border: 1px solid #fff176;
}

.if-feedback-item--addition {
  background: #f3f4ff;
  border: 1px solid #c5cae9;
}

.if-feedback-icon {
  font-size: 1rem;
  flex-shrink: 0;
  padding-top: 1px;
}

.if-feedback-type {
  font-size: 0.78rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 4px;
}

.if-feedback-text {
  font-size: 0.875rem;
  color: #333;
  line-height: 1.6;
}

/* 학습 팁 */
.if-tip-text {
  font-size: 0.875rem;
  color: #555;
  line-height: 1.7;
}

/* 꼬리 질문 */
.if-followup-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.if-followup-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: #fafafa;
  border-radius: 8px;
}

.if-followup-num {
  font-size: 0.78rem;
  font-weight: 700;
  color: #888;
  flex-shrink: 0;
  padding-top: 2px;
}

.if-followup-text {
  font-size: 0.875rem;
  color: #333;
  line-height: 1.5;
}

/* 푸터 */
.if-footer {
  display: flex;
  justify-content: flex-start;
  margin-top: 24px;
}

.if-btn-back {
  padding: 12px 32px;
  background: #3a3a3a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.if-btn-back:hover {
  background: #1a1a1a;
}

/* 반응형 */
@media (max-width: 600px) {
  .if-answer-grid {
    grid-template-columns: 1fr;
  }

  .if-score-row {
    flex-wrap: wrap;
  }

  .if-score-card {
    min-width: calc(50% - 5px);
  }
}

/* src/pages/interview/InterviewSessionPage.css */
.is-page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

/* 헤더 */
.is-header {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.is-back {
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  padding: 0;
  line-height: 1;
}

.is-header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
}

/* 컨테이너 */
.is-container {
  max-width: 860px;
  margin: 0 auto;
  padding: 32px 24px 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 질문 */
.is-question {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
  text-align: left;
  width: 100%;
  line-height: 1.6;
}

/* 카메라 */
.is-video-wrap {
  width: 100%;
  max-width: 740px;
  aspect-ratio: auto 16/9;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin-bottom: 16px;
}

.is-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.is-rec-dot {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 10px;
  height: 10px;
  background: #e53935;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* 타이머 */
.is-timer-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  max-width: 740px;
  margin-bottom: 16px;
}

.is-timer {
  font-size: 2rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  transition: color 0.3s;
}

.is-timer-label {
  font-size: 0.75rem;
  color: #aaa;
  margin-top: 2px;
}

/* 버튼 */
.is-btn-wrap {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 740px;
}

.is-btn-skip {
  flex: 1;
  padding: 13px;
  border: 1.5px solid #d0d0d0;
  border-radius: 8px;
  background: #fff;
  font-size: 0.95rem;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}

.is-btn-skip:hover {
  border-color: #999;
}

.is-btn-skip:disabled,
.is-btn-main:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.is-btn-main {
  flex: 2;
  padding: 13px;
  background: #555;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.is-btn-main:hover {
  background: #333;
}

/* 기타 옵션 */
.is-extra-opts {
  width: 100%;
  max-width: 740px;
  margin-top: 20px;
}

.is-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.is-divider::before,
.is-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

.is-divider span {
  font-size: 0.8rem;
  color: #aaa;
  white-space: nowrap;
}

.is-direct-analysis {
  background: none;
  border: none;
  font-size: 0.875rem;
  color: #e53935;
  cursor: pointer;
  text-decoration: underline;
  display: block;
  margin: 0 auto;
}

.is-direct-analysis:hover {
  color: #c62828;
}

.is-direct-analysis:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* STT 로딩 */
.is-stt-loading {
  font-size: 0.875rem;
  color: #888;
  margin-bottom: 12px;
  text-align: center;
  animation: pulse 1.5s infinite;
}

/* 디버그 오버레이 canvas */
.is-debug-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;  /* 클릭 이벤트 통과 */
}

/* 분석 상태 UI */
.is-detection-status {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(0, 0, 0, 0.5);
  padding: 6px 10px;
  border-radius: 8px;
  pointer-events: none;
}

.is-status-on {
  font-size: 11px;
  color: #4caf50;  /* 초록색: 감지됨 */
}

.is-status-off {
  font-size: 11px;
  color: #f44336;  /* 빨간색: 미감지 */
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* src/pages/interview/interviewStartPage.css */
.in-page {
  min-height: 100vh;
  background: #fafafa;
}

.in-container {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.in-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.in-subtitle {
  font-size: 0.875rem;
  color: #888;
  margin-bottom: 32px;
}

/* 섹션 */
.in-section {
  margin-bottom: 32px;
}

.in-section-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.in-section-sub {
  font-size: 0.8rem;
  font-weight: 400;
  color: #888;
  margin-left: 4px;
}

/* 모드 카드 */
.in-mode-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.in-mode-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 16px;
  border: 1.5px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}

.in-mode-card:hover {
  border-color: #ccc;
}

.in-mode-card.active {
  border-color: #e57373;
  background: #fff5f5;
}

.in-mode-card strong {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.in-mode-card span {
  font-size: 0.8rem;
  color: #888;
  line-height: 1.5;
}

/* 카테고리 그룹 */
.in-category-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  margin-top: 16px;
}

.in-load-my-info-btn {
  font-size: 0.8rem;
  color: #555;
  background: none;
  border: 1.5px solid #d0d0d0;
  border-radius: 16px;
  padding: 4px 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.in-load-my-info-btn:hover:not(:disabled) {
  border-color: #999;
  color: #333;
}

.in-load-my-info-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.in-category-group-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  margin-top: 0
}

.in-job-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.in-job-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.in-job-group-label {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 4px;
}

/* 칩 */
.in-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.in-chip {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid #e0e0e0;
  background: #fff;
  font-size: 0.85rem;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}

.in-chip:hover:not(.disabled) {
  border-color: #bbb;
}

.in-chip.selected {
  border-color: #1a1a1a;
  background: #1a1a1a;
  color: #fff;
}

.in-chip.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 직접입력 */
.in-manual-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.in-manual-card {
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
}

.in-manual-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.in-manual-card-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
}

.in-manual-delete {
  font-size: 0.8rem;
  color: #e57373;
  background: none;
  border: none;
  cursor: pointer;
}

.in-manual-field {
  margin-bottom: 10px;
}

.in-manual-label {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 4px;
  display: block;
}

.in-manual-select {
  width: 100%;
  height: 38px;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 10px;
  font-size: 0.875rem;
  color: #333;
  background: #fff;
  cursor: pointer;
}

.in-manual-textarea {
  width: 100%;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.875rem;
  color: #333;
  resize: none;
  box-sizing: border-box;
  font-family: inherit;
}

.in-manual-textarea:focus {
  outline: none;
  border-color: #888;
}

.in-add-btn {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border: 1.5px dashed #ccc;
  border-radius: 10px;
  background: none;
  font-size: 0.875rem;
  color: #888;
  cursor: pointer;
  transition: all 0.15s;
}

.in-add-btn:hover {
  border-color: #999;
  color: #555;
}

/* 에러 */
.in-error {
  font-size: 0.875rem;
  color: #e57373;
  margin-bottom: 12px;
  text-align: right;
}

/* 인라인 에러 */
.in-field-error {
  font-size: 0.8rem;
  color: #e57373;
  margin-top: 4px;
}

.in-manual-select.error {
  border-color: #e57373;
}

.in-manual-textarea.error {
  border-color: #e57373;
}

/* 하단 버튼 */
.in-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.in-start-btn {
  padding: 12px 40px;
  background: #3a3a3a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.in-start-btn:hover:not(:disabled) {
  background: #1a1a1a;
}

.in-start-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* src/pages/dashboard/DashboardPage.css */
.dash-page {
    min-height: 100vh;
    background: #fafafa;
}

.dash-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 24px 80px;
}

.dash-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    color: #aaa;
}

/* ── 빈 상태 ── */
.dash-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
    padding: 40px 20px;
}

.dash-empty-icon {
    font-size: 3rem;
    margin-bottom: 20px;
}

.dash-empty-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 12px;
}

.dash-empty-desc {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.8;
    margin-bottom: 28px;
}

.dash-empty-btn {
    background: #3a3a3a;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 14px 32px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    margin-bottom: 48px;
    font-family: 'Noto Sans KR', sans-serif;
    transition: background 0.15s;
}

.dash-empty-btn:hover {
    background: #1a1a1a;
}

.dash-steps {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
}

.dash-step-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #f5f5ff;
    margin: 0 auto 14px;
}

.dash-step {
    background: white;
    border: 1.5px solid #e8e8e8;
    border-radius: 12px;
    padding: 24px 20px;
    width: 240px;
    text-align: center;
}

.dash-step-num {
    font-size: 1.5rem;
    margin-bottom: 8px;
}

.dash-step-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
}

.dash-step-desc {
    font-size: 0.8rem;
    color: #888;
    line-height: 1.5;
    word-break: keep-all;
}

/* ── 헤더 ── */
.dash-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.dash-greeting {
    font-size: 1.1rem;
    font-weight: 500;
    color: #1a1a1a;
}

.dash-greeting strong {
    font-weight: 700;
}

.dash-start-btn {
    background: #3a3a3a;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 0.875rem;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
    transition: background 0.15s;
}

.dash-start-btn:hover {
    background: #1a1a1a;
}

/* ── 통계 카드 ── */
.dash-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 20px;
}

.dash-card {
    background: white;
    border: 1.5px solid #e8e8e8;
    border-radius: 14px;
    padding: 24px;
    text-align: center;
}

.dash-card-label {
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 8px;
}

.dash-card-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
}

/* ── 메인 (차트 + 항목별 평균) ── */
.dash-main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 20px;
}

.dash-chart-wrap,
.dash-detail-wrap {
    background: white;
    border: 1.5px solid #e8e8e8;
    border-radius: 14px;
    padding: 24px;
}

.dash-section-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 16px;
}

/* ── 항목별 평균 ── */
.dash-detail-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.dash-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}

.dash-detail-label {
    font-size: 0.82rem;
    color: #555;
}

.dash-detail-score {
    font-size: 0.82rem;
    font-weight: 600;
    color: #1a1a1a;
}

.dash-detail-bar-bg {
    height: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
}

.dash-detail-bar {
    height: 100%;
    border-radius: 4px;
    transition: width 0.8s ease;
}

/* ── 세션 목록 ── */
.dash-sessions {
    background: white;
    border: 1.5px solid #e8e8e8;
    border-radius: 14px;
    padding: 24px;
}

.dash-session-list {
    display: flex;
    flex-direction: column;
}

.dash-session-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1.5px solid #f5f5f5;
    cursor: pointer;
    transition: background 0.1s;
    border-radius: 4px;
    gap: 12px;
}

.dash-session-item:last-child {
    border-bottom: none;
}

.dash-session-item:hover {
    background: #fafafa;
}

.dash-session-info {
    flex: 1;
    min-width: 0;
}

.dash-session-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.dash-session-meta {
    font-size: 0.75rem;
    color: #aaa;
}

.dash-session-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.dash-session-badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    border: 1px solid;
    white-space: nowrap;
}

.dash-session-score {
    font-size: 0.9rem;
    font-weight: 700;
    color: #1a1a1a;
    white-space: nowrap;
}

.dash-session-arrow {
    font-size: 1.1rem;
    color: #ccc;
}

/* ── 페이징 ── */
.dash-paging {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-top: 16px;
}

.dash-paging button {
    width: 30px;
    height: 30px;
    border: 1.5px solid #e8e8e8;
    border-radius: 6px;
    background: white;
    font-size: 0.8rem;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
    transition: all 0.1s;
    color: #555;
}

.dash-paging button:hover:not(:disabled) {
    border-color: #3a3a3a;
    color: #1a1a1a;
}

.dash-paging button.active {
    background: #3a3a3a;
    color: white;
    border-color: #3a3a3a;
}

.dash-paging button:disabled {
    opacity: 0.3;
    cursor: default;
}

.dash-page-ellipsis {
    padding: 0 4px;
    color: #aaa;
    font-size: 0.8rem;
}

/* src/pages/main/MainPage.css */
.main-page {
  width: 100%;
}

/* ── Hero: 진짜 풀 너비 ── */
.hero {
  position: relative;
  width: 100%;
  height: 480px;
  background: #0F2854;  /* Spline 로딩 전 배경 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Spline을 배경으로 */
.hero-spline {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-spline canvas {
  width: 100% !important;
  height: 100% !important;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(189,232,245,0.12) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(73,136,196,0.2) 0%, transparent 50%);
}

/* 텍스트는 Spline 위에 */
.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  padding: 60px 20px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: #BDE8F5;
  margin-bottom: 20px;
  font-weight: 400;
}

.hero-divider {
  width: 2px;
  height: 36px;
  background: rgba(189,232,245,0.5);
  margin: 0 auto 24px;
}

.hero-btn {
  background: white;
  color: #0F2854;
  border: none;
  border-radius: 50px;
  padding: 14px 42px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Noto Sans KR', sans-serif;
  box-shadow: 0 4px 20px rgba(15,40,84,0.25);
}

.hero-btn:hover {
  background: #BDE8F5;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(15,40,84,0.3);
}

/* ── Features: 큰 화면에서 넉넉하게 ── */
.features {
  width: 100%;
  padding: 72px 0;
  background: #ffffff;
}

.features-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-img {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #f0f4fb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  border: 1px solid #e0e8f4;
}

.feature-icon {
  font-size: 3.5rem;
}

.feature-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #0F2854;
}

.feature-desc {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.7;
  margin: 0;
}

/* ── 반응형 ── */
@media (max-width: 1024px) {
  .features-inner {
    gap: 24px;
    padding: 0 32px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .features-inner {
    grid-template-columns: 1fr;
    max-width: 480px;
    padding: 0 24px;
  }
}

/* src/pages/board/BoardPage.css */
.board-wrap {
    min-height: 100vh;
    background: #f8f9fa;
}

.board-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 32px 20px;
}

/* 탭 */
.board-tabs {
    display: flex;
    gap: 0;
    border-bottom: 2px solid #e0e0e0;
    margin-bottom: 24px;
}

.board-tab {
    padding: 10px 28px;
    background: none;
    border: none;
    font-size: 1rem;
    font-weight: 500;
    color: #888;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.15s;
    font-family: 'Noto Sans KR', sans-serif;
}

.board-tab.active {
    color: #0F2854;
    border-bottom: 2px solid #0F2854;
    font-weight: 700;
}

/* 검색 */
.board-search-wrap {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
}

.board-search-type {
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.875rem;
    font-family: 'Noto Sans KR', sans-serif;
    background: white;
    cursor: pointer;
}

.board-search-input {
    flex: 1;
    padding: 8px 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.875rem;
    font-family: 'Noto Sans KR', sans-serif;
    outline: none;
}

.board-search-input:focus {
    border-color: #0F2854;
}

.board-search-btn {
    padding: 8px 18px;
    background: #0F2854;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
}

/* 카테고리 필터 */
.board-filter-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
    padding: 12px 16px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
}

.board-filter-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.board-filter-label {
    font-size: 0.8rem;
    color: #888;
    min-width: 56px;
    font-weight: 500;
}

.board-filter-btns {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.board-filter-btn {
    padding: 4px 14px;
    border: 1px solid #ddd;
    border-radius: 50px;
    background: white;
    font-size: 0.8rem;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
    transition: all 0.15s;
}

.board-filter-btn.active {
    background: #0F2854;
    color: white;
    border-color: #0F2854;
}

.board-filter-sub {
    padding-top: 8px;
    border-top: 1px dashed #eee;
}

/* 게시글 목록 */
.board-list {
    background: white;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    overflow: hidden;
    margin-bottom: 20px;
}

.board-loading,
.board-empty {
    padding: 60px 20px;
    text-align: center;
    color: #aaa;
    font-size: 0.9rem;
}

.board-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background 0.1s;
}

.board-item:last-child {
    border-bottom: none;
}

.board-item:hover {
    background: #f8f9fa;
}

.board-item.notice {
    background: #fffbe6;
}

.board-item-main {
    flex: 1;
    min-width: 0;
}

.board-item-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
}

.board-item-category {
    font-size: 0.75rem;
    color: #888;
}

.board-item-cscategory {
    font-size: 0.75rem;
    color: #0F2854;
    font-weight: 600;
}

.board-item-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: #222;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.board-item-info {
    display: flex;
    gap: 8px;
    font-size: 0.75rem;
    color: #aaa;
}

.board-item-tags {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    margin-top: 4px;
}

.board-item-tag {
    font-size: 0.72rem;
    color: #666;
    background: #f0f4fb;
    padding: 2px 8px;
    border-radius: 50px;
}

.board-item-counts {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    font-size: 0.75rem;
    color: #888;
    white-space: nowrap;
    margin-left: 16px;
    min-width: 80px;
}

.board-item-counts span {
    display: flex;
    align-items: center;
    gap: 4px;
}

/* 하단 */
.board-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.board-paging {
    display: flex;
    align-items: center;
    gap: 4px;
}

.board-paging button {
    width: 32px;
    height: 32px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    font-size: 0.875rem;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
    transition: all 0.1s;
}

.board-paging button:hover:not(:disabled) {
    background: #f0f4fb;
    border-color: #0F2854;
}

.board-paging button.active {
    background: #0F2854;
    color: white;
    border-color: #0F2854;
}

.board-paging button:disabled {
    opacity: 0.3;
    cursor: default;
}

.board-page-ellipsis {
    padding: 0 4px;
    color: #aaa;
}

.board-write-btn {
    position: absolute;
    right: 0;
    padding: 8px 20px;
    background: #0F2854;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
}

.board-write-btn:hover {
    background: #1a3d6e;
}

@media (max-width: 768px) {
    .board-container {
        padding: 16px 12px;
    }
    .board-tab {
        padding: 8px 16px;
        font-size: 0.9rem;
    }
    .board-search-wrap {
        flex-wrap: wrap;
    }
    .board-search-type {
        width: 100%;
    }
}

/* src/pages/board/BoardWritePage.css */
.board-write-wrap {
    min-height: 100vh;
    background: #f8f9fa;
}

.board-write-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px 20px;
}

/* 헤더 */
.board-write-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
}

.board-write-back {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #555;
    padding: 4px 8px;
}

.board-write-title-header {
    font-size: 1.1rem;
    font-weight: 700;
    color: #0F2854;
}

.board-write-submit-btn {
    padding: 8px 20px;
    background: #0F2854;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
}

.board-write-submit-btn:disabled {
    opacity: 0.5;
    cursor: default;
}

/* 바디 */
.board-write-body {
    background: white;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    padding: 28px;
}

.board-write-section-title {
    font-size: 1rem;
    font-weight: 700;
    color: #111;
    margin-bottom: 24px;
}

/* 필드 */
.board-write-field {
    margin-bottom: 24px;
}

.board-write-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.required {
    color: #e53935;
    margin-left: 2px;
}

/* 유형 버튼 */
.board-write-type-btns {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.board-write-type-btn {
    padding: 8px 20px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    font-size: 0.875rem;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
    transition: all 0.15s;
}

.board-write-type-btn.active {
    background: #0F2854;
    color: white;
    border-color: #0F2854;
}

/* 입력 */
.board-write-input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.875rem;
    font-family: 'Noto Sans KR', sans-serif;
    outline: none;
    box-sizing: border-box;
}

.board-write-input:focus {
    border-color: #0F2854;
}

/* CS 카테고리 필터 */
.board-write-filter-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
}

.board-write-filter-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.board-write-filter-label {
    font-size: 0.8rem;
    color: #888;
    min-width: 56px;
    font-weight: 500;
}

.board-write-filter-btns {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.board-write-filter-btn {
    padding: 4px 14px;
    border: 1px solid #ddd;
    border-radius: 50px;
    background: white;
    font-size: 0.8rem;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
    transition: all 0.15s;
}

.board-write-filter-btn.active {
    background: #0F2854;
    color: white;
    border-color: #0F2854;
}

.board-write-filter-sub {
    padding-top: 8px;
    border-top: 1px dashed #ddd;
}

/* 텍스트에리어 */
.board-write-textarea {
    width: 100%;
    min-height: 240px;
    padding: 12px 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.875rem;
    font-family: 'Noto Sans KR', sans-serif;
    outline: none;
    resize: vertical;
    box-sizing: border-box;
    line-height: 1.7;
}

.board-write-textarea:focus {
    border-color: #0F2854;
}

/* 해시태그 */
.board-write-hashtag-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    min-height: 42px;
    align-items: center;
    background: white;
}

.board-write-hashtag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #f0f4fb;
    color: #0F2854;
    padding: 3px 10px;
    border-radius: 50px;
    font-size: 0.8rem;
}

.board-write-hashtag button {
    background: none;
    border: none;
    cursor: pointer;
    color: #888;
    font-size: 0.9rem;
    padding: 0;
    line-height: 1;
}

.board-write-hashtag-input {
    border: none;
    outline: none;
    font-size: 0.875rem;
    font-family: 'Noto Sans KR', sans-serif;
    min-width: 120px;
    flex: 1;
}

/* 하단 버튼 */
.board-write-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
}

/* src/pages/board/BoardDetailPage.css */
.board-detail-wrap {
    min-height: 100vh;
    background: #f8f9fa;
}

.board-detail-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px 20px;
}

.board-detail-loading {
    text-align: center;
    padding: 80px 20px;
    color: #aaa;
}

.board-detail-back {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #555;
    padding: 4px 8px;
    margin-bottom: 16px;
}

/* 게시글 */
.board-detail-post {
    background: white;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    padding: 28px;
    margin-bottom: 16px;
}

.board-detail-breadcrumb {
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 10px;
}

.board-detail-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #111;
    margin-bottom: 16px;
    line-height: 1.5;
}

.board-detail-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.board-detail-author-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
}

.board-detail-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #ddd;
}

.board-detail-author {
    font-size: 0.9rem;
    font-weight: 600;
    color: #222;
}

.board-detail-date {
    font-size: 0.75rem;
    color: #aaa;
    margin-top: 2px;
}

.board-detail-counts {
    display: flex;
    gap: 12px;
    font-size: 0.8rem;
    color: #888;
}

.board-detail-counts span {
    display: flex;
    align-items: center;
    gap: 4px;
}

.board-detail-divider {
    border: none;
    border-top: 1px solid #f0f0f0;
    margin: 16px 0;
}

.board-detail-content {
    font-size: 0.95rem;
    color: #333;
    line-height: 1.8;
    white-space: pre-wrap;
    min-height: 100px;
    margin-bottom: 16px;
}

.board-detail-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 16px;
}

.board-detail-tag {
    font-size: 0.75rem;
    color: #666;
    background: #f0f4fb;
    padding: 3px 10px;
    border-radius: 50px;
}

/* 좋아요/스크랩 */
.board-detail-actions {
    display: flex;
    flex-direction: row;
    gap: 16px;
    justify-content: center;
    align-items: center;
    padding: 8px 0;
}

.board-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 24px;
    border: 1px solid #ddd;
    border-radius: 50px;
    background: white;
    font-size: 0.875rem;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
    transition: all 0.15s;
}

.board-action-btn.active {
    background: #0F2854;
    color: white;
    border-color: #0F2854;
}


/* 댓글 */
.board-detail-comments {
    background: white;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    padding: 20px;
    margin-bottom: 16px;
}

.board-comment-header {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    font-size: 0.8rem;
    color: #888;
}

.board-comment-sort {
    cursor: pointer;
}

.board-comment-group {
    margin-bottom: 8px;
}

.board-comment-indent {
    padding-left: 40px;
}

.board-comment-item {
    display: flex;
    gap: 10px;
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f5;
}

.board-comment-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #ddd;
    flex-shrink: 0;
}

.board-comment-body {
    flex: 1;
}

.board-comment-top {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
}

.board-comment-author {
    font-size: 0.875rem;
    font-weight: 600;
    color: #222;
}

.board-comment-badge {
    font-size: 0.7rem;
    background: #0F2854;
    color: white;
    padding: 1px 6px;
    border-radius: 4px;
}

.board-comment-content {
    font-size: 0.875rem;
    color: #333;
    line-height: 1.6;
    margin-bottom: 6px;
    white-space: pre-wrap;
}

.board-comment-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.board-comment-date {
    font-size: 0.75rem;
    color: #aaa;
    display: flex;
    align-items: center;
    gap: 8px;
}

.board-comment-reply-btn {
    background: none;
    border: none;
    font-size: 0.75rem;
    color: #888;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
    padding: 0;
}

.board-comment-actions {
    display: flex;
    gap: 8px;
}

.board-comment-actions button {
    background: none;
    border: none;
    font-size: 0.75rem;
    color: #888;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
}

/* 댓글 입력 */
.board-comment-input-wrap {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px;
    margin-top: 16px;
}

.board-comment-input-wrap.reply-input {
    margin-top: 8px;
    background: #f8f9fa;
}

.board-comment-input-author {
    font-size: 0.875rem;
    font-weight: 600;
    color: #222;
    margin-bottom: 8px;
}

.board-comment-textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    font-size: 0.875rem;
    font-family: 'Noto Sans KR', sans-serif;
    background: transparent;
    min-height: 60px;
    color: #333;
    box-sizing: border-box;
}

.board-comment-input-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
}

.board-comment-submit-btn {
    padding: 6px 16px;
    background: #0F2854;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
}

.board-comment-edit-wrap {
    margin-bottom: 6px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px;
    background: white;
}

.board-comment-edit-wrap .board-comment-textarea {
    min-height: 60px;
    color: #333;
}

.board-comment-edit-wrap .board-comment-submit-btn {
    display: flex;
    margin-top: 8px;
    margin-left: auto;
}

/* 하단 버튼 */
.board-detail-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.board-detail-footer-left {
    display: flex;
    gap: 8px;
}

.board-footer-btn {
    padding: 8px 20px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    font-size: 0.875rem;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
}

.board-footer-btn.primary {
    background: #0F2854;
    color: white;
    border-color: #0F2854;
}

.board-footer-btn.danger {
    color: #e53935;
    border-color: #e53935;
}

/* src/pages/mypage/MyPage.css */
/* src/pages/mypage/MyPage.css */

.mp-page {
  width: 100%;
  min-height: 100vh;
  background: #f8f9fb;
  display: flex;
  flex-direction: column;
}

.mp-modal-help-text {
  font-size: 0.875rem;
  color: #555;
  margin-bottom: 10px;
}

.mp-modal-sub-help-text {
  font-size: 0.78rem;
  color: #aaa;
}

.mp-modal-full-width {
  margin-bottom: 6px;
  width: 100%;
  box-sizing: border-box;
}


/* ── 레이아웃 ── */
.mp-layout {
  display: flex;
  max-width: 1100px;
  margin: 32px auto;
  padding: 0 24px;
  gap: 32px;
  width: 100%;
  box-sizing: border-box;
}

/* ── 사이드바 ── */
.mp-sidebar {
  width: 180px;
  flex-shrink: 0;
}

.mp-sidebar-section {
  margin-bottom: 8px;
}

.mp-sidebar-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 6px 12px;
  margin-bottom: 4px;
}

.mp-sidebar-item {
  display: block;
  width: 100%;
  padding: 9px 12px;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.88rem;
  font-family: "Noto Sans KR", sans-serif;
  color: #555;
  cursor: pointer;
  border-radius: 6px;
  transition:
    background 0.15s,
    color 0.15s;
}

.mp-sidebar-item:hover {
  background: #eef0f5;
  color: #1a1a1a;
}

.mp-sidebar-item.active {
  background: #1a1a1a;
  color: #fff;
  font-weight: 600;
}

.mp-sidebar-item.danger {
  color: #d32f2f;
}

.mp-sidebar-item.danger:hover {
  background: #fff0f0;
}

/* ── 콘텐츠 영역 ── */
.mp-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── 프로필 헤더 ── */
.mp-profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.mp-avatar {
  width: 52px;
  height: 52px;
  background: #e0e4ef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: #8899bb;
  flex-shrink: 0;
  position: relative;
}

.mp-avatar-edit {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  background: #555;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.65rem;
  color: #fff;
}

.mp-profile-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a1a;
}

.mp-profile-joined {
  font-size: 0.82rem;
  color: #aaa;
  margin-top: 2px;
}

/* ── 탭 ── */
.mp-tabs {
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 4px;
}

.mp-tab {
  padding: 10px 20px;
  background: none;
  border: none;
  font-size: 0.95rem;
  font-family: "Noto Sans KR", sans-serif;
  color: #aaa;
  cursor: pointer;
  border-bottom: 2.5px solid transparent;
  margin-bottom: -2px;
  font-weight: 500;
  transition: color 0.15s;
}

.mp-tab.active {
  color: #1a1a1a;
  font-weight: 700;
  border-bottom-color: #1a1a1a;
}

/* ── 카드 섹션 ── */
.mp-card {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e8ecf3;
  padding: 24px 28px;
}

.mp-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f0f0f0;
}

.mp-card-title--compact {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.mp-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

/* ── 정보 행 ── */
.mp-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  gap: 12px;
}

.mp-row:last-child {
  border-bottom: none;
}

.mp-target-job-row {
  justify-content: space-between;
}

.mp-target-job-name {
  font-size: 0.875rem;
  color: #1a1a1a;
}

.mp-target-job-period,
.mp-employment-period {
  font-size: 0.8rem;
  color: #aaa;
}

.mp-employment-row {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.mp-employment-company {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
}

.mp-employment-category {
  font-size: 0.85rem;
  color: #666;
}

.mp-empty-message {
  color: #aaa;
  font-size: 0.875rem;
}

.mp-row-label {
  width: 80px;
  flex-shrink: 0;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  min-width: 100px;
  flex-shrink: 0;
  color: #888;
}

.mp-row-value {
  flex: 1;
  font-size: 0.9rem;
  color: #1a1a1a;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mp-row-value input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: "Noto Sans KR", sans-serif;
  color: #1a1a1a;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.mp-row-value input:focus {
  border-color: #1c4d8d;
}

.mp-row-value input:read-only {
  background: #f8f9fb;
  color: #888;
  cursor: default;
}

.mp-row-btn {
  flex-shrink: 0;
  height: 36px;
  padding: 0 16px;
  background: #fff;
  color: #444;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: "Noto Sans KR", sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.mp-row-btn:hover {
  background: #f5f5f5;
  border-color: #999;
}

.mp-row-btn.primary {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}

.mp-row-btn.primary:hover {
  background: #333;
}

/* ── 비밀번호 행 ── */
.mp-pw-dots {
  letter-spacing: 3px;
  font-size: 1rem;
  color: #bbb;
}

/* ── SNS 계정 연결 ── */
.mp-sns-row {
  display: flex;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
  gap: 12px;
}

.mp-sns-row:last-child {
  border-bottom: none;
}

.mp-sns-label {
  width: auto;
  min-width: 100px;
  flex-shrink: 0;
  white-space: nowrap;
  font-size: 0.85rem;
  font-weight: 600;
  color: #888;
}

.mp-sns-icons {
  flex: 1;
  display: flex;
  gap: 10px;
}

.mp-sns-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
  border: none;
}

.mp-sns-icon:hover {
  opacity: 0.8;
}

.mp-sns-icon.google {
  background: #e53935;
  color: #fff;
}
.mp-sns-icon.kakao {
  background: #fee500;
  color: #1a1a1a;
}
.mp-sns-icon.naver {
  background: #03c75a;
  color: #fff;
}

.mp-sns-icon.inactive {
  background: #e8e8e8;
  color: #bbb;
  cursor: default;
}

.mp-sns-icon.inactive:hover {
  opacity: 1;
}

/* ── 힌트/에러 ── */
.mp-hint {
  font-size: 0.78rem;
  color: #aaa;
  margin-top: 4px;
}

.mp-hint.error {
  color: #d32f2f;
}
.mp-hint.ok {
  color: #1a7f4b;
}

/* ── 모달 ── */
.mp-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.mp-modal {
  background: #fff;
  border-radius: 14px;
  padding: 32px 36px;
  width: 420px;
  max-width: 90vw;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.18);
}

.mp-modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.mp-modal-field {
  margin-bottom: 14px;
}

.mp-modal-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
}

.mp-modal-required {
  color: #d32f2f;
  margin-left: 2px;
}

.mp-modal-input {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: "Noto Sans KR", sans-serif;
  color: #1a1a1a;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.mp-modal-input:focus {
  border-color: #1c4d8d;
}
.mp-modal-input.error {
  border-color: #d32f2f;
}

.mp-modal-btn-row {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
}

.mp-modal-btn {
  height: 42px;
  padding: 0 22px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Noto Sans KR", sans-serif;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid #d0d0d0;
  background: #fff;
  color: #444;
}

.mp-modal-btn:hover {
  background: #f5f5f5;
}

.mp-modal-btn.primary {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}

.mp-modal-btn.primary:hover {
  background: #333;
}
.mp-modal-btn.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mp-modal-btn.danger {
  background: #d32f2f;
  color: #fff;
  border-color: #d32f2f;
}

.mp-modal-btn.danger:hover {
  background: #b71c1c;
}
.mp-modal-btn.danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── 탈퇴 모달 안내 박스 ── */
.mp-withdraw-warn {
  background: #fff5f5;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 16px;
}

.mp-withdraw-warn-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #d32f2f;
  margin-bottom: 8px;
}

.mp-withdraw-warn ul {
  margin: 0;
  padding-left: 18px;
}

.mp-withdraw-warn li {
  font-size: 0.82rem;
  color: #555;
  margin-bottom: 4px;
}

.mp-withdraw-check-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.875rem;
  color: #444;
  cursor: pointer;
  margin-bottom: 10px;
  line-height: 1.5;
}

.mp-withdraw-check-label input[type="checkbox"] {
  width: 15px;
  height: 15px;
  margin-top: 2px;
  accent-color: #1a1a1a;
  flex-shrink: 0;
  cursor: pointer;
}

/* ── 반응형 ── */
@media (max-width: 768px) {
  .mp-layout {
    flex-direction: column;
    margin: 16px auto;
    padding: 0 16px;
    gap: 16px;
  }

  .mp-sidebar {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .mp-sidebar-title {
    display: none;
  }

  .mp-sidebar-item {
    padding: 7px 14px;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    font-size: 0.82rem;
  }

    .mp-card {
    padding: 16px;
  }

  .mp-row {
    flex-wrap: wrap;
    gap: 8px;
  }

  .mp-row-label {
    width: 100%;
    min-width: unset;
  }

  .mp-row-value {
    flex: 1;
    white-space: normal;   /* 모바일에서는 줄바꿈 허용 */
    min-width: 0;
  }

  .mp-row-btn {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .mp-sns-row {
    flex-wrap: wrap;
    gap: 8px;
  }

  .mp-sns-label {
    width: 100%;
    min-width: unset;
  }

  .mp-sns-icons {
    flex-wrap: nowrap;
  }
}

/* ── 내 활동 ── */
.mp-activity-menu {
    display: flex;
    gap: 0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 16px;
}

.mp-activity-menu-item {
    padding: 8px 16px;
    background: none;
    border: none;
    font-size: 0.875rem;
    font-family: 'Noto Sans KR', sans-serif;
    color: #aaa;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 0.15s;
    font-weight: 500;
}

.mp-activity-menu-item.active {
    color: #1a1a1a;
    font-weight: 700;
    border-bottom-color: #1a1a1a;
}

.mp-activity-list {
    min-height: 200px;
}

.mp-activity-empty {
    text-align: center;
    padding: 60px 20px;
    color: #aaa;
    font-size: 0.875rem;
}

.mp-activity-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f5;
    cursor: pointer;
    transition: background 0.1s;
}

.mp-activity-item:last-child {
    border-bottom: none;
}

.mp-activity-item:hover {
    background: #f8f9fb;
}

.mp-activity-checkbox {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #1a1a1a;
}

.mp-activity-content {
    flex: 1;
    min-width: 0;
}

.mp-activity-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mp-activity-meta {
    display: flex;
    gap: 4px;
    font-size: 0.75rem;
    color: #aaa;
}

.mp-activity-post-title {
    font-size: 0.75rem;
    color: #888;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mp-activity-counts {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    font-size: 0.75rem;
    color: #aaa;
    white-space: nowrap;
    flex-shrink: 0;
}

.mp-activity-counts span {
    display: flex;
    align-items: center;
    gap: 3px;
}

.mp-activity-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    margin-top: 8px;
    border-top: 1px solid #f0f0f0;
}

.mp-activity-select-all {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    color: #555;
    cursor: pointer;
}

.mp-activity-select-all input[type="checkbox"] {
    width: 15px;
    height: 15px;
    accent-color: #1a1a1a;
    cursor: pointer;
}

.mp-activity-footer-btns {
    display: flex;
    gap: 8px;
}

.mp-activity-paging {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-top: 16px;
}

.mp-activity-paging button {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    font-size: 0.8rem;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
    transition: all 0.1s;
}

.mp-activity-paging button:hover:not(:disabled) {
    background: #f0f4fb;
    border-color: #1a1a1a;
}

.mp-activity-paging button.active {
    background: #1a1a1a;
    color: white;
    border-color: #1a1a1a;
}

.mp-activity-paging button:disabled {
    opacity: 0.3;
    cursor: default;
}

.mp-page-ellipsis {
    padding: 0 4px;
    color: #aaa;
    font-size: 0.8rem;
}

@media (max-width: 480px) {
  .mp-row-btn {
    font-size: 0.78rem;
    padding: 0 10px;
    height: 32px;
  }

  .mp-sns-icon {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
}

/* src/styles/jobForm.css */
/* src/styles/jobForm.css */
/* 목표직무/재직이력 공통 스타일 (SignupStep2, SignupStep3, MyPage에서 공유) */
/* ── 안내 문구 ── */
.jf-guide-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
}
.jf-guide-sub {
  font-size: 0.875rem;
  font-weight: 400;
  color: #888;
}
.jf-tab-desc {
  font-size: 0.82rem;
  color: #aaa;
  margin: 12px 0 14px;
}

/* ── 대분류 탭 ── */
.jf-tabs {
  display: flex;
  border-bottom: 1.5px solid #e0e0e0;
  margin-bottom: 0;
}
.jf-tab {
  flex-shrink: 0;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #aaa;
  background: none;
  border: none;
  border-bottom: 2.5px solid transparent;
  margin-bottom: -1.5px;
  cursor: pointer;
  white-space: nowrap;
  font-family: "Noto Sans KR", sans-serif;
  transition: color 0.15s;
}
.jf-tab:hover {
  color: #555;
}
.jf-tab.active {
  color: #1a1a1a;
  font-weight: 700;
  border-bottom-color: #1a1a1a;
}

/* ── 중분류 칩 ── */
.jf-job-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 14px 0 24px;
}
.jf-job-chip {
  padding: 8px 18px;
  border: 1.5px solid #d0d0d0;
  border-radius: 20px;
  font-size: 0.875rem;
  font-family: "Noto Sans KR", sans-serif;
  background: #fff;
  color: #444;
  cursor: pointer;
  transition: all 0.15s;
}
.jf-job-chip:hover:not(.disabled) {
  border-color: #888;
}
.jf-job-chip.selected {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #fff;
  font-weight: 600;
}
.jf-job-chip.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ── 선택된 직무 박스 ── */
.jf-selected-box {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px 18px;
  margin-bottom: 28px;
  min-height: 80px;
}
.jf-selected-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.jf-selected-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
}
.jf-selected-limit {
  font-size: 0.8rem;
  color: #aaa;
}
.jf-selected-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.jf-selected-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border: 1.5px solid #d0d0d0;
  border-radius: 20px;
  font-size: 0.85rem;
  background: #fff;
  color: #1a1a1a;
}
.jf-chip-remove {
  background: none;
  border: none;
  font-size: 0.75rem;
  color: #888;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.jf-chip-remove:hover {
  color: #d32f2f;
}

/* ── 날짜 입력 ── */
.jf-period {
  margin-bottom: 32px;
}
.jf-period-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 10px;
}
.jf-period-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.jf-input {
  flex: 1;
  height: 46px;
  padding: 0 14px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: "Noto Sans KR", sans-serif;
  color: #1a1a1a;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}
.jf-input::placeholder {
  color: #bbb;
}
.jf-input:focus {
  border-color: #1c4d8d;
}
.jf-input:disabled {
  background: #f5f5f5;
  color: #bbb;
  cursor: not-allowed;
}
.jf-input--error {
  border-color: #d32f2f !important;
}
.jf-period-dash {
  font-size: 1rem;
  color: #888;
  flex-shrink: 0;
}
.jf-hint--error {
  font-size: 0.78rem;
  color: #d32f2f;
  margin-bottom: 4px;
}
.jf-checkbox-label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.875rem;
  color: #444;
  cursor: pointer;
  margin-bottom: 4px;
}
.jf-checkbox-label input[type="checkbox"] {
  width: 15px;
  height: 15px;
  accent-color: #1a1a1a;
  cursor: pointer;
}
.jf-checkbox-hint {
  font-size: 0.78rem;
  color: #aaa;
  margin-left: 22px;
}

/* ── 재직이력 카드 ── */
.jf-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 18px 20px;
  margin-bottom: 14px;
  background: #fafafa;
}
.jf-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.jf-card-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
}
.jf-card-delete {
  font-size: 0.85rem;
  color: #d32f2f;
  background: none;
  border: none;
  cursor: pointer;
  font-family: "Noto Sans KR", sans-serif;
}
.jf-card-delete:hover {
  text-decoration: underline;
}
.jf-card-field {
  margin-bottom: 14px;
}
.jf-card-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
}
.jf-card-input {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: "Noto Sans KR", sans-serif;
  color: #1a1a1a;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}
.jf-card-input::placeholder {
  color: #bbb;
}
.jf-card-input:focus {
  border-color: #1c4d8d;
}
.jf-card-input--disabled {
  background: #f0f0f0;
  color: #bbb;
  cursor: not-allowed;
}
.jf-card-input--error {
  border-color: #d32f2f;
}

/* ── 직무 카테고리 트리거 ── */
.jf-job-trigger {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1.5px dashed #d0d0d0;
  border-radius: 6px;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 0.15s;
  margin-bottom: 6px;
}
.jf-job-trigger:hover {
  border-color: #888;
}
.jf-job-trigger--error {
  border-color: #d32f2f !important;
}
.jf-job-trigger-placeholder {
  font-size: 0.875rem;
  color: #aaa;
}
.jf-job-trigger-edit {
  font-size: 0.875rem;
  color: #444;
}
.jf-job-selected {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.jf-job-chip-selected {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1.5px solid #d0d0d0;
  border-radius: 14px;
  font-size: 0.82rem;
  background: #fff;
  color: #1a1a1a;
}
.jf-job-chip-remove {
  background: none;
  border: none;
  font-size: 0.7rem;
  color: #888;
  cursor: pointer;
  padding: 0;
}
.jf-job-chip-remove:hover {
  color: #d32f2f;
}
.jf-job-empty {
  font-size: 0.8rem;
  color: #bbb;
  margin: 0;
}

/* ── 이력 추가 버튼 ── */
.jf-add-btn {
  width: 100%;
  height: 48px;
  margin-bottom: 24px;
  background: #fff;
  color: #888;
  border: 1.5px dashed #d0d0d0;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: "Noto Sans KR", sans-serif;
  cursor: pointer;
  transition: all 0.15s;
}
.jf-add-btn:hover {
  border-color: #888;
  color: #444;
}
/* ── 직무 선택 모달 ── */
.jf-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
}
.jf-modal {
  background: #fff;
  border-radius: 12px;
  width: 640px;        /* 560px → 640px */
  max-width: 92vw;     /* 90vw → 92vw */
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;        /* border-radius 클리핑 담당 */
}
.jf-modal-content {
  padding: 24px;           /* 기존 padding을 여기로 이동 */
}
.jf-modal-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 16px;
}
.jf-modal-tabs {
  display: inline-flex;
  flex-wrap: nowrap;
  border-bottom: 1.5px solid #e0e0e0;
  margin-bottom: 16px;
  width: max-content;      /* 탭 전체 너비 확보 */
  min-width: 100%;
}
.jf-modal-tabs-scroll {
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
  display: block;
  width: 100%;
}
.jf-modal-tabs-scroll::-webkit-scrollbar {
  display: none;
}
.jf-modal-tab {
  flex: 0 0 auto;          /* flex-shrink: 0 대신 */
  padding: 8px 12px;
  font-size: 0.85rem; color: #aaa;
  background: none; border: none;
  border-bottom: 2px solid transparent; margin-bottom: -1.5px;
  cursor: pointer; white-space: nowrap;
  font-family: 'Noto Sans KR', sans-serif; transition: color 0.15s;
}
.jf-modal-tab:hover {
  color: #555;
}
.jf-modal-tab.active {
  color: #1a1a1a;
  font-weight: 700;
  border-bottom-color: #1a1a1a;
}
.jf-modal-body {
  min-height: 100px;
  margin-bottom: 16px;
  overflow: hidden;
}
.jf-modal-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.jf-modal-chip {
  padding: 7px 16px;
  border: 1.5px solid #d0d0d0;
  border-radius: 20px;
  font-size: 0.875rem;
  font-family: "Noto Sans KR", sans-serif;
  background: #fff;
  color: #444;
  cursor: pointer;
  transition: all 0.15s;
}
.jf-modal-chip:hover {
  border-color: #888;
}
.jf-modal-chip.selected {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #fff;
  font-weight: 600;
}
.jf-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #e0e0e0;
  padding-top: 14px;
}
.jf-modal-selected-text {
  font-size: 0.875rem;
  color: #888;
}
.jf-modal-selected-text strong {
  color: #1a1a1a;
}
.jf-modal-btns {
  display: flex;
  gap: 8px;
}
.jf-modal-btn {
  padding: 9px 20px;
  border-radius: 5px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Noto Sans KR", sans-serif;
  cursor: pointer;
}
.jf-modal-btn--cancel {
  background: #fff;
  color: #444;
  border: 1px solid #d0d0d0;
}
.jf-modal-btn--confirm {
  background: #555;
  color: #fff;
  border: none;
}
.jf-modal-btn--confirm:hover:not(:disabled) {
  background: #0f2854;
}
.jf-modal-btn--confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
`

export default GlobalStyles
