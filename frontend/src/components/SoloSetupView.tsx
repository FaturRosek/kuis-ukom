import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Category, QuestionSet } from '../types';
import { BookOpen, Sparkles, Layers, Play, Settings2 } from 'lucide-react';

interface SoloSetupViewProps {
  onStartSession: (questionSetId: string, durationSeconds: number, playerName: string) => void;
  onGoToMultiplayer: () => void;
}

export const SoloSetupView: React.FC<SoloSetupViewProps> = ({
  onStartSession,
  onGoToMultiplayer,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  const [activeSet, setActiveSet] = useState<QuestionSet | null>(null);
  const [duration, setDuration] = useState<number>(30);
  const [playerName, setPlayerName] = useState<string>('Peserta UKOM');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catList, setList] = await Promise.all([
        api.getCategories(),
        api.getQuestionSets(undefined, 'published'),
      ]);
      setCategories(catList);
      setQuestionSets(setList);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data paket soal.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSets =
    selectedCategory === 'all'
      ? questionSets
      : questionSets.filter((s) => s.category_id === selectedCategory);

  const handleLaunch = () => {
    if (!activeSet) return;
    onStartSession(activeSet.id, duration, playerName);
  };

  return (
    <div>
      {}
      <section className="hero-section">
        <div className="hero-tag">
          <Sparkles size={16} />
          Uji Kompetensi Nasional 2026
        </div>
        <h1 className="hero-title">Latihan Soal UKOM Mandiri & Bersama</h1>
        <p className="hero-desc">
          Tingkatkan kesiapan ujian dengan simulasi berbasis timer, pembahasan mendalam, feedback instan,
          dan mode kompetisi multiplayer real-time.
        </p>
        <div className="hero-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              if (questionSets.length > 0) setActiveSet(questionSets[0]);
            }}
          >
            <Play size={20} />
            Mulai Latihan Sekarang
          </button>
          <button className="btn btn-secondary btn-lg" onClick={onGoToMultiplayer}>
            <Settings2 size={20} />
            Mode Multiplayer
          </button>
        </div>
      </section>

      {}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Pilih Paket Soal Latihan</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Pilih bidang keperawatan atau spesialisasi yang ingin Anda latih hari ini.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedCategory('all')}
          >
            Semua ({questionSets.length})
          </button>
          {categories.map((cat) => {
            const count = questionSets.filter((s) => s.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Memuat bank soal...</p>
        </div>
      )}

      {error && (
        <div className="card" style={{ borderColor: 'var(--danger)', background: 'var(--danger-light)', padding: '1.5rem', color: 'var(--danger-dark)' }}>
          {error}
        </div>
      )}

      {!loading && filteredSets.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Layers size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>Belum ada paket soal yang dipublikasikan</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Silakan buat soal baru di menu Bank Soal atau gunakan fitur Impor Word/PDF.
          </p>
        </div>
      )}

      {/* Question Set Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
          alignItems: 'stretch',
        }}
      >
        {filteredSets.map((set) => {
          const hasQuestions = (set.question_count || 0) > 0;
          return (
            <div
              key={set.id}
              className="card card-interactive"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
                minHeight: '260px',
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              <div>
                {/* Category & Question Count Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    marginBottom: '0.85rem',
                  }}
                >
                  <span
                    className="badge badge-primary"
                    style={{
                      maxWidth: '70%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      fontSize: '0.76rem',
                    }}
                    title={set.category_name}
                  >
                    {set.category_name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: hasQuestions ? 'var(--primary)' : 'var(--text-muted)',
                      background: hasQuestions ? 'var(--primary-light)' : 'var(--surface-alt)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {set.question_count || 0} Soal
                  </span>
                </div>

                {/* Title (2 lines clamp with uniform height) */}
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    lineHeight: 1.4,
                    marginBottom: '0.5rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                    minHeight: '3.2rem',
                  }}
                  title={set.title}
                >
                  {set.title}
                </h3>

                {/* Description (2 lines clamp with uniform height) */}
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                    minHeight: '2.6rem',
                  }}
                  title={set.description || ''}
                >
                  {set.description ||
                    'Latihan komprehensif uji kompetensi dengan kunci dan pembahasan terverifikasi.'}
                </p>
              </div>

              {/* Action Button pinned at bottom */}
              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                <button
                  className={`btn ${hasQuestions ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    opacity: hasQuestions ? 1 : 0.65,
                    cursor: hasQuestions ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => setActiveSet(set)}
                  disabled={!hasQuestions}
                >
                  <Play size={17} />
                  {hasQuestions ? 'Mulai Latihan' : 'Belum Ada Soal'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Launch Configuration Modal */}
      {activeSet && (
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
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Konfigurasi Latihan</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {activeSet.title} ({activeSet.question_count} Soal)
            </p>

            <div className="form-group">
              <label className="form-label">Nama Anda</label>
              <input
                type="text"
                className="form-input"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Masukkan nama Anda"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Waktu Pengerjaan per Soal</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {[15, 30, 45, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    className={`btn ${duration === sec ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setDuration(sec)}
                  >
                    {sec} dtk
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setActiveSet(null)}
              >
                Batal
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 2 }}
                onClick={handleLaunch}
              >
                Mulai Sesi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
