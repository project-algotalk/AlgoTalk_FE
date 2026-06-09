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
  overflow-x: hidden;
  background: #f8fafc;
}

.hero {
  --hero-navy: #091b3b;
  position: relative;
  min-height: 690px;
  background: var(--hero-navy);
  color: #fff;
  isolation: isolate;
  overflow: hidden;
}

.hero-grid {
  position: absolute;
  inset: 0;
  z-index: -2;
  opacity: 0.2;
  background-image:
    linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: linear-gradient(to right, #000, transparent 72%);
}

.hero-ambient {
  position: absolute;
  border-radius: 999px;
  filter: blur(2px);
  pointer-events: none;
  z-index: -1;
}

.hero-ambient--one {
  width: 620px;
  height: 620px;
  right: -80px;
  top: -210px;
  background: radial-gradient(circle, rgba(91, 92, 226, 0.38), transparent 68%);
}

.hero-ambient--two {
  width: 520px;
  height: 520px;
  left: 24%;
  bottom: -390px;
  background: radial-gradient(circle, rgba(36, 197, 180, 0.24), transparent 68%);
}

.hero-inner {
  width: min(1180px, calc(100% - 64px));
  min-height: 690px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, .92fr) minmax(500px, 1.08fr);
  gap: 56px;
  align-items: center;
  padding: 68px 0 76px;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-eyebrow {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 13px;
  margin-bottom: 24px;
  border: 1px solid rgba(151, 161, 255, 0.3);
  border-radius: 999px;
  background: rgba(120, 123, 255, 0.1);
  color: #c8cbff;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: .03em;
}

.hero-title {
  max-width: 640px;
  font-size: clamp(2.75rem, 4.4vw, 4.15rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.055em;
  word-break: keep-all;
}

.hero-title span {
  color: #aeb4ff;
}

.hero-subtitle {
  margin-top: 24px;
  color: #b6c2d8;
  font-size: 1.04rem;
  line-height: 1.8;
  letter-spacing: -0.015em;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 34px;
}

.hero-btn {
  min-height: 52px;
  border-radius: 12px;
  padding: 0 23px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px solid transparent;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: .92rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform .2s ease, background .2s ease, border-color .2s ease, box-shadow .2s ease;
}

.hero-btn:hover { transform: translateY(-2px); }

.hero-btn--primary {
  background: #7779ee;
  color: #fff;
  box-shadow: 0 12px 30px rgba(82, 84, 210, .28);
}

.hero-btn--primary:hover {
  background: #888af4;
  box-shadow: 0 16px 36px rgba(82, 84, 210, .38);
}

.hero-btn--secondary {
  color: #d5ddec;
  border-color: rgba(255,255,255,.16);
  background: rgba(255,255,255,.05);
}

.hero-btn--secondary:hover {
  border-color: rgba(255,255,255,.28);
  background: rgba(255,255,255,.09);
}

.hero-proof {
  margin-top: 34px;
  display: flex;
  align-items: center;
  gap: 13px;
}

.hero-proof-avatars { display: flex; padding-left: 8px; }
.hero-proof-avatars span {
  width: 32px;
  height: 32px;
  margin-left: -8px;
  display: grid;
  place-items: center;
  border: 2px solid #0a1c3d;
  border-radius: 50%;
  color: #dfe4ff;
  background: #2b3b67;
  font-size: .61rem;
  font-weight: 800;
}
.hero-proof-avatars span:nth-child(2) { background: #5557ac; }
.hero-proof-avatars span:nth-child(3) { background: #277e7a; }
.hero-proof-stars { color: #f7c86c; font-size: .7rem; letter-spacing: 2px; }
.hero-proof p { margin-top: 2px; color: #8493ac; font-size: .73rem; }

.hero-visual {
  position: relative;
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  perspective: 1200px;
}

.interview-card {
  width: min(100%, 520px);
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 22px;
  background: rgba(10, 28, 59, .85);
  box-shadow: 0 38px 90px rgba(0, 5, 20, .42);
  overflow: hidden;
  transform: rotateY(-4deg) rotateX(1deg);
  backdrop-filter: blur(18px);
}

.interview-card__topbar {
  min-height: 70px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,.09);
  background: rgba(255,255,255,.035);
}

.interview-card__brand { display: flex; align-items: center; gap: 11px; }
.interview-card__brand-mark {
  width: 36px; height: 36px; display: grid; place-items: center;
  border-radius: 10px; color: #c9ccff; background: rgba(119,121,238,.17);
}
.interview-card__brand div { display: flex; flex-direction: column; gap: 2px; }
.interview-card__brand strong { font-size: .82rem; color: #edf1f9; }
.interview-card__brand span { color: #6f809d; font-size: .66rem; }
.interview-card__live {
  display: flex; align-items: center; gap: 6px; color: #90a0b8; font-size: .64rem; font-weight: 800; letter-spacing: .08em;
}
.interview-card__live i { width: 7px; height: 7px; border-radius: 50%; background: #fa7581; box-shadow: 0 0 0 4px rgba(250,117,129,.12); }

.interview-card__body {
  min-height: 425px;
  padding: 38px 38px 24px;
  text-align: center;
  background:
    radial-gradient(circle at 50% 33%, rgba(109, 111, 232, .16), transparent 34%),
    linear-gradient(180deg, rgba(255,255,255,.02), transparent);
}

.interviewer-orb { width: 92px; height: 92px; margin: 0 auto 13px; display: grid; place-items: center; position: relative; }
.interviewer-orb__core {
  width: 58px; height: 58px; display: grid; place-items: center; position: relative; z-index: 2;
  border: 1px solid rgba(201,204,255,.4); border-radius: 50%; color: #daddff;
  background: linear-gradient(145deg, #6769d9, #383a88); box-shadow: 0 0 38px rgba(104,106,223,.42);
}
.orb-ring { position: absolute; border: 1px solid rgba(154,157,255,.24); border-radius: 50%; animation: orbPulse 3s ease-out infinite; }
.orb-ring--one { width: 74px; height: 74px; }
.orb-ring--two { width: 92px; height: 92px; animation-delay: 1s; }
.interviewer-label { color: #7779df; font-size: .63rem; font-weight: 800; letter-spacing: .16em; }
.interview-card__body h2 { margin-top: 9px; color: #eff2f8; font-size: 1.23rem; line-height: 1.55; letter-spacing: -.03em; }
.answer-status { margin-top: 24px; display: inline-flex; align-items: center; gap: 7px; color: #8290a8; font-size: .7rem; }
.answer-status i { width: 6px; height: 6px; border-radius: 50%; background: #56d4bd; box-shadow: 0 0 0 4px rgba(86,212,189,.1); }
.answer-wave { height: 64px; margin: 5px auto 9px; display: flex; align-items: center; justify-content: center; gap: 5px; }
.answer-wave span { width: 3px; height: var(--answer-height); border-radius: 4px; background: linear-gradient(to top, #5154ad, #a3a6ff); animation: soundWave 1.1s ease-in-out infinite alternate; animation-delay: var(--delay); }
.interview-card__footer { padding-top: 16px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; border-top: 1px solid rgba(255,255,255,.08); }
.interview-card__footer span { display: flex; align-items: center; justify-content: center; gap: 6px; color: #6f809b; font-size: .68rem; }
.interview-card__footer button { width: 42px; height: 42px; display: grid; place-items: center; color: #fff; border: 0; border-radius: 50%; background: #6d6fe4; box-shadow: 0 0 0 7px rgba(109,111,228,.12); }

.floating-card { position: absolute; display: flex; align-items: center; border: 1px solid rgba(255,255,255,.16); background: rgba(18,39,75,.9); box-shadow: 0 18px 48px rgba(0,6,24,.3); backdrop-filter: blur(14px); }
.floating-card--score { left: -16px; bottom: 42px; width: 262px; padding: 13px 14px; gap: 11px; border-radius: 14px; animation: floatCard 5s ease-in-out infinite; }
.floating-card__icon { width: 36px; height: 36px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 10px; color: #6fe0cb; background: rgba(74,204,181,.12); }
.floating-card--score div { display: flex; flex: 1; flex-direction: column; gap: 2px; }
.floating-card--score strong { color: #e8edf5; font-size: .76rem; }
.floating-card--score div span { color: #7788a3; font-size: .61rem; }
.floating-card__check { color: #6fe0cb; }
.floating-card--tip { right: -18px; top: 34px; padding: 10px 13px; gap: 7px; border-radius: 999px; color: #bdc3ff; font-size: .68rem; font-weight: 700; animation: floatCard 5s ease-in-out -2s infinite; }
.floating-card--tip i { width: 3px; height: 3px; border-radius: 50%; background: #7c7fe6; animation: dotPulse 1.2s ease-in-out infinite; }
.floating-card--tip i:nth-last-child(2) { animation-delay: .2s; }
.floating-card--tip i:last-child { animation-delay: .4s; }

.features { padding: 112px 0 124px; background: #f8fafc; }
.features-heading { width: min(1180px, calc(100% - 64px)); margin: 0 auto 48px; display: flex; align-items: flex-end; justify-content: space-between; gap: 48px; }
.section-kicker { color: #6467d7; font-size: .72rem; font-weight: 800; letter-spacing: .16em; }
.features-heading h2 { margin-top: 13px; color: #12213d; font-size: clamp(2rem, 3.5vw, 2.8rem); line-height: 1.25; letter-spacing: -.045em; }
.features-heading > p { max-width: 490px; padding-bottom: 4px; color: #718096; font-size: .93rem; line-height: 1.8; word-break: keep-all; }
.features-inner { width: min(1180px, calc(100% - 64px)); margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.feature-card { min-width: 0; padding: 24px; border: 1px solid #e6eaf1; border-radius: 20px; background: #fff; box-shadow: 0 10px 35px rgba(28,45,78,.045); transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
.feature-card:hover { transform: translateY(-6px); border-color: #d9dff0; box-shadow: 0 20px 50px rgba(28,45,78,.09); }
.feature-card__meta { display: flex; align-items: center; justify-content: space-between; color: #9aa5b7; }
.feature-card__meta > span { font-size: .72rem; font-weight: 800; letter-spacing: .08em; }
.feature-card--violet .feature-card__meta svg { color: #6d6fe2; }
.feature-card--blue .feature-card__meta svg { color: #3c83ca; }
.feature-card--mint .feature-card__meta svg { color: #2b9f8e; }
.feature-card__visual { height: 180px; margin: 20px 0 25px; display: flex; align-items: center; justify-content: center; border-radius: 15px; overflow: hidden; }
.feature-card--violet .feature-card__visual { background: linear-gradient(145deg, #f0efff, #e7e9ff); }
.feature-card--blue .feature-card__visual { background: linear-gradient(145deg, #edf6fd, #e5f0fb); }
.feature-card--mint .feature-card__visual { background: linear-gradient(145deg, #ebf9f5, #e2f4f1); }
.feature-wave { height: 82px; display: flex; align-items: center; gap: 6px; padding: 0 25px; border-radius: 16px; background: rgba(255,255,255,.62); box-shadow: 0 12px 30px rgba(82,84,180,.09); }
.feature-wave span { width: 4px; height: var(--wave-height); border-radius: 5px; background: linear-gradient(to top, #6063cf, #a2a5ff); }
.feature-score { width: 82%; height: 122px; padding: 17px; position: relative; border: 1px solid rgba(255,255,255,.8); border-radius: 15px; background: rgba(255,255,255,.68); box-shadow: 0 12px 30px rgba(47,99,149,.08); overflow: hidden; }
.feature-score div { display: flex; align-items: baseline; gap: 8px; position: relative; z-index: 2; }
.feature-score strong { color: #286cae; font-size: 1.6rem; }
.feature-score span { color: #7188a0; font-size: .65rem; }
.feature-score svg { width: 100%; height: 60px; margin-top: 7px; overflow: visible; }
.feature-score path { fill: none; stroke: #4e9bdd; stroke-width: 3; stroke-linecap: round; filter: drop-shadow(0 5px 5px rgba(78,155,221,.2)); }
.feature-tags { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px; padding: 25px; }
.feature-tags span { padding: 10px 13px; border: 1px solid rgba(43,159,142,.12); border-radius: 10px; color: #257e72; background: rgba(255,255,255,.72); box-shadow: 0 7px 18px rgba(43,127,116,.07); font-size: .72rem; font-weight: 700; }
.feature-tags span:nth-child(2), .feature-tags span:nth-child(4) { transform: translateY(7px); }
.feature-card__content h3 { color: #182741; font-size: 1.12rem; letter-spacing: -.025em; }
.feature-card__content p { min-height: 70px; margin-top: 10px; color: #7a879a; font-size: .84rem; line-height: 1.75; word-break: keep-all; }
.feature-card__content button { margin-top: 17px; padding: 0; display: flex; align-items: center; gap: 3px; border: 0; color: #53627a; background: transparent; font-family: 'Noto Sans KR', sans-serif; font-size: .75rem; font-weight: 700; cursor: pointer; }
.feature-card__content button:hover { color: #6164d2; }

@keyframes orbPulse { 0% { transform: scale(.85); opacity: 0; } 35% { opacity: 1; } 100% { transform: scale(1.13); opacity: 0; } }
@keyframes soundWave { from { transform: scaleY(.45); opacity: .55; } to { transform: scaleY(1); opacity: 1; } }
@keyframes floatCard { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
@keyframes dotPulse { 0%, 100% { opacity: .25; } 50% { opacity: 1; } }

@media (prefers-reduced-motion: reduce) {
  .orb-ring, .answer-wave span, .floating-card, .floating-card--tip i { animation: none; }
  .feature-card, .hero-btn { transition: none; }
}

@media (max-width: 1050px) {
  .hero-inner { grid-template-columns: .9fr 1.1fr; gap: 24px; }
  .floating-card--score { left: -8px; }
  .floating-card--tip { right: -8px; }
  .features-heading > p { max-width: 420px; }
}

@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr; padding-top: 74px; }
  .hero-content { text-align: center; }
  .hero-eyebrow, .hero-proof { margin-left: auto; margin-right: auto; }
  .hero-actions { justify-content: center; }
  .hero-visual { width: min(600px, 100%); margin: -10px auto 0; }
  .interview-card { transform: none; }
  .features-heading { align-items: flex-start; flex-direction: column; gap: 20px; }
  .features-heading > p br { display: none; }
  .features-inner { grid-template-columns: 1fr; max-width: 620px; }
  .feature-card__content p { min-height: 0; }
}

@media (max-width: 650px) {
  .hero-inner, .features-heading, .features-inner { width: min(100% - 36px, 560px); }
  .hero-inner { min-height: auto; padding: 58px 0 80px; }
  .hero-title { font-size: clamp(2.25rem, 11vw, 3.15rem); }
  .hero-subtitle { font-size: .94rem; }
  .hero-subtitle-break { display: none; }
  .hero-actions { flex-direction: column; }
  .hero-btn { width: 100%; }
  .hero-proof { justify-content: center; }
  .hero-visual { min-height: 450px; margin-top: 10px; }
  .interview-card__body { min-height: 380px; padding: 28px 18px 20px; }
  .interview-card__body h2 { font-size: 1.08rem; }
  .floating-card--score { left: -3px; bottom: -7px; width: 232px; }
  .floating-card--tip { right: -3px; top: 12px; }
  .features { padding: 84px 0 92px; }
  .features-heading { margin-bottom: 32px; }
  .features-heading h2 { font-size: 2rem; }
  .features-heading > p { font-size: .86rem; }
  .feature-card { padding: 20px; }
}

/* src/pages/main/QuestionExplorePage.css */
.questions-page {
  min-height: 100vh;
  color: #17243d;
  background: #f7f9fc;
}

.questions-container {
  width: min(1080px, calc(100% - 48px));
  margin: 0 auto;
}

.questions-hero {
  position: relative;
  overflow: hidden;
  color: #fff;
  background:
    linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px),
    #0b1d3e;
  background-size: 56px 56px;
}

.questions-hero__glow {
  position: absolute;
  width: 620px;
  height: 620px;
  right: -150px;
  top: -340px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(111, 113, 229, .42), transparent 68%);
  pointer-events: none;
}

.questions-hero__inner {
  position: relative;
  padding: 32px 0 62px;
}

.questions-back {
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 0;
  color: #8e9db7;
  background: transparent;
  font: 600 .75rem 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: color .2s ease;
}

.questions-back:hover { color: #dce3ef; }

.questions-hero__content {
  margin-top: 48px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 48px;
}

.questions-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #aeb4ff;
  font-size: .68rem;
  font-weight: 800;
  letter-spacing: .15em;
}

.questions-hero h1 {
  margin-top: 14px;
  color: #f7f9fc;
  font-size: clamp(2.35rem, 5vw, 3.55rem);
  line-height: 1.2;
  letter-spacing: -.055em;
}

.questions-hero__content > div:first-child > p {
  margin-top: 20px;
  color: #9eacc2;
  font-size: .92rem;
  line-height: 1.8;
}

.questions-hero__stats {
  min-width: 390px;
  padding: 22px 26px;
  display: grid;
  grid-template-columns: 1fr 1px 1fr 1px 1fr;
  align-items: center;
  gap: 18px;
  border: 1px solid rgba(255,255,255,.11);
  border-radius: 16px;
  background: rgba(255,255,255,.055);
  box-shadow: 0 22px 50px rgba(0,5,20,.18);
  backdrop-filter: blur(12px);
}

.questions-hero__stats div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  text-align: center;
}

.questions-hero__stats strong { color: #dfe2ff; font-size: 1.25rem; }
.questions-hero__stats span { color: #8291aa; font-size: .62rem; white-space: nowrap; }
.questions-hero__stats > i { width: 1px; height: 28px; background: rgba(255,255,255,.1); }

.questions-library { padding: 48px 0 100px; }

.questions-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.questions-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
}

.questions-tabs button {
  min-height: 40px;
  padding: 0 17px;
  border: 1px solid transparent;
  border-radius: 10px;
  color: #718096;
  background: transparent;
  font: 600 .82rem 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: all .18s ease;
}

.questions-tabs button:hover { color: #4e57b9; background: #eff1ff; }
.questions-tabs button.active { color: #fff; background: #5457bd; box-shadow: 0 7px 18px rgba(84,87,189,.2); }

.questions-search {
  width: 270px;
  height: 43px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid #dde3eb;
  border-radius: 11px;
  color: #a1abb9;
  background: #fff;
  transition: border-color .2s ease, box-shadow .2s ease;
}

.questions-search:focus-within {
  border-color: #8c8ee1;
  box-shadow: 0 0 0 3px rgba(99,102,211,.09);
}

.questions-search input {
  width: 100%;
  border: 0;
  outline: 0;
  color: #273550;
  background: transparent;
  font: .78rem 'Noto Sans KR', sans-serif;
}

.questions-search input::placeholder { color: #a7b0bd; }

.questions-section-heading {
  margin: 50px 0 20px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.questions-section-heading span {
  color: #6a6dd1;
  font-size: .62rem;
  font-weight: 800;
  letter-spacing: .14em;
}

.questions-section-heading h2 {
  margin-top: 8px;
  color: #17243d;
  font-size: 1.55rem;
  letter-spacing: -.035em;
}

.questions-section-heading > p { color: #9aa5b4; font-size: .75rem; }
.questions-section-heading > p strong { color: #5558bc; font-size: .95rem; }

.questions-list { display: flex; flex-direction: column; gap: 10px; }

.question-card {
  border: 1px solid #e3e7ee;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 7px 24px rgba(31,47,78,.035);
  overflow: hidden;
  transition: border-color .2s ease, box-shadow .2s ease;
}

.question-card:hover { border-color: #d4d9e5; }
.question-card--open { border-color: #cbccef; box-shadow: 0 13px 34px rgba(49,54,126,.075); }

.question-card__summary {
  width: 100%;
  padding: 24px 26px;
  display: grid;
  grid-template-columns: 48px 1fr auto;
  align-items: start;
  gap: 17px;
  border: 0;
  color: inherit;
  background: transparent;
  text-align: left;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
}

.question-card__number {
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: #6568c9;
  background: #f0f1ff;
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .03em;
}

.question-card__main { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; }
.question-card__labels { display: flex; flex-wrap: wrap; gap: 5px; }
.question-card__labels em {
  padding: 4px 7px;
  border-radius: 5px;
  color: #65758d;
  background: #f2f5f8;
  font-size: .59rem;
  font-style: normal;
  font-weight: 700;
}
.question-card__labels em:first-child { color: #5558b9; background: #eff0ff; }
.question-card__labels .level--빈출 { color: #a06827; background: #fff5df; }
.question-card__labels .level--심화 { color: #a14561; background: #fff0f4; }
.question-card__main > strong { margin-top: 10px; color: #1a2943; font-size: .98rem; letter-spacing: -.025em; }
.question-card__description { margin-top: 6px; color: #8792a3; font-size: .73rem; line-height: 1.6; }
.question-card__keywords { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 8px; }
.question-card__keywords i { color: #7a83a8; font-size: .62rem; font-style: normal; }

.question-card__aside {
  min-width: 88px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  color: #9aa5b5;
}
.question-card__aside span { display: flex; align-items: center; gap: 5px; font-size: .65rem; white-space: nowrap; }
.question-card__aside > svg { transition: transform .2s ease; }
.question-card--open .question-card__aside > svg { color: #6568ca; transform: rotate(180deg); }

.question-answer {
  margin: 0 26px 24px 91px;
  padding: 22px 24px;
  border: 1px solid #e6e7f5;
  border-radius: 13px;
  background: #f9f9fe;
}

.question-answer__header { display: flex; align-items: center; justify-content: space-between; }
.question-answer__header > span { display: flex; align-items: center; gap: 7px; color: #5053ad; font-size: .75rem; font-weight: 800; }
.question-answer__header button {
  padding: 6px 9px;
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid #dde0ec;
  border-radius: 7px;
  color: #8994a6;
  background: #fff;
  font: 600 .65rem 'Noto Sans KR', sans-serif;
  cursor: pointer;
}
.question-answer__header button.saved { color: #5659bd; border-color: #cfd1ef; background: #f0f1ff; }

.question-answer ol { margin: 19px 0 0; padding: 0; display: flex; flex-direction: column; gap: 11px; list-style: none; }
.question-answer li { display: flex; align-items: flex-start; gap: 9px; color: #5e6a7d; font-size: .76rem; line-height: 1.55; }
.question-answer li svg { flex: 0 0 auto; margin-top: 1px; color: #57a995; }

.question-answer__tip {
  margin-top: 19px;
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  border-radius: 9px;
  color: #7b6f54;
  background: #fff8e9;
}
.question-answer__tip svg { flex: 0 0 auto; margin-top: 1px; color: #d39a3e; }
.question-answer__tip p { font-size: .69rem; line-height: 1.55; }
.question-answer__tip strong { margin-right: 8px; color: #9b702a; }
.question-answer__practice {
  margin: 18px 0 0 auto;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 0;
  color: #5558bb;
  background: transparent;
  font: 700 .72rem 'Noto Sans KR', sans-serif;
  cursor: pointer;
}

.questions-empty {
  padding: 76px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px dashed #d7dce5;
  border-radius: 16px;
  color: #9aa5b4;
  background: #fff;
  text-align: center;
}
.questions-empty h3 { margin-top: 12px; color: #536078; font-size: .95rem; }
.questions-empty p { margin-top: 6px; font-size: .75rem; }

.questions-cta {
  min-height: 190px;
  margin-top: 58px;
  padding: 34px 42px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 22px;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  color: #fff;
  background: linear-gradient(120deg, #111f40, #252b64);
  box-shadow: 0 20px 48px rgba(20,29,65,.15);
}

.questions-cta__icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 13px;
  color: #babdff;
  background: rgba(255,255,255,.07);
}
.questions-cta span { color: #8f96ce; font-size: .67rem; font-weight: 800; letter-spacing: .08em; }
.questions-cta h2 { margin-top: 7px; font-size: 1.35rem; line-height: 1.45; letter-spacing: -.025em; }
.questions-cta > button {
  min-height: 46px;
  padding: 0 19px;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 2;
  border: 0;
  border-radius: 10px;
  color: #fff;
  background: #696bdd;
  font: 700 .78rem 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: transform .2s ease, background .2s ease;
}
.questions-cta > button:hover { background: #7779e8; transform: translateY(-2px); }
.questions-cta__deco { position: absolute; right: 120px; bottom: -55px; color: rgba(255,255,255,.03); transform: rotate(-12deg); }

@media (max-width: 900px) {
  .questions-hero__content { align-items: flex-start; flex-direction: column; }
  .questions-hero__stats { width: 100%; }
  .questions-toolbar { align-items: stretch; flex-direction: column; }
  .questions-search { width: 100%; }
  .questions-cta { grid-template-columns: auto 1fr; }
  .questions-cta > button { grid-column: 2; width: fit-content; }
}

@media (max-width: 650px) {
  .questions-container { width: min(100% - 32px, 560px); }
  .questions-hero__inner { padding: 25px 0 48px; }
  .questions-hero__content { margin-top: 36px; gap: 32px; }
  .questions-hero h1 { font-size: 2.2rem; }
  .questions-hero__stats { min-width: 0; padding: 18px 12px; gap: 8px; }
  .questions-hero__stats span { font-size: .55rem; }
  .questions-library { padding: 32px 0 72px; }
  .questions-tabs { width: 100%; overflow-x: auto; padding-bottom: 3px; }
  .questions-tabs button { flex: 0 0 auto; padding: 0 14px; }
  .questions-section-heading { margin-top: 34px; }
  .question-card__summary { grid-template-columns: 38px 1fr; padding: 20px 17px; gap: 12px; }
  .question-card__number { width: 38px; height: 38px; }
  .question-card__aside { grid-column: 2; min-width: 0; justify-content: space-between; }
  .question-answer { margin: 0 16px 17px; padding: 18px; }
  .question-answer__header { align-items: flex-start; gap: 12px; }
  .questions-cta { padding: 27px 23px; grid-template-columns: 1fr; text-align: center; }
  .questions-cta__icon { margin: 0 auto; }
  .questions-cta > button { grid-column: 1; width: 100%; justify-content: center; }
  .questions-cta h2 { font-size: 1.15rem; }
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

/* Main camera preview refinement */
.interview-card__body {
  min-height: 425px;
  padding: 22px 22px 18px;
  background: linear-gradient(180deg, rgba(255,255,255,.025), transparent);
}

.camera-preview {
  height: 340px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 16px;
  background: linear-gradient(145deg, #263654, #152440 62%, #101d34);
  box-shadow: inset 0 0 60px rgba(0,0,0,.18);
}

.camera-preview::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 4;
  background: linear-gradient(180deg, transparent 54%, rgba(6,14,29,.62));
  pointer-events: none;
}

.camera-preview__room { position: absolute; inset: 0; overflow: hidden; }
.camera-preview__room::before {
  content: '';
  width: 220px;
  height: 170px;
  position: absolute;
  left: 18px;
  top: 26px;
  border: 9px solid #314462;
  background: linear-gradient(145deg, #334967, #1c304e);
  box-shadow: 0 12px 25px rgba(0,0,0,.18);
}
.camera-preview__room::after {
  content: '';
  width: 105px;
  height: 3px;
  position: absolute;
  right: 24px;
  top: 108px;
  background: #3a4d6b;
  box-shadow: 0 46px 0 #3a4d6b;
}
.camera-preview__lamp { width: 72px; height: 72px; position: absolute; right: 37px; top: 18px; border-radius: 50%; background: radial-gradient(circle, rgba(255,220,158,.55), rgba(255,201,118,.08) 55%, transparent 70%); }
.camera-preview__lamp::after { content: ''; width: 26px; height: 36px; position: absolute; left: 23px; top: 18px; border-radius: 50% 50% 35% 35%; background: #dbbd87; box-shadow: 0 0 25px rgba(244,205,137,.45); }
.camera-preview__plant { width: 40px; height: 54px; position: absolute; right: 54px; bottom: 37px; border-radius: 4px 4px 16px 16px; background: #1a6570; }
.camera-preview__plant i { width: 13px; height: 30px; position: absolute; left: 13px; top: -24px; border-radius: 90% 0 90% 0; background: #32867d; transform-origin: bottom; }
.camera-preview__plant i:first-child { transform: rotate(-42deg); }
.camera-preview__plant i:nth-child(2) { transform: rotate(4deg) translateY(-8px); }
.camera-preview__plant i:last-child { transform: rotate(43deg); }
.camera-preview__desk { width: 160px; height: 8px; position: absolute; right: 7px; bottom: 33px; border-radius: 5px; background: #293d59; }

.candidate { width: 230px; height: 290px; position: absolute; left: 50%; bottom: -25px; z-index: 2; transform: translateX(-50%); }
.candidate__head { width: 104px; height: 126px; position: absolute; left: 63px; top: 30px; z-index: 3; border-radius: 46% 46% 44% 44%; background: linear-gradient(120deg, #e8b492, #c98767); box-shadow: inset -12px -5px 20px rgba(110,54,38,.12); }
.candidate__hair { width: 112px; height: 79px; position: absolute; left: 59px; top: 20px; z-index: 4; border-radius: 54% 52% 30% 25%; background: #252c3a; transform: rotate(-3deg); }
.candidate__hair::after { content: ''; width: 32px; height: 55px; position: absolute; right: -1px; top: 39px; border-radius: 0 70% 65% 0; background: #252c3a; transform: rotate(-5deg); }
.candidate__eye { width: 7px; height: 4px; position: absolute; top: 68px; z-index: 5; border-radius: 50%; background: #3d3030; }
.candidate__eye--left { left: 27px; }
.candidate__eye--right { right: 27px; }
.candidate__nose { width: 5px; height: 13px; position: absolute; left: 50px; top: 71px; border-right: 1px solid rgba(92,46,35,.35); border-bottom: 1px solid rgba(92,46,35,.2); border-radius: 0 0 4px 0; }
.candidate__smile { width: 20px; height: 8px; position: absolute; left: 42px; top: 96px; border-bottom: 2px solid rgba(110,48,45,.65); border-radius: 50%; }
.candidate__neck { width: 42px; height: 50px; position: absolute; left: 94px; top: 139px; z-index: 2; background: #cb8d70; }
.candidate__body { width: 224px; height: 155px; position: absolute; left: 3px; bottom: 0; z-index: 1; border-radius: 85px 85px 14px 14px; background: linear-gradient(125deg, #5365a8, #2e3d74); }
.candidate__body::after { content: ''; width: 50px; height: 70px; position: absolute; left: 87px; top: -3px; background: linear-gradient(135deg, #f3f5f8 50%, transparent 51%); clip-path: polygon(0 0, 100% 0, 50% 100%); }

.camera-preview__focus { width: 20px; height: 20px; position: absolute; z-index: 6; border-color: rgba(134,224,207,.8); border-style: solid; }
.camera-preview__focus--one { left: 31%; top: 14%; border-width: 2px 0 0 2px; }
.camera-preview__focus--two { right: 31%; top: 14%; border-width: 2px 2px 0 0; }
.camera-preview__focus--three { left: 31%; bottom: 27%; border-width: 0 0 2px 2px; }
.camera-preview__focus--four { right: 31%; bottom: 27%; border-width: 0 2px 2px 0; }
.camera-preview__analysis { position: absolute; left: 12px; top: 12px; z-index: 7; display: flex; gap: 6px; }
.camera-preview__analysis span { padding: 6px 8px; display: flex; align-items: center; gap: 5px; border: 1px solid rgba(255,255,255,.11); border-radius: 7px; color: #b9e9df; background: rgba(7,19,35,.62); font-size: .56rem; font-weight: 700; backdrop-filter: blur(7px); }
.camera-preview__analysis span i { width: 5px; height: 5px; border-radius: 50%; background: #65d1bd; box-shadow: 0 0 0 3px rgba(101,209,189,.12); }
.camera-preview__recording { position: absolute; right: 12px; top: 12px; z-index: 7; padding: 6px 8px; display: flex; align-items: center; gap: 5px; border-radius: 7px; color: #ffd3d7; background: rgba(7,19,35,.62); font-size: .56rem; font-weight: 800; letter-spacing: .08em; }
.camera-preview__recording i { width: 6px; height: 6px; border-radius: 50%; background: #ff737e; animation: dotPulse 1.2s ease-in-out infinite; }
.camera-preview__question { position: absolute; left: 16px; right: 16px; bottom: 38px; z-index: 7; display: flex; flex-direction: column; gap: 4px; text-align: left; }
.camera-preview__question span { color: #9398ee; font-size: .55rem; font-weight: 800; letter-spacing: .1em; }
.camera-preview__question strong { color: #f5f7fb; font-size: .82rem; font-weight: 700; }
.camera-preview__wave { height: 25px; position: absolute; right: 15px; bottom: 8px; z-index: 7; display: flex; align-items: center; gap: 3px; }
.camera-preview__wave span { width: 2px; height: var(--answer-height); border-radius: 3px; background: #8d90f0; animation: soundWave 1.1s ease-in-out infinite alternate; animation-delay: var(--delay); }
.interview-card__footer { padding-top: 15px; }

/* Interview setup visual system */
.in-page { background: linear-gradient(180deg, #f7f8fc, #fbfcfe); }
.in-container { max-width: 1040px; padding: 64px 28px 100px; }
.in-heading { margin-bottom: 42px; text-align: center; }
.in-eyebrow { display: inline-flex; align-items: center; gap: 7px; color: #6265c9; font-size: .67rem; font-weight: 800; letter-spacing: .15em; }
.in-title { margin: 13px 0 12px; color: #172641; font-size: clamp(2rem, 4vw, 2.75rem); line-height: 1.22; letter-spacing: -.05em; }
.in-subtitle { margin: 0; color: #7c899c; font-size: .9rem; }
.in-heading-note { width: fit-content; margin: 20px auto 0; padding: 9px 13px; display: flex; align-items: center; gap: 7px; border: 1px solid #e2e4f4; border-radius: 999px; color: #66738a; background: #fff; font-size: .7rem; box-shadow: 0 7px 20px rgba(33,47,78,.04); }
.in-section { margin-bottom: 22px; padding: 28px; border: 1px solid #e4e8ef; border-radius: 18px; background: #fff; box-shadow: 0 10px 32px rgba(31,47,78,.045); }
.in-section-label { margin-bottom: 17px; color: #26354f; font-size: .92rem; font-weight: 800; }
.in-mode-cards { gap: 12px; }
.in-mode-card { min-height: 170px; padding: 23px 18px; align-items: flex-start; justify-content: flex-start; gap: 7px; position: relative; border: 1px solid #e1e5ec; border-radius: 14px; text-align: left; }
.in-mode-card:hover { border-color: #c9ccef; transform: translateY(-2px); box-shadow: 0 12px 25px rgba(42,50,105,.07); }
.in-mode-card.active { border-color: #7376dd; background: linear-gradient(145deg, #f8f8ff, #f0f1ff); box-shadow: 0 0 0 3px rgba(105,108,214,.08); }
.in-mode-card.active::after { content: '✓'; width: 22px; height: 22px; display: grid; place-items: center; position: absolute; right: 13px; top: 13px; border-radius: 50%; color: #fff; background: #6669d0; font-size: .7rem; font-weight: 900; }
.in-mode-icon { width: 43px; height: 43px; margin-bottom: 8px; display: grid; place-items: center; border-radius: 11px; color: #6568ca; background: #eff0ff; }
.in-mode-card strong { color: #22314b; font-size: .94rem; }
.in-mode-card span:not(.in-mode-icon) { color: #8390a2; font-size: .72rem; }
.in-category-group-header { margin-top: 24px; }
.in-category-group-label { color: #6d798d; font-size: .76rem; }
.in-chip { padding: 8px 15px; border: 1px solid #dfe4eb; color: #667388; background: #fafbfd; font: 600 .78rem 'Noto Sans KR', sans-serif; }
.in-chip:hover:not(.disabled) { border-color: #9da0e3; color: #575abc; background: #f5f5ff; }
.in-chip.selected { border-color: #5f62c5; color: #fff; background: #5f62c5; box-shadow: 0 6px 14px rgba(95,98,197,.2); }
.in-load-my-info-btn { padding: 6px 12px; border: 1px solid #d9deea; color: #5d63b7; background: #f8f8ff; }
.in-manual-card { border: 1px solid #e0e5ed; border-radius: 13px; background: #fafbfd; }
.in-manual-select, .in-manual-textarea { border: 1px solid #dce2ea; background: #fff; }
.in-add-btn { border-color: #cdd3e0; color: #686fc2; background: #fafaff; }
.in-footer { margin-top: 28px; }
.in-start-btn { min-height: 52px; padding: 0 27px; display: flex; align-items: center; gap: 9px; border-radius: 11px; background: #172b4d; box-shadow: 0 10px 24px rgba(23,43,77,.16); font-family: 'Noto Sans KR', sans-serif; }
.in-start-btn:hover:not(:disabled) { background: #595cc4; transform: translateY(-2px); }

@media (max-width: 700px) {
  .camera-preview { height: 310px; }
  .camera-preview__analysis span:nth-child(2) { display: none; }
  .in-container { padding: 48px 18px 75px; }
  .in-heading-note { border-radius: 13px; line-height: 1.5; }
  .in-section { padding: 20px; }
  .in-mode-cards { grid-template-columns: 1fr; }
  .in-mode-card { min-height: 128px; }
  .in-start-btn { width: 100%; justify-content: center; }
}


/* Live interview screen alignment */
.is-page { background: #f5f7fb; }
.is-header { min-height: 64px; padding: 0 max(24px, calc((100% - 1040px) / 2)); border-color: #e3e8f0; background: rgba(255,255,255,.94); backdrop-filter: blur(14px); }
.is-back { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 9px; color: #40506a; background: #f2f4f8; font-size: 1.35rem; }
.is-header-title { color: #172946; font-size: .95rem; font-weight: 850; letter-spacing: -.03em; }
.is-container { max-width: 960px; padding: 42px 28px 70px; }
.is-question { margin-bottom: 18px; padding: 18px 21px; border: 1px solid #e1e6ee; border-radius: 14px; color: #22314b; background: #fff; box-shadow: 0 8px 25px rgba(31,47,78,.045); font-size: 1rem; }
.is-video-wrap { max-width: 820px; aspect-ratio: 16/9; margin-bottom: 14px; border: 1px solid #dce2eb; border-radius: 16px; background: #182841; box-shadow: 0 18px 45px rgba(20,34,61,.13); }
.is-video { transform: none; }
.is-detection-status { top: 14px; right: 14px; padding: 8px 11px; flex-direction: row; gap: 8px; border: 1px solid rgba(255,255,255,.13); border-radius: 9px; background: rgba(8,19,35,.7); backdrop-filter: blur(10px); }
.is-status-on, .is-status-off { font-size: 10px; }
.is-rec-dot { top: 17px; left: 17px; right: auto; box-shadow: 0 0 0 5px rgba(229,57,53,.18); }
.is-timer-wrap { max-width: 820px; padding: 4px 2px 0; }
.is-timer { color: #263754; font-size: 1.8rem; letter-spacing: -.03em; }
.is-timer-label { color: #8b97a8; }
.is-btn-wrap { max-width: 820px; }
.is-btn-skip, .is-btn-main { min-height: 49px; padding: 0 18px; border-radius: 10px; font-family: 'Noto Sans KR', sans-serif; }
.is-btn-skip { border: 1px solid #dce2e9; color: #657287; background: #fff; }
.is-btn-main { background: #172b4d; box-shadow: 0 9px 20px rgba(23,43,77,.14); }
.is-btn-main:hover { background: #595cc4; }
.is-extra-opts { max-width: 820px; }
.is-stt-loading { padding: 9px 13px; border-radius: 9px; color: #5559b5; background: #efefff; }

@media (max-width: 700px) {
  .is-header { padding: 0 16px; }
  .is-container { padding: 25px 16px 55px; }
  .is-question { font-size: .9rem; }
  .is-detection-status { flex-direction: column; }
}


/* Unified secondary navigation */
.login-nav, .su-nav, .su2-nav, .su3-nav, .fa-nav, .sc-nav,
.dc-header, .is-header {
  min-height: 64px;
  height: 64px;
  padding: 0 max(22px, calc((100% - 1180px) / 2));
  border-bottom: 1px solid #e7ebf2;
  background: rgba(255,255,255,.95);
  backdrop-filter: blur(15px);
  box-sizing: border-box;
}

.login-nav-logo, .su-nav-logo, .su2-nav-logo, .su3-nav-logo, .fa-nav-logo, .sc-nav-logo {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #172a49;
  font-size: 1.08rem;
  font-weight: 850;
  letter-spacing: -.04em;
}

.login-nav-logo::before, .su-nav-logo::before, .su2-nav-logo::before,
.su3-nav-logo::before, .fa-nav-logo::before, .sc-nav-logo::before {
  content: '';
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background:
    linear-gradient(67deg, transparent 43%, rgba(255,255,255,.9) 44% 50%, transparent 51%) 8px 8px / 12px 13px no-repeat,
    linear-gradient(145deg, #7477e5, #474aaa);
  box-shadow: 0 6px 14px rgba(72,75,174,.2);
}

.login-nav-close, .fa-nav-close, .su-nav-back, .su2-nav-back, .su3-nav-back {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: 1px solid #e5e9f0;
  border-radius: 10px;
  color: #506078;
  background: #f8f9fb;
  transition: color .18s ease, border-color .18s ease, background .18s ease;
}

.login-nav-close:hover, .fa-nav-close:hover, .su-nav-back:hover,
.su2-nav-back:hover, .su3-nav-back:hover {
  color: #5457b8;
  border-color: #d4d6ef;
  background: #f1f2ff;
}

.login-page, .su-page, .su2-page, .su3-page, .fa-page, .sc-page {
  background: linear-gradient(180deg, #f8f9fc, #fff 38%);
}

/* Device check redesign */
.dc-page { min-height: 100vh; background: linear-gradient(180deg, #f5f7fc, #fbfcfe); }
.dc-header { display: flex; align-items: center; position: relative; }
.dc-back { width: 38px; height: 38px; padding: 0; display: grid; place-items: center; border: 1px solid #e2e7ef; border-radius: 10px; color: #4d5d76; background: #f8f9fb; }
.dc-header-title { display: flex; align-items: center; gap: 9px; color: #182b4b; font-size: .95rem; font-weight: 850; }
.dc-header-title i { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(145deg,#7477e5,#474aaa); box-shadow: 0 6px 14px rgba(72,75,174,.2); }
.dc-header-title em { margin-left: 3px; padding-left: 11px; border-left: 1px solid #dce1e9; color: #929caf; font-size: .57rem; font-style: normal; letter-spacing: .13em; }
.dc-container { max-width: 820px; padding: 55px 24px 85px; }
.dc-heading { margin-bottom: 29px; text-align: center; }
.dc-eyebrow { display: inline-flex; align-items: center; gap: 6px; color: #6265c8; font-size: .65rem; font-weight: 800; letter-spacing: .14em; }
.dc-title { margin: 12px 0 11px; color: #172640; font-size: clamp(2rem,4vw,2.65rem); line-height: 1.23; letter-spacing: -.05em; }
.dc-subtitle { max-width: 520px; margin: 0 auto; color: #7b889b; font-size: .86rem; line-height: 1.7; }
.dc-preview { max-width: 720px; margin-bottom: 13px; border: 1px solid #dce2eb; border-radius: 18px; background: radial-gradient(circle at 50% 42%, #273a5b, #121f35); box-shadow: 0 20px 55px rgba(20,34,61,.15); }
.dc-preview::after { content: ''; position: absolute; inset: 12px; border: 1px solid rgba(255,255,255,.055); border-radius: 11px; pointer-events: none; }
.dc-preview-placeholder { flex-direction: column; gap: 11px; color: #8e9bb0; }
.dc-preview-placeholder svg { color: #777bd7; }
.dc-preview-placeholder span { font-size: .75rem; }
.dc-video { object-fit: cover; }
.dc-preview-status { position: absolute; left: 14px; top: 14px; z-index: 2; padding: 7px 10px; display: flex; align-items: center; gap: 7px; border: 1px solid rgba(255,255,255,.12); border-radius: 8px; color: #b9eadd; background: rgba(7,19,35,.7); font-size: .62rem; font-weight: 700; backdrop-filter: blur(9px); }
.dc-preview-status i { width: 6px; height: 6px; border-radius: 50%; background: #63d1bb; box-shadow: 0 0 0 4px rgba(99,209,187,.13); }
.dc-hint { margin-bottom: 17px; display: flex; align-items: center; justify-content: center; gap: 6px; color: #8491a4; font-size: .69rem; }
.dc-mic-level { max-width: 720px; height: 5px; margin-bottom: 14px; background: #e4e8ef; }
.dc-mic-bar { background: linear-gradient(90deg,#5f62c7,#5cc7b4); }
.dc-check-btns { max-width: 720px; margin-bottom: 27px; }
.dc-check-btn { min-height: 75px; padding: 12px 14px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 11px; border: 1px solid #dde3eb; border-radius: 13px; color: #7b8798; background: #fff; text-align: left; font-family: 'Noto Sans KR',sans-serif; box-shadow: 0 8px 24px rgba(31,47,78,.035); }
.dc-check-btn:hover { border-color: #c9ccef; transform: translateY(-2px); box-shadow: 0 12px 28px rgba(31,47,78,.07); }
.dc-check-btn > span:nth-child(2) { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.dc-check-btn strong { color: #26364f; font-size: .78rem; }
.dc-check-btn small { overflow: hidden; color: #929dae; font-size: .62rem; font-weight: 400; text-overflow: ellipsis; white-space: nowrap; }
.dc-check-icon { width: 37px; height: 37px; display: grid!important; place-items: center; border-radius: 10px; color: #6366c7; background: #eff0ff; }
.dc-check-btn.ok { border-color: #bfe3da; color: #3a9b87; background: #f8fdfb; }
.dc-check-btn.ok .dc-check-icon { color: #30927d; background: #e5f7f2; }
.dc-check-btn.error { border-color: #efcdd3; color: #c76273; background: #fffafb; }
.dc-footer { max-width: 720px; }
.dc-prev-btn, .dc-start-btn { min-height: 50px; padding: 0 18px; display: flex; align-items: center; justify-content: center; gap: 7px; border-radius: 10px; font-family: 'Noto Sans KR',sans-serif; }
.dc-prev-btn { border: 1px solid #dce2e9; color: #637187; }
.dc-start-btn { background: #172b4d; box-shadow: 0 9px 22px rgba(23,43,77,.15); }
.dc-start-btn:hover:not(:disabled) { background: #595cc4; }
.dc-start-btn:disabled { color: #99a4b5; background: #e1e5eb; box-shadow: none; }

/* MyPage refinement */
.mp-page { background: linear-gradient(180deg,#f5f7fb,#fafbfd); }
.mp-page-heading { width: min(1080px,calc(100% - 48px)); margin: 48px auto 0; }
.mp-page-heading > span { display: flex; align-items: center; gap: 6px; color: #6568c9; font-size: .65rem; font-weight: 800; letter-spacing: .14em; }
.mp-page-heading h1 { margin-top: 9px; color: #172640; font-size: 2rem; letter-spacing: -.045em; }
.mp-page-heading p { margin-top: 7px; color: #8490a2; font-size: .82rem; }
.mp-layout { max-width: 1080px; margin-top: 28px; gap: 25px; }
.mp-sidebar { width: 205px; padding: 16px; align-self: flex-start; position: sticky; top: 88px; border: 1px solid #e2e7ee; border-radius: 16px; background: rgba(255,255,255,.85); box-shadow: 0 10px 30px rgba(31,47,78,.045); backdrop-filter: blur(12px); }
.mp-sidebar-title { padding: 5px 9px 9px; color: #9aa4b3; font-size: .65rem; }
.mp-sidebar-item { min-height: 40px; padding: 0 11px; border-radius: 9px; color: #667388; font-size: .8rem; font-weight: 600; }
.mp-sidebar-item:hover { color: #5356b5; background: #f3f4ff; }
.mp-sidebar-item.active { color: #5558ba; background: #eff0ff; font-weight: 800; box-shadow: inset 3px 0 #6669cf; }
.mp-sidebar-item.danger { margin-top: 7px; border-top: 1px solid #edf0f4; border-radius: 0 0 9px 9px; }
.mp-content { gap: 16px; }
.mp-profile-header { margin: 0; padding: 22px 25px; border: 1px solid #e1e6ee; border-radius: 17px; background: linear-gradient(120deg,#fff,#f5f6ff); box-shadow: 0 10px 30px rgba(31,47,78,.045); }
.mp-avatar { width: 58px; height: 58px; color: #6265c7; background: linear-gradient(145deg,#eef0ff,#e4e6fc); box-shadow: inset 0 0 0 1px #d9dcf4; }
.mp-avatar-edit { width: 21px; height: 21px; right: -1px; bottom: -1px; border: 2px solid #fff; color: #fff; background: #5c5fc1; }
.mp-profile-name { color: #1e2e49; font-size: 1.2rem; }
.mp-profile-joined { color: #919cad; font-size: .73rem; }
.mp-tabs { padding: 5px; border: 1px solid #e2e7ee; border-radius: 12px; background: #fff; }
.mp-tab { min-height: 38px; padding: 0 18px; border: 0; border-radius: 8px; margin: 0; color: #8994a4; font-size: .8rem; }
.mp-tab.active { border: 0; color: #5558ba; background: #eff0ff; }
.mp-card { padding: 25px 27px; border-color: #e1e6ee; border-radius: 16px; box-shadow: 0 10px 30px rgba(31,47,78,.045); }
.mp-card-title { color: #263650; font-size: .95rem; }
.mp-row { min-height: 59px; border-color: #f0f2f5; }
.mp-row-label { color: #8994a5; font-size: .76rem; }
.mp-row-value { color: #26354d; font-size: .83rem; }
.mp-row-btn { min-height: 34px; height: 34px; border-color: #dce2e9; border-radius: 8px; color: #5c6578; background: #fafbfd; font-size: .72rem; }
.mp-row-btn:hover { color: #5558b9; border-color: #c9cbee; background: #f3f4ff; }
.mp-row-btn.primary { border-color: #5558b9; background: #5558b9; }
.mp-modal { border: 1px solid #e1e6ed; border-radius: 17px; box-shadow: 0 24px 70px rgba(20,31,58,.18); }

@media (max-width: 760px) {
  .login-nav, .su-nav, .su2-nav, .su3-nav, .fa-nav, .sc-nav, .dc-header, .is-header { padding: 0 16px; }
  .dc-container { padding: 43px 16px 65px; }
  .dc-check-btns { flex-direction: column; }
  .mp-page-heading { width: calc(100% - 32px); margin-top: 34px; }
  .mp-layout { padding: 0 16px; flex-direction: column; }
  .mp-sidebar { width: 100%; position: static; display: flex; overflow-x: auto; }
  .mp-sidebar-section { display: flex; flex: 0 0 auto; margin: 0; }
  .mp-sidebar-title { display: none; }
  .mp-sidebar-item { width: auto; white-space: nowrap; }
  .mp-sidebar-item.active { box-shadow: inset 0 -3px #6669cf; }
  .mp-profile-header { padding: 18px; }
  .mp-card { padding: 20px 18px; }
}


/* Auth experience refresh */
.auth-heading { text-align: center; }
.auth-eyebrow { display: inline-flex; align-items: center; gap: 6px; color: #6265c8; font-size: .64rem; font-weight: 800; letter-spacing: .14em; }
.auth-subtitle { margin-top: 9px; color: #8390a2; font-size: .8rem; line-height: 1.65; word-break: keep-all; }
.auth-heading-icon { width: 46px; height: 46px; margin: 14px auto 0; display: grid; place-items: center; border: 1px solid #dedff4; border-radius: 13px; color: #5d60c1; background: linear-gradient(145deg,#f5f5ff,#eceeff); box-shadow: 0 9px 22px rgba(70,73,160,.08); }

.login-page { position: relative; overflow: hidden; }
.login-page::before { content: ''; width: 500px; height: 500px; position: fixed; left: -270px; top: 100px; border-radius: 50%; background: radial-gradient(circle,rgba(105,108,215,.13),transparent 68%); pointer-events: none; }
.login-page::after { content: ''; width: 420px; height: 420px; position: fixed; right: -230px; bottom: -100px; border-radius: 50%; background: radial-gradient(circle,rgba(63,190,169,.1),transparent 68%); pointer-events: none; }
.login-container { padding: 64px 20px 80px; position: relative; z-index: 1; }
.login-form { max-width: 410px; padding: 32px; border: 1px solid #e1e6ee; border-radius: 19px; background: rgba(255,255,255,.9); box-shadow: 0 22px 60px rgba(28,42,72,.085); backdrop-filter: blur(12px); }
.auth-heading--login { width: 100%; margin-bottom: 25px; }
.login-title { margin: 10px 0 0; color: #172640; font-size: 1.75rem; letter-spacing: -.045em; }
.login-input { height: 50px; border: 1px solid #dce2ea; border-radius: 10px; color: #26354d; background: #fbfcfe; }
.login-input:focus { border-color: #8588db; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,199,.09); }
.login-save-id { color: #778397; font-size: .75rem; }
.login-save-id input[type='checkbox'] { accent-color: #5d60c2; }
.login-btn { height: 49px; border-radius: 10px; }
.login-btn--primary { display: flex; align-items: center; justify-content: center; gap: 7px; background: #172b4d; box-shadow: 0 9px 22px rgba(23,43,77,.14); }
.login-btn--primary:hover:not(:disabled) { background: #595cc4; transform: translateY(-1px); }
.login-btn--outline { border-color: #dce2e9; color: #5f6c80; background: #fff; }
.login-social { margin-top: 24px; padding-top: 24px; border-top: 1px solid #edf0f4; }
.social-btn { border-color: #e1e5eb; border-radius: 10px; box-shadow: 0 5px 14px rgba(31,47,78,.03); }
.auth-security { width: 100%; margin-top: 16px; display: flex; align-items: center; justify-content: center; gap: 6px; color: #94a0b0; font-size: .67rem; }
.login-find { margin-top: 18px; }
.login-find a { color: #69768a; font-size: .75rem; }

.su-container, .su2-container, .su3-container { max-width: 780px; padding: 54px 42px 75px; margin-top: 38px; margin-bottom: 70px; border: 1px solid #e1e6ee; border-radius: 21px; background: rgba(255,255,255,.94); box-shadow: 0 22px 60px rgba(28,42,72,.075); }
.auth-heading--signup { margin-bottom: 30px; }
.auth-heading--signup h1 { margin-top: 12px; color: #172640; font-size: 1.65rem; letter-spacing: -.04em; }
.su-steps, .su2-steps, .su3-steps { margin: 0 -42px 32px; padding: 20px 42px; border-top: 1px solid #edf0f4; border-bottom: 1px solid #edf0f4; background: #fafbfe; }
.su-step-circle, .su2-step-circle, .su3-step-circle { width: 30px; height: 30px; background: #e6e9ef; color: #9aa4b4; }
.su-step-circle.active, .su2-step-circle.active, .su3-step-circle.active { background: #5d60c2; box-shadow: 0 0 0 5px rgba(93,96,194,.1); }
.su2-step-circle.done, .su3-step-circle.done { background: #54a995; }
.su-step-label, .su2-step-label, .su3-step-label { color: #9aa5b5; font-size: .78rem; }
.su-step-label.active, .su2-step-label.active, .su3-step-label.active { color: #4e51ae; }
.su2-step-label.done, .su3-step-label.done { color: #438e7d; }
.su-step-line, .su2-step-line, .su3-step-line { background: #e2e6ed; }
.su2-step-line.done, .su3-step-line.done { background: #87caba; }
.su-field { margin-bottom: 22px; }
.su-label, .fa-label, .jf-card-label { color: #4f5d73; font-size: .76rem; font-weight: 700; }
.su-input, .su-select, .fa-input, .fa-select, .jf-card-input { border: 1px solid #dce2e9; border-radius: 10px; color: #26354d; background: #fbfcfe; }
.su-input:focus, .su-select:focus, .fa-input:focus, .fa-select:focus, .jf-card-input:focus { border-color: #8588da; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,199,.08); }
.su-side-btn, .fa-side-btn { min-width: 96px; border: 1px solid #d5d9ef; border-radius: 10px; color: #575ab6; background: #f5f5ff; }
.su-side-btn:hover:not(:disabled), .fa-side-btn:hover:not(:disabled) { border-color: #9da0df; background: #eeeeff; }
.su-next-btn, .fa-submit-btn { min-height: 51px; border-radius: 11px; background: #172b4d; box-shadow: 0 9px 22px rgba(23,43,77,.13); }
.su-next-btn:hover, .fa-submit-btn:hover:not(:disabled) { background: #595cc4; transform: translateY(-1px); }

.jf-guide-title, .su3-guide { color: #273750; font-size: .95rem; }
.su2-guide-desc { padding: 10px 12px; border-radius: 9px; color: #7f8b9e; background: #f7f8fc; }
.jf-tabs { padding: 5px; border: 1px solid #e0e5ed; border-radius: 12px; background: #f8f9fc; }
.jf-tab { border-radius: 8px; color: #7d899b; }
.jf-tab.active { color: #fff; background: #5d60c2; box-shadow: 0 6px 14px rgba(93,96,194,.18); }
.jf-job-chips { padding: 18px; border: 1px solid #e4e8ef; border-radius: 13px; background: #fbfcfe; }
.jf-job-chip, .jf-chip { border-color: #dde2ea; color: #667388; background: #fff; }
.jf-job-chip.selected, .jf-chip.selected { border-color: #5d60c2; color: #fff; background: #5d60c2; }
.jf-selected-box { border-color: #dfe3f2; border-radius: 13px; background: #f8f8ff; }
.jf-card { padding: 21px; border: 1px solid #e1e6ed; border-radius: 14px; background: #fbfcfe; }
.jf-add-btn { min-height: 46px; border-color: #cdd3e0; border-radius: 11px; color: #5e63bb; background: #f9f9ff; }
.su2-btn, .su3-btn { min-height: 51px; height: 51px; border-radius: 11px; }
.su2-btn--next, .su3-btn--submit { background: #172b4d; box-shadow: 0 9px 22px rgba(23,43,77,.13); }
.su2-btn--next:hover, .su3-btn--submit:hover:not(:disabled) { background: #595cc4; }
.su2-btn--prev, .su3-btn--prev { border-color: #dce2e9; color: #637086; }

.fa-container { max-width: 620px; margin-top: 55px; margin-bottom: 70px; padding: 42px; border: 1px solid #e1e6ee; border-radius: 20px; background: rgba(255,255,255,.94); box-shadow: 0 22px 60px rgba(28,42,72,.075); }
.auth-heading--find { margin-bottom: 27px; }
.fa-title { margin: 11px 0 0; color: #172640; font-size: 1.65rem; letter-spacing: -.04em; }
.fa-tabs { padding: 5px; border: 1px solid #e1e6ed; border-radius: 11px; background: #f7f8fb; }
.fa-tab { border: 0; border-radius: 8px; color: #8994a5; }
.fa-tab.active { color: #fff; background: #5d60c2; box-shadow: 0 6px 14px rgba(93,96,194,.18); }
.fa-content { margin-top: 26px; }
.fa-result { padding: 25px; border: 1px solid #dfe2f2; border-radius: 13px; background: #f7f8ff; }
.fa-bottom-links { margin-top: 24px; padding-top: 19px; border-top: 1px solid #edf0f4; }
.fa-bottom-links a { color: #657186; }

.sc-body { padding: 70px 24px; position: relative; isolation: isolate; background: radial-gradient(circle at 50% 35%,rgba(105,108,215,.1),transparent 28%); }
.sc-body::before { content: ''; width: min(470px,calc(100% - 36px)); height: 410px; position: absolute; z-index: -1; border: 1px solid #e1e6ee; border-radius: 22px; background: rgba(255,255,255,.94); box-shadow: 0 24px 70px rgba(28,42,72,.09); }
.sc-eyebrow { display: flex; align-items: center; gap: 6px; color: #6265c8; font-size: .65rem; font-weight: 800; letter-spacing: .14em; }
.sc-icon { width: 78px; height: 78px; margin: 26px 0 22px; display: grid; place-items: center; border-radius: 50%; color: #48a38f; background: #e9f8f4; box-shadow: 0 0 0 9px rgba(72,163,143,.08); }
.sc-title { color: #172640; font-size: 1.75rem; letter-spacing: -.045em; }
.sc-desc { color: #6f7c90; font-size: .9rem; }
.sc-redirect { color: #9aa4b3; }
.sc-btn { min-height: 49px; padding: 0 25px; display: flex; align-items: center; gap: 8px; border-radius: 10px; background: #172b4d; box-shadow: 0 9px 22px rgba(23,43,77,.14); }
.sc-btn:hover { background: #595cc4; }

/* Community refresh */
.board-wrap { background: #f6f8fb; }
.board-hero { position: relative; overflow: hidden; color: #fff; background: #0c1f41; }
.board-hero::before { content: ''; width: 500px; height: 500px; position: absolute; right: -100px; top: -280px; border-radius: 50%; background: radial-gradient(circle,rgba(107,110,225,.42),transparent 68%); }
.board-hero::after { content: ''; position: absolute; inset: 0; opacity: .18; background-image: linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px); background-size: 56px 56px; mask-image: linear-gradient(to right,#000,transparent 85%); }
.board-hero__inner { width: min(1080px,calc(100% - 48px)); min-height: 275px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 40px; position: relative; z-index: 1; }
.board-hero__inner > div:first-child > span { display: flex; align-items: center; gap: 6px; color: #aeb4ff; font-size: .65rem; font-weight: 800; letter-spacing: .14em; }
.board-hero h1 { margin-top: 13px; color: #f6f8fc; font-size: clamp(2rem,4vw,2.8rem); line-height: 1.25; letter-spacing: -.05em; }
.board-hero p { margin-top: 13px; color: #9cabc1; font-size: .82rem; }
.board-hero__visual { width: 245px; padding: 24px; display: flex; flex-direction: column; align-items: flex-start; gap: 7px; border: 1px solid rgba(255,255,255,.12); border-radius: 17px; color: #b8bcff; background: rgba(255,255,255,.055); box-shadow: 0 20px 45px rgba(0,5,20,.18); backdrop-filter: blur(12px); }
.board-hero__visual strong { margin-top: 7px; color: #edf1f8; font-size: .87rem; }
.board-hero__visual span { color: #8291a9; font-size: .65rem; }
.board-container { max-width: 1080px; padding: 42px 24px 85px; }
.board-tabs { padding: 5px; border: 1px solid #e0e5ed; border-radius: 12px; background: #fff; box-shadow: 0 8px 25px rgba(31,47,78,.035); }
.board-tab { min-height: 40px; padding: 0 20px; border: 0; border-radius: 8px; margin: 0; color: #8994a5; font-size: .82rem; }
.board-tab.active { border: 0; color: #fff; background: #575abc; box-shadow: 0 6px 14px rgba(87,90,188,.18); }
.board-search-wrap { padding: 10px; border: 1px solid #e1e6ed; border-radius: 13px; background: #fff; box-shadow: 0 8px 25px rgba(31,47,78,.035); }
.board-search-type, .board-search-input { min-height: 42px; border: 1px solid #dfe4eb; border-radius: 9px; color: #5f6c81; background: #fafbfd; }
.board-search-input:focus { border-color: #8588da; box-shadow: 0 0 0 3px rgba(99,102,199,.08); }
.board-search-btn { min-width: 88px; display: flex; align-items: center; justify-content: center; gap: 6px; border-radius: 9px; background: #172b4d; }
.board-search-btn:hover { background: #595cc4; }
.board-filter-wrap { padding: 17px 19px; gap: 12px; border-color: #e1e6ed; border-radius: 13px; box-shadow: 0 8px 25px rgba(31,47,78,.035); }
.board-filter-label { color: #8994a5; font-size: .7rem; font-weight: 700; }
.board-filter-btn { padding: 6px 12px; border-color: #dfe4eb; color: #68758a; background: #fafbfd; }
.board-filter-btn:hover { border-color: #b8bae8; color: #5558b9; background: #f5f5ff; }
.board-filter-btn.active { border-color: #5d60c2; color: #fff; background: #5d60c2; }
.board-list { border-color: #e1e6ed; border-radius: 15px; box-shadow: 0 10px 30px rgba(31,47,78,.045); }
.board-item { min-height: 112px; padding: 20px 23px; border-color: #edf0f4; }
.board-item:hover { background: #f9f9ff; }
.board-item.notice { background: #fffaf0; }
.board-item-category { padding: 4px 7px; border-radius: 5px; color: #6669c6; background: #f0f1ff; font-weight: 700; }
.board-item-cscategory { color: #557a96; }
.board-item-title { margin: 8px 0 6px; color: #25354f; font-size: .93rem; }
.board-item-info { color: #9aa4b3; }
.board-item-tag { color: #6a73a0; background: #f4f5fb; }
.board-item-counts { color: #8d98a8; }
.board-empty { min-height: 260px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #9aa5b4; }
.board-empty svg { color: #7477d4; }
.board-empty strong { color: #58657a; font-size: .9rem; }
.board-empty span { font-size: .72rem; }
.board-bottom { align-items: center; }
.board-paging button { width: 36px; height: 36px; border-color: #dfe4eb; border-radius: 8px; color: #6e7a8d; background: #fff; }
.board-paging button.active { border-color: #575abc; background: #575abc; }
.board-write-btn { min-height: 40px; padding: 0 16px; display: flex; align-items: center; gap: 7px; border-radius: 9px; background: #172b4d; box-shadow: 0 7px 17px rgba(23,43,77,.13); }
.board-write-btn:hover { background: #595cc4; }

@media (max-width: 720px) {
  .login-form { padding: 25px 20px; }
  .su-container, .su2-container, .su3-container, .fa-container { width: calc(100% - 28px); margin-top: 22px; padding: 34px 20px 55px; border-radius: 17px; }
  .su-steps, .su2-steps, .su3-steps { margin: 0 -20px 27px; padding: 17px 20px; overflow-x: auto; }
  .su-step-label, .su2-step-label, .su3-step-label { display: none; }
  .su-email-row, .fa-email-row { flex-wrap: wrap; }
  .su-email-local, .fa-email-local { min-width: calc(100% - 28px); }
  .su-select-wrap, .fa-select-wrap { flex: 1; }
  .board-hero__inner { width: calc(100% - 32px); min-height: 245px; }
  .board-hero__visual { display: none; }
  .board-container { padding: 28px 16px 65px; }
  .board-tabs { overflow-x: auto; }
  .board-tab { flex: 0 0 auto; }
  .board-search-wrap { flex-wrap: wrap; }
  .board-search-type { width: 100%; }
  .board-search-input { min-width: 0; }
  .board-filter-row { align-items: flex-start; flex-direction: column; }
  .board-item { align-items: flex-start; flex-direction: column; gap: 13px; }
  .board-item-counts { width: 100%; justify-content: flex-end; }
  .board-bottom { flex-direction: column; gap: 17px; }
  .board-write-btn { width: 100%; justify-content: center; }
}

`

export default GlobalStyles
