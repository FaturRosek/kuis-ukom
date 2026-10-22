import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PracticeHistoryItem } from '../types';
import { History, Award, Clock, CheckCircle2, Eye } from 'lucide-react';

interface HistoryViewProps {
  onReviewSession: (sessionId: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onReviewSession }) => {
  const [history, setHistory] = useState<PracticeHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const items = await api.getHistory();
      setHistory(items);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Riwayat Latihan & Hasil Ujian</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Daftar sesi latihan mandiri dan multiplayer yang telah diselesaikan.
        </p>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          Memuat riwayat...
        </div>
      )}

      {!loading && history.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <History size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>Belum ada riwayat latihan</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Mulai latihan solo pertama Anda untuk mengukur tingkat kesiapan UKOM.
          </p>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((item) => {
            const score = Math.round(Number(item.score_percentage));
            const isPassed = score >= 65;
            const dateStr = new Date(item.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.75rem',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: 'var(--radius-md)',
                      background: isPassed ? 'var(--success-light)' : 'var(--danger-light)',
                      color: isPassed ? 'var(--success-dark)' : 'var(--danger-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                    }}
                  >
                    {score}%
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span className="badge badge-primary">{item.category_name}</span>
                      <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                        {item.mode}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.05rem' }}>{item.question_set_title}</h4>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Peserta: <strong>{item.player_name}</strong> • {dateStr}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <div>
                      <strong style={{ color: 'var(--success-dark)' }}>{item.correct_count}</strong> benar dari{' '}
                      <strong>{item.total_questions}</strong> soal
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Waktu total: {item.total_time_seconds}s
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onReviewSession(item.session_id)}
                  >
                    <Eye size={16} />
                    Lihat Review
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
