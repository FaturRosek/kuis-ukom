import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ImportParserService } from '../services/importParserService.js';
import { QuestionService } from '../services/questionService.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
});

router.post('/upload', upload.single('document'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah.' });
    }

    const { originalname, mimetype, buffer } = req.file;

    
    const allowed = ['.docx', '.pdf'];
    const hasValidExt = allowed.some((ext) => originalname.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      return res.status(400).json({
        success: false,
        message: 'Format file tidak diizinkan. Harap unggah dokumen berekstensi .docx atau .pdf.',
      });
    }

    const parseResult = await ImportParserService.parseFile(buffer, originalname, mimetype);

    if (parseResult.errors.length > 0 && parseResult.questions.length === 0) {
      return res.status(422).json({
        success: false,
        message: parseResult.errors.join('; '),
        errors: parseResult.errors,
      });
    }

    const validCount = parseResult.questions.filter((q) => q.hasValidKey && q.warnings.length === 0).length;
    const warningCount = parseResult.questions.length - validCount;

    res.json({
      success: true,
      data: {
        fileName: originalname,
        totalQuestions: parseResult.questions.length,
        validCount,
        warningCount,
        questions: parseResult.questions,
        errors: parseResult.errors,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/save', async (req: Request, res: Response) => {
  try {
    const { questionSetId, categoryId, questions, status } = req.body;

    if (!questionSetId || !categoryId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Paket soal, kategori, dan daftar soal wajib ditentukan.',
      });
    }

    
    if (status === 'published') {
      for (const q of questions) {
        const hasKey = q.options && q.options.some((o: any) => !!o.isCorrect);
        if (!hasKey) {
          return res.status(400).json({
            success: false,
            message: `Soal #${q.questionNumber || 'tanpa nomor'} belum memiliki kunci jawaban yang valid. Periksa kembali atau simpan sebagai draft.`,
          });
        }
      }
    }

    const savedCount = await QuestionService.bulkSave(
      questionSetId,
      categoryId,
      questions.map((q: any) => ({
        questionText: q.questionText,
        explanation: q.explanation,
        status: status || 'draft',
        options: q.options.map((opt: any) => ({
          label: opt.label,
          text: opt.text,
          isCorrect: !!opt.isCorrect,
        })),
      }))
    );

    res.json({
      success: true,
      message: `Berhasil menyimpan ${savedCount} soal ke dalam bank soal.`,
      savedCount,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
