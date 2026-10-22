import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ReviewQuestionItem } from '../types';
import { ArrowLeft, CheckCircle2, XCircle, Clock, BookOpen } from 'lucide-react';

interface SoloReviewViewProps {
  sessionId: string;
  onBack: () => void;
}

export const SoloReviewView: React.FC<SoloReviewViewProps> = ({ sessionId, onBack }) => {
  const [reviewItems, setReviewItems] = useState<ReviewQuestionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReview();
  }, [sessionId]);

  const loadReview = async () => {
    try {
      setLoading(true);
      const items = await api.getSoloReview(sessionId);
      setReviewItems(items);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat review sesi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <button className="btn btn-secondary btn-sm" onClick={onBack} style={{ marginBottom: '0.75rem' }}>
            <ArrowLeft size={16} />
            Kembali ke Hasil
          </button>
          <h2>Review Jawaban & Kunci Pembahasan</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Tinjau seluruh soal untuk memperdalam pemahaman materi uji kompetensi.
          </p>
        </div>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Memuat pembahasan soal...</p>
        </div>
      )}

      {error && (
        <div className="card" style={{ borderColor: 'var(--danger)', background: 'var(--danger-light)', padding: '1.5rem', color: 'var(--danger-dark)' }}>
          {error}
        </div>
      )}

      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {reviewItems.map((item) => {
            const isCorrect = item.userAnswer?.isCorrect;
            const isTimeout = item.userAnswer?.isTimeout;

            return (
              <div key={item.questionId} className="card" style={{ padding: '1.75rem' }}>
                {}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span className="badge badge-primary">Soal #{item.questionOrder}</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {isCorrect ? (
                      <span className="badge badge-success">
                        <CheckCircle2 size={14} />
                        Benar ({item.userAnswer?.timeTakenSeconds}s)
                      </span>
                    ) : isTimeout ? (
                      <span className="badge badge-warning">
                        <Clock size={14} />
                        Waktu Habis
                      </span>
                    ) : (
                      <span className="badge badge-danger">
                        <XCircle size={14} />
                        Belum Tepat ({item.userAnswer?.timeTakenSeconds}s)
                      </span>
                    )}
                  </div>
                </div>

                {}
                <p style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {item.questionText}
                </p>

                {}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  {item.options.map((opt) => {
                    const isSelected = item.userAnswer?.selectedOptionId === opt.id;
                    const isTheCorrectKey = opt.id === item.correctOption.id;

                    let bg = 'var(--surface-alt)';
                    let border = '1px solid var(--border)';
                    let textColor = 'var(--text-primary)';

                    if (isTheCorrectKey) {
                      bg = 'var(--success-light)';
                      border = '1.5px solid var(--success)';
                      textColor = 'var(--success-dark)';
                    } else if (isSelected && !isTheCorrectKey) {
                      bg = 'var(--danger-light)';
                      border = '1.5px solid var(--danger)';
                      textColor = 'var(--danger-dark)';
                    }

                    return (
                      <div
                        key={opt.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          background: bg,
                          border: border,
                          color: textColor,
                          fontSize: '0.95rem',
                        }}
                      >
                        <strong style={{ minWidth: '24px' }}>{opt.label}.</strong>
                        <span style={{ flex: 1 }}>{opt.text}</span>
                        {isTheCorrectKey && (
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success-dark)' }}>
                            [Kunci Jawaban]
                          </span>
                        )}
                        {isSelected && !isTheCorrectKey && (
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--danger-dark)' }}>
                            [Jawaban Anda]
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {}
                {item.explanation && (
                  <div
                    style={{
                      background: 'rgba(79, 70, 229, 0.05)',
                      borderLeft: '4px solid var(--primary)',
                      padding: '1rem 1.25rem',
                      borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem' }}>
                      <BookOpen size={16} />
                      Pembahasan Klinis:
                    </div>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {item.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
