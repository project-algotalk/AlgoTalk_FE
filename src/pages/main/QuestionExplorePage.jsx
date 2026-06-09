import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  Layers3,
  Search,
  Sparkles,
  Target,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'

const categories = [
  '전체',
  '자료구조/알고리즘',
  '데이터베이스',
  '운영체제',
  '네트워크',
  '프론트엔드 개발자',
  '백엔드 개발자',
]

const sampleQuestions = [
  {
    id: 1,
    category: '프론트엔드 개발자',
    categoryId: 100,
    subject: '소프트웨어 개발',
    level: '기본',
    time: '1분 30초',
    question: '브라우저 렌더링 과정을 설명해 주세요.',
    description: 'HTML을 화면에 그리기까지 어떤 단계가 일어나는지 확인하는 질문입니다.',
    keywords: ['DOM', 'CSSOM', 'Render Tree'],
    guide: [
      'HTML과 CSS를 파싱해 DOM과 CSSOM을 생성합니다.',
      '두 트리를 결합해 Render Tree를 구성합니다.',
      'Layout으로 위치와 크기를 계산하고 Paint와 Composite를 수행합니다.',
    ],
    tip: '각 단계가 성능 최적화와 어떻게 연결되는지 덧붙이면 좋아요.',
  },
  {
    id: 2,
    category: '데이터베이스',
    categoryId: 11,
    subject: '직무 공통',
    level: '기본',
    time: '1분 30초',
    question: '데이터베이스 인덱스는 어떻게 동작하나요?',
    description: '인덱스의 자료구조와 조회 성능, 트레이드오프를 설명하는 질문입니다.',
    keywords: ['B-Tree', '조회 성능', '쓰기 비용'],
    guide: [
      '인덱스는 별도의 자료구조에 검색 키와 레코드 위치를 저장합니다.',
      '일반적으로 B-Tree 계열을 사용해 탐색 범위를 빠르게 줄입니다.',
      '조회는 빨라지지만 추가 저장 공간과 쓰기 작업 비용이 발생합니다.',
    ],
    tip: '카디널리티가 낮은 컬럼의 인덱스 효율도 함께 언급해 보세요.',
  },
  {
    id: 3,
    category: '운영체제',
    categoryId: 12,
    subject: '직무 공통',
    level: '빈출',
    time: '1분 30초',
    question: '프로세스와 스레드의 차이를 설명해 주세요.',
    description: '실행 단위와 메모리 공유 관점에서 차이를 묻는 대표 CS 질문입니다.',
    keywords: ['메모리', 'Context Switch', '동시성'],
    guide: [
      '프로세스는 독립된 메모리 공간을 할당받는 실행 단위입니다.',
      '스레드는 프로세스 안에서 Code, Data, Heap 영역을 공유합니다.',
      '스레드는 통신이 빠르지만 공유 자원에 대한 동기화가 필요합니다.',
    ],
    tip: '멀티프로세스와 멀티스레드의 장애 격리 차이까지 연결해 보세요.',
  },
  {
    id: 4,
    category: '프론트엔드 개발자',
    categoryId: 100,
    subject: '소프트웨어 개발',
    level: '빈출',
    time: '1분 30초',
    question: 'JavaScript 이벤트 루프의 동작 원리를 설명해 주세요.',
    description: '싱글 스레드 환경에서 비동기 작업이 처리되는 흐름을 확인합니다.',
    keywords: ['Call Stack', 'Task Queue', 'Microtask'],
    guide: [
      '동기 코드는 Call Stack에서 순차적으로 실행됩니다.',
      '비동기 작업의 콜백은 완료 후 각 Task Queue에서 대기합니다.',
      '스택이 비면 이벤트 루프가 Microtask를 우선해 실행 큐로 옮깁니다.',
    ],
    tip: 'Promise와 setTimeout의 실행 순서를 예시로 들면 명확해집니다.',
  },
  {
    id: 5,
    category: '네트워크',
    categoryId: 13,
    subject: '직무 공통',
    level: '심화',
    time: '1분 30초',
    question: 'HTTP와 HTTPS의 차이와 TLS Handshake를 설명해 주세요.',
    description: '안전한 통신을 위해 인증서와 암호화 키가 교환되는 과정을 묻습니다.',
    keywords: ['TLS', '인증서', '대칭키'],
    guide: [
      'HTTPS는 HTTP 통신을 TLS 프로토콜로 암호화합니다.',
      '서버 인증서를 통해 신뢰할 수 있는 서버인지 검증합니다.',
      'Handshake에서 합의한 세션 키로 이후 데이터를 대칭키 암호화합니다.',
    ],
    tip: '비대칭키와 대칭키를 함께 사용하는 이유를 설명해 보세요.',
  },
  {
    id: 6,
    category: '자료구조/알고리즘',
    categoryId: 10,
    subject: '직무 공통',
    level: '기본',
    time: '1분 30초',
    question: '해시 테이블의 충돌 해결 방법을 설명해 주세요.',
    description: '동일한 해시 값이 생성될 때 데이터를 저장하고 찾는 방법을 확인합니다.',
    keywords: ['Chaining', 'Open Addressing', 'Load Factor'],
    guide: [
      '서로 다른 키가 같은 버킷을 가리키면 해시 충돌이 발생합니다.',
      'Chaining은 같은 버킷의 데이터를 연결 리스트 등으로 관리합니다.',
      'Open Addressing은 비어 있는 다른 버킷을 탐색해 저장합니다.',
    ],
    tip: 'Load Factor와 리사이징이 조회 성능에 미치는 영향도 중요해요.',
  },
  {
    id: 7,
    category: '백엔드 개발자',
    categoryId: 101,
    subject: '소프트웨어 개발',
    level: '빈출',
    time: '1분 30초',
    question: '트랜잭션의 ACID 속성과 격리 수준을 설명해 주세요.',
    description: '안정적인 데이터 처리를 위한 트랜잭션의 핵심 원칙을 확인합니다.',
    keywords: ['ACID', 'Isolation Level', '동시성'],
    guide: [
      'ACID는 원자성, 일관성, 격리성, 지속성을 의미합니다.',
      '격리 수준은 동시에 실행되는 트랜잭션이 서로에게 노출되는 범위를 결정합니다.',
      '격리 수준이 높을수록 정합성은 강화되지만 동시 처리 성능과 트레이드오프가 있습니다.',
    ],
    tip: 'Dirty Read와 Non-repeatable Read 사례를 연결하면 이해도를 보여줄 수 있어요.',
  },
]

export default function QuestionExplorePage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [query, setQuery] = useState('')
  const [openQuestionId, setOpenQuestionId] = useState(1)
  const [savedIds, setSavedIds] = useState([])

  const filteredQuestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return sampleQuestions.filter((question) => {
      const matchesCategory = selectedCategory === '전체' || question.category === selectedCategory
      const searchableText = [
        question.question,
        question.description,
        question.subject,
        ...question.keywords,
      ].join(' ').toLowerCase()

      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery))
    })
  }, [query, selectedCategory])

  const toggleSaved = (questionId) => {
    setSavedIds((current) => (
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId]
    ))
  }

  return (
    <div className="questions-page">
      <Navbar />

      <main>
        <section className="questions-hero">
          <div className="questions-hero__glow" />
          <div className="questions-container questions-hero__inner">
            <button className="questions-back" onClick={() => navigate('/')}>
              <ArrowLeft size={16} /> 메인으로
            </button>
            <div className="questions-hero__content">
              <div>
                <span className="questions-eyebrow"><Sparkles size={14} /> INTERVIEW LIBRARY</span>
                <h1>어떤 질문을 받게 될지<br />미리 확인해 보세요.</h1>
                <p>실제 기술 면접에서 자주 등장하는 질문과<br />답변에 꼭 담아야 할 핵심 포인트를 모았습니다.</p>
              </div>
              <div className="questions-hero__stats" aria-label="샘플 질문 안내">
                <div><strong>7</strong><span>엄선된 샘플 질문</span></div>
                <i />
                <div><strong>7</strong><span>실제 CS 카테고리</span></div>
                <i />
                <div><strong>100%</strong><span>무료 미리보기</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="questions-library">
          <div className="questions-container">
            <div className="questions-toolbar">
              <div className="questions-tabs" role="tablist" aria-label="질문 카테고리">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={selectedCategory === category ? 'active' : ''}
                    onClick={() => setSelectedCategory(category)}
                    role="tab"
                    aria-selected={selectedCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <label className="questions-search">
                <Search size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="질문 또는 키워드 검색"
                  aria-label="질문 검색"
                />
              </label>
            </div>

            <div className="questions-section-heading">
              <div>
                <span>CURATED QUESTIONS</span>
                <h2>{selectedCategory === '전체' ? '전체 면접 질문' : `${selectedCategory} 면접 질문`}</h2>
              </div>
              <p><strong>{filteredQuestions.length}</strong>개의 질문</p>
            </div>

            {filteredQuestions.length > 0 ? (
              <div className="questions-list">
                {filteredQuestions.map((question, index) => {
                  const isOpen = openQuestionId === question.id
                  const isSaved = savedIds.includes(question.id)

                  return (
                    <article className={`question-card ${isOpen ? 'question-card--open' : ''}`} key={question.id}>
                      <button
                        className="question-card__summary"
                        onClick={() => setOpenQuestionId(isOpen ? null : question.id)}
                        aria-expanded={isOpen}
                      >
                        <span className="question-card__number">Q{String(index + 1).padStart(2, '0')}</span>
                        <span className="question-card__main">
                          <span className="question-card__labels">
                            <em>{question.category}</em>
                            <em>{question.subject}</em>
                            <em className={`level level--${question.level}`}>{question.level}</em>
                          </span>
                          <strong>{question.question}</strong>
                          <span className="question-card__description">{question.description}</span>
                          <span className="question-card__keywords">
                            {question.keywords.map((keyword) => <i key={keyword}>#{keyword}</i>)}
                          </span>
                        </span>
                        <span className="question-card__aside">
                          <span><Clock3 size={15} /> 권장 {question.time}</span>
                          <ChevronDown size={20} />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="question-answer">
                          <div className="question-answer__header">
                            <span><Target size={17} /> 답변 핵심 포인트</span>
                            <button
                              className={isSaved ? 'saved' : ''}
                              onClick={() => toggleSaved(question.id)}
                              aria-label={isSaved ? '스크랩 취소' : '질문 스크랩'}
                            >
                              <Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} />
                              {isSaved ? '저장됨' : '스크랩'}
                            </button>
                          </div>
                          <ol>
                            {question.guide.map((item) => (
                              <li key={item}><CheckCircle2 size={18} /><span>{item}</span></li>
                            ))}
                          </ol>
                          <div className="question-answer__tip">
                            <Sparkles size={16} />
                            <p><strong>AI 코치 Tip</strong>{question.tip}</p>
                          </div>
                          <button className="question-answer__practice" onClick={() => navigate('/interview')}>
                            이 질문으로 실전 연습하기 <ArrowRight size={17} />
                          </button>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="questions-empty">
                <Search size={25} />
                <h3>일치하는 질문이 없어요.</h3>
                <p>다른 검색어나 카테고리를 선택해 보세요.</p>
              </div>
            )}

            <div className="questions-cta">
              <div className="questions-cta__icon"><Layers3 size={25} /></div>
              <div>
                <span>샘플은 여기까지!</span>
                <h2>내 직무에 맞는 질문으로<br />실전 면접을 시작해 보세요.</h2>
              </div>
              <button onClick={() => navigate('/interview')}>
                AI 면접 시작하기 <ArrowRight size={18} />
              </button>
              <Code2 className="questions-cta__deco" size={130} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
