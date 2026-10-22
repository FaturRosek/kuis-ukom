import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SessionResultSummary } from '../types';
import { CheckCircle2, XCircle, Clock, RotateCcw, FileText, Home } from 'lucide-react';

interface SoloResultViewProps {
  summary: SessionResultSummary;
  onReview: () => void;
  onRetry: () => void;
  onHome: () => void;
}

export const SoloResultView: React.FC<SoloResultViewProps> = ({
  summary,
  onReview,
  onRetry,
  onHome,
}) => {
  useEffect(() => {
    if (summary.scorePercentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [summary.scorePercentage]);

  const isPassed = summary.scorePercentage >= 65;

  return (
    <div className="card result-card">
      <div className="score-circle">
        <span className="score-number">{Math.round(summary.scorePercentage)}%</span>
        <span className="score-label">Akurasi Nilai</span>
      </div>

      <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>
        {isPassed ? 'Selamat! Sesi Latihan Selesai' : 'Tetap Semangat! Terus Berlatih'}
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.75rem' }}>
        {summary.title}
      </p>

      {}
      <div className="stats-grid">
        <div className="stat-box" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="stat-value" style={{ color: 'var(--success-dark)' }}>
            {summary.correctCount}
          </div>
          <div className="stat-desc">
            <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Jawaban Benar
          </div>
        </div>

        <div className="stat-box" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div className="stat-value" style={{ color: 'var(--danger-dark)' }}>
            {summary.incorrectCount}
          </div>
          <div className="stat-desc">
            <XCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Belum Tepat
          </div>
        </div>

        <div className="stat-box" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>
            {summary.timeoutCount}
          </div>
          <div className="stat-desc">
            <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Waktu Habis
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Total waktu pengerjaan: <strong>{summary.totalTimeSeconds} detik</strong>. Skor akademik dihitung murni dari akurasi jawaban benar ({summary.correctCount} dari {summary.totalQuestions} soal).
      </p>

      {}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={onReview}>
          <FileText size={18} />
          Review Seluruh Soal & Pembahasan
        </button>
        <button className="btn btn-secondary" onClick={onRetry}>
          <RotateCcw size={18} />
          Ulangi Latihan
        </button>
        <button className="btn btn-secondary" onClick={onHome}>
          <Home size={18} />
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};
