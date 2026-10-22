import { describe, it, expect } from 'vitest';
import { AISolverService } from '../services/aiSolverService.js';

describe('AISolverService Tests', () => {
  it('correctly solves Soal 1 (NBF 10% fiksasi HE rutin)', async () => {
    const results = await AISolverService.solveBatch([
      {
        index: 1,
        question_text:
          'Seorang TLM menerima spesimen biopsi lambung berukuran 1 × 1 × 0,5 cm. Larutan fiksatif yang paling tepat digunakan adalah....',
        options: [
          { option_label: 'A', option_text: 'Etanol 70%' },
          { option_label: 'B', option_text: 'Metanol absolut' },
          { option_label: 'C', option_text: 'Neutral Buffered Formalin 10%' },
          { option_label: 'D', option_text: 'Xilena' },
          { option_label: 'E', option_text: 'Parafin cair' },
        ],
      },
    ]);

    expect(results).toHaveLength(1);
    expect(results[0].correct_label).toBe('C');
    expect(results[0].explanation).toContain('Neutral Buffered Formalin');
  });

  it('correctly solves Soal 2 (Autolisis karena jaringan terlalu tebal)', async () => {
    const results = await AISolverService.solveBatch([
      {
        index: 2,
        question_text:
          'Sebuah jaringan hasil operasi berukuran besar diterima laboratorium. Setelah difiksasi, bagian tengah jaringan menunjukkan autolisis sedangkan bagian perifer terfiksasi dengan baik. Kesalahan preanalitik yang paling mungkin menyebabkan kondisi tersebut adalah....',
        options: [
          { option_label: 'A', option_text: 'Jaringan dipotong terlalu tipis' },
          { option_label: 'B', option_text: 'Jaringan terlalu tebal saat difiksasi' },
          { option_label: 'C', option_text: 'Konsentrasi parafin terlalu tinggi' },
          { option_label: 'D', option_text: 'Suhu water bath terlalu rendah' },
          { option_label: 'E', option_text: 'Waktu pewarnaan eosin terlalu singkat' },
        ],
      },
    ]);

    expect(results).toHaveLength(1);
    expect(results[0].correct_label).toBe('B');
    expect(results[0].explanation).toContain('tebal');
  });

  it('solves unknown question using semantic keywords (Xilena clearing)', async () => {
    const results = await AISolverService.solveBatch([
      {
        index: 999,
        question_text:
          'Reagen yang bertindak sebagai agen clearing atau penjernih sebelum perendaman parafin cair adalah....',
        options: [
          { option_label: 'A', option_text: 'Aseton pekat' },
          { option_label: 'B', option_text: 'Xilena atau Xylol murni' },
          { option_label: 'C', option_text: 'Air distilasi' },
          { option_label: 'D', option_text: 'Etanol 50%' },
          { option_label: 'E', option_text: 'Formaldehid 37%' },
        ],
      },
    ]);

    expect(results).toHaveLength(1);
    expect(results[0].correct_label).toBe('B');
  });
});
