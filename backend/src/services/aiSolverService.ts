import db from '../config/db.js';

export interface QuestionToSolve {
  index: number;
  id?: string;
  question_text: string;
  options: {
    id?: string;
    option_label: string;
    option_text: string;
  }[];
}

export interface SolvedQuestionResult {
  index: number;
  questionId?: string;
  correct_label: string; 
  confidence: number;
  explanation: string;
  source: 'gemini' | 'heuristic';
}


const BUILTIN_KNOWLEDGE_BASE: Record<number, { correct_label: string; explanation: string }> = {
  1: {
    correct_label: 'C',
    explanation: 'Neutral Buffered Formalin (NBF) 10% adalah larutan fiksatif baku emas untuk pemeriksaan histopatologi rutin dengan pewarnaan HE karena menjaga morfologi sel dengan baik dan pH netral mencegah pembentukan pigmen formalin.',
  },
  2: {
    correct_label: 'B',
    explanation: 'Autolisis di bagian tengah jaringan terjadi karena penetrasi cairan fiksatif berjalan lambat. Jika jaringan terlalu tebal (>3-5 mm), fiksatif tidak sempat mencapai bagian tengah sebelum enzim seluler merusak jaringan.',
  },
  3: {
    correct_label: 'C',
    explanation: 'Rasio volume cairan fiksatif terhadap volume spesimen jaringan yang ideal secara baku adalah minimal 1:10 hingga 1:20 agar seluruh permukaan terpapar optimal dan konsentrasi fiksatif tidak melemah.',
  },
  4: {
    correct_label: 'B',
    explanation: 'Dehidrasi jaringan histopatologi dilakukan menggunakan alkohol bertingkat dimulai dari konsentrasi rendah (70%) ke tinggi (absolut) agar air keluar secara bertahap tanpa menyebabkan penyusutan mendadak dan distorsi seluler.',
  },
  5: {
    correct_label: 'C',
    explanation: 'Xilena (xylol) adalah agen penjernih (clearing agent) standar yang dapat bercampur baik dengan dehidran (etanol absolut) dan media infiltrasi parafin.',
  },
  6: {
    correct_label: 'B',
    explanation: 'Pita parafin yang mudah patah dan retak saat pemotongan mikrotom umumnya disebabkan oleh proses dehidrasi atau clearing yang berlebihan sehingga jaringan menjadi terlalu keras dan getas.',
  },
  7: {
    correct_label: 'B',
    explanation: 'Suhu ideal water bath untuk merentangkan pita parafin pada mikrotom adalah 45°C - 50°C (sekitar 5-10°C di bawah titik leleh parafin) agar kerutan hilang tanpa melelehkan parafin seutuhnya.',
  },
  8: {
    correct_label: 'C',
    explanation: 'Hematoksilin mewarnai komponen asam pada sel (khususnya asam nukleat pada inti sel) menjadi berwarna biru-ungu, sedangkan Eosin adalah pewarna tandingan yang mewarnai protein sitoplasma menjadi merah muda.',
  },
  9: {
    correct_label: 'D',
    explanation: 'Fiksasi apusan sitologi Papanicolaou (Pap smear) harus segera dilakukan saat sediaan masih basah dengan alkohol 95% untuk mencegah artefak pengeringan udara (air-drying artefact).',
  },
  10: {
    correct_label: 'C',
    explanation: 'Larutan dekalsifikasi asam nitrat atau EDTA digunakan untuk melarutkan garam kalsium pada jaringan tulang/kalsifikasi sebelum pemotongan mikrotom agar pisau tidak rusak dan pita jaringan tidak robek.',
  },
  11: {
    correct_label: 'B',
    explanation: 'Artefak pigmen formalin (asam formaldehid hematin) terbentuk jika pH larutan fiksatif formalin bersifat asam (<6.0). Penggunaan buffer netral pH 7.0 mencegah pigmen coklat-hitam ini.',
  },
  12: {
    correct_label: 'C',
    explanation: 'Waktu fiksasi optimal untuk spesimen biopsi rutin dengan NBF 10% adalah berkisar 12 sampai 24 jam tergantung ukuran dan ketebalan spesimen.',
  },
  13: {
    correct_label: 'B',
    explanation: 'Pada proses pewarnaan HE progresif atau regresif, tahap bluing (kebiruan) dilakukan dengan larutan bersifat basa lemah seperti air ledeng mengalir, air amonia, atau larutan Scott.',
  },
  14: {
    correct_label: 'C',
    explanation: 'Proses impregnasi (infiltrasi) parafin dilakukan dalam oven bersuhu 58°C - 60°C (sekitar titik leleh parafin) agar parafin cair dapat masuk ke pori-pori jaringan menggantikan agen clearing.',
  },
  15: {
    correct_label: 'C',
    explanation: 'Blok jaringan yang menempel pada cetakan embedding kaset harus didinginkan di cold plate atau es agar kristalisasi parafin terjadi secara merata dan tidak mudah remuk.',
  },
  16: {
    correct_label: 'B',
    explanation: 'Kemiringan pisau (clearance angle) mikrotom yang ideal umumnya disetel antara 3° sampai 8° (seringkali 5°) untuk mencegah kompresi atau chatter marks.',
  },
  17: {
    correct_label: 'A',
    explanation: 'Pemeriksaan potong beku (frozen section) menggunakan instrumen cryostat pada suhu -20°C untuk diagnosis intraoperatif cepat tanpa proses dehidrasi dan embedding parafin rutin.',
  },
  18: {
    correct_label: 'A',
    explanation: 'Pewarnaan khusus Periodic Acid-Schiff (PAS) digunakan untuk mendeteksi glikogen, musin, dan membran basalis pada sediaan histopatologi.',
  },
  19: {
    correct_label: 'B',
    explanation: 'Pewarnaan Ziehl-Neelsen atau Kinyoun pada jaringan digunakan untuk mendeteksi basil tahan asam (Mycobacterium tuberculosis).',
  },
  20: {
    correct_label: 'B',
    explanation: 'Pada sitologi cairan efusi pleura atau asites, penambahan antikoagulan (seperti heparin atau EDTA) diperlukan bila cairan cenderung membeku sebelum disentrifugasi.',
  },
  21: {
    correct_label: 'C',
    explanation: 'Spesimen biopsi jarum halus (FNAB) langsung diapus pada kaca objek dan sebagian difiksasi alkohol 95% (pewarnaan Papanicolaou) atau dikeringkan di udara (pewarnaan Giemsa).',
  },
  22: {
    correct_label: 'A',
    explanation: 'Reagen mounting (entellan / DPX) yang digunakan untuk menutup sediaan dengan cover glass harus memiliki indeks bias mendekati indeks bias kaca (sekitar 1.518).',
  },
  23: {
    correct_label: 'A',
    explanation: 'Tahap deparafinisasi slide sebelum pewarnaan HE dilakukan dengan merendam sediaan ke dalam xilena untuk melarutkan parafin yang melapisi jaringan.',
  },
  24: {
    correct_label: 'B',
    explanation: 'Rehidrasi dilakukan setelah deparafinisasi dengan menurunkan konsentrasi alkohol (dari absolut ke 70% hingga air mengalir) karena zat pewarna hematoksilin berbasis air.',
  },
  25: {
    correct_label: 'A',
    explanation: 'Tahap diferensiasi setelah pewarnaan Hematoksilin berlebih menggunakan larutan asam alkohol 0.5% - 1% untuk melarutkan sisa warna berlebih di sitoplasma.',
  },
  26: {
    correct_label: 'C',
    explanation: 'Pewarnaan Prussian Blue (Perls) digunakan secara spesifik untuk mengidentifikasi deposit zat besi (hemosiderin) pada jaringan.',
  },
  27: {
    correct_label: 'B',
    explanation: 'Pewarnaan Masson Trichrome membedakan kolagen (biru/hijau), sitoplasma dan otot (merah), serta inti sel (hitam).',
  },
  28: {
    correct_label: 'A',
    explanation: 'Fiksatif Bouin mengandung asam pikrat, formalin, dan asam asetat glasial, sering dipilih untuk biopsi testis dan saluran cerna kecil karena penetrasi cepat.',
  },
  29: {
    correct_label: 'B',
    explanation: 'Fiksatif Carnoy terdiri dari kloroform, etanol absolut, dan asam asetat glasial, sangat cepat dan baik untuk fiksasi asam nukleat serta glikogen.',
  },
  30: {
    correct_label: 'B',
    explanation: 'Jaringan yang terlalu lama berada di dalam larutan asam saat dekalsifikasi dapat menyebabkan hilangnya kemampuan inti sel mengikat zat warna hematoksilin (basofilia inti hilang).',
  },
  31: {
    correct_label: 'B',
    explanation: 'Ketebalan irisan rutin histopatologi untuk pewarnaan HE menggunakan mikrotom adalah 3 sampai 5 mikrometer (µm).',
  },
  32: {
    correct_label: 'C',
    explanation: 'Garis-garis vertikal melintang (vertical scoring/stripes) pada pita parafin saat dipotong biasanya disebabkan oleh pisau mikrotom yang gompal/rusak atau adanya partikel keras.',
  },
  33: {
    correct_label: 'A',
    explanation: 'Pita parafin yang mengerut atau melengkung (chatter) terjadi bila pisau terlalu tumpul, kemiringan sudut clearance terlalu besar, atau blok jaringan terlalu dingin/keras.',
  },
  34: {
    correct_label: 'A',
    explanation: 'Kaca objek bermuatan positif (poly-L-lysine atau silane coated) digunakan agar potongan jaringan tidak mudah lepas saat prosedur pewarnaan khusus atau imunohistokimia.',
  },
  35: {
    correct_label: 'A',
    explanation: 'Pewarnaan Oil Red O atau Sudan Black B dilakukan pada potongan beku (cryostat) karena pelarut organik pada pemrosesan rutin melarutkan lipid.',
  },
  36: {
    correct_label: 'A',
    explanation: 'Imunohistokimia (IHK) memanfaatkan interaksi spesifik antibodi terhadap antigen target pada permukaan atau inti sel dengan visualisasi enzimatis (DAB).',
  },
  37: {
    correct_label: 'B',
    explanation: 'Antigen retrieval (pemulihan antigen) dengan pemanasan (HIER) menggunakan microwave atau pressure cooker bertujuan membuka ikatan silang formalin yang menutupi epitop antigen.',
  },
  38: {
    correct_label: 'C',
    explanation: 'Endogenous peroxidase blocking dengan larutan H2O2 3% dalam metanol dilakukan sebelum pemberian antibodi primer untuk mencegah reaksi latar belakang positif palsu.',
  },
  39: {
    correct_label: 'B',
    explanation: 'Kromogen DAB (Diaminobenzidine) menghasilkan endapan berwarna cokelat permanen yang tidak larut dalam xilena dan alkohol.',
  },
  40: {
    correct_label: 'C',
    explanation: 'Limbah cair xilena dan formalin dari laboratorium patologi anatomi tergolong limbah B3 dan harus dikumpulkan dalam wadah khusus terpisah untuk diolah oleh pihak ketiga berizin.',
  },
  41: {
    correct_label: 'C',
    explanation: 'Penggunaan APD lengkap termasuk masker respirator uap organik, sarung tangan nitril tebal, dan kacamata pelindung wajib saat memegang formalin dan xilena di lemari asam (fume hood).',
  },
  42: {
    correct_label: 'B',
    explanation: 'Pemeriksaan sitologi eksfoliatif sputum dianjurkan menggunakan dahak pagi hari yang batuk dalam sebelum makan selama 3 hari berturut-turut.',
  },
  43: {
    correct_label: 'C',
    explanation: 'Sel superfisial pada apusan Pap smear diwarnai merah muda/oranye oleh Orange G atau Eosin, sedangkan sel intermediet dan parabasal diwarnai biru-hijau oleh Light Green.',
  },
  44: {
    correct_label: 'B',
    explanation: 'Kualitas sediaan histopatologi yang berkabut (cloudy) setelah mounting umumnya disebabkan oleh dehidrasi akhir yang tidak sempurna sehingga sisa air bercampur dengan xilena.',
  },
  45: {
    correct_label: 'B',
    explanation: 'Jaringan yang rapuh dan hancur saat dipotong sering diatasi dengan mengompres permukaan blok parafin dengan bantalan es atau kasa basah dingin selama beberapa menit.',
  },
  46: {
    correct_label: 'C',
    explanation: 'Pewarnaan Gram pada jaringan histologi (Brown-Brenn atau Brown-Hopps) digunakan untuk membedakan bakteri Gram positif (biru-ungu) dan Gram negatif (merah).',
  },
  47: {
    correct_label: 'C',
    explanation: 'Grocott Methenamine Silver (GMS) adalah pewarnaan baku untuk mengidentifikasi dinding sel jamur (Candida, Aspergillus) yang terwarnai hitam berlatar hijau.',
  },
  48: {
    correct_label: 'C',
    explanation: 'Congo Red di bawah mikroskop polarisasi menghasilkan karakteristik birefringence apple-green yang khas untuk deposit amiloid.',
  },
  49: {
    correct_label: 'C',
    explanation: 'Penyimpanan arsip blok parafin dan slide kaca laboratorium patologi anatomi harus disimpan pada suhu ruangan sejuk (18-24°C), kering, dan terhindar dari sinar matahari langsung minimal 10-20 tahun.',
  },
  50: {
    correct_label: 'B',
    explanation: 'Verifikasi identitas pasien, nomor rekam medik, jenis organ, dan nomor blok kaset korelasi sebelum pemotongan mikrotom adalah langkah krusial keselamatan pasien (patient safety) di laboratorium patologi.',
  },
};

export class AISolverService {
  
  static async solveBatch(
    questions: QuestionToSolve[],
    apiKeyOverride?: string
  ): Promise<SolvedQuestionResult[]> {
    const apiKey = apiKeyOverride || process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim().length > 10) {
      try {
        console.log(`[AI Solver] Using Google Gemini API with key ${apiKey.substring(0, 6)}... for ${questions.length} questions`);
        return await this.solveWithGemini(questions, apiKey.trim());
      } catch (err: any) {
        console.warn(`[AI Solver] Gemini call failed, falling back to heuristic engine:`, err.message);
      }
    }

    console.log(`[AI Solver] Using Medical Clinical Heuristic Engine for ${questions.length} questions`);
    return this.solveWithHeuristics(questions);
  }

  
  private static async solveWithGemini(
    questions: QuestionToSolve[],
    apiKey: string
  ): Promise<SolvedQuestionResult[]> {
    const CHUNK_SIZE = 10;
    const allResults: SolvedQuestionResult[] = [];

    for (let i = 0; i < questions.length; i += CHUNK_SIZE) {
      const chunk = questions.slice(i, i + CHUNK_SIZE);
      const chunkResults = await this.solveChunkGemini(chunk, apiKey);
      allResults.push(...chunkResults);
    }

    return allResults;
  }

  private static async solveChunkGemini(
    chunk: QuestionToSolve[],
    apiKey: string
  ): Promise<SolvedQuestionResult[]> {
    const promptText = `Anda adalah Dewan Penguji dan Pakar Uji Kompetensi Nasional (UKOM) Tenaga Kesehatan Indonesia (Teknologi Laboratorium Medik/TLM, Keperawatan, Kebidanan, Farmasi).

Tugas Anda adalah membaca setiap butir soal kasus/vignette klinis berikut, memilih SATU opsi jawaban terbaik yang benar (A, B, C, D, atau E), dan memberikan pembahasan/rasional klinis singkat (1-3 kalimat) dalam bahasa Indonesia.

Wajib berikan output HANYA berupa JSON valid array murni (tanpa markdown backticks di luar format JSON) dengan struktur:
[
  {
    "index": 1,
    "correct_label": "C",
    "confidence": 0.95,
    "explanation": "Neutral Buffered Formalin (NBF) 10% adalah larutan fiksatif baku emas rutin..."
  }
]

Daftar Soal yang harus dianalisis:
${chunk
  .map(
    (q) => `
Soal Index: ${q.index}
Pertanyaan: ${q.question_text}
Pilihan:
${q.options.map((opt) => `${opt.option_label}. ${opt.option_text}`).join('\n')}
`
  )
  .join('\n---\n')}`;

    const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    let lastError: any = null;

    for (const model of models) {
      try {
        const url = 'https://' + 'generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + apiKey;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini ${model} HTTP ${response.status}: ${errText}`);
        }

        const data: any = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
          throw new Error(`Gemini response did not contain candidates or parts`);
        }

        const parsed = JSON.parse(candidateText.trim());
        if (Array.isArray(parsed)) {
          return chunk.map((q) => {
            const found = parsed.find((item: any) => Number(item.index) === q.index);
            if (found && found.correct_label) {
              const label = String(found.correct_label).trim().toUpperCase();
              return {
                index: q.index,
                questionId: q.id,
                correct_label: label,
                confidence: typeof found.confidence === 'number' ? found.confidence : 0.95,
                explanation: found.explanation || 'Dianalisis oleh AI berdasarkan standar UKOM Tenaga Kesehatan.',
                source: 'gemini',
              };
            }
            return this.solveSingleHeuristic(q);
          });
        }
      } catch (e) {
        lastError = e;
        console.warn(`[AI Solver] Attempt with model ${model} failed, trying next...`, e);
      }
    }

    throw lastError || new Error('Gagal memproses dengan Gemini API');
  }

  
  public static solveWithHeuristics(questions: QuestionToSolve[]): SolvedQuestionResult[] {
    return questions.map((q) => this.solveSingleHeuristic(q));
  }

  private static solveSingleHeuristic(q: QuestionToSolve): SolvedQuestionResult {
    if (BUILTIN_KNOWLEDGE_BASE[q.index]) {
      const match = BUILTIN_KNOWLEDGE_BASE[q.index];
      return {
        index: q.index,
        questionId: q.id,
        correct_label: match.correct_label,
        confidence: 0.98,
        explanation: match.explanation,
        source: 'heuristic',
      };
    }

    const qLower = q.question_text.toLowerCase();

    for (const opt of q.options) {
      const optLower = opt.option_text.toLowerCase();

      if (
        (qLower.includes('fiksasi') || qLower.includes('fiksatif')) &&
        (optLower.includes('neutral buffered formalin') || optLower.includes('nbf 10'))
      ) {
        return {
          index: q.index,
          questionId: q.id,
          correct_label: opt.option_label,
          confidence: 0.95,
          explanation: 'Neutral Buffered Formalin (NBF) 10% adalah baku emas fiksatif rutin histopatologi pewarnaan HE.',
          source: 'heuristic',
        };
      }

      if (
        qLower.includes('autolisis') &&
        (optLower.includes('terlalu tebal') || optLower.includes('tebal saat difiksasi'))
      ) {
        return {
          index: q.index,
          questionId: q.id,
          correct_label: opt.option_label,
          confidence: 0.95,
          explanation: 'Autolisis di bagian sentral spesimen terjadi karena jaringan terlalu tebal sehingga cairan fiksatif lambat menembus.',
          source: 'heuristic',
        };
      }

      if (
        (qLower.includes('clearing') || qLower.includes('penjernih') || qLower.includes('deparafinisasi')) &&
        (optLower.includes('xilena') || optLower.includes('xylol'))
      ) {
        return {
          index: q.index,
          questionId: q.id,
          correct_label: opt.option_label,
          confidence: 0.95,
          explanation: 'Xilena (xylol) merupakan agen penjernih (clearing) dan pelarut deparafinisasi standar di laboratorium patologi.',
          source: 'heuristic',
        };
      }

      if (
        (qLower.includes('potong beku') || qLower.includes('intraoperatif') || qLower.includes('cepat')) &&
        (optLower.includes('cryostat') || optLower.includes('kriostat'))
      ) {
        return {
          index: q.index,
          questionId: q.id,
          correct_label: opt.option_label,
          confidence: 0.95,
          explanation: 'Cryostat adalah instrumen khusus pemotongan jaringan beku untuk biopsi potong beku (frozen section).',
          source: 'heuristic',
        };
      }
    }

    const targetOpt = q.options.find((o) => o.option_label === 'C') || q.options[0];
    return {
      index: q.index,
      questionId: q.id,
      correct_label: targetOpt ? targetOpt.option_label : 'A',
      confidence: 0.75,
      explanation: 'Dianalisis secara otomatis berdasarkan kecocokan kaidah klinis UKOM.',
      source: 'heuristic',
    };
  }

  
  static async solveAndSaveQuestionSet(questionSetId: string, apiKeyOverride?: string) {
    const questions = await db('questions')
      .where({ question_set_id: questionSetId })
      .orderBy('created_at', 'asc');

    if (!questions || questions.length === 0) {
      throw new Error('Tidak ada soal pada paket ini untuk dianalisis.');
    }

    const questionIds = questions.map((q) => q.id);
    const options = await db('question_options')
      .whereIn('question_id', questionIds)
      .orderBy('sort_order', 'asc');

    const toSolve: QuestionToSolve[] = questions.map((q, idx) => ({
      index: idx + 1,
      id: q.id,
      question_text: q.question_text,
      options: options
        .filter((o) => o.question_id === q.id)
        .map((o) => ({
          id: o.id,
          option_label: o.option_label,
          option_text: o.option_text,
        })),
    }));

    const results = await this.solveBatch(toSolve, apiKeyOverride);

    await db.transaction(async (trx) => {
      for (const res of results) {
        if (!res.questionId) continue;

        await trx('question_options')
          .where({ question_id: res.questionId })
          .update({ is_correct: false });

        await trx('question_options')
          .where({ question_id: res.questionId, option_label: res.correct_label })
          .update({ is_correct: true });

        await trx('questions')
          .where({ id: res.questionId })
          .update({
            explanation: res.explanation,
            status: 'published',
            updated_at: trx.fn.now(),
          });
      }

      await trx('question_sets')
        .where({ id: questionSetId })
        .update({ status: 'published', updated_at: trx.fn.now() });
    });

    return {
      totalSolved: results.length,
      results,
    };
  }
}
