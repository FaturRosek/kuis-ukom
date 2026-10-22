import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { SoloSession, SoloQuestionClientView, AnswerFeedback } from '../types';
import { Timer } from './Timer';
import { CheckCircle2, XCircle, Clock, ArrowRight, Award, LogOut } from 'lucide-react';

interface SoloGameViewProps {
  session: SoloSession;
  initialQuestion: SoloQuestionClientView;
  playerName: string;
  onFinish: (sessionId: string) => void;
  onQuit: () => void;
}

export const SoloGameView: React.FC<SoloGameViewProps> = ({
  session,
  initialQuestion,
  playerName,
  onFinish,
  onQuit,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<SoloQuestionClientView>(initialQuestion);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loadingNext, setLoadingNext] = useState<boolean>(false);
  const [showQuitModal, setShowQuitModal] = useState<boolean>(false);

  
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    setSelectedOptionId(null);
    setFeedback(null);
    setIsSubmitting(false);
  }, [currentQuestion.id]);

  const handleSelectOption = async (optionId: string) => {
    if (isSubmitting || feedback) return;

    setSelectedOptionId(optionId);
    setIsSubmitting(true);

    const elapsedSeconds = Math.min(
      session.duration_per_question,
      Math.max(1, Math.round((Date.now() - startTimeRef.current) / 100) / 10)
    );

    try {
      const result = await api.submitSoloAnswer(session.id, {
        questionId: currentQuestion.id,
        selectedOptionId: optionId,
        isTimeout: false,
        timeTakenSeconds: elapsedSeconds,
        playerName,
      });
      setFeedback(result);
    } catch (err: any) {
      alert(`Gagal mengirim jawaban: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  const handleTimeout = async () => {
    if (isSubmitting || feedback) return;

    setIsSubmitting(true);
    try {
      const result = await api.submitSoloAnswer(session.id, {
        questionId: currentQuestion.id,
        selectedOptionId: null,
        isTimeout: true,
        timeTakenSeconds: session.duration_per_question,
        playerName,
      });
      setFeedback(result);
    } catch (err: any) {
      console.error('Timeout submit error:', err);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestion.order >= session.total_questions) {
      // Last question completed -> finish session
      onFinish(session.id);
      return;
    }

    try {
      setLoadingNext(true);
      const nextQ = await api.getSoloQuestion(session.id, currentQuestion.order + 1);
      setCurrentQuestion(nextQ);
    } catch (err: any) {
      alert(`Gagal memuat soal berikutnya: ${err.message}`);
    } finally {
      setLoadingNext(false);
    }
  };

  const isLocked = isSubmitting || feedback !== null;
  const isLastQuestion = currentQuestion.order >= session.total_questions;

  return (
    <div className="gameplay-wrapper">
      {/* Game Header */}
      <div className="game-header">
        <div className="game-progress-info">
          <span className="progress-pill">
            Soal {currentQuestion.order} dari {session.total_questions}
          </span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Peserta: <strong>{playerName}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Timer
            key={currentQuestion.id}
            durationSeconds={session.duration_per_question}
            onTimeout={handleTimeout}
            isPaused={feedback !== null || showQuitModal}
          />
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowQuitModal(true)}
            title="Keluar dari sesi latihan"
          >
            <LogOut size={14} style={{ marginRight: '4px' }} />
            Keluar
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="question-card">
        <p className="question-text">{currentQuestion.question_text}</p>

        {/* Options List */}
        <div className="options-list">
          {currentQuestion.options.map((opt) => {
            let statusClass = '';
            let icon = null;

            if (feedback) {
              if (opt.id === feedback.correctOptionId) {
                statusClass = 'correct';
                icon = <CheckCircle2 size={20} color="var(--success)" />;
              } else if (opt.id === selectedOptionId && !feedback.isCorrect) {
                statusClass = 'wrong';
                icon = <XCircle size={20} color="var(--danger)" />;
              }
            } else if (selectedOptionId === opt.id) {
              statusClass = 'selected';
            }

            return (
              <button
                key={opt.id}
                className={`option-btn ${statusClass}`}
                onClick={() => handleSelectOption(opt.id)}
                disabled={isLocked}
              >
                <div className="option-label-circle">{opt.label}</div>
                <div className="option-text-content">{opt.text}</div>
                {icon && <div style={{ marginLeft: 'auto', alignSelf: 'center' }}>{icon}</div>}
              </button>
            );
          })}
        </div>

        {/* Feedback Panel */}
        {feedback && (
          <div
            className={`feedback-box ${feedback.isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}
          >
            <div className="feedback-header">
              <div className="feedback-status">
                {feedback.isCorrect ? (
                  <>
                    <CheckCircle2 size={26} color="var(--success)" />
                    <span style={{ color: 'var(--success-dark)' }}>Jawaban Benar!</span>
                  </>
                ) : feedback.isTimeout ? (
                  <>
                    <Clock size={26} color="var(--warning)" />
                    <span style={{ color: 'var(--danger-dark)' }}>Waktu Habis!</span>
                  </>
                ) : (
                  <>
                    <XCircle size={26} color="var(--danger)" />
                    <span style={{ color: 'var(--danger-dark)' }}>Jawaban Belum Tepat</span>
                  </>
                )}
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Kunci: <strong>Opsi {feedback.correctOptionLabel}</strong>
              </div>
            </div>

            {feedback.explanation && (
              <div className="explanation-card">
                <strong>Pembahasan:</strong>
                <p style={{ marginTop: '0.35rem' }}>{feedback.explanation}</p>
              </div>
            )}

            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-primary"
                onClick={handleNextQuestion}
                disabled={loadingNext}
              >
                {isLastQuestion ? (
                  <>
                    <Award size={18} />
                    Lihat Hasil Akhir
                  </>
                ) : (
                  <>
                    <span>Lanjut ke Soal Berikutnya</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* In-App Quit Confirmation Modal */}
      {showQuitModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--danger-light)',
                  color: 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <LogOut size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Keluar dari Latihan?</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Timer latihan sedang dijeda</p>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Anda sedang mengerjakan soal <strong>{currentQuestion.order} dari {session.total_questions}</strong>.
              Apakah Anda ingin membatalkan latihan atau menyelesaikan sesi sekarang untuk melihat nilai?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setShowQuitModal(false)}
              >
                Lanjutkan Latihan
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setShowQuitModal(false);
                  onFinish(session.id);
                }}
              >
                Selesaikan & Lihat Nilai
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  color: 'var(--danger)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                }}
                onClick={() => {
                  setShowQuitModal(false);
                  onQuit();
                }}
              >
                Keluar ke Menu Utama
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
