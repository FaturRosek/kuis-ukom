import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { ParsedQuestionDraft } from '../types/index.js';

export class ImportParserService {
  
  static async parseFile(
    buffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<{ questions: ParsedQuestionDraft[]; rawTextLength: number; errors: string[] }> {
    let rawText = '';
    const errors: string[] = [];

    const isDocx =
      fileName.endsWith('.docx') ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const isPdf = fileName.endsWith('.pdf') || mimeType === 'application/pdf';

    if (isDocx) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        rawText = result.value;
      } catch (err: any) {
        errors.push(`Gagal mengekstrak DOCX: ${err.message}`);
      }
    } else if (isPdf) {
      try {
        const result = await (pdfParse as any)(buffer);
        rawText = result.text;
        if (!rawText || rawText.trim().length === 0) {
          errors.push(
            'Dokumen PDF tidak memiliki lapisan teks yang dapat dibaca. Kemungkinan file merupakan hasil scan gambar (OCR belum didukung pada versi ini).'
          );
        }
      } catch (err: any) {
        errors.push(`Gagal mengekstrak PDF: ${err.message}`);
      }
    } else {
      errors.push('Format file tidak didukung. Harap unggah file .docx atau .pdf berbasis teks.');
    }

    if (errors.length > 0 || !rawText) {
      return { questions: [], rawTextLength: 0, errors };
    }

    const questions = this.parseTextToQuestions(rawText);
    return { questions, rawTextLength: rawText.length, errors };
  }

  
  static parseTextToQuestions(rawText: string): ParsedQuestionDraft[] {
    const rawLines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const isHeaderOrFooter = (line: string): boolean => {
      if (/^Bank Soal.*\|\s*\d+$/i.test(line)) return true;
      if (/^Halaman\s+\d+/i.test(line)) return true;
      if (/^\d+\s*\/\s*\d+$/i.test(line)) return true;
      if (/^BAGIAN\s+[IVXLCDM]+/i.test(line)) return true;
      if (/^SOAL$/i.test(line)) return true;
      if (
        /^(?:TEKNIK\s+PEMBUATAN|TEKNIK\s+PENGOLAHAN|PENILAIAN\s+HASIL|TROUBLESHOOTING|QA,\s*QC)\b/i.test(
          line
        ) &&
        line.length < 80
      ) {
        return true;
      }
      return false;
    };

    const detectQuestionStart = (line: string): { num: number; inlineText: string } | null => {
      if (/^(\*?)\s*(?:\(?([A-Ea-e])\)|([A-Ea-e])[\.\-\)])\s*/.test(line)) {
        return null;
      }

      const m1 = line.match(/^(?:soal|nomor|no\.?)\s*(\d+)[\.\:\-]?\s*(.*)$/i);
      if (m1) {
        return { num: parseInt(m1[1], 10), inlineText: (m1[2] || '').trim() };
      }

      const m2 = line.match(/^(?:\(?(\d+)[\.\)\:\-]\s*)(.*)$/);
      if (m2) {
        return { num: parseInt(m2[1], 10), inlineText: (m2[2] || '').trim() };
      }

      return null;
    };

    let startIdx = -1;
    for (let i = 0; i < rawLines.length; i++) {
      if (/^soal\s+1\b/i.test(rawLines[i])) {
        startIdx = i;
        break;
      }
    }

    if (startIdx === -1) {
      for (let i = 0; i < rawLines.length; i++) {
        if (/^petunjuk/i.test(rawLines[i])) continue;
        if (detectQuestionStart(rawLines[i])) {
          startIdx = i;
          break;
        }
      }
    }

    const lines = (startIdx !== -1 ? rawLines.slice(startIdx) : rawLines).filter(
      (l) => !isHeaderOrFooter(l)
    );

    const questions: ParsedQuestionDraft[] = [];
    let currentQ: {
      questionNumber: number;
      questionTextParts: string[];
      options: { label: string; text: string; isCorrect: boolean }[];
      explanationParts: string[];
      detectedKey: string | null;
      warnings: string[];
    } | null = null;

    let currentSection: 'question' | 'option' | 'explanation' = 'question';
    let currentOptionLabel: string | null = null;

    const optionRegex = /^(\*?)\s*(?:\(?([A-Ea-e])\)|([A-Ea-e])[\.\-\)])\s*(.*)$/;
    const answerKeyRegex = /^(?:kunci(?:\s*jawaban)?|jawaban|answer|key)\s*[:=\-]?\s*([A-Ea-e])\b/i;
    const explanationRegex = /^(?:pembahasan|penjelasan|rasional(?:isasi)?|explanation)\s*[:=\-]?\s*(.*)$/i;

    const finalizeCurrent = () => {
      if (!currentQ) return;

      const qText = currentQ.questionTextParts.join(' ').trim();
      const expl = currentQ.explanationParts.join(' ').trim();
      const warnings: string[] = [...currentQ.warnings];

      if (!qText || qText.length < 5) {
        warnings.push('Teks pertanyaan terlalu pendek atau tidak terdeteksi dengan lengkap.');
      }

      if (currentQ.options.length < 2) {
        warnings.push(`Pilihan jawaban kurang dari 2 (ditemukan: ${currentQ.options.length}).`);
      }

      let hasValidKey = false;
      if (currentQ.detectedKey) {
        const found = currentQ.options.find(
          (o) => o.label.toUpperCase() === currentQ!.detectedKey!.toUpperCase()
        );
        if (found) {
          found.isCorrect = true;
          hasValidKey = true;
        } else {
          warnings.push(`Kunci terdeteksi (${currentQ.detectedKey}) tetapi tidak cocok dengan opsi.`);
        }
      } else {
        const markedCorrect = currentQ.options.filter((o) => o.isCorrect);
        if (markedCorrect.length === 1) {
          hasValidKey = true;
        } else if (markedCorrect.length > 1) {
          warnings.push('Terdeteksi lebih dari satu kunci jawaban.');
        } else {
          warnings.push(
            'Kunci jawaban belum ditemukan, silakan tentukan saat preview atau simpan sebagai Draft.'
          );
        }
      }

      questions.push({
        tempId: `draft-${questions.length + 1}-${Date.now()}`,
        questionNumber: currentQ.questionNumber || questions.length + 1,
        questionText: qText,
        options: currentQ.options,
        explanation: expl || undefined,
        hasValidKey,
        warnings,
      });
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      const qMatch = detectQuestionStart(line);
      if (qMatch) {
        finalizeCurrent();

        currentQ = {
          questionNumber: qMatch.num,
          questionTextParts: qMatch.inlineText ? [qMatch.inlineText] : [],
          options: [],
          explanationParts: [],
          detectedKey: null,
          warnings: [],
        };
        currentSection = 'question';
        currentOptionLabel = null;
        continue;
      }

      if (!currentQ) {
        continue;
      }

      const keyMatch = line.match(answerKeyRegex);
      if (keyMatch) {
        currentQ.detectedKey = keyMatch[1].toUpperCase();
        continue;
      }

      const explMatch = line.match(explanationRegex);
      if (explMatch) {
        currentSection = 'explanation';
        if (explMatch[1] && explMatch[1].trim().length > 0) {
          currentQ.explanationParts.push(explMatch[1].trim());
        }
        continue;
      }

      const optMatch = line.match(optionRegex);
      if (optMatch && currentSection !== 'explanation') {
        const asterisk = optMatch[1];
        const label = (optMatch[2] || optMatch[3]).toUpperCase();
        const text = (optMatch[4] || '').trim();

        const isCorrect = asterisk === '*' || text.includes('(Kunci)') || text.includes('(Benar)');
        const cleanedText = text.replace(/\((?:Kunci|Benar)\)/gi, '').trim();

        const alreadyHasLabel = currentQ.options.some((o) => o.label === label);
        if (alreadyHasLabel && label === 'A') {
          finalizeCurrent();
          currentQ = {
            questionNumber: questions.length + 1,
            questionTextParts: [],
            options: [{ label, text: cleanedText, isCorrect }],
            explanationParts: [],
            detectedKey: null,
            warnings: [],
          };
          currentSection = 'option';
          currentOptionLabel = label;
          continue;
        }

        currentQ.options.push({
          label,
          text: cleanedText,
          isCorrect,
        });

        currentSection = 'option';
        currentOptionLabel = label;
        continue;
      }

      if (currentSection === 'question') {
        currentQ.questionTextParts.push(line);
      } else if (currentSection === 'option' && currentOptionLabel) {
        const lastOpt = currentQ.options[currentQ.options.length - 1];
        if (lastOpt) {
          lastOpt.text += ' ' + line;
        }
      } else if (currentSection === 'explanation') {
        currentQ.explanationParts.push(line);
      }
    }

    finalizeCurrent();
    return questions;
  }

  
  static applyBulkKeys(
    questions: ParsedQuestionDraft[],
    rawKeyText: string
  ): { updatedCount: number; questions: ParsedQuestionDraft[] } {
    const keyMap = new Map<number, string>();

    const numberedRegex = /(?:soal\s*)?(\d+)[\.\:\-\s]+([A-Ea-e])\b/gi;
    let match: RegExpExecArray | null;
    let foundNumbered = false;

    while ((match = numberedRegex.exec(rawKeyText)) !== null) {
      foundNumbered = true;
      const num = parseInt(match[1], 10);
      const key = match[2].toUpperCase();
      keyMap.set(num, key);
    }

    if (!foundNumbered) {
      const letters = rawKeyText.match(/\b([A-Ea-e])\b/g);
      if (letters) {
        letters.forEach((l, idx) => {
          keyMap.set(idx + 1, l.toUpperCase());
        });
      }
    }

    let updatedCount = 0;
    const updatedQuestions = questions.map((q) => {
      const targetKey = keyMap.get(q.questionNumber);
      if (!targetKey) return q;

      let matched = false;
      const updatedOptions = q.options.map((opt) => {
        const isMatch = opt.label.toUpperCase() === targetKey;
        if (isMatch) matched = true;
        return {
          ...opt,
          isCorrect: isMatch,
        };
      });

      if (matched) {
        updatedCount++;
        return {
          ...q,
          options: updatedOptions,
          hasValidKey: true,
          warnings: q.warnings.filter((w) => !w.includes('Kunci')),
        };
      }

      return q;
    });

    return { updatedCount, questions: updatedQuestions };
  }
}
