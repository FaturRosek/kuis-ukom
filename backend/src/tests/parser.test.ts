import { describe, it, expect } from 'vitest';
import { ImportParserService } from '../services/importParserService.js';

describe('ImportParserService', () => {
  it('correctly parses text into structured questions with options and answer keys', () => {
    const rawText = `
1. Seorang perempuan berusia 25 tahun dirawat dengan asma bronkial.
A. Memberikan oksigen nasal kanul
B. Mengatur posisi semi-fowler
C. Memberikan bronkodilator nebulisasi
D. Melakukan perkusi dada
Kunci: B
Pembahasan: Posisi semi-fowler membantu memaksimalkan ventilasi paru.

2. Korban kecelakaan dengan henti napas.
A. Kompresi dada 30:2
*B. Cek respon dan nadi karotis
C. Berikan napas buatan 2 kali
D. Pasang cervical collar
Pembahasan: Cek nadi dan respon adalah langkah pertama pada henti jantung/napas.
    `;

    const questions = ImportParserService.parseTextToQuestions(rawText);

    expect(questions).toHaveLength(2);

    
    expect(questions[0].questionNumber).toBe(1);
    expect(questions[0].questionText).toContain('asma bronkial');
    expect(questions[0].options).toHaveLength(4);
    expect(questions[0].hasValidKey).toBe(true);
    const q1Correct = questions[0].options.find((o) => o.isCorrect);
    expect(q1Correct?.label).toBe('B');
    expect(questions[0].explanation).toContain('ventilasi paru');

    
    expect(questions[1].questionNumber).toBe(2);
    expect(questions[1].hasValidKey).toBe(true);
    const q2Correct = questions[1].options.find((o) => o.isCorrect);
    expect(q2Correct?.label).toBe('B');
    expect(questions[1].warnings).toHaveLength(0);
  });

  it('marks questions without keys as unverified with warnings and does not invent answers', () => {
    const rawText = `
1. Tanda khas apendisitis akut adalah?
A. Nyeri tekan McBurney
B. Nyeri punggung bawah
C. Nyeri kepala berdenyut
D. Nyeri dada retrosternal
    `;

    const questions = ImportParserService.parseTextToQuestions(rawText);
    expect(questions).toHaveLength(1);
    expect(questions[0].hasValidKey).toBe(false);
    expect(questions[0].warnings.some((w) => w.includes('Kunci jawaban belum ditemukan'))).toBe(true);
  });

  it('accurately parses format with Soal 1 on its own line and options A-E', () => {
    const rawText = `
Bank Soal UKOMNAS D3 TLM – Sitohistoteknologi | 1
SOAL
BAGIAN I

Soal 1
Seorang TLM menerima spesimen biopsi lambung.
Larutan fiksatif yang paling tepat digunakan adalah....
A. Etanol 70%
B. Metanol absolut
C. Neutral Buffered Formalin 10%
D. Xilena
E. Parafin cair

Soal 2
Sebuah jaringan hasil operasi berukuran besar diterima laboratorium.
Kesalahan preanalitik yang paling mungkin adalah....
A. Jaringan dipotong terlalu tipis
B. Jaringan terlalu tebal saat difiksasi
C. Konsentrasi parafin terlalu tinggi
D. Suhu water bath terlalu rendah
E. Waktu pewarnaan eosin terlalu singkat
    `;

    const questions = ImportParserService.parseTextToQuestions(rawText);
    expect(questions).toHaveLength(2);
    expect(questions[0].questionNumber).toBe(1);
    expect(questions[0].questionText).toContain('biopsi lambung');
    expect(questions[0].options).toHaveLength(5);
    expect(questions[0].options[0].text).toBe('Etanol 70%');
    expect(questions[0].options[4].text).toBe('Parafin cair');

    expect(questions[1].questionNumber).toBe(2);
    expect(questions[1].questionText).toContain('jaringan hasil operasi');
    expect(questions[1].options).toHaveLength(5);
    expect(questions[1].options[1].text).toBe('Jaringan terlalu tebal saat difiksasi');

    
    const bulkResult = ImportParserService.applyBulkKeys(questions, '1. C, 2. B');
    expect(bulkResult.updatedCount).toBe(2);
    expect(bulkResult.questions[0].hasValidKey).toBe(true);
    expect(bulkResult.questions[0].options.find((o) => o.isCorrect)?.label).toBe('C');
    expect(bulkResult.questions[1].options.find((o) => o.isCorrect)?.label).toBe('B');
  });
});
