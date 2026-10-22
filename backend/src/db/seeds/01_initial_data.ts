import type { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  
  await knex('player_session_results').del();
  await knex('game_answers').del();
  await knex('game_session_questions').del();
  await knex('game_sessions').del();
  await knex('room_participants').del();
  await knex('multiplayer_rooms').del();
  await knex('import_jobs').del();
  await knex('question_options').del();
  await knex('questions').del();
  await knex('question_sets').del();
  await knex('categories').del();
  await knex('users').del();

  
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  const studentHash = await bcrypt.hash('User123!', 10);

  const [adminUser] = await knex('users')
    .insert([
      {
        name: 'Administrator UKOM',
        email: 'admin@ukomquiz.id',
        password_hash: passwordHash,
        role: 'admin',
      },
      {
        name: 'Budi Santoso',
        email: 'budi@ukomquiz.id',
        password_hash: studentHash,
        role: 'user',
      },
    ])
    .returning('*');

  
  const categories = await knex('categories')
    .insert([
      {
        name: 'Keperawatan Medikal Bedah (KMB)',
        slug: 'keperawatan-medikal-bedah',
        description: 'Soal-soal Uji Kompetensi Keperawatan mencakup sistem kardiovaskular, pernapasan, pencernaan, dan saraf.',
      },
      {
        name: 'Keperawatan Gawat Darurat (KGD)',
        slug: 'keperawatan-gawat-darurat',
        description: 'Triage, resusitasi jantung paru, penanganan trauma akut, dan kegawatdaruratan klinis.',
      },
      {
        name: 'Keperawatan Maternitas',
        slug: 'keperawatan-maternitas',
        description: 'Asuhan keperawatan antenatal, intranatal, postnatal, dan kesehatan reproduksi.',
      },
    ])
    .returning('*');

  const kmbCat = categories[0];
  const kgdCat = categories[1];

  
  const [kmbSet] = await knex('question_sets')
    .insert([
      {
        category_id: kmbCat.id,
        title: 'Paket Latihan KMB: Sistem Kardiovaskular & Respirasi',
        description: 'Paket latihan soal UKOM fokus diagnosis keperawatan dan tindakan prioritas pada gangguan respirasi dan kardiovaskular.',
        status: 'published',
      },
    ])
    .returning('*');

  const [kgdSet] = await knex('question_sets')
    .insert([
      {
        category_id: kgdCat.id,
        title: 'Paket Latihan KGD: Triage & Manajemen Trauma',
        description: 'Latihan soal studi kasus gawat darurat, evaluasi airway breathing circulation, dan resusitasi.',
        status: 'published',
      },
    ])
    .returning('*');

  
  const [q1] = await knex('questions')
    .insert([
      {
        category_id: kmbCat.id,
        question_set_id: kmbSet.id,
        question_text:
          'Seorang laki-laki berusia 54 tahun dirawat di ruang rawat inap dengan keluhan sesak napas yang memberat sejak 2 hari lalu. Hasil pemeriksaan fisik: RR 28x/menit, terdengar ronkhi basah halus pada kedua basal paru, edema pretibial (+/+), JVP meningkat 5+3 cmH2O. TD 150/90 mmHg, HR 96x/menit. Apakah tindakan keperawatan mandiri prioritas pertama yang harus segera dilakukan?',
        explanation:
          'Posisi semi-fowler atau high-fowler membantu menurunkan beban preload jantung melalui pooling darah vena di ekstremitas bawah serta memaksimalkan ekspansi rongga paru, sehingga meringankan sesak napas pada pasien gagal jantung kongestif dengan edema paru.',
        difficulty: 'medium',
        status: 'published',
      },
    ])
    .returning('*');

  await knex('question_options').insert([
    { question_id: q1.id, option_label: 'A', option_text: 'Mengatur posisi pasien semi-fowler atau fowler tinggi', is_correct: true, sort_order: 1 },
    { question_id: q1.id, option_label: 'B', option_text: 'Memberikan kompres hangat pada kedua ekstremitas bawah', is_correct: false, sort_order: 2 },
    { question_id: q1.id, option_label: 'C', option_text: 'Membatasi asupan cairan total hingga 500 ml/hari', is_correct: false, sort_order: 3 },
    { question_id: q1.id, option_label: 'D', option_text: 'Melakukan fisioterapi dada dan postural drainage', is_correct: false, sort_order: 4 },
    { question_id: q1.id, option_label: 'E', option_text: 'Menganjurkan tirah baring posisi terlentang datar', is_correct: false, sort_order: 5 },
  ]);

  
  const [q2] = await knex('questions')
    .insert([
      {
        category_id: kmbCat.id,
        question_set_id: kmbSet.id,
        question_text:
          'Seorang perempuan berusia 48 tahun datang ke poli penyakit dalam dengan keluhan batuk berdahak sudah 3 minggu, berkeringat di malam hari tanpa aktivitas, dan penurunan berat badan 4 kg dalam sebulan. Hasil pemeriksaan sputum BTA (+). Pasien akan memulai pengobatan OAT kategori 1. Apakah edukasi utama perawat untuk mencegah resistensi obat (MDR-TB)?',
        explanation:
          'Kepatuhan minum obat OAT tanpa terputus selama minimal 6 bulan adalah kunci utama mencegah terjadinya resistensi kuman Mycobacterium tuberculosis (MDR-TB). Evaluasi keteraturan melalui Pengawas Menelan Obat (PMO) sangat dianjurkan.',
        difficulty: 'easy',
        status: 'published',
      },
    ])
    .returning('*');

  await knex('question_options').insert([
    { question_id: q2.id, option_label: 'A', option_text: 'Menghentikan konsumsi obat apabila keluhan batuk sudah berkurang', is_correct: false, sort_order: 1 },
    { question_id: q2.id, option_label: 'B', option_text: 'Meminum obat secara teratur dan tuntas selama periode yang ditentukan dokter', is_correct: true, sort_order: 2 },
    { question_id: q2.id, option_label: 'C', option_text: 'Menghindari konsumsi makanan tinggi protein hewani selama terapi', is_correct: false, sort_order: 3 },
    { question_id: q2.id, option_label: 'D', option_text: 'Mengurangi dosis obat jika timbul perubahan warna urine menjadi kemerahan', is_correct: false, sort_order: 4 },
    { question_id: q2.id, option_label: 'E', option_text: 'Melakukan isolasi mandiri total di dalam kamar tertutup selama 6 bulan', is_correct: false, sort_order: 5 },
  ]);

  
  const [q3] = await knex('questions')
    .insert([
      {
        category_id: kmbCat.id,
        question_set_id: kmbSet.id,
        question_text:
          'Seorang laki-laki 62 tahun dirawat dengan post-stroke iskemik hari ke-3. Pasien mengalami hemiparesis dekstra dan disfagia ringan. Saat perawat hendak memberikan obat oral, tindakan apakah yang paling tepat untuk mencegah aspirasi pulmonal?',
        explanation:
          'Pada pasien dengan gangguan menelan (disfagia), posisi duduk tegak 90 derajat dengan kepala sedikit menunduk (chin-tuck maneuver) membantu menutup jalan napas (laring) dan mengarahkan bolus makanan/obat ke esofagus, sehingga mencegah aspirasi.',
        difficulty: 'medium',
        status: 'published',
      },
    ])
    .returning('*');

  await knex('question_options').insert([
    { question_id: q3.id, option_label: 'A', option_text: 'Memberikan obat dalam posisi berbaring telentang dengan bantal tipis', is_correct: false, sort_order: 1 },
    { question_id: q3.id, option_label: 'B', option_text: 'Memposisikan pasien duduk tegak dengan kepala fleksi ringan (chin-tuck)', is_correct: true, sort_order: 2 },
    { question_id: q3.id, option_label: 'C', option_text: 'Mencampur obat dengan air mineral dalam volume besar', is_correct: false, sort_order: 3 },
    { question_id: q3.id, option_label: 'D', option_text: 'Memberikan obat melalui sedotan secara cepat', is_correct: false, sort_order: 4 },
    { question_id: q3.id, option_label: 'E', option_text: 'Meminta pasien menengadahkan leher ke belakang saat menelan', is_correct: false, sort_order: 5 },
  ]);

  
  const [q4] = await knex('questions')
    .insert([
      {
        category_id: kgdCat.id,
        question_set_id: kgdSet.id,
        question_text:
          'Di IGD rumah sakit terjadi insiden kecelakaan bus massal. Seorang korban laki-laki 35 tahun ditemukan bernapas spontan dengan frekuensi 34x/menit, capillary refill time > 2 detik, dan tidak mampu mengikuti perintah sederhana. Berdasarkan metode triage START, kategori pita warna apakah yang harus diberikan?',
        explanation:
          'Pada triage START, korban dewasa yang bernapas spontan tetapi frekuensi napas > 30x/menit ATAU CRT > 2 detik ATAU tidak mampu mematuhi perintah diklasifikasikan ke dalam kategori Merah (Immediate / Prioritas 1).',
        difficulty: 'medium',
        status: 'published',
      },
    ])
    .returning('*');

  await knex('question_options').insert([
    { question_id: q4.id, option_label: 'A', option_text: 'Hijau (Minor)', is_correct: false, sort_order: 1 },
    { question_id: q4.id, option_label: 'B', option_text: 'Kuning (Delayed)', is_correct: false, sort_order: 2 },
    { question_id: q4.id, option_label: 'C', option_text: 'Merah (Immediate)', is_correct: true, sort_order: 3 },
    { question_id: q4.id, option_label: 'D', option_text: 'Hitam (Expectant / Deceased)', is_correct: false, sort_order: 4 },
    { question_id: q4.id, option_label: 'E', option_text: 'Putih (Dismissed)', is_correct: false, sort_order: 5 },
  ]);

  
  const [q5] = await knex('questions')
    .insert([
      {
        category_id: kgdCat.id,
        question_set_id: kgdSet.id,
        question_text:
          'Seorang laki-laki 40 tahun korban kecelakaan lalu lintas dibawa ke IGD dalam kondisi tidak sadar. Pasien dicurigai mengalami trauma servikal. Tampak adanya lendir dan suara gurgling pada jalan napas. Apakah tindakan pertama yang harus dilakukan untuk membebaskan jalan napas pasien?',
        explanation:
          'Pada pasien curiga fraktur servikal yang mengalami sumbatan jalan napas cair (gurgling), lakukan suction (pengisapan lendir) sambil mempertahankan stabilisasi leher segaris tanpa hiperekstensi leher (gunakan teknik jaw thrust, bukan head tilt chin lift).',
        difficulty: 'hard',
        status: 'published',
      },
    ])
    .returning('*');

  await knex('question_options').insert([
    { question_id: q5.id, option_label: 'A', option_text: 'Head-tilt dan chin-lift manuver', is_correct: false, sort_order: 1 },
    { question_id: q5.id, option_label: 'B', option_text: 'Pemberian oksigen masker non-rebreathing 12 L/menit', is_correct: false, sort_order: 2 },
    { question_id: q5.id, option_label: 'C', option_text: 'Suction cairan sekret dan manuver jaw-thrust dengan stabilisasi manual inline', is_correct: true, sort_order: 3 },
    { question_id: q5.id, option_label: 'D', option_text: 'Memasang bantal tebal di bawah kepala pasien', is_correct: false, sort_order: 4 },
    { question_id: q5.id, option_label: 'E', option_text: 'Memiringkan seluruh tubuh pasien ke sisi kiri tanpa fiksasi', is_correct: false, sort_order: 5 },
  ]);
}
