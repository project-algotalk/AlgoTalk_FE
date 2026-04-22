// src/pages/main/MainPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import useAuthStore from '../../store/authStore'
import './MainPage.css'

export default function MainPage() {
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuthStore()

  const features = [
    {
      title: 'AI 면접 시뮬레이션',
      desc: '실제 면접처럼 AI와 1:1 기술 면접을 연습하세요. 직무별 맞춤 질문을 제공합니다.',
      icon: '🎤',
    },
    {
      title: '답변 분석 & 피드백',
      desc: '답변 논리성, 추임새, 답변 시간을 자동으로 분석하고 개선점을 제안합니다.',
      icon: '📊',
    },
    {
      title: '커뮤니티 질문 공유',
      desc: '다른 취준생들과 면접 질문을 공유하고 스크랩해서 바로 연습에 활용하세요.',
      icon: '💬',
    },
  ]

  return (
    <div className="main-page">
      <Navbar />

      {/* Hero 섹션 */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">
            AI와 함께하는<br />
            기술 면접 준비
          </h1>
          <p className="hero-subtitle">
            실전처럼 연습하고, 데이터로 성장하세요
          </p>
          <div className="hero-divider" />
          <button
            className="hero-btn"
            onClick={() => navigate(isLoggedIn ? '/interview' : '/login')}
          >
            면접 보기
          </button>
        </div>
      </section>

      {/* 기능 소개 */}
      <section className="features">
        <div className="features-inner">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-img">
                <span className="feature-icon">{f.icon}</span>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}