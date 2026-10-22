import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { getSocket } from '../services/socket';
import { QuestionSet, MultiplayerRoom, LeaderboardItem } from '../types';
import confetti from 'canvas-confetti';
import {
  Users,
  Copy,
  Check,
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  Crown,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface MultiplayerViewProps {
  onHome: () => void;
}

export const MultiplayerView: React.FC<MultiplayerViewProps> = ({ onHome }) => {
  const [mode, setMode] = useState<'entry' | 'lobby' | 'playing' | 'game_over'>('entry');
  const [entryTab, setEntryTab] = useState<'join' | 'create'>('join');

  
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);

  
  const [joinCode, setJoinCode] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('Peserta');

  
  const [hostName, setHostName] = useState<string>('Host UKOM');
  const [selectedSetId, setSelectedSetId] = useState<string>('');
  const [duration, setDuration] = useState<number>(30);

  
  const [currentRoom, setCurrentRoom] = useState<MultiplayerRoom | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  
  const [currentQ, setCurrentQ] = useState<{
    questionId: string;
    questionOrder: number;
    totalQuestions: number;
    questionText: string;
    imageUrl?: string | null;
    options: { id: string; label: string; text: string }[];
    durationSeconds: number;
    deadlineTimestamp: number;
  } | null>(null);

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<{
    isCorrect: boolean;
    correctOptionId: string;
    correctOptionLabel: string;
    explanation: string | null;
  } | null>(null);

  const [roundEndedInfo, setRoundEndedInfo] = useState<{
    correctOptionId: string;
    correctOptionLabel: string;
    explanation: string | null;
    leaderboard: LeaderboardItem[];
  } | null>(null);

  const [finalLeaderboard, setFinalLeaderboard] = useState<LeaderboardItem[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(30);
  const [startingCountdown, setStartingCountdown] = useState<number | null>(null);

  const answerStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    api.getQuestionSets(undefined, 'published').then((sets) => {
      setQuestionSets(sets);
      if (sets.length > 0) setSelectedSetId(sets[0].id);
    });
  }, []);

  
  useEffect(() => {
    const socket = getSocket();

    socket.on('room_updated', (updatedRoom: MultiplayerRoom) => {
      setCurrentRoom(updatedRoom);
    });

    socket.on('game_starting', ({ countdownSeconds }: { countdownSeconds: number }) => {
      setStartingCountdown(countdownSeconds);
      setMode('lobby');

      const interval = setInterval(() => {
        setStartingCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on('new_question', (data: any) => {
      setMode('playing');
      setStartingCountdown(null);
      setCurrentQ(data);
      setSelectedOptionId(null);
      setAnswerFeedback(null);
      setRoundEndedInfo(null);
      answerStartTimeRef.current = Date.now();
    });

    socket.on('answer_feedback', (feedback: any) => {
      setAnswerFeedback(feedback);
    });

    socket.on('round_ended', (data: any) => {
      setRoundEndedInfo(data);
    });

    socket.on('game_over', ({ leaderboard }: { leaderboard: LeaderboardItem[] }) => {
      setMode('game_over');
      setFinalLeaderboard(leaderboard);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    });

    socket.on('error_message', (msg: string) => {
      setError(msg);
    });

    return () => {
      socket.off('room_updated');
      socket.off('game_starting');
      socket.off('new_question');
      socket.off('answer_feedback');
      socket.off('round_ended');
      socket.off('game_over');
      socket.off('error_message');
    };
  }, []);

  
  useEffect(() => {
    if (mode !== 'playing' || !currentQ || roundEndedInfo) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((currentQ.deadlineTimestamp - now) / 1000));
      setRemainingSeconds(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 500);
    return () => clearInterval(interval);
  }, [mode, currentQ, roundEndedInfo]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName || !selectedSetId) return;

    setError(null);
    try {
      const room = await api.createMultiplayerRoom(hostName, selectedSetId, duration);
      setCurrentRoom(room);
      setMode('lobby');

      const socket = getSocket();
      socket.emit('join_room', { roomCode: room.room_code, playerName: hostName });
    } catch (err: any) {
      setError(err.message || 'Gagal membuat room.');
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode || !playerName) return;

    setError(null);
    try {
      const { room } = await api.joinMultiplayerRoom(joinCode, playerName);
      setCurrentRoom(room);
      setMode('lobby');

      const socket = getSocket();
      socket.emit('join_room', { roomCode: room.room_code, playerName });
    } catch (err: any) {
      setError(err.message || 'Gagal bergabung ke room.');
    }
  };

  const handleCopyCode = () => {
    if (!currentRoom) return;
    navigator.clipboard.writeText(currentRoom.room_code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleToggleReady = () => {
    if (!currentRoom) return;
    const self = currentRoom.participants?.find((p) => p.player_name === playerName);
    const nextState = !self?.is_ready;

    const socket = getSocket();
    socket.emit('toggle_ready', {
      roomCode: currentRoom.room_code,
      playerName,
      isReady: nextState,
    });
  };

  const handleStartGame = () => {
    if (!currentRoom) return;
    const socket = getSocket();
    socket.emit('start_game', { roomCode: currentRoom.room_code });
  };

  const handleSelectOption = (optionId: string) => {
    if (!currentRoom || !currentQ || selectedOptionId) return;

    setSelectedOptionId(optionId);
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - answerStartTimeRef.current) / 100) / 10);

    const socket = getSocket();
    socket.emit('submit_answer', {
      roomCode: currentRoom.room_code,
      playerName: currentPlayerName(),
      questionId: currentQ.questionId,
      selectedOptionId: optionId,
      isTimeout: false,
      timeTaken: elapsedSeconds,
    });
  };

  const currentPlayerName = () => {
    return entryTab === 'create' ? hostName : playerName;
  };

  const isCurrentHost = () => {
    const name = currentPlayerName();
    return currentRoom?.participants?.some((p) => p.player_name === name && p.is_host) || false;
  };

  
  if (mode === 'entry') {
    return (
      <div style={{ maxWidth: '520px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
            }}
          >
            <Users size={28} />
          </div>
          <h2>Multiplayer UKOM Real-Time</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
            Kompetisi latihan serentak bersama teman dengan sinkronisasi timer dan live leaderboard.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            className={`btn ${entryTab === 'join' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1 }}
            onClick={() => setEntryTab('join')}
          >
            Gabung Room
          </button>
          <button
            className={`btn ${entryTab === 'create' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1 }}
            onClick={() => setEntryTab('create')}
          >
            Buat Room Baru
          </button>
        </div>

        {error && (
          <div
            className="card"
            style={{
              borderColor: 'var(--danger)',
              background: 'var(--danger-light)',
              color: 'var(--danger-dark)',
              padding: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            {error}
          </div>
        )}

        {entryTab === 'join' ? (
          <form className="card" onSubmit={handleJoinRoom}>
            <div className="form-group">
              <label className="form-label">Kode Room (6 Karakter)</label>
              <input
                type="text"
                className="form-input"
                style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, fontSize: '1.25rem' }}
                placeholder="CONTOH: UKOM26"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nama Anda</label>
              <input
                type="text"
                className="form-input"
                placeholder="Masukkan nama Anda"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
              Masuk ke Lobby
            </button>
          </form>
        ) : (
          <form className="card" onSubmit={handleCreateRoom}>
            <div className="form-group">
              <label className="form-label">Nama Host</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nama Anda sebagai host"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pilih Paket Soal</label>
              <select
                className="form-select"
                value={selectedSetId}
                onChange={(e) => setSelectedSetId(e.target.value)}
                required
              >
                {questionSets.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.question_count || 0} Soal)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Durasi per Soal</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {[15, 30, 45, 60].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`btn ${duration === s ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setDuration(s)}
                  >
                    {s} dtk
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
              Buat Room & Masuk Lobby
            </button>
          </form>
        )}
      </div>
    );
  }

  if (mode === 'lobby' && currentRoom) {
    const isHost = isCurrentHost();
    const self = currentRoom.participants?.find((p) => p.player_name === currentPlayerName());

    return (
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <div className="lobby-header-box">
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Lobby Menunggu
          </span>
          <h2 style={{ fontSize: '1.75rem' }}>{currentRoom.question_set_title}</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Durasi {currentRoom.duration_per_question} detik per soal
          </p>

          <div className="room-code-display">
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>KODE ROOM</div>
              <div className="room-code-text">{currentRoom.room_code}</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleCopyCode}>
              {isCopied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
              {isCopied ? 'Tersalin!' : 'Salin Kode'}
            </button>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Bagikan kode ini kepada teman Anda untuk bergabung bersama di room ini.
          </p>

          {startingCountdown !== null && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'var(--primary-light)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--primary)',
                fontWeight: 800,
                fontSize: '1.25rem',
              }}
            >
              <Sparkles size={22} style={{ display: 'inline', marginRight: '8px' }} />
              Permainan dimulai dalam {startingCountdown} detik...
            </div>
          )}
        </div>

        {/* Participants list */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3>Peserta Bergabung ({currentRoom.participants?.length || 0})</h3>
          {!isHost && (
            <button
              className={`btn btn-sm ${self?.is_ready ? 'btn-success' : 'btn-secondary'}`}
              onClick={handleToggleReady}
            >
              {self?.is_ready ? '✓ Anda Siap' : 'Tandai Siap'}
            </button>
          )}
        </div>

        <div className="players-grid">
          {currentRoom.participants?.map((p) => (
            <div key={p.id} className="player-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-full)',
                    background: p.is_host ? 'var(--primary)' : 'var(--surface-alt)',
                    color: p.is_host ? '#fff' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  {p.is_host ? <Crown size={18} /> : p.player_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.player_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {p.is_host ? 'Host Room' : 'Peserta'}
                  </div>
                </div>
              </div>

              <div>
                {p.is_ready ? (
                  <span className="badge badge-success">Siap</span>
                ) : (
                  <span className="badge badge-neutral">Menunggu</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lobby Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
          <button className="btn btn-secondary" onClick={() => setMode('entry')}>
            Tinggalkan Room
          </button>

          {isHost && (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleStartGame}
              disabled={startingCountdown !== null}
            >
              <Play size={20} />
              Mulai Permainan Sekarang
            </button>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'playing' && currentQ) {
    const isLocked = selectedOptionId !== null || roundEndedInfo !== null;

    return (
      <div className="gameplay-wrapper">
        <div className="game-header">
          <div className="game-progress-info">
            <span className="progress-pill">
              Soal {currentQ.questionOrder} dari {currentQ.totalQuestions}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Room: <strong>{currentRoom?.room_code}</strong>
            </span>
          </div>

          <div className="timer-container" style={{ minWidth: '95px' }}>
            <Clock size={19} />
            <span>{roundEndedInfo ? 0 : remainingSeconds}s</span>
          </div>
        </div>

        <div className="question-card">
          <p className="question-text">{currentQ.questionText}</p>

          {currentQ.imageUrl && (
            <div style={{ textAlign: 'center', margin: '1rem 0' }}>
              <img
                src={currentQ.imageUrl!}
                alt="Ilustrasi Soal"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  objectFit: 'contain',
                  background: '#fff',
                }}
              />
            </div>
          )}

          <div className="options-list">
            {currentQ.options.map((opt) => {
              let statusClass = '';
              let icon = null;

              if (roundEndedInfo) {
                if (opt.id === roundEndedInfo.correctOptionId) {
                  statusClass = 'correct';
                  icon = <CheckCircle2 size={20} color="var(--success)" />;
                } else if (opt.id === selectedOptionId && selectedOptionId !== roundEndedInfo.correctOptionId) {
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

          {/* Answer status while waiting for round end */}
          {selectedOptionId && !roundEndedInfo && (
            <div style={{ marginTop: '1.25rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Jawaban dikunci! Menunggu semua pemain selesai...
            </div>
          )}

          {/* Round ended summary */}
          {roundEndedInfo && (
            <div className="feedback-box feedback-correct" style={{ marginTop: '1.75rem' }}>
              <div className="feedback-header">
                <div className="feedback-status">
                  <CheckCircle2 size={24} color="var(--success)" />
                  <span style={{ color: 'var(--success-dark)' }}>
                    Kunci Jawaban: Opsi {roundEndedInfo.correctOptionLabel}
                  </span>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Soal berikutnya dalam hitungan detik...
                </span>
              </div>

              {roundEndedInfo.explanation && (
                <div className="explanation-card">
                  <strong>Pembahasan:</strong>
                  <p style={{ marginTop: '0.35rem' }}>{roundEndedInfo.explanation}</p>
                </div>
              )}

              {/* Mini Leaderboard */}
              <div style={{ marginTop: '1.25rem' }}>
                <strong style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Klasemen Ronde Ini:
                </strong>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {roundEndedInfo.leaderboard.slice(0, 4).map((p, idx) => (
                    <div
                      key={p.id}
                      style={{
                        padding: '0.4rem 0.75rem',
                        background: '#fff',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: '1px solid var(--border)',
                      }}
                    >
                      #{idx + 1} {p.playerName}: {p.correctCount} Benar ({p.score} pts)
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'game_over') {
    const winner = finalLeaderboard[0];

    return (
      <div className="card result-card" style={{ maxWidth: '720px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}
        >
          <Trophy size={42} />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Permainan Selesai!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Peringkat berdasarkan jumlah jawaban benar tertinggi, lalu total waktu tercepat.
        </p>

        {/* Leaderboard Table */}
        <div style={{ marginBottom: '2.5rem' }}>
          {finalLeaderboard.map((item, idx) => {
            const isWinner = idx === 0;
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: isWinner ? 'var(--primary-light)' : 'var(--surface-alt)',
                  border: isWinner ? '2px solid var(--primary)' : '1px solid var(--border)',
                  marginBottom: '0.6rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-full)',
                      background: isWinner ? 'var(--primary)' : 'var(--text-muted)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                    }}
                  >
                    #{idx + 1}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                      {item.playerName} {item.isHost && '(Host)'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Total waktu: {item.totalTimeSeconds}s
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--success-dark)' }}>
                    {item.correctCount} Benar
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.score} Poin</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => setMode('entry')}>
            Main Lagi
          </button>
          <button className="btn btn-secondary" onClick={onHome}>
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return null;
};
