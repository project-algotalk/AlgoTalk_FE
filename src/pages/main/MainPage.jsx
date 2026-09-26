import {
  ArrowRight,
  Camera,
  BarChart3,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  MessageSquareText,
  Mail,
  Mic2,
  Sparkles,
  ScanFace,
  Target,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'

const features = [
  {
    number: '01',
    title: '실전 같은 AI 면접',
    desc: '직무와 난이도를 선택하면 AI가 맥락에 맞는 꼬리 질문까지 이어갑니다.',
    icon: Mic2,
    accent: 'violet',
    visual: (
      <div className="feature-wave" aria-hidden="true">
        {[16, 28, 42, 22, 50, 34, 58, 30, 44, 20, 36, 16].map((height, index) => (
          <span key={index} style={{ '--wave-height': `${height}px` }} />
        ))}
      </div>
    ),
  },
  {
    number: '02',
    title: '근거 있는 답변 분석',
    desc: '논리성, 답변 속도, 추임새를 데이터로 확인하고 다음 답변의 방향을 찾으세요.',
    icon: BarChart3,
    accent: 'blue',
    visual: (
      <div className="feature-score" aria-hidden="true">
        <div>
          <strong>86</strong>
          <span>답변 완성도</span>
        </div>
        <svg viewBox="0 0 180 58" role="presentation">
          <path d="M2 49 C24 43, 31 50, 49 36 S76 42, 91 26 S118 31, 132 17 S159 20, 178 5" />
        </svg>
      </div>
    ),
  },
  {
    number: '03',
    title: '함께 쌓는 질문 아카이브',
    desc: '다른 개발자의 질문과 답변을 탐색하고, 필요한 질문은 스크랩해 바로 연습하세요.',
    icon: MessageSquareText,
    accent: 'mint',
    visual: (
      <div className="feature-tags" aria-hidden="true">
        <span>자료구조</span>
        <span>네트워크</span>
        <span>운영체제</span>
        <span>데이터베이스</span>
      </div>
    ),
  },
]

export default function MainPage() {
  const navigate = useNavigate()

  return (
    <div className="main-page">
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-ambient hero-ambient--one" />
          <div className="hero-ambient hero-ambient--two" />
          <div className="hero-grid" />

          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-eyebrow">
                <Sparkles size={15} strokeWidth={2.2} />
                <span>개발자를 위한 AI 기술면접 코치</span>
              </div>
              <h1 className="hero-title">
                막연한 면접 준비를<br />
                <span>확신으로 바꾸세요.</span>
              </h1>
              <p className="hero-subtitle">
                실전처럼 말하고, AI 피드백으로 부족한 부분을 채우세요.<br className="hero-subtitle-break" />
                오늘의 연습이 내일의 합격 답변이 됩니다.
              </p>
              <div className="hero-actions">
                <button className="hero-btn hero-btn--primary" onClick={() => navigate('/interview')}>
                  무료로 면접 시작하기
                  <ArrowRight size={18} />
                </button>
                <button className="hero-btn hero-btn--secondary" onClick={() => navigate('/questions')}>
                  질문 둘러보기
                </button>
              </div>
              <div className="hero-proof">
                <div className="hero-proof-avatars" aria-hidden="true">
                  <span>FE</span><span>BE</span><span>AI</span>
                </div>
                <div>
                  <div className="hero-proof-stars">★★★★★</div>
                  <p>개발자들의 면접 루틴, AlgoTalk</p>
                </div>
              </div>
            </div>

            <div className="hero-visual" aria-label="AlgoTalk AI 면접 화면 미리보기">
              <div className="interview-card">
                <div className="interview-card__topbar">
                  <div className="interview-card__brand">
                    <span className="interview-card__brand-mark"><Camera size={17} /></span>
                    <div>
                      <strong>AI Interview</strong>
                      <span>Frontend · 3 / 8</span>
                    </div>
                  </div>
                  <div className="interview-card__live"><i /> LIVE</div>
                </div>

                <div className="interview-card__body">
                  <div className="camera-preview">
                    <div className="camera-preview__room" aria-hidden="true">
                      <span className="camera-preview__lamp" />
                      <span className="camera-preview__plant"><i /><i /><i /></span>
                      <span className="camera-preview__desk" />
                    </div>
                    <div className="candidate" aria-hidden="true">
                      <span className="candidate__hair" />
                      <span className="candidate__head">
                        <i className="candidate__eye candidate__eye--left" />
                        <i className="candidate__eye candidate__eye--right" />
                        <i className="candidate__nose" />
                        <i className="candidate__smile" />
                      </span>
                      <span className="candidate__neck" />
                      <span className="candidate__body" />
                    </div>
                    <span className="camera-preview__focus camera-preview__focus--one" />
                    <span className="camera-preview__focus camera-preview__focus--two" />
                    <span className="camera-preview__focus camera-preview__focus--three" />
                    <span className="camera-preview__focus camera-preview__focus--four" />
                    <div className="camera-preview__analysis">
                      <span><ScanFace size={14} /> 시선 감지</span>
                      <span><i /> 자세 안정</span>
                    </div>
                    <div className="camera-preview__recording"><i /> REC</div>
                    <div className="camera-preview__question">
                      <span>QUESTION 03</span>
                      <strong>브라우저 렌더링 과정을 설명해 주세요.</strong>
                    </div>
                    <div className="camera-preview__wave" aria-hidden="true">
                      {[12, 20, 10, 32, 45, 24, 52, 36, 18, 42, 58, 30, 46, 22, 34, 14, 26, 10].map((height, index) => (
                        <span key={index} style={{ '--answer-height': `${height * 0.55}px`, '--delay': `${index * -0.08}s` }} />
                      ))}
                    </div>
                  </div>
                  <div className="interview-card__footer">
                    <span><Clock3 size={15} /> 01:24</span>
                    <button aria-label="답변 녹음 중"><Mic2 size={19} /></button>
                    <span><Code2 size={15} /> CS 기본</span>
                  </div>
                </div>
              </div>

              <div className="floating-card floating-card--score">
                <span className="floating-card__icon"><Target size={18} /></span>
                <div><strong>논리성 92%</strong><span>핵심부터 잘 설명했어요</span></div>
                <Check size={16} className="floating-card__check" />
              </div>
              <div className="floating-card floating-card--tip">
                <Sparkles size={16} />
                <span>AI 실시간 분석 중</span>
                <i /><i /><i />
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="features-heading">
            <div>
              <span className="section-kicker">WHY ALGOTALK</span>
              <h2>혼자 연습해도,<br />혼자가 아닌 것처럼.</h2>
            </div>
            <p>
              질문을 받는 순간부터 답변을 개선하는 과정까지,<br />
              기술 면접 준비에 필요한 모든 흐름을 하나로 연결했습니다.
            </p>
          </div>

          <div className="features-inner">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <article className={`feature-card feature-card--${feature.accent}`} key={feature.title}>
                  <div className="feature-card__meta">
                    <span>{feature.number}</span>
                    <Icon size={23} strokeWidth={1.8} />
                  </div>
                  <div className="feature-card__visual">{feature.visual}</div>
                  <div className="feature-card__content">
                    <h3>{feature.title}</h3>
                    <p>{feature.desc}</p>
                    <button onClick={() => navigate(feature.number === '03' ? '/questions' : '/interview')}>
                      자세히 보기 <ChevronRight size={16} />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="main-footer">
        <div className="main-footer__inner">
          <div className="main-footer__brand">
            <span className="main-footer__brand-mark" aria-hidden="true">A</span>
            <div>
              <strong>AlgoTalk</strong>
              <p>개발자를 위한 AI 기술면접 코치</p>
            </div>
          </div>

          <div className="main-footer__contact">
            <span>CONTACT</span>
            <a href="mailto:jh96.dev@gmail.com">
              <Mail size={17} aria-hidden="true" />
              jh96.dev@gmail.com
            </a>
          </div>
        </div>
        <div className="main-footer__bottom">
          <span>상호: 알고톡 AlgoTalk</span>
          <span>© 2026 AlgoTalk. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
