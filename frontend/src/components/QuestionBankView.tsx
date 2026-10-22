import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Category, QuestionSet, Question } from '../types';
import {
  Plus,
  Database,
  Trash2,
  Edit3,
  CheckCircle2,
  Bot,
  Sparkles,
  Loader2,
  Key,
} from 'lucide-react';

export const QuestionBankView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<QuestionSet | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  
  const [isNewSetModalOpen, setIsNewSetModalOpen] = useState<boolean>(false);
  const [newSetData, setNewSetData] = useState({
    title: '',
    category_id: '',
    description: '',
    status: 'published',
  });

  
  const [setToDelete, setSetToDelete] = useState<QuestionSet | null>(null);
  const [isDeletingSet, setIsDeletingSet] = useState<boolean>(false);

  
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState<boolean>(false);

  
  const [isNewQuestionModalOpen, setIsNewQuestionModalOpen] = useState<boolean>(false);
  const [newQuestionData, setNewQuestionData] = useState({
    question_text: '',
    explanation: '',
    difficulty: 'medium',
    status: 'published',
    options: [
      { option_label: 'A', option_text: '', is_correct: true },
      { option_label: 'B', option_text: '', is_correct: false },
      { option_label: 'C', option_text: '', is_correct: false },
      { option_label: 'D', option_text: '', is_correct: false },
      { option_label: 'E', option_text: '', is_correct: false },
    ],
  });

  
  const [isEditSetModalOpen, setIsEditSetModalOpen] = useState<boolean>(false);
  const [editSetData, setEditSetData] = useState<{
    id: string;
    title: string;
    category_id: string;
    description: string;
    status: string;
  } | null>(null);
  const [isSavingSet, setIsSavingSet] = useState<boolean>(false);

  
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editQuestionData, setEditQuestionData] = useState<{
    question_text: string;
    explanation: string;
    difficulty: string;
    image_url?: string | null;
    options: { id?: string; option_label: string; option_text: string; is_correct: boolean }[];
  } | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

  
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isAiSolving, setIsAiSolving] = useState<boolean>(false);
  const [aiApiKey, setAiApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'sets' | 'questions'>('sets');

  useEffect(() => {
    loadSetsAndCategories();
  }, []);

  const loadSetsAndCategories = async () => {
    try {
      setLoading(true);
      const [cats, sets] = await Promise.all([
        api.getCategories(),
        api.getQuestionSets(),
      ]);
      setCategories(cats);
      setQuestionSets(sets);
      if (cats.length > 0 && !newSetData.category_id) {
        setNewSetData((prev) => ({ ...prev, category_id: cats[0].id }));
      }
      if (sets.length > 0) {
        setSelectedSet((prev) => {
          if (!prev) {
            selectQuestionSet(sets[0]);
            return sets[0];
          }
          const found = sets.find((s) => s.id === prev.id);
          return found || sets[0];
        });
      } else {
        setSelectedSet(null);
        setQuestions([]);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectQuestionSet = async (set: QuestionSet) => {
    setSelectedSet(set);
    setMobileTab('questions');
    try {
      const qList = await api.getQuestions({ questionSetId: set.id });
      setQuestions(qList);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCreateSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSetData.title || !newSetData.category_id) return;

    try {
      const created = await api.createQuestionSet(newSetData);
      setIsNewSetModalOpen(false);
      setNewSetData({ title: '', category_id: categories[0]?.id || '', description: '', status: 'published' });
      await loadSetsAndCategories();
      selectQuestionSet(created);
    } catch (err: any) {
      alert(`Gagal membuat paket: ${err.message}`);
    }
  };

  const handleOpenEditSet = (s: QuestionSet) => {
    setEditSetData({
      id: s.id,
      title: s.title,
      category_id: s.category_id,
      description: s.description || '',
      status: s.status || 'published',
    });
    setIsEditSetModalOpen(true);
  };

  const handleSaveEditSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSetData || !editSetData.title.trim()) return;

    try {
      setIsSavingSet(true);
      const updated = await api.updateQuestionSet(editSetData.id, {
        title: editSetData.title.trim(),
        category_id: editSetData.category_id,
        description: editSetData.description.trim() || undefined,
        status: editSetData.status,
      });

      setQuestionSets((prev) =>
        prev.map((s) => (s.id === editSetData.id ? { ...s, ...updated } : s))
      );
      if (selectedSet?.id === editSetData.id) {
        setSelectedSet((prev) => (prev ? { ...prev, ...updated } : null));
      }
      setIsEditSetModalOpen(false);
      setAiSuccessMsg('Judul paket soal berhasil diperbarui!');
      setTimeout(() => setAiSuccessMsg(null), 3000);
      await loadSetsAndCategories();
    } catch (err: any) {
      alert(`Gagal memperbarui paket soal: ${err.message}`);
    } finally {
      setIsSavingSet(false);
    }
  };

  const confirmDeleteQuestionSet = async () => {
    if (!setToDelete) return;
    try {
      setIsDeletingSet(true);
      await api.deleteQuestionSet(setToDelete.id);
      const remainingSets = questionSets.filter((s) => s.id !== setToDelete.id);
      setQuestionSets(remainingSets);

      if (selectedSet?.id === setToDelete.id) {
        if (remainingSets.length > 0) {
          selectQuestionSet(remainingSets[0]);
        } else {
          setSelectedSet(null);
          setQuestions([]);
        }
      }
      setSetToDelete(null);
    } catch (err: any) {
      alert(`Gagal menghapus paket soal: ${err.message}`);
    } finally {
      setIsDeletingSet(false);
    }
  };

  const confirmDeleteQuestion = async () => {
    if (!questionToDelete) return;
    try {
      setIsDeletingQuestion(true);
      await api.deleteQuestion(questionToDelete.id);
      if (selectedSet) {
        await selectQuestionSet(selectedSet);
        await loadSetsAndCategories();
      }
      setQuestionToDelete(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsDeletingQuestion(false);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSet || !newQuestionData.question_text.trim()) return;

    try {
      await api.createQuestion({
        category_id: selectedSet.category_id,
        question_set_id: selectedSet.id,
        question_text: newQuestionData.question_text.trim(),
        explanation: newQuestionData.explanation.trim() || undefined,
        difficulty: newQuestionData.difficulty,
        status: newQuestionData.status,
        options: newQuestionData.options,
      });

      setIsNewQuestionModalOpen(false);
      setNewQuestionData({
        question_text: '',
        explanation: '',
        difficulty: 'medium',
        status: 'published',
        options: [
          { option_label: 'A', option_text: '', is_correct: true },
          { option_label: 'B', option_text: '', is_correct: false },
          { option_label: 'C', option_text: '', is_correct: false },
          { option_label: 'D', option_text: '', is_correct: false },
          { option_label: 'E', option_text: '', is_correct: false },
        ],
      });

      selectQuestionSet(selectedSet);
      loadSetsAndCategories();
    } catch (err: any) {
      alert(`Gagal menambah soal: ${err.message}`);
    }
  };

  const handleOpenEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setEditQuestionData({
      question_text: q.question_text,
      explanation: q.explanation || '',
      difficulty: q.difficulty || 'medium',
      image_url: q.image_url || '',
      options: (q.options || []).map((opt) => ({
        id: opt.id,
        option_label: opt.option_label,
        option_text: opt.option_text,
        is_correct: Boolean(opt.is_correct),
      })),
    });
  };

  const handleSaveEditQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !editQuestionData || !selectedSet) return;
    if (!editQuestionData.question_text.trim()) return;

    try {
      setIsSavingEdit(true);
      const updated = await api.updateQuestion(editingQuestion.id, {
        category_id: selectedSet.category_id,
        question_set_id: selectedSet.id,
        question_text: editQuestionData.question_text.trim(),
        explanation: editQuestionData.explanation.trim() || undefined,
        difficulty: editQuestionData.difficulty,
        image_url: editQuestionData.image_url?.trim() || null,
        options: editQuestionData.options,
      });

      setQuestions((prev) =>
        prev.map((q) => (q.id === editingQuestion.id ? updated : q))
      );
      setEditingQuestion(null);
      setEditQuestionData(null);
      setAiSuccessMsg('Butir soal berhasil diperbarui!');
      setTimeout(() => setAiSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(`Gagal menyimpan perubahan: ${err.message}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleSolveSetWithAI = async () => {
    if (!selectedSet) return;
    try {
      setIsAiSolving(true);
      if (aiApiKey) {
        localStorage.setItem('gemini_api_key', aiApiKey.trim());
      }
      const res = await api.solveQuestionSetWithAI(selectedSet.id, aiApiKey.trim() || undefined);
      setAiSuccessMsg(`Berhasil! AI menganalisis & mengisi kunci jawaban serta pembahasan untuk ${res.totalSolved} butir soal.`);
      setIsAiModalOpen(false);
      await selectQuestionSet(selectedSet);
      await loadSetsAndCategories();
      setTimeout(() => setAiSuccessMsg(null), 5000);
    } catch (err: any) {
      alert(`Gagal menganalisis dengan AI: ${err.message}`);
    } finally {
      setIsAiSolving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Bank Soal UKOM</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Kelola kategori, paket soal latihan, dan butir soal pilihan ganda.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setIsNewSetModalOpen(true)}>
            <Plus size={16} />
            Paket Soal Baru
          </button>
          {selectedSet && (
            <button className="btn btn-primary" onClick={() => setIsNewQuestionModalOpen(true)}>
              <Plus size={16} />
              Tambah Soal ke Paket Ini
            </button>
          )}
        </div>
      </div>

      {aiSuccessMsg && (
        <div
          className="card"
          style={{
            borderColor: 'var(--success)',
            background: 'var(--success-light)',
            color: 'var(--success-dark)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{aiSuccessMsg}</span>
        </div>
      )}

      <div className="bank-mobile-switcher">
        <button
          type="button"
          className={`bank-mobile-switch-btn ${mobileTab === 'sets' ? 'active' : ''}`}
          onClick={() => setMobileTab('sets')}
        >
          Daftar Paket ({questionSets.length})
        </button>
        <button
          type="button"
          className={`bank-mobile-switch-btn ${mobileTab === 'questions' ? 'active' : ''}`}
          onClick={() => setMobileTab('questions')}
        >
          Butir Soal ({questions.length})
        </button>
      </div>

      <div className="bank-grid-container">
        <div className={`card bank-sidebar-card ${mobileTab === 'questions' ? 'mobile-hidden' : ''}`} style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Daftar Paket Soal ({questionSets.length})
            </h4>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Memuat...</p>
          ) : questionSets.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
              Belum ada paket soal. Buat baru atau impor dari dokumen.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {questionSets.map((s) => {
                const isSelected = selectedSet?.id === s.id;
                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                      background: isSelected ? 'var(--primary-light)' : 'var(--surface-alt)',
                      transition: 'all 0.2s',
                      overflow: 'hidden',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <button
                      onClick={() => selectQuestionSet(s)}
                      style={{
                        flex: '1 1 0%',
                        minWidth: 0,
                        textAlign: 'left',
                        padding: '0.85rem 0.65rem 0.85rem 0.9rem',
                        background: 'transparent',
                        border: 'none',
                        color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          marginBottom: '0.25rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          wordBreak: 'break-word',
                          overflowWrap: 'anywhere',
                        }}
                        title={s.title}
                      >
                        {s.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                        }}
                      >
                        <span
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '140px',
                          }}
                          title={s.category_name}
                        >
                          {s.category_name}
                        </span>
                        <span style={{ flexShrink: 0, fontWeight: 600 }}>{s.question_count || 0} Soal</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSetToDelete(s);
                      }}
                      title={`Hapus paket "${s.title}"`}
                      style={{
                        flexShrink: 0,
                        width: '36px',
                        height: '36px',
                        marginRight: '0.4rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--danger)';
                        e.currentTarget.style.background = 'var(--danger-light)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={`bank-questions-column ${mobileTab === 'sets' ? 'mobile-hidden' : ''}`}>
          {selectedSet ? (
            <div>
              <div className="mobile-back-to-sets" style={{ marginBottom: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setMobileTab('sets')}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  &larr; Ganti Paket Soal
                </button>
              </div>

              <div
                className="card"
                style={{
                  padding: '1.25rem 1.75rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: '1 1 0%', minWidth: 0 }}>
                  <span className="badge badge-primary">{selectedSet.category_name}</span>
                  <h3
                    style={{
                      fontSize: '1.35rem',
                      marginTop: '0.35rem',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {selectedSet.title}
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      marginTop: '0.25rem',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {selectedSet.description || 'Tidak ada deskripsi paket.'}
                  </p>
                </div>

                <div className="bank-set-actions">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {questions.length} Butir Soal
                    </div>
                    <span className="badge badge-success">{selectedSet.status}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenEditSet(selectedSet)}
                      title="Edit judul atau informasi paket soal ini"
                      style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Edit3 size={15} />
                      Edit Judul Paket
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsAiModalOpen(true)}
                      title="Analisis kunci jawaban dan pembahasan dengan AI"
                      style={{
                        borderColor: '#818cf8',
                        color: '#4f46e5',
                        background: '#eef2ff',
                        fontWeight: 600,
                      }}
                    >
                      <Bot size={15} />
                      Bantu Kunci dengan AI
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSetToDelete(selectedSet)}
                      title="Hapus paket soal ini beserta seluruh soalnya"
                      style={{
                        borderColor: 'rgba(239, 68, 68, 0.4)',
                        color: 'var(--danger)',
                        background: 'var(--danger-light)',
                        fontWeight: 600,
                      }}
                    >
                      <Trash2 size={15} />
                      Hapus Paket
                    </button>
                  </div>
                </div>
              </div>

              {questions.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <Database size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
                  <h4>Belum ada soal pada paket ini</h4>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', marginBottom: '1.25rem' }}>
                    Tambah soal secara manual atau gunakan fitur Impor Dokumen untuk mengekstrak banyak soal sekaligus.
                  </p>
                  <button className="btn btn-primary" onClick={() => setIsNewQuestionModalOpen(true)}>
                    <Plus size={16} />
                    Tambah Soal Sekarang
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {questions.map((q, qIdx) => (
                    <div key={q.id} className="card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span className="badge badge-neutral">Soal #{qIdx + 1}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="badge badge-primary">{q.difficulty || 'medium'}</span>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem' }}
                            onClick={() => handleOpenEditQuestion(q)}
                            title="Edit butir soal ini"
                          >
                            <Edit3 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{
                              color: 'var(--danger)',
                              borderColor: 'rgba(239, 68, 68, 0.25)',
                              background: 'var(--danger-light)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.35rem 0.65rem',
                            }}
                            onClick={() => setQuestionToDelete(q)}
                            title="Hapus butir soal ini"
                          >
                            <Trash2 size={14} />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>

                      <p style={{ fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                        {q.question_text}
                      </p>

                      {q.image_url && (
                        <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
                          <img
                            src={q.image_url!}
                            alt="Ilustrasi Soal"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '340px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border)',
                              boxShadow: 'var(--shadow-sm)',
                              objectFit: 'contain',
                              background: '#fff',
                            }}
                          />
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                        {q.options?.map((opt) => (
                          <div
                            key={opt.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.6rem',
                              padding: '0.45rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              background: opt.is_correct ? 'var(--success-light)' : 'var(--surface-alt)',
                              border: opt.is_correct ? '1px solid var(--success)' : '1px solid transparent',
                              fontSize: '0.92rem',
                            }}
                          >
                            <strong>{opt.option_label}.</strong>
                            <span>{opt.option_text}</span>
                            {opt.is_correct && (
                              <span style={{ marginLeft: 'auto', fontWeight: 800, color: 'var(--success-dark)', fontSize: '0.8rem' }}>
                                ✓ KUNCI JAWABAN
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <div style={{ background: 'var(--surface-alt)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          <strong>Pembahasan:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              Pilih paket soal untuk melihat butir soal.
            </div>
          )}
        </div>
      </div>

      {setToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1rem',
          }}
        >
          <div className="card modal-card" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }}>
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
                }}
              >
                <Trash2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Hapus Paket Soal?</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Tindakan ini tidak dapat dibatalkan
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Apakah Anda yakin ingin menghapus paket soal <strong>&quot;{setToDelete.title}&quot;</strong>? Semua{' '}
              <strong>({setToDelete.question_count || 0})</strong> butir soal dan data sesi latihan di dalamnya akan dihapus secara permanen.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={isDeletingSet}
                onClick={() => setSetToDelete(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={isDeletingSet}
                style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }}
                onClick={confirmDeleteQuestionSet}
              >
                {isDeletingSet ? (
                  <>
                    <Loader2 size={16} className="spin-animation" />
                    Menghapus...
                  </>
                ) : (
                  'Ya, Hapus Paket'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {questionToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1rem',
          }}
        >
          <div className="card modal-card" style={{ maxWidth: '460px', width: '100%', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Hapus Butir Soal?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Yakin ingin menghapus butir soal ini? Tindakan ini akan menghapus opsi dan kunci jawaban yang terkait.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={isDeletingQuestion}
                onClick={() => setQuestionToDelete(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={isDeletingQuestion}
                style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }}
                onClick={confirmDeleteQuestion}
              >
                {isDeletingQuestion ? 'Menghapus...' : 'Ya, Hapus Soal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAiModalOpen && selectedSet && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div className="card modal-card" style={{ maxWidth: '560px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: '#eef2ff',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>AI Solver Agent UKOM</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Paket: <strong>{selectedSet.title}</strong> ({questions.length} soal)
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              AI Agent akan membaca setiap vignette klinis di paket ini, menentukan kunci jawaban yang paling tepat
              sesuai standar UKOM Tenaga Kesehatan (TLM, Perawat, dll.), dan menyusun pembahasan ilmiah otomatis.
            </p>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Key size={15} />
                Google Gemini API Key (Opsional)
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="AIzaSy... (kosongkan untuk menggunakan Engine Klinis Bawaan)"
                value={aiApiKey}
                onChange={(e) => setAiApiKey(e.target.value)}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.35rem' }}>
                {aiApiKey
                  ? '✓ Menggunakan Google Gemini Flash (tersimpan aman di browser Anda)'
                  : 'ℹ️ Tanpa API key, sistem menggunakan Medical Clinical Heuristic Engine bawaan.'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={isAiSolving}
                onClick={() => setIsAiModalOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={isAiSolving || questions.length === 0}
                onClick={handleSolveSetWithAI}
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none' }}
              >
                {isAiSolving ? (
                  <>
                    <Loader2 size={16} className="spin-animation" />
                    Menganalisis {questions.length} Soal...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Mulai Analisis AI Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isNewSetModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <form className="card modal-card" style={{ maxWidth: '500px', width: '100%', padding: '2rem' }} onSubmit={handleCreateSet}>
            <h3 style={{ marginBottom: '1rem' }}>Buat Paket Soal Baru</h3>
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select
                className="form-select"
                value={newSetData.category_id}
                onChange={(e) => setNewSetData({ ...newSetData, category_id: e.target.value })}
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Judul Paket Soal</label>
              <input
                type="text"
                className="form-input"
                value={newSetData.title}
                onChange={(e) => setNewSetData({ ...newSetData, title: e.target.value })}
                placeholder="Contoh: Paket Simulasi UKOM Farmasi 2026"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Deskripsi</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={newSetData.description}
                onChange={(e) => setNewSetData({ ...newSetData, description: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsNewSetModalOpen(false)}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                Simpan Paket
              </button>
            </div>
          </form>
        </div>
      )}

      {isEditSetModalOpen && editSetData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <form
            className="card modal-card"
            style={{ maxWidth: '520px', width: '100%', padding: '2rem' }}
            onSubmit={handleSaveEditSet}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Edit3 size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Edit Judul & Info Paket Soal</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Judul Paket Soal</label>
              <input
                type="text"
                className="form-input"
                value={editSetData.title}
                onChange={(e) => setEditSetData({ ...editSetData, title: e.target.value })}
                placeholder="Masukkan judul baru paket soal..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select
                className="form-select"
                value={editSetData.category_id}
                onChange={(e) => setEditSetData({ ...editSetData, category_id: e.target.value })}
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Deskripsi (Opsional)</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={editSetData.description}
                onChange={(e) => setEditSetData({ ...editSetData, description: e.target.value })}
                placeholder="Deskripsi singkat mengenai paket soal ini..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={editSetData.status}
                onChange={(e) => setEditSetData({ ...editSetData, status: e.target.value })}
              >
                <option value="published">Published (Tersedia untuk Latihan/Kuis)</option>
                <option value="draft">Draft (Disembunyikan)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={isSavingSet}
                onClick={() => {
                  setIsEditSetModalOpen(false);
                  setEditSetData(null);
                }}
              >
                Batal
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSavingSet}>
                {isSavingSet ? (
                  <>
                    <Loader2 size={16} className="spin-animation" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {isNewQuestionModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem', overflowY: 'auto' }}>
          <form className="card modal-card" style={{ maxWidth: '640px', width: '100%', padding: '2rem' }} onSubmit={handleCreateQuestion}>
            <h3 style={{ marginBottom: '0.5rem' }}>Tambah Soal Pilihan Ganda</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Paket: <strong>{selectedSet?.title}</strong>
            </p>

            <div className="form-group">
              <label className="form-label">Teks Pertanyaan</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={newQuestionData.question_text}
                onChange={(e) => setNewQuestionData({ ...newQuestionData, question_text: e.target.value })}
                placeholder="Tuliskan kasus atau pertanyaan klinis..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pilihan Opsi & Kunci Jawaban</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {newQuestionData.options.map((opt, idx) => (
                  <div key={opt.option_label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="radio"
                      name="correct-option"
                      checked={opt.is_correct}
                      onChange={() => {
                        const updated = newQuestionData.options.map((o, i) => ({
                          ...o,
                          is_correct: i === idx,
                        }));
                        setNewQuestionData({ ...newQuestionData, options: updated });
                      }}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <strong style={{ minWidth: '20px' }}>{opt.option_label}.</strong>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={`Pilihan ${opt.option_label}`}
                      value={opt.option_text}
                      onChange={(e) => {
                        const updated = [...newQuestionData.options];
                        updated[idx].option_text = e.target.value;
                        setNewQuestionData({ ...newQuestionData, options: updated });
                      }}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pembahasan Klinis (Opsional)</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={newQuestionData.explanation}
                onChange={(e) => setNewQuestionData({ ...newQuestionData, explanation: e.target.value })}
                placeholder="Rasional ilmiah / alasan opsi tersebut benar..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsNewQuestionModalOpen(false)}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                Simpan Soal
              </button>
            </div>
          </form>
        </div>
      )}

      {editingQuestion && editQuestionData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
            overflowY: 'auto',
          }}
        >
          <form
            className="card modal-card"
            style={{ maxWidth: '680px', width: '100%', padding: '2rem' }}
            onSubmit={handleSaveEditQuestion}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem' }}>Edit Butir Soal</h3>
              </div>
              <span className="badge badge-primary">Paket: {selectedSet?.title}</span>
            </div>

            <div className="form-group">
              <label className="form-label">Teks Pertanyaan / Kasus Klinis</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={editQuestionData.question_text}
                onChange={(e) =>
                  setEditQuestionData({ ...editQuestionData, question_text: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tingkat Kesulitan</label>
              <select
                className="form-select"
                value={editQuestionData.difficulty}
                onChange={(e) =>
                  setEditQuestionData({ ...editQuestionData, difficulty: e.target.value })
                }
              >
                <option value="easy">Mudah</option>
                <option value="medium">Sedang</option>
                <option value="hard">Sulit</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">URL Gambar / Diagram (Opsional)</label>
              <input
                type="text"
                className="form-input"
                value={editQuestionData.image_url || ''}
                onChange={(e) =>
                  setEditQuestionData({ ...editQuestionData, image_url: e.target.value })
                }
                placeholder="Contoh: /images/questions/kimia_soal_3.jpeg"
              />
              {editQuestionData.image_url && (
                <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                  <img
                    src={editQuestionData.image_url}
                    alt="Preview"
                    style={{ maxHeight: '160px', maxWidth: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#fff' }}
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Pilihan Opsi (Pilih radio button untuk menentukan kunci jawaban yang benar):
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {editQuestionData.options.map((opt: any, idx: number) => (
                  <div
                    key={opt.option_label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.35rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: opt.is_correct ? 'var(--success-light)' : 'transparent',
                      border: opt.is_correct ? '1px solid var(--success)' : '1px solid transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name="edit-correct-option"
                      checked={opt.is_correct}
                      onChange={() => {
                        const updated = editQuestionData.options.map((o: any, i: number) => ({
                          ...o,
                          is_correct: i === idx,
                        }));
                        setEditQuestionData({ ...editQuestionData, options: updated });
                      }}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <strong style={{ minWidth: '22px' }}>{opt.option_label}.</strong>
                    <input
                      type="text"
                      className="form-input"
                      value={opt.option_text}
                      onChange={(e) => {
                        const updated = [...editQuestionData.options];
                        updated[idx].option_text = e.target.value;
                        setEditQuestionData({ ...editQuestionData, options: updated });
                      }}
                      required
                    />
                    {opt.is_correct && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: 'var(--success-dark)',
                          whiteSpace: 'nowrap',
                          padding: '0.2rem 0.4rem',
                        }}
                      >
                        [KUNCI]
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pembahasan Klinis / Rasional Ilmiah</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={editQuestionData.explanation}
                onChange={(e) =>
                  setEditQuestionData({ ...editQuestionData, explanation: e.target.value })
                }
                placeholder="Rasional ilmiah / alasan mengapa opsi tersebut benar..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={isSavingEdit}
                onClick={() => {
                  setEditingQuestion(null);
                  setEditQuestionData(null);
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSavingEdit}
              >
                {isSavingEdit ? (
                  <>
                    <Loader2 size={16} className="spin-animation" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
