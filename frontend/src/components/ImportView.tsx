import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Category, QuestionSet, ParsedQuestionDraft } from '../types';
import {
  UploadCloud,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Save,
  Key,
  Sparkles,
  Info,
  Bot,
  Loader2,
  Trash2,
} from 'lucide-react';

interface ImportViewProps {
  onSuccess: () => void;
}

export const ImportView: React.FC<ImportViewProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  
  const [parsedData, setParsedData] = useState<{
    fileName: string;
    totalQuestions: number;
    validCount: number;
    warningCount: number;
    questions: ParsedQuestionDraft[];
  } | null>(null);

  
  const [bulkModalOpen, setBulkModalOpen] = useState<boolean>(false);
  const [bulkKeysText, setBulkKeysText] = useState<string>('');

  
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiSolving, setAiSolving] = useState<boolean>(false);
  const [aiApiKey, setAiApiKey] = useState<string>(
    () => localStorage.getItem('gemini_api_key') || ''
  );

  
  const [categories, setCategories] = useState<Category[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSetId, setSelectedSetId] = useState<string>('new');
  const [newSetTitle, setNewSetTitle] = useState<string>('');

  useEffect(() => {
    loadCategoriesAndSets();
  }, []);

  const loadCategoriesAndSets = async () => {
    try {
      const [cats, sets] = await Promise.all([
        api.getCategories(),
        api.getQuestionSets(),
      ]);
      setCategories(cats);
      setQuestionSets(sets);
      if (cats.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(cats[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccessMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Silakan pilih file terlebih dahulu.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await api.uploadDocument(file);
      setParsedData(result);
      if (!newSetTitle) {
        setNewSetTitle(file.name.replace(/\.(docx|pdf)$/i, ''));
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengekstrak dokumen.');
    } finally {
      setUploading(false);
    }
  };

  
  const handleUpdateQuestionText = (index: number, text: string) => {
    if (!parsedData) return;
    const updated = [...parsedData.questions];
    updated[index].questionText = text;
    setParsedData({ ...parsedData, questions: updated });
  };

  const handleUpdateOptionText = (qIndex: number, optIndex: number, text: string) => {
    if (!parsedData) return;
    const updated = [...parsedData.questions];
    updated[qIndex].options[optIndex].text = text;
    setParsedData({ ...parsedData, questions: updated });
  };

  const handleSetCorrectKey = (qIndex: number, optIndex: number) => {
    if (!parsedData) return;
    const updated = [...parsedData.questions];
    updated[qIndex].options.forEach((opt, idx) => {
      opt.isCorrect = idx === optIndex;
    });
    updated[qIndex].hasValidKey = true;
    updated[qIndex].warnings = updated[qIndex].warnings.filter(
      (w) => !w.includes('Kunci')
    );
    setParsedData({ ...parsedData, questions: updated });
  };

  const handleUpdateExplanation = (index: number, expl: string) => {
    if (!parsedData) return;
    const updated = [...parsedData.questions];
    updated[index].explanation = expl;
    setParsedData({ ...parsedData, questions: updated });
  };

  
  const handleDeleteQuestionDraft = (index: number) => {
    if (!parsedData) return;
    const updated = parsedData.questions.filter((_, idx) => idx !== index);
    const renumbered = updated.map((q, idx) => ({
      ...q,
      questionNumber: idx + 1,
    }));
    setParsedData({
      ...parsedData,
      questions: renumbered,
      totalQuestions: renumbered.length,
      validCount: renumbered.filter((q) => q.hasValidKey).length,
      warningCount: renumbered.filter((q) => !q.hasValidKey).length,
    });
  };

  
  const handleSolveWithAI = async () => {
    if (!parsedData || parsedData.questions.length === 0) return;
    try {
      setAiSolving(true);
      if (aiApiKey.trim()) {
        localStorage.setItem('gemini_api_key', aiApiKey.trim());
      }

      const questionsToSolve = parsedData.questions.map((q) => ({
        index: q.questionNumber,
        question_text: q.questionText,
        options: q.options.map((opt) => ({
          option_label: opt.label,
          option_text: opt.text,
        })),
      }));

      const results = await api.solveQuestionsWithAI(
        questionsToSolve,
        aiApiKey.trim() || undefined
      );

      const resultMap = new Map<number, { correct_label: string; explanation: string }>();
      results.forEach((r) => {
        resultMap.set(r.index, {
          correct_label: r.correct_label,
          explanation: r.explanation,
        });
      });

      let solvedCount = 0;
      const updated = parsedData.questions.map((q) => {
        const solved = resultMap.get(q.questionNumber);
        if (!solved) return q;

        solvedCount++;
        const updatedOpts = q.options.map((opt) => ({
          ...opt,
          isCorrect: opt.label.toUpperCase() === solved.correct_label.toUpperCase(),
        }));

        return {
          ...q,
          options: updatedOpts,
          explanation: solved.explanation,
          hasValidKey: true,
          warnings: q.warnings.filter((w) => !w.includes('Kunci')),
        };
      });

      setParsedData({
        ...parsedData,
        questions: updated,
        validCount: updated.filter((q) => q.hasValidKey).length,
        warningCount: updated.filter((q) => !q.hasValidKey).length,
      });

      setAiModalOpen(false);
      setSuccessMessage(
        `🎉 AI Agent berhasil menentukan kunci jawaban dan menyusun pembahasan klinis untuk ${solvedCount} butir soal!`
      );
      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err: any) {
      alert(`Gagal menganalisis dengan AI: ${err.message}`);
    } finally {
      setAiSolving(false);
    }
  };

  // Bulk Apply Answer Keys (e.g. "1.C 2.B 3.C..." or "C B C B...")
  const handleApplyBulkKeys = () => {
    if (!parsedData || !bulkKeysText.trim()) return;

    const keyMap = new Map<number, string>();
    const numberedRegex = /(?:soal\s*)?(\d+)[\.\:\-\s]+([A-Ea-e])\b/gi;
    let match: RegExpExecArray | null;
    let foundNumbered = false;

    while ((match = numberedRegex.exec(bulkKeysText)) !== null) {
      foundNumbered = true;
      const num = parseInt(match[1], 10);
      const key = match[2].toUpperCase();
      keyMap.set(num, key);
    }

    if (!foundNumbered) {
      const letters = bulkKeysText.match(/\b([A-Ea-e])\b/g);
      if (letters) {
        letters.forEach((l, idx) => {
          keyMap.set(idx + 1, l.toUpperCase());
        });
      }
    }

    let appliedCount = 0;
    const updated = parsedData.questions.map((q) => {
      const targetKey = keyMap.get(q.questionNumber);
      if (!targetKey) return q;

      let matched = false;
      const updatedOpts = q.options.map((opt) => {
        const isMatch = opt.label.toUpperCase() === targetKey;
        if (isMatch) matched = true;
        return { ...opt, isCorrect: isMatch };
      });

      if (matched) {
        appliedCount++;
        return {
          ...q,
          options: updatedOpts,
          hasValidKey: true,
          warnings: q.warnings.filter((w) => !w.includes('Kunci')),
        };
      }
      return q;
    });

    setParsedData({
      ...parsedData,
      questions: updated,
      validCount: updated.filter((q) => q.hasValidKey).length,
      warningCount: updated.filter((q) => !q.hasValidKey).length,
    });
    setBulkModalOpen(false);
    setBulkKeysText('');
    alert(`Berhasil menetapkan ${appliedCount} kunci jawaban secara otomatis!`);
  };

  // Set Default Temporary Key (e.g. Option A) for tryout without keys
  const handleSetDefaultKey = (label: string = 'A') => {
    if (!parsedData) return;
    if (
      !window.confirm(
        `Tetapkan opsi ${label} sebagai kunci jawaban sementara untuk semua soal yang belum memiliki kunci? (Dapat diubah kapan saja di Bank Soal)`
      )
    ) {
      return;
    }

    let count = 0;
    const updated = parsedData.questions.map((q) => {
      if (q.hasValidKey) return q;

      const updatedOpts = q.options.map((opt) => {
        const isMatch = opt.label.toUpperCase() === label.toUpperCase();
        return { ...opt, isCorrect: isMatch };
      });

      count++;
      return {
        ...q,
        options: updatedOpts,
        hasValidKey: true,
        warnings: q.warnings.filter((w) => !w.includes('Kunci')),
      };
    });

    setParsedData({
      ...parsedData,
      questions: updated,
      validCount: updated.filter((q) => q.hasValidKey).length,
      warningCount: updated.filter((q) => !q.hasValidKey).length,
    });
    alert(`Berhasil menetapkan ${count} soal dengan kunci sementara opsi ${label}!`);
  };

  const handleSaveToBank = async (status: 'draft' | 'published') => {
    if (!parsedData) return;

    setSaving(true);
    setError(null);
    try {
      let targetSetId = selectedSetId;

      // Create new set if selected
      if (selectedSetId === 'new') {
        if (!newSetTitle.trim()) {
          throw new Error('Judul paket soal baru wajib diisi.');
        }
        const createdSet = await api.createQuestionSet({
          category_id: selectedCategoryId,
          title: newSetTitle.trim(),
          description: `Diimpor dari file ${parsedData.fileName}`,
          status,
        });
        targetSetId = createdSet.id;
      }

      await api.saveImportedQuestions({
        questionSetId: targetSetId,
        categoryId: selectedCategoryId,
        questions: parsedData.questions,
        status,
      });

      setSuccessMessage(
        `Berhasil menyimpan ${parsedData.questions.length} butir soal ke Bank Soal dengan status "${status}"!`
      );
      setParsedData(null);
      setFile(null);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan soal.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Impor Soal dari Dokumen Word / PDF</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Ekstrak soal pilihan ganda secara otomatis dari file .docx atau .pdf teks. Hasil ekstraksi
          dapat dibantu AI Agent untuk menentukan kunci jawaban & pembahasan, ditempel massal,
          atau disimpan langsung sebagai Draft / Published.
        </p>
      </div>

      {error && (
        <div
          className="card"
          style={{
            borderColor: 'var(--danger)',
            background: 'var(--danger-light)',
            color: 'var(--danger-dark)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <AlertTriangle size={20} style={{ display: 'inline', marginRight: '6px' }} />
          {error}
        </div>
      )}

      {successMessage && (
        <div
          className="card"
          style={{
            borderColor: 'var(--success)',
            background: 'var(--success-light)',
            color: 'var(--success-dark)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <CheckCircle2 size={20} style={{ display: 'inline', marginRight: '6px' }} />
          {successMessage}
        </div>
      )}

      {/* Upload Box */}
      {!parsedData && (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <UploadCloud size={32} />
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Pilih atau seret file Word (.docx) atau PDF
          </h3>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              maxWidth: '560px',
              margin: '0 auto 1.75rem',
            }}
          >
            Mendukung format &quot;Soal 1&quot;, &quot;1.&quot;, opsi (A, B, C, D, E), kunci jawaban, dan pembahasan.
            Jika dokumen tidak memiliki kunci jawaban, gunakan fitur <strong>AI Agent</strong> untuk memecahkan jawaban secara cerdas!
          </p>

          <input
            type="file"
            id="doc-upload-input"
            accept=".docx,.pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <label htmlFor="doc-upload-input" className="btn btn-secondary">
              Pilih Dokumen
            </label>
            {file && (
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </span>
            )}
            {file && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? 'Mengekstrak Soal...' : 'Mulai Ekstrak Soal'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Parsed Result Preview */}
      {parsedData && (
        <div>
          {/* Summary Card */}
          <div
            className="card"
            style={{
              padding: '1.25rem 1.75rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  File yang diekstrak:
                </div>
                <strong style={{ fontSize: '1.15rem' }}>{parsedData.fileName}</strong>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">
                  Total Soal: {parsedData.questions.length}
                </span>
                <span className="badge badge-success">
                  Kunci Ada: {parsedData.questions.filter((q) => q.hasValidKey).length}
                </span>
                {parsedData.questions.some((q) => !q.hasValidKey) && (
                  <span className="badge badge-warning">
                    Belum Ada Kunci: {parsedData.questions.filter((q) => !q.hasValidKey).length}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Key Helpers + AI AGENT BUTTON */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border)',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <Info size={16} color="var(--primary)" />
                <span>Belum punya kunci jawaban? Gunakan tombol pembantu:</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {/* AI Agent Button */}
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setAiModalOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(99, 102, 241, 0.25)',
                  }}
                >
                  <Bot size={15} />
                  🤖 Bantu Jawab dengan AI Agent
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setBulkModalOpen(true)}
                >
                  <Key size={15} />
                  Tempel Kunci Massal
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleSetDefaultKey('A')}
                >
                  <Sparkles size={15} />
                  Set Kunci Sementara (Semua A)
                </button>
              </div>
            </div>
          </div>

          {/* Destination Target Setup */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
              Pengaturan Target Penyimpanan
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem',
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Kategori Ujian</label>
                <select
                  className="form-select"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Tujuan Paket Soal</label>
                <select
                  className="form-select"
                  value={selectedSetId}
                  onChange={(e) => setSelectedSetId(e.target.value)}
                >
                  <option value="new">+ Buat Paket Soal Baru</option>
                  {questionSets.map((s) => (
                    <option key={s.id} value={s.id}>
                      Tambahkan ke: {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedSetId === 'new' && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nama Paket Soal Baru</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newSetTitle}
                    onChange={(e) => setNewSetTitle(e.target.value)}
                    placeholder="Contoh: Paket Tryout UKOM TLM 2026"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Questions Review List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            {parsedData.questions.map((q, qIndex) => (
              <div
                key={q.questionNumber}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderColor: q.hasValidKey ? 'var(--border)' : '#fbbf24',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-primary">Soal #{q.questionNumber}</span>
                    {q.hasValidKey ? (
                      <span className="badge badge-success">Kunci Terpasang</span>
                    ) : (
                      <span className="badge badge-warning">Belum Ada Kunci Jawaban</span>
                    )}
                  </div>

                  {/* Delete button if parsed text is not a valid question */}
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{
                      color: 'var(--danger)',
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                      background: 'var(--danger-light)',
                      padding: '0.3rem 0.65rem',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontWeight: 600,
                    }}
                    onClick={() => handleDeleteQuestionDraft(qIndex)}
                    title="Hapus butir ini jika bukan soal"
                  >
                    <Trash2 size={14} />
                    Hapus (Bukan Soal)
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Pertanyaan / Vignette Klinis</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={q.questionText}
                    onChange={(e) => handleUpdateQuestionText(qIndex, e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Pilihan Jawaban (Klik radio button untuk memilih kunci):
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {q.options.map((opt, optIndex) => (
                      <div
                        key={opt.label}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: opt.isCorrect ? 'var(--success-light)' : 'transparent',
                          padding: '0.35rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: opt.isCorrect ? '1px solid var(--success)' : '1px solid transparent',
                        }}
                      >
                        <input
                          type="radio"
                          name={`correct-key-${q.questionNumber}`}
                          checked={opt.isCorrect}
                          onChange={() => handleSetCorrectKey(qIndex, optIndex)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <strong style={{ minWidth: '22px' }}>{opt.label}.</strong>
                        <input
                          type="text"
                          className="form-input"
                          value={opt.text}
                          onChange={(e) =>
                            handleUpdateOptionText(qIndex, optIndex, e.target.value)
                          }
                          style={{
                            flex: 1,
                            borderColor: opt.isCorrect ? 'var(--success)' : undefined,
                          }}
                        />
                        {opt.isCorrect && (
                          <span
                            style={{
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              color: 'var(--success-dark)',
                              minWidth: '55px',
                            }}
                          >
                            [KUNCI]
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Pembahasan Klinis</span>
                    {q.explanation && (
                      <span style={{ fontSize: '0.78rem', color: '#4f46e5', fontWeight: 600 }}>
                        ✓ Pembahasan Tersedia
                      </span>
                    )}
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={q.explanation || ''}
                    placeholder="Masukkan alasan atau referensi klinis jawaban yang benar..."
                    onChange={(e) => handleUpdateExplanation(qIndex, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons toolbar */}
          <div
            style={{
              position: 'sticky',
              bottom: '1rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 2rem',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 50,
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (window.confirm('Batal impor dan buang pratinjau ini?')) {
                    setParsedData(null);
                    setFile(null);
                  }
                }}
              >
                Batal
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary"
                onClick={() => handleSaveToBank('draft')}
                disabled={saving}
                title="Simpan soal ke Bank Soal tanpa harus melengkapi kunci sekarang"
              >
                <Save size={18} />
                Simpan sebagai Draft
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleSaveToBank('published')}
                disabled={saving}
              >
                <FileCheck size={18} />
                {saving ? 'Menyimpan...' : 'Validasi & Publikasikan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: AI Solver Agent */}
      {aiModalOpen && parsedData && (
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
          <div className="card" style={{ maxWidth: '580px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
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
                  Akan menganalisis {parsedData.questions.length} butir soal dari {parsedData.fileName}
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              AI Agent akan membaca setiap vignette klinis, menentukan pilihan jawaban yang paling tepat (A–E)
              sesuai standar UKOM Tenaga Kesehatan Indonesia, serta menyusun rasional pembahasan ilmiah secara otomatis.
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
                  ? '✓ Menggunakan Google Gemini Flash (tersimpan di browser)'
                  : 'ℹ️ Tanpa API key, sistem menggunakan Engine Heuristik Klinis Bawaan (mendukung Sitohistoteknologi & pola UKOM).'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={aiSolving}
                onClick={() => setAiModalOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={aiSolving}
                onClick={handleSolveWithAI}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  border: 'none',
                }}
              >
                {aiSolving ? (
                  <>
                    <Loader2 size={16} className="spin-animation" />
                    Sedang Menganalisis {parsedData.questions.length} Soal...
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

      {/* Modal: Bulk Paste Answer Keys */}
      {bulkModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div className="card" style={{ maxWidth: '580px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>
              Tempel Kunci Jawaban Massal
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.88rem',
                marginBottom: '1.25rem',
              }}
            >
              Tempelkan teks kunci jawaban Anda di bawah. Sistem mendukung berbagai format:
              <br />• <code>1. C, 2. B, 3. C, 4. B, 5. C...</code>
              <br />• <code>1.C 2.B 3.C 4.B 5.C...</code>
              <br />• Huruf berurutan: <code>C B C B C B B C D C...</code>
            </p>

            <div className="form-group">
              <label className="form-label">Teks Kunci Jawaban</label>
              <textarea
                className="form-textarea"
                rows={6}
                placeholder="Contoh: 1.C 2.B 3.C 4.B 5.C 6.B 7.B 8.C 9.D 10.C..."
                value={bulkKeysText}
                onChange={(e) => setBulkKeysText(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setBulkModalOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 2 }}
                onClick={handleApplyBulkKeys}
              >
                Terapkan Kunci ke Soal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
