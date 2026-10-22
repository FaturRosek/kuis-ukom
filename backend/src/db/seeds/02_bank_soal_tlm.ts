import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  
  const categoriesData = [
    {
      name: 'Sitohistoteknologi',
      slug: 'sitohistoteknologi',
      description: 'Pemrosesan jaringan histopatologi, pewarnaan HE & sitologi, mikrotomi, dan jaminan mutu laboratorium patologi anatomik.',
    },
    {
      name: 'Kimia Klinik',
      slug: 'kimia-klinik',
      description: 'Pemeriksaan analitik kimia klinik, profil lipid, kontrol kualitas Westgard, urinalisis, dan cairan tubuh.',
    },
    {
      name: 'Toksikologi Klinik',
      slug: 'toksikologi-klinik',
      description: 'Pemeriksaan toksikologi bahan biologis: NAPZA, pestisida, logam berat (timbal, merkuri, arsen), dan senyawa volatil.',
    },
    {
      name: 'Parasitologi',
      slug: 'parasitologi',
      description: 'Identifikasi helmintes, protozoa usus dan darah, serta mikologi klinik pada spesimen medis.',
    },
  ];

  for (const cat of categoriesData) {
    const existing = await knex('categories').where('slug', cat.slug).first();
    if (!existing) {
      await knex('categories').insert(cat);
    }
  }

  const allCategories = await knex('categories').select('*');
  const catMap = new Map(allCategories.map((c) => [c.slug, c.id]));

  const questionSetsData = [
  {
    "title": "Bank_Soal_UKOMNAS_D3_TLM_Sitohistoteknologi_Analisa_AAKDHG",
    "category_slug": "sitohistoteknologi",
    "category_name": "Sitohistoteknologi",
    "description": "50 Soal Kasus UKOMNAS D3 TLM Sitohistoteknologi: Fiksasi, Processing, Mikrotomi, Sitologi, QA/QC, dan K3 Laboratorium Patologi Anatomi.",
    "questions": [
      {
        "question_text": "Seorang TLM menerima spesimen biopsi lambung berukuran 1 × 1 × 0,5 cm. Spesimen akan diproses untuk pemeriksaan histopatologi rutin dengan pewarnaan Hematoksilin-Eosin (HE). TLM harus segera memasukkan jaringan ke dalam larutan fiksatif agar morfologi sel dan jaringan tetap terpelihara. Larutan fiksatif yang paling tepat digunakan adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Etanol 70%",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Metanol absolut",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Neutral Buffered Formalin 10%",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Xilena",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Parafin cair",
            "is_correct": false
          }
        ],
        "explanation": "Neutral Buffered Formalin (NBF) 10% adalah larutan fiksatif standar baku emas untuk pemeriksaan histopatologi rutin dengan pewarnaan HE.",
        "difficulty": "medium"
      },
      {
        "question_text": "Sebuah jaringan hasil operasi berukuran besar diterima laboratorium. Setelah difiksasi, bagian tengah jaringan menunjukkan autolisis sedangkan bagian perifer terfiksasi dengan baik. Kesalahan preanalitik yang paling mungkin menyebabkan kondisi tersebut adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Jaringan dipotong terlalu tipis",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Jaringan terlalu tebal saat difiksasi",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Konsentrasi parafin terlalu tinggi",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Suhu water bath terlalu rendah",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Waktu pewarnaan eosin terlalu singkat",
            "is_correct": false
          }
        ],
        "explanation": "Ketebalan jaringan yang berlebihan menghambat penetrasi formalin ke bagian tengah jaringan, menyebabkan autolisis di bagian dalam sementara perifer terfiksasi baik.",
        "difficulty": "medium"
      },
      {
        "question_text": "Setelah proses fiksasi selesai, seorang TLM melakukan trimming sebelum jaringan dimasukkan ke dalam kaset jaringan. Tujuan utama trimming adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Menghilangkan air dari jaringan",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Membuat jaringan menjadi transparan",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Mendapatkan bagian jaringan representatif dengan ukuran sesuai untuk processing",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Menggantikan xilena dengan parafin",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Mewarnai inti jaringan",
            "is_correct": false
          }
        ],
        "explanation": "Tujuan trimming (pemotongan kasar) adalah memilih bagian jaringan representatif dengan ketebalan optimal (sekitar 3–4 mm) agar muat dalam kaset dan terproses sempurna.",
        "difficulty": "medium"
      },
      {
        "question_text": "Jaringan yang telah selesai difiksasi akan memasuki tahap tissue processing. TLM memasukkan jaringan secara berurutan ke dalam alkohol 70%, 80%, 90%, 95%, dan absolut. Tujuan prosedur tersebut adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Mengeluarkan parafin",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Menghilangkan air jaringan secara bertahap",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Menjernihkan jaringan",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Melunakkan jaringan",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Memberikan warna pada sitoplasma",
            "is_correct": false
          }
        ],
        "explanation": "Dehidrasi dengan alkohol bertingkat konsentrasi meningkat (70% hingga absolut) bertujuan mengeluarkan air dari jaringan secara bertahap tanpa menyebabkan penyusutan mendadak.",
        "difficulty": "medium"
      },
      {
        "question_text": "Setelah dehidrasi dengan alkohol absolut selesai, jaringan dimasukkan ke dalam xilena. Fungsi utama xilena pada tahap tersebut adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Fiksasi",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Dekalsifikasi",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Clearing",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Pewarnaan",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Mounting",
            "is_correct": false
          }
        ],
        "explanation": "Xilena berfungsi sebagai zat clearing (penjernih/perantara) yang larut dalam alkohol dehidrasi sekaligus larut dalam parafin infiltrasi.",
        "difficulty": "medium"
      },
      {
        "question_text": "Setelah infiltrasi parafin selesai, TLM menempatkan jaringan ke dalam cetakan berisi parafin cair. Saat melakukan orientasi, permukaan jaringan yang harus diperiksa justru diletakkan menjauhi bidang pemotongan. Apakah dampak utama kesalahan tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Jaringan tidak terfiksasi",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Bagian diagnostik tidak segera terpotong saat sectioning",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Hematoksilin tidak mewarnai inti",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Eosin menjadi terlalu gelap",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Xilena tidak dapat menghilangkan alkohol",
            "is_correct": false
          }
        ],
        "explanation": "Orientasi jaringan yang salah saat embedding menyebabkan permukaan diagnostik tidak segera terpotong saat perataan (trimming) dan sectioning mikrotom.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang TLM melakukan pemotongan blok parafin menggunakan mikrotom untuk menghasilkan preparat histologi rutin. Ketebalan irisan yang paling sesuai adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "0,1–0,5 μm",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "3–5 μm",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "15–20 μm",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "30–40 μm",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "50–100 μm",
            "is_correct": false
          }
        ],
        "explanation": "Ketebalan pemotongan standar untuk jaringan blok parafin pada pemeriksaan histopatologi rutin HE adalah 3–5 mikrometer.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pita jaringan hasil mikrotomi menunjukkan sedikit kerutan. TLM kemudian mengapungkan section pada water bath sebelum mengambilnya menggunakan kaca objek. Tujuan utama tindakan tersebut adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Melakukan dehidrasi",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Menghilangkan formalin",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Meratakan lipatan/kerutan section",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Menghilangkan parafin seluruhnya",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Mewarnai jaringan",
            "is_correct": false
          }
        ],
        "explanation": "Water bath bersuhu sekitar 40–45°C digunakan untuk meregangkan pita parafin dan meratakan kerutan/lipatan section sebelum ditempelkan pada kaca objek.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada pewarnaan Hematoksilin-Eosin, seorang mahasiswa ditanya mengenai struktur yang terutama diwarnai oleh hematoksilin. Struktur tersebut adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Kolagen",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Sitoplasma",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Eritrosit",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Inti sel",
            "is_correct": true
          },
          {
            "option_label": "E",
            "option_text": "Serabut otot",
            "is_correct": false
          }
        ],
        "explanation": "Hematoksilin adalah pewarna basa yang memiliki afinitas terhadap gugus asam nukleat sehingga mewarnai inti sel menjadi biru/ungu.",
        "difficulty": "medium"
      },
      {
        "question_text": "Setelah pewarnaan HE selesai, preparat didehidrasi, dijernihkan, kemudian diberi mounting medium dan ditutup menggunakan cover glass. Tujuan utama mounting adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Memfiksasi jaringan",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Menghilangkan kalsium",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Melindungi preparat dan mempertahankannya untuk pengamatan jangka panjang",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Menghilangkan parafin sebelum staining",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Memperbesar ukuran inti",
            "is_correct": false
          }
        ],
        "explanation": "Tahap mounting dengan resin sintetis dan cover glass bertujuan melindungi irisan jaringan dari kerusakan mekanis/oksidasi serta mempertahankan sediaan untuk evaluasi mikroskopis jangka panjang.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang TLM menerima sampel aspirasi massa payudara untuk pemeriksaan sitologi. Sampel diletakkan pada kaca objek kemudian dibuat apusan menggunakan kaca objek kedua. Tindakan berikutnya yang paling penting untuk preparat yang akan diwarnai Papanicolaou adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Membiarkan preparat kering di udara",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Segera melakukan fiksasi basah dalam etanol 95%",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Memasukkan ke xilena",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Memasukkan ke formalin 10%",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Memanaskan preparat",
            "is_correct": false
          }
        ],
        "explanation": "Preparat sitologi yang akan diwarnai Papanicolaou harus segera difiksasi basah (wet fixation) dalam alkohol 95% selagi masih lembap agar tidak terjadi air drying artifact.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang TLM membuat dua preparat aspirasi. Preparat pertama akan diwarnai Papanicolaou, sedangkan preparat kedua menggunakan May-Grünwald-Giemsa (MGG). Teknik fiksasi yang tepat adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Keduanya harus wet fixation",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Keduanya harus dikeringkan udara",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Pap → wet fixation; MGG → air dried",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Pap → air dried; MGG → formalin",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Pap → formalin; MGG → xilena",
            "is_correct": false
          }
        ],
        "explanation": "Pewarnaan Papanicolaou memerlukan wet fixation dalam etanol 95%, sedangkan May-Grünwald-Giemsa (MGG) memerlukan sediaan yang dikeringkan di udara (air-dried).",
        "difficulty": "medium"
      },
      {
        "question_text": "Apusan sitologi dibuat terlalu tebal sehingga sel saling bertumpuk dan morfologi inti sulit dievaluasi. Tindakan pencegahan yang paling tepat adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Memperpanjang pewarnaan hematoksilin",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Menggunakan jumlah sampel yang sesuai dan membuat apusan merata",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Menambah eosin",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Memperpanjang clearing",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Meningkatkan suhu fiksasi",
            "is_correct": false
          }
        ],
        "explanation": "Untuk mencegah tumpukan sel yang tebal pada apusan sitologi, gunakan volume spesimen yang sesuai dan lakukan teknik apusan merata dengan sudut yang tepat.",
        "difficulty": "medium"
      },
      {
        "question_text": "Preparat Pap smear terlambat dimasukkan ke dalam etanol. Pada mikroskop tampak sel membesar, batas sel tidak jelas, dan detail kromatin terganggu. Artefak tersebut disebut....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Chatter artifact",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Floaters",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Air-drying artifact",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Formalin pigment",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Knife line",
            "is_correct": false
          }
        ],
        "explanation": "Pengeringan apusan di udara sebelum fiksasi basah Papanicolaou menimbulkan air-drying artifact (sel membesar, kromatin kabur, sitoplasma rusak).",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada pewarnaan Papanicolaou, pewarna yang terutama memberikan detail inti adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Eosin Y",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Orange G",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Hematoksilin",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Light Green SF",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Xilena",
            "is_correct": false
          }
        ],
        "explanation": "Pada metode pewarnaan Papanicolaou, hematoksilin Harris digunakan untuk mewarnai inti sel dan memperlihatkan detail kromatin secara jelas.",
        "difficulty": "medium"
      },
      {
        "question_text": "Dalam pewarnaan Papanicolaou digunakan Orange G (OG-6). Komponen tersebut terutama berfungsi untuk mewarnai....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Nukleus",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Sel keratinisasi secara oranye",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "DNA menjadi biru",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Mukus menjadi hitam",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Bakteri menjadi ungu",
            "is_correct": false
          }
        ],
        "explanation": "Orange G (OG-6) pada pewarnaan Papanicolaou adalah pewarna sitoplasma yang secara spesifik mewarnai sel yang mengalami keratinisasi menjadi kuning/oranye terang.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada pewarnaan Papanicolaou digunakan EA (Eosin Azure). Komponen tersebut berperan terutama dalam memberikan....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Diferensiasi warna sitoplasma",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Warna hitam pada inti",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Dekalsifikasi",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Fiksasi jaringan",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Clearing",
            "is_correct": false
          }
        ],
        "explanation": "Eosin Azure (EA) merupakan pewarna counterstain polikromik yang membedakan sel skuamosa superfisial (merah muda) dari sel intermediet/parabasal (hijau kebiruan).",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang TLM menerima sputum untuk pemeriksaan sitologi sel ganas. Sampel sangat kental dan banyak mengandung mukus sehingga sel sulit tersebar. Prinsip pengolahan yang paling tepat adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Membuat apusan representatif dari bagian yang mengandung material seluler",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Membuang seluruh bagian yang berlendir",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Menambahkan parafin langsung",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Menambahkan xilena sebelum apusan",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Membiarkan sampel selama 24 jam tanpa fiksasi",
            "is_correct": false
          }
        ],
        "explanation": "Sputum kental berlendir diolah dengan memilih bagian mukoid atau bercak darah/seluler representatif menggunakan ose/kaca objek agar diperoleh kepadatan sel yang diagnostik.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada saat membuat apusan aspirasi, TLM menekan kedua kaca objek terlalu kuat. Setelah pewarnaan ditemukan banyak sel pecah dan inti memanjang. Penyebab artefak tersebut adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Fiksasi berlebihan",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Tekanan mekanis berlebihan saat membuat apusan",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Clearing terlalu lama",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Eosin terlalu pekat",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Parafin terlalu dingin",
            "is_correct": false
          }
        ],
        "explanation": "Tekanan berlebih saat mempreparasi apusan sitologi menyebabkan sel pecah, terdistorsi, dan memanjang (crush artifact).",
        "difficulty": "medium"
      },
      {
        "question_text": "Preparat sitologi cair memiliki jumlah sel sangat sedikit. Laboratorium ingin memusatkan sel pada area kecil kaca objek sebelum dilakukan pewarnaan. Metode yang paling sesuai adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Mikrotomi",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Cytocentrifugation",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Embedding langsung",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Kato-Katz",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Flotasi",
            "is_correct": false
          }
        ],
        "explanation": "Cytocentrifugation (sitospin) adalah metode konsentrasi sel terbaik untuk cairan tubuh hiposeluler (cairan pleura, asites, CSS) agar sel terkumpul pada area sempit kaca objek.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada preparat HE yang berkualitas baik, inti sel seharusnya tampak....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Merah terang",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Kuning",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Biru hingga ungu",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Hijau",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Tidak berwarna",
            "is_correct": false
          }
        ],
        "explanation": "Kualitas HE yang baik ditandai dengan inti sel yang terwarnai kontras biru tua hingga ungu tajam, berpadu harmonis dengan sitoplasma merah muda.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada preparat HE ditemukan seluruh inti berwarna sangat pucat sehingga detail kromatin sulit dinilai, sedangkan sitoplasma tampak baik. Penyebab paling mungkin adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Hematoksilin kurang adekuat",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Eosin terlalu lama",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Parafin terlalu panas",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Mounting medium terlalu banyak",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Cover glass terlalu tipis",
            "is_correct": false
          }
        ],
        "explanation": "Inti sel yang tampak sangat pucat pada HE disebabkan oleh hematoksilin yang belum matang/kedaluwarsa, waktu inkubasi hematoksilin terlalu singkat, atau diferensiasi asam alkohol berlebihan.",
        "difficulty": "medium"
      },
      {
        "question_text": "Setelah pewarnaan HE, inti sel tampak terlalu gelap dan hampir seluruh struktur nuklear tertutup. Penyebab yang paling mungkin adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Overstaining hematoksilin atau diferensiasi tidak adekuat",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Eosin terlalu singkat",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Clearing terlalu lama",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Dehidrasi kurang",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Parafin terlalu dingin",
            "is_correct": false
          }
        ],
        "explanation": "Inti sel yang terlalu gelap dan pekat disebabkan oleh overstaining hematoksilin atau diferensiasi asam alkohol yang tidak adekuat.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada preparat HE ditemukan daerah putih kosong dan tidak terwarnai di beberapa bagian jaringan. Pemeriksaan menunjukkan parafin masih tertinggal pada area tersebut. Tahap yang kemungkinan tidak adekuat adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Fiksasi",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Deparafinisasi",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Bluing",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Counterstaining",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Mounting",
            "is_correct": false
          }
        ],
        "explanation": "Daerah kosong tidak terwarnai pada sediaan parafin disebabkan oleh deparafinisasi dengan xilena yang belum sempurna sehingga pewarna berbasis air tidak dapat menembus jaringan.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada preparat HE tampak sitoplasma sangat merah dan detail jaringan menjadi sulit dibedakan. Kesalahan yang paling mungkin adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Eosin overstaining",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Hematoksilin understaining",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Fiksasi kurang",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Trimming terlalu tipis",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Mounting terlalu cepat",
            "is_correct": false
          }
        ],
        "explanation": "Sitoplasma yang sangat merah pekat hingga mengaburkan detail struktur jaringan disebabkan oleh overstaining larutan eosin atau pencucian alkohol diferensiasi yang kurang.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada preparat Papanicolaou, inti tampak tajam dengan kromatin jelas dan sitoplasma menunjukkan variasi warna transparan. Penilaian terhadap hasil tersebut adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Pewarnaan tidak adekuat",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Preparat mengalami autolisis",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Pewarnaan baik",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Terjadi air-drying artifact berat",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Terjadi crush artifact",
            "is_correct": false
          }
        ],
        "explanation": "Inti tajam dengan struktur kromatin jelas dan sitoplasma dengan transparansi serta variasi warna yang baik menunjukkan kualitas pewarnaan yang berhasil secara optimal.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada Pap smear ditemukan sel-sel membesar, detail kromatin kabur, dan sitoplasma kehilangan transparansi. Riwayat menunjukkan preparat dibiarkan di meja sebelum dimasukkan ke etanol. Penyebabnya adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Formalin pigment",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Air-drying artifact",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Overdehydration",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Knife artifact",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Floaters",
            "is_correct": false
          }
        ],
        "explanation": "Membiarkan apusan mengering sebelum fiksasi alkohol memicu air-drying artifact yang ditandai dengan distorsi morfologi sel dan kekaburan inti.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada preparat histologi ditemukan garis-garis sejajar yang melewati seluruh section. Masalah tersebut paling mungkin berhubungan dengan....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Mata pisau mikrotom rusak/kotor",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Hematoksilin terlalu pekat",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Formalin terlalu encer",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Eosin terlalu lama",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Mounting medium terlalu banyak",
            "is_correct": false
          }
        ],
        "explanation": "Garis-garis lurus sejajar (knife lines) sepanjang arah pemotongan mikrotom disebabkan oleh mata pisau mikrotom yang gompal, tergores, atau terdapat kotoran keras pada bilah pisau.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada section jaringan tampak pola pita tebal-tipis secara berulang menyerupai venetian blind. Artefak tersebut dikenal sebagai....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Floaters",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Chatter",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Air-drying",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Formalin pigment",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Crush artifact",
            "is_correct": false
          }
        ],
        "explanation": "Chatter adalah artefak pemotongan mikrotom berupa garis tebal-tipis berulang menyerupai tirai venetian akibat getaran mikrotom, pisau longgar, atau jaringan terlalu keras.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada preparat ditemukan fragmen jaringan kecil yang secara morfologis tidak sesuai dengan jaringan pasien dan diduga berasal dari blok lain. Artefak tersebut disebut....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Chatter",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Floaters",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Folding",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Crushing",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Air drying",
            "is_correct": false
          }
        ],
        "explanation": "Floaters adalah kontaminasi serpihan jaringan dari blok atau pasien lain yang menempel pada sediaan karena water bath atau alat penampung tidak dibersihkan dengan baik.",
        "difficulty": "medium"
      },
      {
        "question_text": "Jaringan hasil processing menjadi sangat keras, rapuh, dan sulit dipotong dengan mikrotom. Riwayat processing menunjukkan jaringan terlalu lama berada dalam alkohol absolut. Penyebab paling mungkin adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Underfixation",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Overdehydration",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Understaining",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Incomplete clearing",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Air drying",
            "is_correct": false
          }
        ],
        "explanation": "Jaringan yang terlalu lama direndam dalam alkohol absolut mengalami dehidrasi berlebihan (overdehydration) sehingga menjadi keras, getas, rapuh, dan pecah saat dipotong.",
        "difficulty": "medium"
      },
      {
        "question_text": "Setelah tissue processing, blok parafin tampak lunak dan sulit menghasilkan ribbon yang baik. Diduga masih terdapat xilena dalam jaringan akibat penggantian dengan parafin tidak adekuat. Tahap yang mengalami masalah adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Fiksasi",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Dehidrasi",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Infiltrasi",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Staining",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Mounting",
            "is_correct": false
          }
        ],
        "explanation": "Blok parafin yang lunak dan berbau xilena menandakan proses infiltrasi/impregnasi parafin cair tidak adekuat sehingga xilena masih tertahan di dalam jaringan.",
        "difficulty": "medium"
      },
      {
        "question_text": "Saat mikrotomi, section tidak membentuk ribbon dan setiap irisan terpisah. Faktor yang paling perlu diperiksa adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Kondisi blok, blade, dan sudut pemotongan",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Konsentrasi hematoksilin",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "pH eosin saja",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Konsentrasi formalin saja",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Warna kaset jaringan",
            "is_correct": false
          }
        ],
        "explanation": "Kegagalan pembentukan pita parafin (ribbon) saat mikrotomi terutama dipengaruhi oleh sudut potong pisau (clearance angle), suhu blok parafin, ketajaman blade, dan kebersihan mikrotom.",
        "difficulty": "medium"
      },
      {
        "question_text": "Section yang diletakkan pada water bath mengalami ekspansi berlebihan dan sebagian struktur tampak rusak. Penyebab paling mungkin adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Water bath terlalu panas",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Water bath terlalu dingin",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Hematoksilin terlalu encer",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Eosin terlalu pekat",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Formalin terlalu sedikit",
            "is_correct": false
          }
        ],
        "explanation": "Suhu water bath yang terlalu panas (>45°C) menyebabkan parafin mencair terlalu cepat dan ekspansi berlebihan sehingga struktur jaringan terurai dan rusak.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada proses HE, preparat setelah hematoksilin dan diferensiasi masih menunjukkan inti berwarna kemerahan, bukan biru. Tahap yang perlu dievaluasi adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Bluing",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Embedding",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Clearing sebelum infiltrasi",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Trimming",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Grossing",
            "is_correct": false
          }
        ],
        "explanation": "Setelah diferensiasi asam alkohol, inti sel berwarna kemerahan. Tahap bluing (dengan air ledeng alkalis, larutan Scott, atau amonia encer) diperlukan untuk mengubah warna inti menjadi biru stabil.",
        "difficulty": "medium"
      },
      {
        "question_text": "Setelah mounting ditemukan banyak gelembung udara di bawah cover glass sehingga mengganggu pengamatan mikroskopis. Tindakan pencegahan terbaik adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Memastikan teknik pemasangan cover glass dan jumlah mounting medium sesuai",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Memperpanjang fiksasi formalin",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Mempertebal section",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Memperlama hematoksilin",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Menurunkan konsentrasi alkohol saat fiksasi",
            "is_correct": false
          }
        ],
        "explanation": "Gelembung udara di bawah cover glass dicegah dengan menambahkan jumlah media mounting yang cukup dan menurunkan cover glass secara perlahan dengan sudut 45 derajat.",
        "difficulty": "medium"
      },
      {
        "question_text": "Laboratorium akan melakukan pewarnaan HE pada satu batch preparat pasien. Untuk memastikan kualitas pewarnaan sebelum hasil pasien dilaporkan, tindakan yang paling tepat adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Menilai hanya preparat pasien pertama",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Menggunakan control slide jaringan dengan karakteristik pewarnaan yang telah diketahui",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Mengurangi waktu staining",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Tidak menggunakan kontrol karena HE adalah pewarnaan rutin",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Mengganti seluruh reagen setiap preparat",
            "is_correct": false
          }
        ],
        "explanation": "Penggunaan slide kontrol jaringan dengan sifat pewarnaan yang terkarakterisasi adalah standar jaminan mutu analitik untuk memvalidasi performa reagen pewarnaan HE harian.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang TLM menemukan label pada kaca objek tidak sesuai dengan identitas pada kaset jaringan. Tindakan yang paling tepat adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Memilih identitas yang paling mungkin",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Menghapus label dan menulis nama pasien lain",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Menghentikan proses pelaporan dan melakukan verifikasi identitas sesuai prosedur",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Tetap melaporkan karena morfologi jaringan tidak berubah",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Meminta pasien baru setelah hasil selesai",
            "is_correct": false
          }
        ],
        "explanation": "Jika ditemukan ketidaksesuaian identitas antara label kaca objek dan kaset jaringan, seluruh proses harus dihentikan untuk verifikasi identitas praanalitik sesuai SOP.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang TLM bekerja dengan formalin dan xilena selama proses histologi. Upaya keselamatan kerja yang paling tepat adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Melakukan seluruh pekerjaan di meja terbuka tanpa ventilasi",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Menggunakan APD dan menangani bahan volatil pada ventilasi/fume hood yang sesuai",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Mencampurkan sisa xilena dengan limbah domestik",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Menyimpan xilena dalam wadah terbuka",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Menggunakan sarung tangan yang sama sepanjang hari tanpa diganti",
            "is_correct": false
          }
        ],
        "explanation": "Formalin dan xilena merupakan bahan kimia toksik dan volatil; penanganannya wajib dilakukan di lemari asam (fume hood) dengan ventilasi yang baik serta APD lengkap.",
        "difficulty": "medium"
      },
      {
        "question_text": "Sebelum hasil preparat histologi diserahkan untuk interpretasi, TLM melakukan pemeriksaan kualitas. Ditemukan section utuh, tidak terlipat, tidak terdapat kontaminasi, inti berwarna biru-ungu tajam, dan sitoplasma berwarna merah muda dengan diferensiasi yang baik. Kesimpulan yang paling tepat adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Preparat harus diulang karena terlalu tipis",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Preparat tidak layak karena eosin harus berwarna biru",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Preparat memenuhi kualitas teknis untuk pemeriksaan mikroskopis",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Preparat mengalami chatter",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Preparat mengalami air-drying artifact",
            "is_correct": false
          }
        ],
        "explanation": "Preparat dengan irisan utuh tanpa lipatan, inti biru-ungu tajam, dan diferensiasi sitoplasma merah muda telah memenuhi seluruh kriteria teknis mutu histopatologi.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada awal hari kerja, laboratorium menjalankan pewarnaan HE pada jaringan kontrol. Inti pada kontrol tampak sangat pucat, sedangkan reagen yang sama akan digunakan untuk 25 preparat pasien. Tindakan QC yang paling tepat sebelum melanjutkan preparat pasien adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Tetap memproses semua preparat karena kontrol bukan sampel pasien",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Menerima hasil kontrol selama eosin berwarna merah muda",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Menghentikan batch, menelusuri penyebab, melakukan tindakan korektif, lalu mengulang kontrol",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Menambahkan mounting medium lebih banyak",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Melaporkan hasil pasien terlebih dahulu lalu memperbaiki kontrol",
            "is_correct": false
          }
        ],
        "explanation": "Bila slide kontrol QC menunjukkan hasil tidak memenuhi syarat (inti pucat), batch harus segera dihentikan untuk investigasi penyebab dan tindakan perbaikan sebelum memproses sampel pasien.",
        "difficulty": "hard"
      },
      {
        "question_text": "TLM akan mengganti botol hematoksilin pada stainer. Pada botol baru tercantum nomor lot berbeda dari lot sebelumnya. Dokumentasi yang paling penting untuk menjamin traceability adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Hanya mencatat warna botol",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Mencatat nomor lot, tanggal mulai digunakan, tanggal kedaluwarsa, dan hasil verifikasi sebelum",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Membuang label pabrik setelah botol dibuka",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Mencatat nama pasien pertama saja",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Tidak perlu dokumentasi jika reagen berasal dari produsen yang sama",
            "is_correct": false
          }
        ],
        "explanation": "Untuk menjamin ketertelusuran (traceability), setiap pergantian lot reagen harus dicatat nomor lot, tanggal penerimaan, tanggal kedaluwarsa, dan hasil uji validasi lot baru.",
        "difficulty": "hard"
      },
      {
        "question_text": "Saat penerimaan spesimen biopsi, nama pada formulir permintaan berbeda satu huruf dari nama pada pot spesimen dan terdapat perbedaan tanggal lahir. Bagaimana tindakan QA preanalitik yang paling tepat?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Memproses spesimen berdasarkan nama yang paling mirip",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Mengoreksi identitas sendiri berdasarkan nomor rekam medis yang diperkirakan",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Menahan spesimen dan melakukan klarifikasi/verifikasi identitas sesuai SOP sebelum processing",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Membuang spesimen tanpa dokumentasi",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Mengganti label pot sesuai formulir tanpa konfirmasi",
            "is_correct": false
          }
        ],
        "explanation": "Ketidaksesuaian data identitas nama dan tanggal lahir pada formulir dan wadah spesimen mewajibkan penahanan spesimen dan konfirmasi ke unit pengirim sesuai SOP preanalitik.",
        "difficulty": "hard"
      },
      {
        "question_text": "Dalam audit internal ditemukan hasil pewarnaan HE beberapa hari terakhir makin pucat. Catatan menunjukkan frekuensi penggantian hematoksilin tidak sesuai SOP dan tidak ada dokumentasi corrective action. Tindakan jaminan mutu yang paling tepat adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Mengganti reagen tanpa mencatat masalah",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Melakukan analisis akar masalah, tindakan korektif dan pencegahan, serta mendokumentasikan",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Menghapus catatan hasil yang pucat",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Mengubah SOP agar sesuai praktik yang salah",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Menunggu keluhan dokter sebelum bertindak",
            "is_correct": false
          }
        ],
        "explanation": "Temuan audit berupa pewarnaan yang makin pucat harus ditindaklanjuti dengan analisis akar masalah (root cause analysis), tindakan korektif dan pencegahan (CAPA), serta evaluasi efektivitasnya.",
        "difficulty": "hard"
      },
      {
        "question_text": "Laboratorium mengikuti program pemantapan mutu eksternal dan menerima preparat uji tanpa mengetahui hasil rujukannya. Hasil laboratorium kemudian dibandingkan dengan nilai/penilaian penyelenggara. Tujuan utama kegiatan tersebut adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Menggantikan seluruh QC internal",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Menilai kinerja laboratorium secara eksternal dan membandingkannya dengan standar/peer group",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Menentukan diagnosis pasien yang sebenarnya",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Mengurangi kebutuhan SOP",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Menentukan masa kedaluwarsa reagen",
            "is_correct": false
          }
        ],
        "explanation": "Pemantapan Mutu Eksternal (PME / External Quality Assessment) bertujuan menilai akurasi dan kinerja laboratorium secara independen terhadap laboratorium rujukan atau kelompok sejawat.",
        "difficulty": "hard"
      },
      {
        "question_text": "Saat menuangkan formalin 10%, sejumlah larutan tumpah di meja dan tercium bau menyengat. Tidak ada pekerja yang terkena langsung. Tindakan K3 yang paling tepat adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Membersihkan segera dengan tangan tanpa sarung tangan",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Mengencerkan dengan xilena agar cepat menguap",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Mengamankan area, menggunakan APD yang sesuai, meningkatkan ventilasi, dan menangani",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Membiarkan tumpahan menguap sendiri",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Menutup tumpahan dengan kertas lalu membuangnya ke sampah domestik",
            "is_correct": false
          }
        ],
        "explanation": "Tumpahan bahan berbahaya seperti formalin harus ditangani dengan mengisolasi area, memakai APD sesuai, menyalakan ventilasi maksimal, dan menyerap tumpahan sesuai spill kit / SDS.",
        "difficulty": "hard"
      },
      {
        "question_text": "Setelah proses clearing, tersedia 2 liter xilena bekas yang harus dibuang. Pengelolaan limbah yang paling tepat adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Membuangnya ke wastafel dengan air mengalir",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Mencampurnya dengan limbah infeksius",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Menampungnya dalam wadah limbah kimia kompatibel, tertutup dan berlabel untuk pengelolaan",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Menguapkannya di ruang kerja",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Membuangnya ke tempat sampah umum dalam botol terbuka",
            "is_correct": false
          }
        ],
        "explanation": "Limbah pelarut organik seperti xilena bekas tergolong limbah B3 yang harus ditampung dalam wadah khusus berlabel tertutup untuk diolah oleh pihak ketiga berizin.",
        "difficulty": "hard"
      },
      {
        "question_text": "Setelah mengganti disposable microtome blade, TLM harus membuang blade yang sudah tidak digunakan. Tempat pembuangan yang paling tepat adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Kantong limbah domestik",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Kantong limbah infeksius biasa",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Wadah tahan tusuk (sharps container) sesuai prosedur",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Wastafel",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Kotak karton tanpa penutup",
            "is_correct": false
          }
        ],
        "explanation": "Bilah pisau mikrotom sekali pakai tergolong limbah benda tajam yang wajib dibuang ke dalam sharps container tahan tusukan dan anti bocor.",
        "difficulty": "hard"
      },
      {
        "question_text": "Seorang TLM sedang memotong blok parafin dan tangannya tergores blade mikrotom hingga berdarah. Tindakan awal yang paling tepat adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Melanjutkan pekerjaan agar batch selesai",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Menutup luka dengan sarung tangan yang sama",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Menghentikan pekerjaan, melakukan pertolongan pertama, melaporkan insiden dan mengikuti",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Menyiram blade dengan xilena",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Membuang semua preparat pasien",
            "is_correct": false
          }
        ],
        "explanation": "Tertusuk atau tergores benda tajam di laboratorium mewajibkan penghentian kerja segera, pertolongan pertama (mencuci luka dengan air mengalir & sabun), pelaporan insiden, dan penanganan pajanan.",
        "difficulty": "hard"
      },
      {
        "question_text": "Audit mutu menemukan satu preparat pasien tidak dapat ditelusuri secara lengkap karena nomor kaset, nomor blok, nomor slide, lot reagen, dan operator tidak tercatat konsisten. Prinsip QA yang paling terganggu pada kasus tersebut adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Sensitivitas analitik",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Traceability/ketertelusuran",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Presisi mikrotom",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Spesifisitas pewarnaan",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Resolusi mikroskop",
            "is_correct": false
          }
        ],
        "explanation": "Ketidakkonsistenan pencatatan kaset, blok, slide, dan lot reagen mengganggu prinsip ketertelusuran (traceability) yang krusial bagi keselamatan pasien dan integritas hasil diagnostik.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "title": "BIMBINGAN UKOM KIMIA KLINIK 2026 [4]",
    "category_slug": "kimia-klinik",
    "category_name": "Kimia Klinik",
    "description": "37 Soal Latihan UKOM Kimia Klinik: Kontrol Kualitas Westgard, Profil Lipid Rumus Friedewald, Sedimen Urin, Koreksi BJ Urinometer, dan Protein CSS.",
    "questions": [
      {
        "question_text": "[Soal #1] Seorang ATLM melakukan QC pada pemeriksaan trigliserida, ATLM memperoleh dua hasil kontrol berturut-turut pada +2,2 SD dan +2,5 SD. Kedua hasil tersebut berasalh dari level kontrol yang sama pada dua run berturut-turut. Apa jenis kesalahan yang paling mungkin terjadi?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Kesalahan acak (random error)",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Kesalahan pemipetan saja",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Kesalahan identifikasi sampel",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Kesalahan sistematik (systematic error)",
            "is_correct": true
          },
          {
            "option_label": "E",
            "option_text": "Kesalahan administratif",
            "is_correct": false
          }
        ],
        "explanation": "Pelanggaran aturan 2_2s (dua hasil kontrol berturut-turut pada sisi yang sama melebihi 2 SD) mendeteksi adanya kesalahan sistematik (systematic error).",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #2] Seorang ATLM melakukan pemeriksaan glukosa darah menggunakan alat kimia klinik. Beberapa hasil kontrol masih dalam batas ±2 SD, sedangkan terdapat satu hasil kontrol seperti gambar berikut, apakah interpretasi yang paling tepat?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Terjadi kesalahan acak dan run harus langsung ditolak",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Terjadi kesalahan sistematik karena dua kontrol melewati",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Terjadi pelanggaran 12S yang berfungsi debagai",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Terjadi pelanggaran R4S karena rentang kontrol terlalu",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Terjadi pelanggaran 10x karena kontrol melewati mean",
            "is_correct": false
          }
        ],
        "explanation": "Satu kontrol keluar di luar batas mean ±2 SD (aturan 1_2s) merupakan aturan peringatan (warning rule) yang mewajibkan peninjauan performa kontrol lainnya.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #3] Seorang ATLM melakukan QC pada pemeriksaan asam urat. QC dilakukan menggunakan aturan westgard rule. Hasil pemeriksaan control ada pada gambar berikut. Apa kesalahan yang terjadi pada kasus tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Random",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Sistematis",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Inheren",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Acak",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Eror",
            "is_correct": false
          }
        ],
        "explanation": "Pergeseran nilai kontrol secara konsisten ke satu arah di atas atau di bawah mean menunjukkan adanya kesalahan sistematis pada sistem analitik.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #4] Seorang ATLM menemukan bahwa hasil QC pemeriksaan kreatinin menyebar tidak menentu. Sebagian hasil berada di atas mean dan sebagian lainnya jauh dibawah mean. Pada satu run, selisih dua level kontrol mencapai lebih dari 4 SD. Apa jenis kesalahan yang paling mungkin terjadi?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Kesalahan sistematik",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Kesalahan kalibrasi yang pasti",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Kesalahan acak",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Kesalahan administrative",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Kesalahan inheren",
            "is_correct": false
          }
        ],
        "explanation": "Hasil kontrol yang menyebar tidak menentu di kedua sisi mean dan selisih antar level melebihi 4 SD (aturan R_4s) mengindikasikan terjadinya kesalahan acak (random error).",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #17] Dalam satu run pemeriksaan glukosa, kontrol level rendah menghasilkan +2,4 SD dan kontrol level tinggi menghasilkan +2,2 SD. Kedua hasil tersebut berada di atas +2 SD pada sisi mean yang sama. Apa aturan yang dilanggar berdasarkan kasus tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "13S",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "R4S",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "10x",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "22S",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "41S",
            "is_correct": false
          }
        ],
        "explanation": "Rumus Friedewald: LDL = Kolesterol Total - HDL - (TG / 5) = 250 - 60 - (200 / 5) = 190 - 40 = 150 mg/dL.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #6] Seorang ATLM melakukan QC pemeriksaan kreatinin, dua bahan kontrol dalam satu run menghasilkan nilai +2,3 SD dan -2,2 SD. Apa interpretasi yang paling tepat?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Aturan 12S, kesalahan sistematik",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Aturan 13S, kesalahan sistematik",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Aturan 22S, kesalahan acak",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Aturan 10x, kesaahan sistematik",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Aturan R4S, kesalahan acak",
            "is_correct": true
          }
        ],
        "explanation": "Dua bahan kontrol dalam satu run menghasilkan nilai +2,3 SD dan -2,2 SD (selisih > 4 SD) melanggar aturan R_4s yang menggambarkan kesalahan acak.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #7] Seorang ATLM mengevaluasi grafik Levey-Jennings pemeriksaan kolesterol. Sepuluh hasil kontrol berturut-turut berada di bawah garis rerata, meskipun semuanya masih dalam batas ±2 SD. Apa Kesimpulan dari pernyataan tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Tidak terjadi pelanggaran",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Terjadi pelanggaran aturan R4S",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Terjadi pelanggaran aturan 10x",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Terjadi pelanggaran aturan 13S",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Terjadi pelanggaran aturan 12s",
            "is_correct": false
          }
        ],
        "explanation": "Sepuluh hasil kontrol berturut-turut berada pada satu sisi di bawah garis rerata melanggar aturan 10x yang menggambarkan pergeseran sistematik.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #8] Seorang ATLM melakukan QC pemeriksaan bilirubin. Salah satu hasil kontrol berada pada +3,2 SD dan pemeriksaan tersebut belum dilaporkan. Apa Tindakan yang paling tepat untuk kasus tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Melanjutkan pemeriksaan dan mengabaikan QC",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Menolak run sesuai SOP. Menyelidiki penyebab, memperbaiki masalah dan mengulang",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Mengubah nilai mean agar hasil kembali normal",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Menghapus hasil kontrol yang menyimpang dari grafik",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Tetap melaporkan hasil pasien apabila secara klinis masuk akal",
            "is_correct": false
          }
        ],
        "explanation": "Hasil kontrol berada pada +3,2 SD melanggar aturan 1_3s (penolakan). Tindakan: tolak run sesuai SOP, selidiki penyebab, perbaiki masalah, dan ulang QC.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #9] Seorang ATLM melakukan QC pada pemeriksaan Albumin. QC dilakukan menggunakan aturan westgard rule. Hasil pemeriksaan control ada pada gambar berikut. Apa aturan yang sesuai dengan gambar tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "13S",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "R4S",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "22S",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "10x",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "41S",
            "is_correct": false
          }
        ],
        "explanation": "Titik kontrol berada di luar batas 3 SD melanggar aturan 1_3s yang merupakan kriteria penolakan run akibat kesalahan acak/sistematik besar.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #10] Seorang ATLM melakukan pemeriksaan bilirubin total, satu hasil kontrol menunjukkan +2,2 SD. Hasil kontrol lainnya berada dalam batas ±2 SD. Tidak ada aturan penolakan lain yang dilanggar. Apa tinfakan awal yang paling tepat?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Langsung melaporkan seluruh hasil paien",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Langsung mengganti semua reagen tanpa evaluasi",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Menganggap pemeriksaan pasti mengalami kesalahan acak",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Memperlakukan hasil sebagai peringatan dan mengevaluasi aturan QC lainnya",
            "is_correct": true
          },
          {
            "option_label": "E",
            "option_text": "Menghentikan seluruh pelayanan laboratorium selama satu hari",
            "is_correct": false
          }
        ],
        "explanation": "Satu kontrol pada +2,2 SD tanpa pelanggaran lain merupakan aturan peringatan (1_2s); perlakukan sebagai peringatan dan evaluasi aturan QC lainnya.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #11] Seorang laki-laki berusia 45 tahun menjalani pemeriksaan profil lipid di laboratorium. Hasil pemeriksaan menunjukkan kolesterol total 240 mg/dL, HDL 50 mg/dL, dan trigliserida 150 mg/dL. Analis kesehatan diminta menghitung kadar LDL menggunakan rumus Friedewald. Berapakah kadar LDL pasien tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "140 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "150 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "160 mg/dL",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "170 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "180 mg/dL",
            "is_correct": false
          }
        ],
        "explanation": "Rumus Friedewald: LDL = Kolesterol Total - HDL - (Trigliserida / 5) = 240 - 50 - (150 / 5) = 240 - 50 - 30 = 160 mg/dL.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #12] Seorang perempuan berusia 50 tahun menjalani pemeriksaan profil lipid. Hasil yang tersedia menunjukkan LDL 120 mg/dL, HDL 55 mg/dL, dan trigliserida 125 mg/dL. Analis diminta menghitung kolesterol total berdasarkan hubungan komponen profil lipid. Berapakah kadar kolesterol total pasien?",
        "options": [
          {
            "option_label": "A",
            "option_text": "190 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "195 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "200 mg/dL",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "205 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "210 mg/dL",
            "is_correct": false
          }
        ],
        "explanation": "Rumus Friedewald: Kolesterol Total = LDL + HDL + (TG / 5) = 120 + 55 + (125 / 5) = 175 + 25 = 200 mg/dL.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #13] Seorang laki-laki berusia 42 tahun melakukan pemeriksaan profil lipid. Hasil laboratorium menunjukkan kolesterol total 220 mg/dL, HDL 45 mg/dL, dan LDL 135 mg/dL. Untuk latihan ini, diasumsikan hubungan Friedewald berlaku pada sampel pasien. Berapakah kadar trigliserida yang diperkirakan?",
        "options": [
          {
            "option_label": "A",
            "option_text": "150 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "175 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "200 mg/dL",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "225 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "250 mg/dL",
            "is_correct": false
          }
        ],
        "explanation": "Rumus Friedewald: VLDL = Kolesterol Total - HDL - LDL = 220 - 45 - 135 = 40 mg/dL. Trigliserida = VLDL x 5 = 40 x 5 = 200 mg/dL.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #14] Seorang perempuan berusia 47 tahun menjalani pemeriksaan profil lipid. Hasil yang diketahui adalah kolesterol total 210 mg/dL, LDL 125 mg/dL, dan trigliserida 150 mg/dL. Analis kesehatan diminta memperkirakan kadar HDL berdasarkan rumus Friedewald. Berapakah kadar HDL pasien?",
        "options": [
          {
            "option_label": "A",
            "option_text": "45 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "50 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "55 mg/dL",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "60 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "65 mg/dL",
            "is_correct": false
          }
        ],
        "explanation": "Rumus Friedewald: VLDL = Kolesterol Total - HDL - LDL = 210 - 45 - 130 = 35 mg/dL. Trigliserida = 35 x 5 = 175 mg/dL.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #15] Seorang pasien berusia 56 tahun menjalani pemeriksaan profil lipid. Hasil pemeriksaan menunjukkan LDL 145 mg/dL, HDL 50 mg/dL, dan trigliserida 175 mg/dL. Analis diminta menghitung kolesterol total berdasarkan hubungan Friedewald. Berapakah kadar kolesterol total pasien?",
        "options": [
          {
            "option_label": "A",
            "option_text": "220 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "225 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "230 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "235 mg/dL",
            "is_correct": true
          },
          {
            "option_label": "E",
            "option_text": "240 mg/dL",
            "is_correct": false
          }
        ],
        "explanation": "Rumus Friedewald: Kolesterol Total = LDL + HDL + (TG / 5) = 145 + 50 + (140 / 5) = 195 + 28 = 223 mg/dL.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #16] Seorang perempuan berusia 49 tahun memiliki hasil pemeriksaan kolesterol total 195 mg/dL, HDL 50 mg/dL, dan LDL 110 mg/dL. Analis diminta memperkirakan kadar trigliserida berdasarkan hubungan Friedewald. Berapakah kadar trigliserida pasien?",
        "options": [
          {
            "option_label": "A",
            "option_text": "125 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "150 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "175 mg/dL",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "200 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "225 mg/dL",
            "is_correct": false
          }
        ],
        "explanation": "Rumus Friedewald: VLDL = Kolesterol Total - HDL - LDL = 195 - 50 - 110 = 35 mg/dL. Trigliserida = 35 x 5 = 175 mg/dL.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #17] Seorang perempuan berusia 51 tahun menjalani pemeriksaan profil lipid dengan hasil kolesterol total 250 mg/dL, HDL 60 mg/dL, dan trigliserida 200 mg/dL. Sampel memenuhi syarat untuk estimasi LDL dengan rumus Friedewald. Berapakah kadar LDL pasien?",
        "options": [
          {
            "option_label": "A",
            "option_text": "140 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "150 mg/dL",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "160 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "170 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "180 mg/dL",
            "is_correct": false
          }
        ],
        "explanation": "Rumus Friedewald: LDL = Kolesterol Total - HDL - (TG / 5) = 250 - 60 - (200 / 5) = 190 - 40 = 150 mg/dL.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #18] Seorang laki-laki berusia 44 tahun menjalani pemeriksaan profil lipid. Hasil pemeriksaan menunjukkan kolesterol total 225 mg/dL, LDL 140 mg/dL, dan trigliserida 150 mg/dL. Analis diminta menghitung HDL berdasarkan rumus Friedewald. Berapakah kadar HDL pasien?",
        "options": [
          {
            "option_label": "A",
            "option_text": "45 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "50 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "55 mg/dL",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "60 mg/dL",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "65 mg/dL",
            "is_correct": false
          }
        ],
        "explanation": "Rumus Friedewald: HDL = Kolesterol Total - LDL - (TG / 5) = 225 - 140 - (150 / 5) = 85 - 30 = 55 mg/dL.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #19] Pemeriksaan Sedimen urine pada pasien laki –laki usia 35 tahun. Pasien mengalami nyeri pada waktu buang air kecil. Urine pasien berwarna merah, dan hasil yang diperiksa sedimen dalam 10 lapang pandang sebagai berikut: Bagaimana pelaporan hasil pemeriksaan tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "1 – 2 sel/lpk",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "1 – 4 sel/lpk",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "2 – 3 sel/lpk",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "2 – 4 sel/lpk",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "2 – 5 sel/lpk",
            "is_correct": false
          }
        ],
        "explanation": "Rerata kristal dalam 10 lapang pandang: 18 / 10 = 1,8, dilaporkan sebagai 2 – 3 sel/LPK.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #20] Pemeriksaan Sedimen urine pada pasien Perempuan usia 33 tahun. Pasien mengalami nyeri pada waktu buang air kecil. Urine pasien berwarna merah, dan hasil yang diperiksa sedimen dalam 10 lapang pandang sebagai berikut: Bagaimana pelaporan hasil pemeriksaan tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Eritorosit 9 – 13 sel/lpb & Leukosit 9 – 11 sel/lpb",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Eritrosit 10,5 sel/lpb & Leukosit 9,4 sel/lpb",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Eritrosit 10 – 12 sel/lpb & Leukosit 9 – 10 sel/lpb",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Eritrosit 10 – 11 sel/lpb & Leukosit 9,4 sel/lpb",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Eritrosit 11 – 12 sel/lpb & Leukosit 9 – 10 sel/lpb",
            "is_correct": true
          },
          {
            "option_label": "E",
            "option_text": "Eritrosit 11 – 12 sel/lpb & Leukosit 9 – 10",
            "is_correct": true
          }
        ],
        "explanation": "Rerata eritrosit 106 / 10 = 10,6 (dilaporkan 11–12 sel/LPB) dan leukosit 94 / 10 = 9,4 (dilaporkan 9–10 sel/LPB).",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #21] Pemeriksaan Sedimen urine pada pasien Perempuan usia 33 tahun. Pasien mengalami nyeri pada waktu buang air kecil. Urine pasien berwarna merah, dan hasil yang diperiksa sedimen dalam 10 lapang pandang sebagai berikut: Bagaimana pelaporan hasil pemeriksaan tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Eritrosit 3 - 4 sel/lpb",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Eritrosit 4 - 5 sel/lpb",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Eritrosit 2 – 3 sel/lpb",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Eritrosit 5 – 6 sel/lpb",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Eritrosit 1 – 2 sel/lpb",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "4 – 5 sel/LPB",
            "is_correct": true
          }
        ],
        "explanation": "Rerata eritrosit dalam 10 LPB dihitung dan dilaporkan dalam rentang 4 - 5 sel/lpb.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #22] Pemeriksaan Sedimen urine pada pasien laki –laki usia 35 tahun. Pasien mengalami nyeri pada waktu buang air kecil. Urine pasien berwarna merah, dan hasil yang diperiksa sedimen dalam 10 lapang pandang sebagai berikut: Bagaimana pelaporan hasil pemeriksaan tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "1 – 2 sel/lpk",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "1 – 4 sel/lpk",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "2 – 3 sel/lpk",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "2 – 4 sel/lpk",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "2 – 5 sel/lpk",
            "is_correct": false
          }
        ],
        "explanation": "Hasil evaluasi sedimen urin dihitung berdasarkan rerata per lapang pandang besar (LPB).",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #23] Pemeriksaan Sedimen urine pada pasien Perempuan usia 33 tahun. Pasien mengalami nyeri pada waktu buang air kecil. Urine pasien berwarna merah, dan hasil yang diperiksa sedimen dalam 10 lapang pandang sebagai berikut: Bagaimana pelaporan hasil pemeriksaan tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Leukosit 7 – 9 sel/lpb",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Leukosit 9 – 10 sel/lpb",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Leukosit 6 – 7 sel/lpb",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Leukosit 8 – 9 sel/lpb",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Leukosit 7 – 8 sel/lpb",
            "is_correct": true
          },
          {
            "option_label": "E",
            "option_text": "Leukosit 7 – 8 sel/lpb",
            "is_correct": true
          }
        ],
        "explanation": "Evaluasi sedimen eritrosit dilaporkan dalam rentang sel/lpb sesuai jumlah total per 10 lapang pandang.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #24] Pemeriksaan Sedimen urine pada pasien laki –laki usia 35 tahun. Pasien mengalami nyeri pada waktu buang air kecil. Urine pasien berwarna merah, dan hasil yang diperiksa sedimen dalam 10 lapang pandang sebagai berikut: Bagaimana pelaporan hasil pemeriksaan tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "1 – 2 sel/lpk",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "1 – 4 sel/lpk",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "2 – 3 sel/lpk",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "2 – 4 sel/lpk",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "2 – 5 sel/lpk",
            "is_correct": false
          }
        ],
        "explanation": "Sedimen kristal dan silinder dinilai pada lapang pandang kecil (LPK), sedangkan sel darah pada lapang pandang besar (LPB).",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #25] Seorang perempuan berusia 32 tahun melakukan pemeriksaan urin. Urinometer yang digunakan dikalibrasi pada suhu 20°C. Hasil pembacaan BJ adalah 1,018, sedangkan suhu urin saat pemeriksaan 30°C. Untuk soal ini, gunakan faktor koreksi 0,001 setiap kenaikan 3°C di atas suhu kalibrasi. Berapakah BJ terkoreksi yang paling mendekati?",
        "options": [
          {
            "option_label": "A",
            "option_text": "1,015",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "1,018",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "1,020",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "1,021",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "1,028",
            "is_correct": false
          }
        ],
        "explanation": "Koreksi suhu: Suhu sampel 26°C dengan kalibrasi 20°C (+6°C = 2x 3°C -> +0,002). BJ terkoreksi = 1,018 + 0,002 = 1,020.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #26] Seorang laki-laki berusia 25 tahun menjalani pemeriksaan urinalisis setelah beraktivitas fisik. Petugas TLM melakukan pemeriksaan menggunakan urinometer. Hasil pembacaan menunjukkan BJ 1,020 pada suhu 20 ̊C. Suhu kalibrasi urinometer adalah 20 ̊C. berapakah hasil BJ urin yang dilaporkan?",
        "options": [
          {
            "option_label": "A",
            "option_text": "1,015",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "1,018",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "1,020",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "1,021",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "1,028",
            "is_correct": false
          }
        ],
        "explanation": "Koreksi suhu: Suhu sampel 29°C dengan kalibrasi 20°C (+9°C = 3x 3°C -> +0,003). BJ terkoreksi = 1,015 + 0,003 = 1,018.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #27] Hasil pengukuran BJ urin dengan urinometer menunjukkan angka 1,022. Suhu kalibrasi alat adalah 20°C, sedangkan suhu sampel adalah 26°C. Untuk latihan ini, gunakan faktor koreksi 0,001 setiap kenaikan 3°C di atas suhu kalibrasi. Berapakah hasil BJ setelah koreksi, dibulatkan hingga tiga angka di belakang koma?",
        "options": [
          {
            "option_label": "A",
            "option_text": "1,020",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "1,021",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "1,022",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "1,024",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "1,028",
            "is_correct": false
          }
        ],
        "explanation": "Koreksi suhu: Suhu sampel 23°C (+3°C -> +0,001). BJ terkoreksi = 1,022 + 0,001 = 1,023.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #28] Sampel urin diperiksa dengan urinometer yang dikalibrasi pada suhu 20°C. Pembacaan BJ adalah 1,016 dan suhu sampel 14°C. Untuk latihan ini, gunakan koreksi sebesar 0,001 untuk setiap penurunan suhu 3°C di bawah suhu kalibrasi, dengan cara mengurangi hasil pembacaan. Berapakah hasil BJ terkoreksi yang paling mendekati?",
        "options": [
          {
            "option_label": "A",
            "option_text": "1,010",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "1,014",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "1,016",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "1,018",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "1,022",
            "is_correct": false
          }
        ],
        "explanation": "Koreksi suhu: Suhu sampel 14°C di bawah 20°C (-6°C -> -0,002). BJ terkoreksi = 1,016 - 0,002 = 1,014.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #29] Seorang laki-laki berusia 24 tahun datang ke laboratorium untuk pemeriksaan urin rutin. Petugas TLM melakukan pemeriksaan menggunakan urinometer yang dikalibrasi pada suhu 20°C. Suhu sampel urin juga 20°C. Hasil pembacaan urinometer menunjukkan 1,018. Berapakah nilai BJ urin yang dilaporkan?",
        "options": [
          {
            "option_label": "A",
            "option_text": "1,010",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "1,014",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "1,016",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "1,018",
            "is_correct": true
          },
          {
            "option_label": "E",
            "option_text": "1,022",
            "is_correct": false
          }
        ],
        "explanation": "Koreksi suhu: Suhu sampel 29°C (+9°C -> +0,003). BJ terkoreksi = 1,020 + 0,003 = 1,023.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #30] Seorang perempuan berusia 30 tahun menjalani pemeriksaan urinalisis. Urinometer dikalibrasi pada suhu 20°C. Suhu sampel saat diperiksa adalah 29°C, dengan BJ terbaca 1,020. Untuk soal ini, gunakan koreksi 0,001 setiap kenaikan suhu 3°C di atas suhu kalibrasi. Berapakah BJ terkoreksi yang paling mendekati?",
        "options": [
          {
            "option_label": "A",
            "option_text": "1,017",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "1,020",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "1,021",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "1,023",
            "is_correct": true
          },
          {
            "option_label": "E",
            "option_text": "1,030",
            "is_correct": false
          }
        ],
        "explanation": "Koreksi suhu: Suhu sampel 29°C (+9°C -> +0,003). BJ terkoreksi = 1,020 + 0,003 = 1,023.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #31] Petugas TLM memeriksa urin menggunakan urinometer dengan suhu kalibrasi 20°C. Suhu urin adalah 26°C dan BJ terbaca 1,015. Dalam skenario ini, gunakan faktor koreksi 0,001 setiap kenaikan suhu 3°C. Berapakah BJ setelah koreksi, dibulatkan hingga tiga angka di belakang koma?",
        "options": [
          {
            "option_label": "A",
            "option_text": "1,013",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "1,015",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "1,016",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "1,017",
            "is_correct": true
          },
          {
            "option_label": "E",
            "option_text": "1,020",
            "is_correct": false
          }
        ],
        "explanation": "Koreksi suhu: Suhu sampel 26°C (+6°C -> +0,002). BJ terkoreksi = 1,015 + 0,002 = 1,017.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #32] Sampel urin diperiksa menggunakan urinometer yang dikalibrasi pada suhu 20°C. Pembacaan BJ adalah 1,024 dan suhu sampel 32°C. Gunakan faktor koreksi 0,001 setiap kenaikan suhu 3°C di atas suhu kalibrasi. Berapakah BJ terkoreksi yang paling mendekati?",
        "options": [
          {
            "option_label": "A",
            "option_text": "1,020",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "1,024",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "1,026",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "1,028",
            "is_correct": true
          },
          {
            "option_label": "E",
            "option_text": "1,032",
            "is_correct": false
          }
        ],
        "explanation": "Koreksi suhu: Suhu sampel 32°C (+12°C = 4x 3°C -> +0,004). BJ terkoreksi = 1,024 + 0,004 = 1,028.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #33] Sampel urin diperiksa menggunakan urinometer yang dikalibrasi pada suhu 20°C. Pembacaan BJ adalah 1,019 dan suhu sampel 14°C. Gunakan faktor koreksi 0,001 setiap kenaikan suhu 3°C di atas suhu kalibrasi. Berapakah BJ terkoreksi yang paling mendekati?",
        "options": [
          {
            "option_label": "A",
            "option_text": "1,015",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "1,017",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "1,019",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "1,021",
            "is_correct": true
          },
          {
            "option_label": "E",
            "option_text": "1,025",
            "is_correct": false
          }
        ],
        "explanation": "Koreksi suhu: Suhu sampel 14°C (-6°C -> -0,002). BJ terkoreksi = 1,019 - 0,002 = 1,017.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #34] Seorang pasien laki-laki berusia 55 tahun mendapatkan formulir permintaan pemeriksaan urobilinogen dalam urine dari dokter. ATLM menjelaskan bahwa urobilinogen dalam urine dapat berubah akibat paparan cahaya dan penyimpanan terlalu lama. Waktu dan penanganan spesimen yang paling tepat adalah?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Mengumpulkan urine kapan saja dan membiarkannya terbuka",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Menggunakan urine yang telah disimpan pada suhu ruang selama 8 jam",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Mengumpulkan urine segar dan segera memeriksanya, terlindung dari cahaya",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Menggunakan urine yang telah disimpan selama 24 jam tanpa pengawet",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Mengambil urine setelah pasien mengonsumsi banyak air",
            "is_correct": false
          }
        ],
        "explanation": "Urobilinogen tidak stabil terhadap oksidasi cahaya; spesimen harus urine segar yang segera diperiksa dalam wadah terlindung cahaya.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #35] Seorang pasien dengan dugaan meningitis menjalani pungsi lumbal. Cairan serebrospinal (CSS) dikirim ke laboratorium untuk pemeriksaan jumlah sel, protein, glukosa, dan mikrobiologi. Tindakan yang paling tepat adalah?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Menyimpan seluruh sampel selama 24 jam pada suhu ruang sebelum pemeriksaan",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Memproses dan mengirimkan sampel sesegera mungkin sesuai prosedur pemeriksaan",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Menunda pemeriksaan sampai sampel membentuk endapan",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Menyimpan sebagian sampel selama 24 jam dan sebagian lagi dikirimkan sesuai",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Menyimpan sampel selama beberapa hari sebelum pemeriksaan",
            "is_correct": false
          }
        ],
        "explanation": "Spesimen CSS (cairan serebrospinal) tergolong cito dan harus segera diproses tanpa penundaan untuk mencegah lisis sel dan degradasi kimiawi.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #36] Seorang pasien menjalani pemeriksaan sedimen urine. Pemeriksaan mikroskopis menunjukkan kristal berbentuk seperti amplop yang ditemukan pada urine dengan pH asam hingga netral. Apa kristal yang paling mungkin ditemukan?",
        "options": [
          {
            "option_label": "A",
            "option_text": "ristal triple fosfat",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Kristal sistin",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Kristal kalsium oksalat",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Kristal amonium biurat",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Kristal fosfat amorf",
            "is_correct": false
          }
        ],
        "explanation": "Kristal kalsium oksalat dalam sedimen urin pH asam hingga netral memiliki bentuk khas seperti amplop surat persegi bersilang diagonal.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Soal #37] Seorang perempuan berusia 28 tahun datang ke laboratorium untuk pemeriksaan urinalisis rutin. Dokter meminta pemeriksaan protein, glukosa, pH, berat jenis, dan sedimen urine. Apa spesimen yang paling sesuai pada kasus tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Urine sewaktu yang ditampung dalam wadah bersih dan tertutup rapat",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Urine porsi tengah (midstream) dalam wadah bersih dan kering",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Urine pagi yang yang dikumpulkan segera setelah bangun tidur",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Urine Suprapubik dalam wadah bersih dan kering",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Urine yang telah disimpan selama 12 jam pada suhu ruang",
            "is_correct": false
          }
        ],
        "explanation": "Urine porsi tengah (midstream clean catch) adalah spesimen terbaik untuk urinalisis rutin dan kultur guna meminimalkan kontaminasi flora komensal uretra.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "title": "Contoh Soal Uji Kompetensi Toksikologi",
    "category_slug": "toksikologi-klinik",
    "category_name": "Toksikologi Klinik",
    "description": "10 Soal Vignette Kasus Toksikologi Klinik Blueprint D3: NAPZA (Narkotika, Psikotropika), Pestisida Organofosfat, Logam Berat, dan Sianida.",
    "questions": [
      {
        "question_text": "Seorang laki-laki berusia 22 tahun diantar petugas kepolisian ke laboratorium untuk pemeriksaan narkoba setelah kedapatan membawa linting daun kering berbau khas saat razia. Analis menampung urin sewaktu pada wadah steril dan memeriksanya dengan rapid test imunokromatografi multidrug (cut-off THC 50 ng/mL). Setelah 5 menit, pada strip THC terlihat garis kontrol (C) berwarna merah muda, sedangkan garis tes (T) tidak terbentuk. Strip parameter lainnya menunjukkan dua garis (C dan T). Interpretasi hasil pemeriksaan yang paling tepat adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Negatif THC karena garis tes tidak terbentuk",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Positif THC karena metabolit THC dalam urin ≥ cut-off bersaing dengan konjugat sehingga",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Invalid karena garis tes tidak terbentuk",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Positif semua golongan karena garis kontrol terbentuk",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Negatif semua golongan karena garis kontrol terbentuk",
            "is_correct": false
          }
        ],
        "explanation": "Rapid test narkoba urin bekerja dengan prinsip imunoasai kompetitif. Bila metabolit target (11-nor-Δ9-THC-COOH) ada dalam urin pada kadar ≥ cut-off, metabolit tersebut menjenuhkan antibodi pada konjugat sehingga tidak ada antibodi bebas yang berikatan dengan antigen di garis tes, dan garis T tidak terbentuk. Garis kontrol yang terbentuk menandakan tes valid. Dengan demikian, ketiadaan garis T berarti positif, sedangkan dua garis (C dan T) pada strip lain berarti negatif. Hasil ini bersifat skrining (presumptif) dan perlu dikonfirmasi dengan GC-MS atau LC-MS/MS bila dipakai untuk keperluan hukum.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang perempuan berusia 27 tahun dibawa keluarganya ke IGD dalam keadaan somnolen. Pemeriksaan fisik menunjukkan pupil pinpoint (miosis), frekuensi napas 8 kali/menit, dan ditemukan bekas suntikan (track marks) pada kedua lengan. Keluarga menyebutkan pasien menggunakan putaw. Dokter meminta pemeriksaan urin untuk memastikan penggunaan heroin dan membedakannya dari penggunaan morfin atau kodein yang sah secara medis. Metabolit yang paling spesifik untuk membuktikan penggunaan heroin pada urin adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Morfin-3-glukuronida",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "6-monoasetilmorfin (6-MAM)",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Benzoilekgonin",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Normorfin",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Kodein-6-glukuronida",
            "is_correct": false
          }
        ],
        "explanation": "Heroin (diasetilmorfin) dimetabolisme dengan sangat cepat menjadi 6- monoasetilmorfin (6-MAM) dan selanjutnya menjadi morfin yang diekskresikan sebagai morfin glukuronida. Morfin juga berasal dari morfin medis dan kodein, sehingga tidak spesifik untuk heroin. 6-MAM hanya terbentuk dari heroin sehingga menjadi penanda spesifik, meskipun jendela deteksinya dalam urin singkat (beberapa jam). Benzoilekgonin adalah metabolit kokain.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang laki-laki berusia 24 tahun ditangkap petugas BNN di tempat hiburan malam karena kedapatan membawa tablet berwarna-warni yang dikenal sebagai ekstasi. Skrining urin dengan rapid test amfetamin menunjukkan hasil positif. Pada anamnesis, ia mengaku tidak menggunakan tablet tersebut, tetapi sehari sebelumnya mengonsumsi obat flu yang mengandung pseudoefedrin. Langkah yang paling tepat dilakukan analis selanjutnya adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Melaporkan hasil sebagai positif amfetamin karena tablet ekstasi ditemukan pada tersangka",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Melaporkan hasil sebagai negatif karena terdapat riwayat konsumsi obat flu",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Mengulang rapid test dengan merek lain dan melaporkan hasil yang sama",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Melakukan pemeriksaan konfirmasi dengan GC-MS atau LC-MS/MS",
            "is_correct": true
          },
          {
            "option_label": "E",
            "option_text": "Mengganti spesimen urin dengan saliva lalu memeriksa dengan rapid test yang sama",
            "is_correct": false
          }
        ],
        "explanation": "Rapid test imunokromatografi hanya bersifat skrining dan dapat memberi hasil positif palsu akibat reaktivitas silang dengan senyawa mirip struktur, misalnya pseudoefedrin dan efedrin. Hasil positif skrining tidak boleh dilaporkan sebagai hasil akhir, tetapi harus dikonfirmasi dengan metode yang berbeda prinsip dan lebih spesifik, yaitu GC-MS atau LC-MS/MS. Mengulang dengan prinsip yang sama (opsi C dan E) tidak menyelesaikan masalah reaktivitas silang.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang perempuan berusia 30 tahun ditemukan tidak sadar di kamar kosnya. Di samping tempat tidur ditemukan strip tablet diazepam 5 mg yang sudah kosong. Frekuensi napas 10 kali/menit dan pupil normal. Pemeriksaan rapid test urin menunjukkan hasil positif pada kolom BZO (benzodiazepin). Zat yang dikonsumsi pasien dan golongannya menurut peraturan perundang-undangan adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Diazepam – narkotika golongan I",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Diazepam – psikotropika golongan IV",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Diazepam – zat adiktif lain",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Diazepam – psikotropika golongan I",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Fenobarbital – narkotika golongan II",
            "is_correct": false
          }
        ],
        "explanation": "Diazepam adalah turunan benzodiazepin yang digolongkan sebagai psikotropika golongan IV (UU No. 5 Tahun 1997 tentang Psikotropika), yaitu psikotropika yang berkhasiat pengobatan dan berpotensi ringan menimbulkan ketergantungan. Strip BZO mendeteksi metabolit seperti nordiazepam dan oksazepam dalam urin. Diazepam bukan narkotika (opsi A) dan bukan golongan I (opsi D). Fenobarbital juga psikotropika golongan IV, bukan narkotika (opsi E).",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang pengemudi mobil berusia 35 tahun mengalami kecelakaan lalu lintas dan tercium bau alkohol dari napasnya. Penyidik meminta pemeriksaan kadar etanol darah. Analis akan melakukan pengambilan darah vena untuk keperluan tersebut. Prosedur pra-analitik yang paling tepat untuk mencegah hasil positif palsu dan kehilangan etanol dari spesimen adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Desinfeksi kulit dengan swab alkohol 70%, ditampung pada tabung tanpa antikoagulan, tutup",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Desinfeksi kulit dengan povidon iodin atau larutan non-alkohol, ditampung pada tabung",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Desinfeksi kulit dengan swab alkohol 70%, ditampung pada tabung heparin, disimpan pada",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Desinfeksi kulit dengan povidon iodin, ditampung pada tabung EDTA, disimpan pada suhu",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Tanpa desinfeksi kulit, ditampung pada tabung tanpa antikoagulan, disimpan pada suhu",
            "is_correct": false
          }
        ],
        "explanation": "Swab alkohol dapat mengontaminasi spesimen sehingga memberi hasil positif palsu, maka kulit didesinfeksi dengan povidon iodin atau larutan berbasis air. Natrium fluorida menghambat glikolisis dan pertumbuhan mikroba yang dapat memproduksi etanol (atau mengonsumsinya), sedangkan kalium oksalat berfungsi sebagai antikoagulan. Karena etanol mudah menguap, tabung diisi penuh, ditutup rapat, dan disimpan dingin (sekitar 4 °C) sampai dianalisis.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang petani berusia 42 tahun dibawa ke puskesmas 2 jam setelah menyemprot tanaman cabai dengan insektisida tanpa alat pelindung diri. Ia mengeluh mual, muntah, keringat dan air liur berlebihan, serta penglihatan kabur. Pemeriksaan fisik menunjukkan pupil miosis, denyut nadi 52 kali/menit, dan fasikulasi otot. Dokter mencurigai keracunan pestisida golongan organofosfat dan meminta pemeriksaan laboratorium. Pemeriksaan laboratorium yang paling tepat dan hasil yang diharapkan pada kasus ini adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Aktivitas kolinesterase darah – menurun",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Aktivitas kolinesterase darah – meningkat",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Kadar karboksihemoglobin – meningkat",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Kadar methemoglobin – meningkat",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Aktivitas ALT serum – menurun",
            "is_correct": false
          }
        ],
        "explanation": "Organofosfat dan karbamat menghambat enzim asetilkolinesterase sehingga asetilkolin menumpuk di sinaps dan menimbulkan gejala muskarinik (hipersalivasi, miosis, bradikardia), nikotinik (fasikulasi), dan sentral. Indikator laboratorium yang digunakan adalah penurunan aktivitas kolinesterase (eritrosit atau plasma/serum) dibandingkan nilai normal atau nilai dasar pekerja. Pada karbamat, inhibisi bersifat reversibel sehingga spesimen perlu segera diperiksa. Karboksihemoglobin berkaitan dengan keracunan CO, dan methemoglobin dengan nitrat/anilin.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang pekerja berusia 35 tahun di bagian daur ulang aki bekas selama 8 tahun mengeluh nyeri perut hebat berulang, sulit buang air besar, lemas, dan sakit kepala. Pemeriksaan menunjukkan konjungtiva pucat dan garis kebiruan pada tepi gusi. Hasil hematologi menunjukkan anemia mikrositik hipokromik dan apusan darah tepi memperlihatkan basophilic stippling. Dokter mencurigai keracunan timbal kronik dan meminta pemeriksaan kadar timbal. Spesimen yang paling tepat untuk pemeriksaan kadar timbal pada kasus ini adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Darah lengkap (whole blood) dengan antikoagulan EDTA atau heparin bebas logam",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Serum dari tabung tanpa antikoagulan",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Plasma sitrat",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Feses sewaktu",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Saliva",
            "is_correct": false
          }
        ],
        "explanation": "Lebih dari 95% timbal dalam darah terikat pada eritrosit, sehingga kadar timbal darah (blood lead level) diukur dari darah lengkap, bukan serum atau plasma. Tabung yang digunakan harus bebas logam (trace metal free) untuk menghindari kontaminasi. Pengukuran umumnya dengan AAS tungku grafit atau ICP-MS. Gejala kolik abdomen, garis Burton pada gusi, anemia mikrositik hipokromik, dan basophilic stippling khas untuk plumbism.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang penambang emas tradisional berusia 38 tahun selama 2 tahun menggunakan merkuri untuk amalgamasi dan membakar amalgam di dalam rumah tanpa ventilasi. Ia mengeluh tremor pada tangan, mudah marah, gigi goyang, gusi bengkak, air liur berlebihan, dan rasa logam di mulut. Dokter mencurigai intoksikasi merkuri dan meminta pemeriksaan kadar merkuri urin 24 jam. Metode pemeriksaan kadar merkuri yang paling tepat untuk spesimen tersebut adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Spektrofotometri serapan atom nyala (flame AAS) dengan aspirasi langsung",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Spektrofotometri serapan atom teknik uap dingin (CV-AAS) dengan reduksi SnCl₂",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Elektroda selektif ion",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Fotometri nyala",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Turbidimetri",
            "is_correct": false
          }
        ],
        "explanation": "Merkuri merupakan satu-satunya logam yang berbentuk cair dan mudah menguap pada suhu ruang. Pada teknik uap dingin (CV-AAS), Hg²⁺ dalam sampel yang telah didestruksi direduksi menjadi Hg⁰ menggunakan SnCl₂ atau NaBH₄, lalu uap Hg dialirkan ke sel kuarsa dan diukur serapannya pada 253,7 nm. Teknik ini jauh lebih sensitif daripada flame AAS langsung. Urin 24 jam dipakai untuk menilai paparan merkuri elemental/anorganik, sedangkan darah atau rambut lebih sesuai untuk metilmerkuri.",
        "difficulty": "medium"
      },
      {
        "question_text": "Satu keluarga beranggotakan empat orang dibawa ke IGD pada pagi hari setelah tidur di kamar tertutup dengan tungku arang yang menyala sepanjang malam. Semuanya mengeluh sakit kepala berdenyut, pusing, dan mual, dan seorang anak tidak sadar. Kulit tampak kemerahan. Saturasi oksigen pada pulse oximeter konvensional menunjukkan 98% pada udara ruang. Dokter mencurigai keracunan gas karbon monoksida. Pemeriksaan laboratorium yang paling tepat untuk mengonfirmasi dugaan tersebut adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Kadar karboksihemoglobin darah dengan CO-oksimetri",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Kadar methemoglobin darah",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Kadar sulfhemoglobin darah",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Kadar hemoglobin total dan hematokrit",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Kadar tiosianat urin",
            "is_correct": false
          }
        ],
        "explanation": "Karbon monoksida berikatan dengan hemoglobin membentuk karboksihemoglobin (COHb) dengan afinitas sekitar 200–250 kali lebih kuat daripada oksigen, sehingga pengangkutan oksigen terganggu. Pulse oximeter konvensional tidak dapat membedakan COHb dari oksihemoglobin sehingga SpO₂ tampak normal, maka konfirmasi dilakukan dengan CO-oksimetri pada darah heparin yang segera diperiksa. Methemoglobin terkait paparan nitrat atau anilin, sedangkan tiosianat urin berkaitan dengan metabolisme sianida/merokok.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang pekerja pelapisan logam (electroplating) berusia 40 tahun ditemukan kolaps di dekat bak larutan kalium sianida. Penolong mencium bau seperti kacang almond pahit dari napas korban. Korban sesak napas hebat, kejang, dan kulit tampak merah cerah, lalu meninggal dalam perjalanan ke rumah sakit. Laboratorium diminta melakukan uji kualitatif awal pada isi lambung korban untuk membuktikan adanya sianida. Uji kualitatif yang paling tepat untuk mendeteksi sianida pada sampel tersebut adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Uji Reinsch",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Uji Marsh",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Uji Prussian blue (biru Berlin)",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Uji Duquenois-Levine",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Uji Marquis",
            "is_correct": false
          }
        ],
        "explanation": "Pada uji Prussian blue, sampel (setelah didestilasi/mikrodifusi dalam suasana asam) dibuat basa, ditambah FeSO₄ dan dipanaskan sehingga terbentuk ferosianida, kemudian ditambah FeCl₃ dan diasamkan dengan HCl sehingga terbentuk warna biru Prusia. Uji alternatif adalah Guignard (kertas asam pikrat berubah menjadi merah-jingga). Uji Reinsch dan Marsh digunakan untuk arsen/logam berat, Duquenois-Levine untuk ganja, dan Marquis untuk golongan opiat/amfetamin. Kunci Jawaban dan Pembahasan Rekapitulasi kunci jawaban: Soal Kunci Materi blueprint 1 B NAPZA – Narkotika (Ganja/Cannabis) 2 B NAPZA – Narkotika (Morfin/Heroin/Putaw/Opiates) 3 D NAPZA – Psikotropika (Ekstasi/Amfetamin) 4 B NAPZA – Psikotropika (Diazepam) 5 B NAPZA – Zat Adiktif (Etanol) 6 A Pestisida (Organofosfat/Karbamat) 7 A Logam Berat (Timbal) 8 B Logam Berat (Merkuri) 9 A Senyawa Lain (Karbon Monoksida) 10 C Senyawa Lain (Sianida)",
        "difficulty": "medium"
      }
    ]
  },
  {
    "title": "Contoh Soal UKOM D3 Analis Kesehatan",
    "category_slug": "toksikologi-klinik",
    "category_name": "Toksikologi Klinik",
    "description": "10 Soal Kasus Toksikologi Logam Berat (Timbal, Merkuri, Arsen, Kadmium): Pemilihan Spesimen, Praanalitik, dan Metode AAS/CV-AAS.",
    "questions": [
      {
        "question_text": "[Timbal: pemilihan spesimen] Seorang anak laki-laki berusia 4 tahun dibawa ibunya ke puskesmas dengan keluhan nyeri perut berulang, nafsu makan menurun, tampak pucat, dan sulit berkonsentrasi. Keluarga tinggal di samping rumah warga yang mengolah aki bekas, dan anak sering bermain di halaman yang penuh debu dan serpihan peleburan. Hasil hematologi menunjukkan Hb 9,2 g/dL dengan gambaran apusan darah tepi mikrositik hipokrom disertai basophilic stippling. Dokter mencurigai keracunan timbal dan meminta pemeriksaan kadar timbal. Spesimen yang paling tepat untuk menilai paparan timbal pada kasus ini adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Urine sewaktu",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Rambut",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Darah lengkap (whole blood) dengan antikoagulan",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Serum",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Feses",
            "is_correct": false
          }
        ],
        "explanation": "Sekitar 99% timbal dalam darah terikat pada eritrosit, sehingga kadar timbal diperiksa dari darah utuh (whole blood), bukan serum atau plasma. Darah utuh adalah indikator paparan terkini dan menjadi spesimen standar untuk skrining anak. Nilai rujukan CDC (blood lead reference value, 2021) adalah 3,5 μg/dL; kadar di atas itu perlu ditindaklanjuti. Penanda pendukung lain adalah peningkatan ALA urine, penurunan aktivitas enzim ALAD, dan peningkatan zinc protoporphyrin (ZPP).",
        "difficulty": "medium"
      },
      {
        "question_text": "[Timbal: metode pemeriksaan] Laboratorium rujukan menerima spesimen darah anak pada Soal 1. Dokter meminta hasil kuantitatif dengan batas deteksi rendah (satuan μg/dL) untuk menentukan perlu tidaknya terapi kelasi. Metode yang paling sesuai digunakan ATLM untuk memeriksa spesimen tersebut adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Uji Reinsch",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Uji Gutzeit",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Uji Dragendorff",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Spektrofotometri serapan atom (AAS) tungku grafit",
            "is_correct": true
          },
          {
            "option_label": "E",
            "option_text": "Fotometri nyala (flame photometry)",
            "is_correct": false
          }
        ],
        "explanation": "AAS tungku grafit (GF-AAS) atau ICP-MS memiliki sensitivitas pada tingkat μg/L sehingga sesuai untuk kadar timbal darah yang rendah. Uji Reinsch adalah uji kualitatif skrining untuk Hg, As, Sb, dan Bi dengan lempeng tembaga. Uji Gutzeit untuk arsen. Uji Dragendorff untuk alkaloid. Fotometri nyala dipakai untuk logam alkali seperti Na dan K. Metode kolorimetri dengan dithizon (kompleks merah muda) hanya semi-kuantitatif dan kurang sensitif.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Timbal: praanalitik] Seorang ATLM di laboratorium klinik akan mengambil darah vena pekerja pabrik pelapisan logam untuk pemeriksaan kadar timbal. Di ruang pengambilan darah tersedia beberapa jenis tabung vakum. Tabung yang paling tepat digunakan adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Tabung tutup kuning dengan gel separator",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Tabung tutup biru muda berisi natrium sitrat",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Tabung tutup biru royal berisi K2EDTA bebas logam jejak (trace element)",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Tabung tutup abu-abu berisi natrium fluorida",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Tabung tutup merah dengan pewarna karet biasa",
            "is_correct": false
          }
        ],
        "explanation": "Pemeriksaan logam jejak rentan kontaminasi dari tutup karet, pigmen, dan gel separator. Gunakan tabung khusus trace element (tutup biru royal) dengan antikoagulan K2EDTA atau heparin yang telah diuji bebas logam. Sitrat mengencerkan spesimen dan diperuntukkan bagi uji koagulasi. Natrium fluorida untuk glukosa dan alkohol. Tabung bergel dan tutup biasa berisiko membawa kontaminan logam sehingga hasil positif palsu. B. Merkuri (Hg)",
        "difficulty": "medium"
      },
      {
        "question_text": "[Merkuri: spesimen paparan kronis] Seorang pria berusia 38 tahun bekerja di penambangan emas skala kecil. Setiap hari ia melakukan amalgamasi dan membakar amalgam di ruang terbuka tanpa masker. Keluhan yang dialami adalah tremor halus pada tangan, gusi bengkak dan mudah berdarah, air liur berlebih, rasa logam di mulut, serta mudah marah dan cemas. Spesimen yang paling tepat untuk menilai paparan merkuri elemental pada pasien ini adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Urine, dikoreksi dengan kreatinin",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Rambut",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Serum",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Feses",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Cairan serebrospinal",
            "is_correct": false
          }
        ],
        "explanation": "Merkuri elemental dan anorganik terutama diekskresikan melalui ginjal, sehingga urine (24 jam atau sewaktu yang dikoreksi kreatinin) adalah spesimen pilihan. Sebagai acuan, ACGIH BEI untuk merkuri urine pekerja adalah 20 μg/g kreatinin. Darah utuh dan rambut lebih sesuai untuk metilmerkuri. Gejala pada vignette (tremor, gingivitis, hipersalivasi, eretisme) khas keracunan merkuri elemental kronis.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Merkuri: prinsip metode CV-AAS] Laboratorium lingkungan dan klinik memeriksa kadar merkuri total pada urine pekerja menggunakan Cold Vapor AAS (CV-AAS). Sebelum pengukuran, sampel didestruksi agar semua bentuk merkuri menjadi Hg2+. Pereaksi yang digunakan untuk mereduksi Hg2+ menjadi Hg0 sehingga dapat diuapkan ke sel absorpsi adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Dithizon",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Kalium bikromat",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Stannous klorida (SnCl2)",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Perak nitrat",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Barium klorida",
            "is_correct": false
          }
        ],
        "explanation": "Pada CV-AAS, Hg2+ direduksi menjadi Hg0 oleh SnCl2 (atau NaBH4), lalu uap merkuri dialirkan oleh gas pembawa ke sel kuarsa dan diukur pada panjang gelombang 253,7 nm tanpa atomisasi dengan nyala. Dithizon adalah pengompleks logam untuk kolorimetri, kalium bikromat adalah oksidator, perak nitrat dan barium klorida adalah pereaksi pengendap anion.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Merkuri: bentuk senyawa penyebab] Warga sebuah desa pesisir selama bertahun-tahun mengonsumsi ikan dan kerang dari teluk yang menerima limbah industri. Sebagian warga mengalami parestesia, ataksia, gangguan bicara, dan penyempitan lapang pandang. Beberapa bayi lahir dengan keterlambatan perkembangan berat meskipun ibunya tampak sehat. Bentuk merkuri yang paling mungkin menjadi penyebab keracunan pada kasus ini adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Merkuri elemental (Hg0)",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Merkuri klorida (HgCl2)",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Metilmerkuri",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Merkuri sulfida (sinabar)",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Fenilmerkuri asetat",
            "is_correct": false
          }
        ],
        "explanation": "Gambaran ini sesuai penyakit Minamata. Merkuri anorganik di perairan diubah mikroorganisme menjadi metilmerkuri yang terbioakumulasi dalam rantai makanan laut. Metilmerkuri mudah menembus sawar darah otak dan plasenta sehingga merusak sistem saraf pusat dan janin. Spesimen yang dianjurkan adalah darah utuh dan rambut (rambut mencerminkan paparan beberapa minggu sampai bulan). C. Arsen (As)",
        "difficulty": "medium"
      },
      {
        "question_text": "[Arsen: spesimen paparan kronis] Warga sebuah dusun memakai air sumur bor sebagai air minum selama lebih dari 5 tahun. Pemeriksaan fisik menemukan hiperpigmentasi kulit berbentuk bercak seperti tetesan hujan (raindrop), hiperkeratosis telapak tangan dan kaki, serta garis putih melintang pada kuku (Mees' lines). Dokter ingin mengetahui paparan arsen selama beberapa bulan terakhir. Spesimen yang paling tepat untuk menilai paparan kronis tersebut adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Rambut dan kuku",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Serum",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Feses",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Saliva",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Cairan lambung",
            "is_correct": false
          }
        ],
        "explanation": "Arsen berikatan dengan gugus sulfhidril keratin sehingga terakumulasi di rambut dan kuku, dan menjadi spesimen yang baik untuk paparan kronis (bulan hingga tahun). Urine dipakai untuk paparan akut atau paparan terkini karena arsen cepat dieliminasi lewat urine (waktu paruh beberapa hari). Darah kurang bermanfaat karena arsen cepat meninggalkan sirkulasi. Batas arsen air minum menurut WHO adalah 10 μg/L.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Arsen: uji kualitatif] Seorang ATLM mendapat kiriman sampel cairan lambung dan air minum dari kasus dugaan keracunan arsen. Skrining dilakukan dengan menambahkan seng dan HCl ke dalam sampel dalam labu reaksi. Gas yang terbentuk dialirkan ke kertas saring yang telah dibasahi merkuri(II) bromida, dan kertas berubah menjadi kuning kecokelatan. Uji yang dilakukan ATLM tersebut adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Uji Reinsch",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Uji Gutzeit",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Uji Dragendorff",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Uji Fujiwara",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Uji Duquenois-Levine",
            "is_correct": false
          }
        ],
        "explanation": "Uji Gutzeit mereduksi arsen menjadi gas arsin (AsH3) yang bereaksi dengan HgBr2 membentuk noda kuning hingga cokelat. Uji Reinsch memakai lempeng tembaga dalam suasana asam yang berubah abu-abu gelap atau mengilap pada keberadaan As, Hg, Sb, dan Bi. Uji Dragendorff untuk alkaloid, Fujiwara untuk senyawa hidrokarbon terklorinasi, dan Duquenois-Levine untuk kanabinoid.",
        "difficulty": "medium"
      },
      {
        "question_text": "[Arsen: interpretasi hasil dan komunikasi] Seorang pasien datang dengan keluhan mual dan nyeri perut ringan. Hasil pemeriksaan urine sewaktu menunjukkan arsen total 450 μg/L (di atas nilai rujukan). Pada anamnesis, pasien mengaku makan kerang dan ikan laut sehari sebelum pengambilan sampel. Tindakan ATLM yang paling tepat adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Melaporkan hasil sebagai keracunan arsen anorganik",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Menolak dan membuang sampel tanpa memberi tahu dokter",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Menginformasikan kepada dokter kemungkinan interferensi arsen organik dari makanan laut,",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Mengencerkan sampel sampai hasil masuk rentang normal",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Mengganti spesimen dengan serum tanpa persetujuan dokter",
            "is_correct": false
          }
        ],
        "explanation": "Makanan laut mengandung arsenobetain dan arsenokolin, yaitu arsen organik yang relatif tidak toksik dan dapat meningkatkan arsen total urine. Karena itu hasil arsen total perlu diinterpretasi bersama riwayat makanan. ATLM berkomunikasi dengan dokter, dan pemeriksaan dapat diulang setelah pasien menghindari makanan laut sekitar 48–72 jam atau dilakukan spesiasi (arsen anorganik dan metabolit metilasinya). Memanipulasi sampel atau menyembunyikan hasil melanggar etika profesi. D. Soal Pengayaan: Kadmium (Cd)",
        "difficulty": "medium"
      },
      {
        "question_text": "[Kadmium: penanda kerusakan ginjal] Seorang pria berusia 52 tahun, perokok berat, telah 20 tahun bekerja di pabrik baterai nikel- kadmium. Ia mengeluh nyeri tulang dan pinggang. Urinalisis menunjukkan proteinuria dengan kadar albumin urine normal. Dokter mencurigai kerusakan tubulus proksimal akibat kadmium. Pemeriksaan penunjang yang paling sesuai untuk menilai kerusakan tubulus akibat paparan kadmium adalah ....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Mikroalbumin urine",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "β2-mikroglobulin urine",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Kreatinin serum",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Asam urat serum",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Amilase serum",
            "is_correct": false
          }
        ],
        "explanation": "Kadmium terikat metalotionein dan menumpuk di tubulus proksimal ginjal (waktu paruh biologis puluhan tahun). Kerusakan tubulus ditandai proteinuria berat molekul rendah, misalnya β2-mikroglobulin, dengan albumin normal. Kadmium urine (ACGIH BEI 5 μg/g kreatinin) mencerminkan beban tubuh, sedangkan kadmium darah mencerminkan paparan terkini. Kadmium kronis berkaitan dengan penyakit itai-itai.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "title": "SOAL & PEMBAHASAN PARASIT",
    "category_slug": "parasitologi",
    "category_name": "Parasitologi",
    "description": "21 Soal Kasus Parasitologi dan Mikologi: Helmintologi (Nematoda, Cestoda, Trematoda), Protozoologi Usus & Darah, serta Identifikasi Jamur.",
    "questions": [
      {
        "question_text": "Seorang laki-laki berusia 38 tahun berasal dari daerah endemis. Diduga schistosoma dan pada hasil pemeriksaan feses menunjukkan telur berbentuk oval, dengan duri pada salah satu ujungnya (terminal spine). Parasit yang paling mungkin adalah...",
        "options": [
          {
            "option_label": "A",
            "option_text": "Schistosoma mansoni",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "enterobius vermicularis",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "schistosoma haematobium",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "schistosoma japonicum",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "fasciola hepatica",
            "is_correct": false
          }
        ],
        "explanation": "Schistosoma haematobium merupakan spesies Schistosoma yang memiliki telur berbentuk oval dengan duri di ujung telur (terminal spine). Shistosoma japonicum telurnya lebih bulat dengan tonjolan kecil (rudimentary lateral spine) sehingga tidak memiliki terminal spine. Shistosoma mansoni telurnya berbentuk oval dengan duri besar di sisi telur (lateral spine)",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang ATLM melakukan pemeriksaan mikroskopis sediaan feses dengan preparat basah. Pada pengamatan ditemukan protozoa berbentuk buah pir, memiliki 2 inti dengan titik kariosom di tengah, serta 4 pasang flagel sebagai alat gerak. Apa nama parasit tersebut...",
        "options": [
          {
            "option_label": "A",
            "option_text": "Entamoeba histolytica",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Trichomonas vaginalis",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Giardia lamblia",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Balantidium coli",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Entamoeba coli",
            "is_correct": false
          }
        ],
        "explanation": "Giardia lamblia (juga dikenal sebagai Giardia duodenalis atau Giardia intestinalis) merupakan protozoa usus yang pada stadium trofozoit memiliki ciri morfologi khas berupa: • Berbentuk buah pir (pear-shaped/tear drop) • Memiliki 2 inti dengan kariosom di tengah • Memiliki 4 pasang flagel (8 flagel) sebagai alat gerak • Memiliki cakram pengisap (ventral sucking disc) untuk melekat pada mukosa usus halus",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang pasien mengalami keluhan bercak hipopigmentasi pada permukaan kulit. Sampel berupa kerokan kulit diperiksa secara mikologi dan ditanam pada media Sabouraud Dextrose Agar (SDA). Setelah inkubasi, ditemukan pertumbuhan koloni jamur. Bagaimanakah karakteristik koloni yang paling sesuai dengan penyebab kelainan tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Koloni berwarna putih kekuningan, dengan konsistensi lunak, creamy, halus,",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Koloni berwarna hitam pekat, konsistensi kering, kasar, seperti bubuk (powdery).",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Koloni berwarna hijau kebiruan, konsistensi berbulu tebal seperti kapas (cottony).",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Koloni berwarna merah muda, konsistensi keras, berkerut, dan permukaan kasar.",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Koloni berwarna coklat tua, konsistensi kering, rapuh, dan mudah terkelupas.",
            "is_correct": false
          }
        ],
        "explanation": "Pembahasan parasitologi laboratorium medik.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang pasien dicurigai mengalami infeksi cacing usus. Sampel feses diperiksa menggunakan teknik yang dapat menentukan berat ringannya infeksi berdasarkan jumlah telur cacing. Metode yang digunakan adalah...",
        "options": [
          {
            "option_label": "A",
            "option_text": "Metode natif",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Metode Kato-Katz",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Metode apung",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Metode Baermann",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Metode kultur",
            "is_correct": false
          }
        ],
        "explanation": "Kato-Katz merupakan metode standar untuk menghitung jumlah telur cacing secara kuantitatif dari feses. Hasil dinyatakan dalam telur per gram tinja (EPG). • Metode natif : Digunakan untuk pemeriksaan feses secara langsung guna melihat adanya telur, larva, atau protozoa, tetapi tidak dapat menentukan derajat infeksi • Metode apung : Digunakan untuk mengkonsentrasikan telur cacing yang berat jenisnya lebih ringan daripada larutan apung, bukan untuk menghitung EPG. • Metode Baermann : Digunakan untuk mengisolasi larva cacing, terutama Strongyloides stercoralis, dari sampel feses. • Metode kultur : Digunakan untuk menumbuhkan larva cacing guna identifikasi spesies, bukan menentukan berat infeksi.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang ATLM melakukan pemeriksaan feses menggunakan metode natif pada pasien yang diduga mengalami infeksi kecacingan. Hasil pemeriksaan tidak ditemukan telur cacing, tetapi berdasarkan gejala klinis dan diagnosis dokter pasien masih dicurigai mengalami infeksi parasit usus. Tindakan pemeriksaan selanjutnya yang paling tepat adalah menggunakan metode...",
        "options": [
          {
            "option_label": "A",
            "option_text": "Metode flotasi",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Metode sedimentasi",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Metode Kato-Katz",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Metode Baermann",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Metode kultur",
            "is_correct": false
          }
        ],
        "explanation": "Metode flotasi memanfaatkan perbedaan berat jenis antara telur cacing dan larutan flotasi sehingga telur dapat naik ke permukaan dan mudah diamati. Metode ini dapat digunakan sebagai metode konsentrasi setelah pemeriksaan natif negatif.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang ATLM melakukan pemeriksaan sampel air dari lingkungan yang dicurigai menjadi tempat perkembangbiakan nyamuk. Pada pengamatan mikroskopis ditemukan larva nyamuk yang sering mengapung sejajar dengan permukaan air, tidak memiliki sifon pernapasan, dan tubuhnya tampak mendatar. Larva nyamuk tersebut kemungkinan berasal dari genus...",
        "options": [
          {
            "option_label": "A",
            "option_text": "Aedes",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Culex",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Anopheles",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Mansonia",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Armigeres",
            "is_correct": false
          }
        ],
        "explanation": "• Larva Anopheles memiliki ciri khas yaitu tidak memiliki sifon pernapasan, sehingga saat mengambil udara larva akan mengapung sejajar dengan permukaan air. • Larva Aedes memiliki sifon yang pendek dan gemuk, larva menggantung membentuk sudut 45 derajat terhadap permukaan air • Larva Culex memiliki sifon panjang dan ramping sehingga menggantung miring 45 derajat di permukaan air • Larva Mansonia memiliki sifon yang digunakan untuk menusuk akar atau batang tumbuhan air guna mengambil oksigen, sehingga tidak perlu naik ke permukaan air. • Larva Armigeres memiliki sifon relatif panjang dan kuat, larva menggantung miring di permukaan air, mirip Culex, tetapi umumnya ditemukan di air yang kaya bahan organik.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang ATLM menerima informasi bahwa pasien mengalami demam tinggi, nyeri sendi, dan ruam kulit. Dokter mencurigai pasien mengalami penyakit chikungunya yang ditularkan melalui gigitan nyamuk. Nyamuk yang berperan sebagai vektor utama penyakit tersebut adalah...",
        "options": [
          {
            "option_label": "A",
            "option_text": "Anopheles sp.",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Culex sp.",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Aedes sp.",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Mansonia sp.",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Armigeres sp.",
            "is_correct": false
          }
        ],
        "explanation": "Chikungunya disebabkan oleh virus chikungunya (genus Alphavirus) dan ditularkan terutama oleh nyamuk Aedes aegypti serta Aedes albopictus. Nyamuk ini juga merupakan vektor penyakit dengue.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada pemeriksaan preparat darah pasien filariasis ditemukan mikrofilaria. Dokter meminta identifikasi spesies berdasarkan morfologi. Hasil pengamatan: • Panjang tubuh lebih besar dibanding lebar • Inti tubuh teratur • Ujung ekor tidak memiliki inti Spesies yang dapat dibandingkan dengan ciri tersebut adalah...",
        "options": [
          {
            "option_label": "A",
            "option_text": "Wuchereria bancrofti",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Brugia malayi",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Loa loa",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Brugia timori",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Ascaris lumbricoides",
            "is_correct": false
          }
        ],
        "explanation": "Pembahasan parasitologi laboratorium medik.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang ATLM melakukan pemeriksaan kultur jamur dari kerokan kulit pasien dengan dugaan dermatofitosis. Pada media SDA ditemukan koloni jamur yang diduga merupakan Epidermophyton floccosum. Manakah karakteristik yang sesuai dengan jamur tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Mikrokonidia berbentuk bulat bergerombol seperti anggur, dan hifa melingkar",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Makrokonidia seperti tetesan air mata, berdinding halus, dan hifa lurus bersekat.",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Makrokonida berbentuk seperti spindle (ujung atas tumpul), berdinding tipis",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Makrokonidia berbentuk gada, berdinding tipis dengan 2-4 sel.",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Makrokonidia berbentuk kumparan yang berunjung runcing, berdinding tebal",
            "is_correct": false
          }
        ],
        "explanation": "Berikut adalah jawaban ciri-ciri dari pilihan ganda di atas a. Tricophyton mentagrophytes b. Tricophyton rubrum c. Microsporum gypseum d. Epidermophyton floccosum e. Micrsoporum canis",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang ATLM melakukan pemeriksaan malaria dengan membuat sediaan darah tebal dan sediaan darah tipis dari sampel darah pasien. Setelah kedua sediaan dibuat dan dikeringkan, dilakukan tahap persiapan sebelum pewarnaan. Tahapan selanjutnya yang tepat adalah...",
        "options": [
          {
            "option_label": "A",
            "option_text": "Melakukan fiksasi pada sediaan darah tebal menggunakan metanol",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Melakukan fiksasi pada sediaan darah tipis menggunakan metanol",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Melakukan hemolisis pada sediaan darah tipis",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Melakukan pewarnaan langsung tanpa fiksasi",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Melakukan pelisisan eritrosit pada sediaan darah tipis",
            "is_correct": false
          }
        ],
        "explanation": "Pada pemeriksaan malaria: Sediaan darah tipis → difiksasi menggunakan metanol agar eritrosit dan parasit tetap melekat pada kaca objek. Sediaan darah tebal → tidak difiksasi, karena eritrosit harus mengalami lisis agar parasit lebih mudah ditemukan.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang ATLM melakukan pemeriksaan langsung kerokan kulit pasien dengan lesi hipopigmentasi. Sampel ditambahkan KOH dan diamati dengan mikroskop. Hasil mikroskopis yang diharapkan pada infeksi Malassezia furfur adalah...",
        "options": [
          {
            "option_label": "A",
            "option_text": "Hifa bersepta panjang dengan makrokonidia kasar",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Hifa pendek dan spora bulat yang tersusun berkelompok",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Hifa bercabang seperti pohon dengan konidia berantai",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Sel ragi besar dengan pseudohifa panjang",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Sporangium berisi banyak sporangiospore",
            "is_correct": false
          }
        ],
        "explanation": "Malassezia furfur pada KOH memberikan gambaran: • Ragi bulat (yeast cell) • Hifa pendek dan melengkung • Susunan khas seperti spaghetti (hifa pendek seperti benang) dan meatballs (Kumpulan spora/ragi bulat)",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada pemeriksaan feses dengan metode flotasi, sampel dicampurkan dengan larutan garam jenuh kemudian didiamkan hingga terbentuk permukaan cembung sebelum ditutup dengan kaca penutup. Prinsip kerja larutan garam jenuh adalah...",
        "options": [
          {
            "option_label": "A",
            "option_text": "Mengubah bentuk telur menjadi lebih besar",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Memisahkan telur parasit berdasarkan perbedaan berat jenis",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Menghancurkan sisa makanan dalam feses",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Menghambat pertumbuhan bakteri",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Melarutkan dinding telur cacing",
            "is_correct": false
          }
        ],
        "explanation": "Metode flotasi bekerja berdasarkan perbedaan berat jenis. Telur cacing yang lebih ringan dibandingkan larutan akan naik ke permukaan, sedangkan debris feses yang lebih berat akan turun. Dikarenakan larutan garam jenuh memiliki berat jenis yang lebih tinggi dibandingkan telur cacing, sehingga telur cacing akan terdorong naik ke permukaan (mengapung).",
        "difficulty": "medium"
      },
      {
        "question_text": "Hasil pemeriksaan feses pasien menunjukkan adanya telur cacing dengan bentuk oval, ukuran besar, dinding tebal tiga lapis, dan terdapat lapisan luar yang tidak rata. Kesimpulan hasil pemeriksaan tersebut adalah pasien kemungkinan terinfeksi",
        "options": [
          {
            "option_label": "A",
            "option_text": "Ascaris lumbricoides",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Trichuris trichiura",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Enterobius vermicularis",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Ancylostoma duodenale",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Ancylostoma caninum",
            "is_correct": false
          }
        ],
        "explanation": "a. Ascaris lumbricoides: memiliki 3 lapisan (albuminoid, kitin, dan vitelin) b. Trichuris trichiura: bentuk seperti tempayan, memiliki mucoid plug di kedua ujungnya c. Enterobius vermicularis: bentuk asimetris, dinding transparan dan hanya 1 lapisan d. Ancylostoma duodenale & Ancylostoma caninum (hookworm): bentuk oval, memiliki lapisan transparan, berisi 2-8 sel",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang ATLM melakukan pemeriksaan feses secara mikroskopis. Pada preparat ditemukan telur cacing dengan ciri adanya lapisan albuminoid, tetapi bagian inti sel tampak buram dan kurang jelas terlihat. Tindakan yang tepat dilakukan ATLM adalah...",
        "options": [
          {
            "option_label": "A",
            "option_text": "Mengganti preparat dengan sampel baru",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Menambahkan pewarna Giemsa pada preparat",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Menggeser pengamatan ke perbesaran 400X untuk melihat struktur lebih",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Mengulang pemeriksaan menggunakan metode kultur",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Menghentikan pemeriksaan karena hasil tidak dapat dibaca",
            "is_correct": false
          }
        ],
        "explanation": "Jika objek telur cacing sudah ditemukan tetapi struktur internal (inti/embrio) belum jelas, ATLM dapat meningkatkan pembesaran mikroskop dari objektif 10X ke 40X (total 400X) untuk melihat detail morfologi telur lebih jelas. Perbesaran 400X digunakan untuk melihat detail morfologi telur parasit seperti inti, embrio, atau struktur dinding telur.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang perempuan berusia 25 tahun datang ke rumah sakit dengan keluhan sakit perut, mual, muntah, dan diare sejak 3 hari yang lalu. Dari hasil anamnesis diketahui bahwa pasien memiliki kebiasaan mengonsumsi daging sapi yang dimasak setengah matang. Dokter meminta pemeriksaan feses untuk menegakkan diagnosis. Parasit yang paling mungkin menginfeksi pasien adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Taenia saginata",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Taenia solium",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Ascaris lumbricoides",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Trichuris trichiura",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Ancylostoma duodenale",
            "is_correct": false
          }
        ],
        "explanation": "Pasien memiliki riwayat mengonsumsi daging sapi yang dimasak setengah matang, yang merupakan faktor risiko utama infeksi Taenia saginata. Manusia terinfeksi setelah memakan larva yang terdapat pada daging sapi yang tidak matang. Kata kunci Taenia solium = ditularkan melalui daging babi, bukan sapi Ascaris lumbricoides = penularannya melalui telur infektif dari tanah/makanannya yang terkontaminasi Trichuris trichiura = penularan melalui telur infektif yang tertelan dari makanan atau tangan yang terkontaminasi Ancylostoma duodenale = larva menembus kulit saat kontak dengan tanah yang tercemar",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang ATLM melakukan pemeriksaan feses secara mikroskopis untuk mengetahui adanya lemak netral pada sampel feses pasien yang mengalami diare kronis dan dicurigai mengalami malabsorpsi. Agar butiran lemak tampak jelas di bawah mikroskop, reagen yang paling tepat digunakan adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Lugol",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Eosin 2%",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Sudan III",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Metilen biru",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "NaCl fisiologis 0,85%",
            "is_correct": false
          }
        ],
        "explanation": "Pemeriksaan lemak feses dilakukan untuk mendeteksi lemak netral. Reagen yang digunakan adalah Sudan III, karena merupakan pewarna yang larut dalam lemak sehingga butiran lemak akan tampak berwarna merah jingga hingga oranye di bawah mikroskop. Kata kunci Lugol = digunakan untuk memperjelas inti protozoa dan glikogen, bukan lemak Eosin 2% = digunakan pada pemeriksaan feses natif sebagai pewarna latar belakang / sisa makanan pada preparat Metilen biru = digunakan sebagai pewarna bakteri/sel tertentu, bukan lemak NaCl fisiologis 0,85% = hanya sebagai media preparat basah, untuk mempertahankan bentuk dan motilitas parasit hidup",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang pasien mengalami pembengkakan kaki kronis. Dokter mencurigai infeksi filariasis. ATLM membuat sediaan darah tebal dan tipis, tetapi tidak ditemukan mikrofilaria. Setelah ditinjau kembali, diketahui darah diambil pada pagi hari. Perbaikan prosedur yang harus dilakukan adalah...",
        "options": [
          {
            "option_label": "A",
            "option_text": "Mengambil darah ulang pada malam hari dan membuat sediaan baru",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Mikrofilaria hanya terdapat pada jaringan kulit",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Darah seharusnya diambil menggunakan darah vena, bukan darah kapiler",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Pasien pasti tidak mengalami filariasis",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Mikrofilaria hanya ditemukan pada feses",
            "is_correct": false
          }
        ],
        "explanation": "Pemeriksaan mikrofilaria membutuhkan waktu pengambilan yang tepat. Pengambilan darah malam hari meningkatkan kemungkinan menemukan mikrofilaria karena sifat nokturnal periodicity",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang ibu membawa anaknya ke puskesmas dengan keluhan gatal-gatal di daerah perianal (sekitar anus), terutama pada malam hari sehingga anak sulit tidur. Dokter meminta Analis Kesehatan untuk melakukan pengambilan sampel. Metode pengambilan sampel apakah yang paling tepat untuk menegakkan diagnosis kasus di atas?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Metode Kato-Katz",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Metode Sedimentasi (Pengendapan)",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Metode Flotasi (Apung)",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Metode Anal Swab menggunakan Scotch adhesive tape",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Pemeriksaan feses langsung dengan eosin 2%",
            "is_correct": false
          }
        ],
        "explanation": "Keluhan gatal di daerah perianal terutama pada malam hari merupakan gejala khas infeksi Enterobius vermicularis. Cacing betina keluar pada malam hari untuk bertelur di lipatan kulit sekitar anus, sehingga telur jarang ditemukan dalam feses. Oleh karena itu, metode pengambilan sampel yang paling tepat adalah anal swab menggunakan Scotch adhesive tape (Graham method), yang dilakukan pagi hari sebelum mandi atau buang air besar agar telur dapat terambil secara optimal.",
        "difficulty": "medium"
      },
      {
        "question_text": "Metode laboratorium yang direkomendasikan untuk menghitung intensitas infeksi cacing usus berdasarkan jumlah telur per gram tinja adalah...",
        "options": [
          {
            "option_label": "A",
            "option_text": "Apusan langsung",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Kato-Katz",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Graham",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Flotasi",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Harada-Mori",
            "is_correct": false
          }
        ],
        "explanation": "Metode Kato-Katz technique merupakan metode standar yang direkomendasikan untuk menghitung intensitas infeksi cacing usus dengan menentukan jumlah telur per gram tinja (Eggs Per Gram/EPG). Hasil EPG digunakan untuk menilai derajat infeksi (ringan, sedang, atau berat), terutama pada infeksi Ascaris lumbricoides, Trichuris trichiura, dan Schistosoma mansoni.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang Analis Teknologi Laboratorium Medik melakukan pemeriksaan feses dengan metode sediaan langsung. Pada pemeriksaan mikroskopis ditemukan telur berbentuk oval, berdinding tipis dan bening, serta di dalamnya tampak blastomer. Parasit yang paling mungkin ditemukan adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Ascaris lumbricoides",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Trichuris trichiura",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Ancylostoma duodenale",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Taenia saginata",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Enterobius vermicularis",
            "is_correct": false
          }
        ],
        "explanation": "Telur Ancylostoma duodenale memiliki ciri khas berbentuk oval, berdinding tipis dan bening, serta berisi blastomer (stadium pembelahan sel). Ciri morfologi ini merupakan karakteristik khas telur cacing tambang (hookworm) yang ditemukan pada pemeriksaan feses. Kata kunci Ascaris lumbricoides = telurnya berdinding tebal dengan 3 lapisan Trichuris trichiura = berbentuk seperti tempayan dengan mucoid plug di kedua kutub Taenia saginata = telur bulat dengan dinding tebal dan bersti radial Enterobius vermicularis = telur berbentuk planokonveks (satu sisi datar dan satu sisi cembung)",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang Analis Teknologi Laboratorium Medik melakukan pemeriksaan mikroskopis feses. Pada preparat ditemukan bentuk amoeba yang mengandung eritrosit di dalam sitoplasmanya. Stadium parasit yang ditemukan adalah....",
        "options": [
          {
            "option_label": "A",
            "option_text": "Kista muda",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Kista matang",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Trofozoit",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Metakista",
            "is_correct": false
          },
          {
            "option_label": "E",
            "option_text": "Prekista",
            "is_correct": false
          }
        ],
        "explanation": "Pada preparat feses ditemukan bentuk amoeba yang mengandung eritrosit di dalam sitoplasmanya. Kemampuan memfagositosis eritrosit hanya dimiliki oleh stadium trofozoit, yaitu stadium aktif yang bergerak, mencari makan, dan berkembang biak. Sebaliknya, stadium kista muda, kista matang, metakista, maupun prekista merupakan stadium tidak aktif sehingga tidak mengandung eritrosit di dalam sitoplasma. Oleh karena itu, stadium parasit yang ditemukan adalah trofozoit.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "title": "soal UKOM sitohistoteknologi",
    "category_slug": "sitohistoteknologi",
    "category_name": "Sitohistoteknologi",
    "description": "Kumpulan soal vignette kasus teknik laboratorium sitopatologi dan histopatologi.",
    "questions": [
      {
        "question_text": "Seorang TLM melakukan pembuatan preparat sitologi. Pada pengamatan mikroskopis, ditemukan sediaan dengan sitoplasma kecil dan inti sel tampak pucat. Diketahui pada prosesnya, sediaan tersebut dibiarkan mengering selama 5 menit terlebih dahulu sebelum difiksasi dengan alkohol 95%. Apakah penyebab dari perubahan morfologi sel tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Fiksasi alkohol yang terlalu pekat",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Air drying artifact",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Pewarnaan papaniculaou yang tidak optimal",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Kontaminasi sediaan oleh zat asing",
            "is_correct": false
          }
        ],
        "explanation": "Sediaan sitologi yang dibiarkan mengering di udara sebelum difiksasi dengan alkohol 95% akan mengalami air drying artifact, ditandai pembesaran semu atau penciutan sitoplasma dan inti sel tampak pucat/kabur.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada pembuatan sediaan sitologi dari spesimen FNAB, seorang TLM menggunakan teknik squash. Namun, saat diamati di bawah mikroskop, sel-sel terlihat gepeng dan inti sel mengalami distorsi. Apakah penyebab terjadinya kerusakan morfologi sel tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Waktu fiksasi yang terlalu singkat",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Tekanan mekanis berlebihan saat squash",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Penggunaan larutan fiksatif yang tidak sesuai",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Kontaminasi bakteri pada spesimen",
            "is_correct": false
          }
        ],
        "explanation": "Tekanan mekanis yang berlebihan pada teknik squash apusan FNAB menyebabkan sel-sel hancur, gepeng (flattening), dan inti mengalami distorsi atau crush artifact.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada pengamatan mikroskopis sediaan histopatologi, ditemukan kondisi di mana inti sel terlihat pucat dan batas kromatin tidak dapat dikenali, tetapi warna sitoplasma tetap berwarna merah muda secara normal. Apakah faktor yang menyebabkan kegagalan pewarnaan inti tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Over diferensiasi atau PH hematoksilin tidak sesuai",
            "is_correct": true
          },
          {
            "option_label": "B",
            "option_text": "Konsentrasi Eosin terlalu tinggi",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Dehidrasi jaringan yang tidak sempurna",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Waktu deparafinisasi yang terlalu lama.",
            "is_correct": false
          }
        ],
        "explanation": "Inti sel yang pucat dengan sitoplasma normal pada HE umumnya disebabkan oleh waktu diferensiasi asam alkohol yang terlalu lama (over-differentiation) atau pH larutan hematoksilin yang tidak optimal.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang ATLM melakukan evaluasi terhadap hasil pengecatan sediaan sitologi dengan pewarnaan Papanicolaou. Pada pengamatan mikroskopis, ditemukan ciri-ciri sel tampak pudar, sitoplasma mengkerut, dan pinggiran sel terlihat terlipat. Apakah penyebab dari terjadinya kondisi sel tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Pewarnaan papanicolaou yang terlalu lama",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Fiksasi tidak adekuat atau terlambat ( air drying artifact )",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Kontaminasi larutan alkohol dengan air",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Suhu inkubasi yang terlalu tinggi",
            "is_correct": false
          }
        ],
        "explanation": "Keterlambatan fiksasi basah pada pewarnaan Papanicolaou memicu pengeringan parsial (air drying artifact) yang menyebabkan sel pudar, sitoplasma mengkerut, dan batas sel melipat.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada pewarnaan Histopatologi menggunakan metode Pewarnaan Hematoxylin & Eosin (H&E). Warna apakah yang terbentuk pada inti sel tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Merah muda",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Biru tua hingga ungu",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Kuning kecoklatan",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Oranye kuning",
            "is_correct": false
          }
        ],
        "explanation": "Hematoksilin merupakan pewarna basa yang memiliki afinitas tinggi terhadap asam nukleat (kromatin inti sel) sehingga mewarnai inti sel menjadi biru tua hingga ungu.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang TLM melakukan pengamatan mikroskopis pada preparat jaringan hati. Berdasarkan hasil pengecatan, apa warna inti sel pada sediaan hepatosit yang sudah diwarnai dengan pewarnaan hematoksilin eosin?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Merah cerah",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Hijau kebiruan",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Biru keunguan",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Merah tua",
            "is_correct": false
          }
        ],
        "explanation": "Pada pewarnaan hematoksilin-eosin (HE) standar, inti sel hepatosit terwarnai biru keunguan oleh hematoksilin, sedangkan sitoplasma terwarnai merah muda oleh eosin.",
        "difficulty": "medium"
      },
      {
        "question_text": "Dalam tahapan pewarnaan jaringan histopatologi, dilakukan suatu proses yang bertujuan untuk menghilangkan kadar air sisa setelah sediaan diwarnai dengan Hematoxylin. Apakah nama tahapan pemrosesan jaringan yang dimaksud?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Clearing",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Dehidrasi",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Deparafinasi",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Mounting",
            "is_correct": false
          }
        ],
        "explanation": "Dehidrasi menggunakan serial alkohol bertingkat bertujuan untuk menarik sisa air dari jaringan setelah pewarnaan Hematoksilin-Eosin sebelum masuk ke tahap clearing dengan xilena.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada evaluasi sediaan histopatologi setelah pewarnaan, di bawah mikroskop terlihat adanya artefak berupa endapan berwarna biru tua yang tersebar di atas preparat jaringan. Apakah yang menyebabkan hal tersebut?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Over staining dengan Eosin",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Presipitasi larutan hematoksilin yang tidak disaring",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Kontaminasi Mounting media",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Deparafinisasi tidak sempurna",
            "is_correct": false
          }
        ],
        "explanation": "Endapan butiran biru gelap atau artefak presipitasi di atas jaringan disebabkan oleh larutan hematoksilin yang sudah teroksidasi membentuk lapisan kemilau dan tidak disaring sebelum digunakan.",
        "difficulty": "medium"
      },
      {
        "question_text": "Pada sediaan sitologi yang diwarnai dengan pewarnaan Giemsa, warna apakah yang akan terbentuk pada inti sel?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Merah muda pucat",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Kuning kecoklatan",
            "is_correct": false
          },
          {
            "option_label": "C",
            "option_text": "Ungu tua hingga merah keunguan",
            "is_correct": true
          },
          {
            "option_label": "D",
            "option_text": "Hijau kebiruan",
            "is_correct": false
          }
        ],
        "explanation": "Pada pewarnaan Giemsa atau kelompok Romanowsky, komponen azur dan metilen biru mengikat gugus fosfat DNA sehingga inti sel terwarnai ungu tua hingga merah keunguan.",
        "difficulty": "medium"
      },
      {
        "question_text": "Seorang ATLM sedang melakukan pengamatan mikroskopis terhadap sediaan jaringan usus yang telah selesai diwarnai. Pada saat diperiksa, tampak jaringan sobek. Apa yang menjadi penyebab utama terjadinya kerusakan sediaan?",
        "options": [
          {
            "option_label": "A",
            "option_text": "Pewarnaan H&E yang terlalu lama",
            "is_correct": false
          },
          {
            "option_label": "B",
            "option_text": "Kesalahan teknik pemotongan mikrotom",
            "is_correct": true
          },
          {
            "option_label": "C",
            "option_text": "Fiksasi jaringan yang terlalu singkat sebelum embedding",
            "is_correct": false
          },
          {
            "option_label": "D",
            "option_text": "Penggunaan Mounting media yang tidak tepat",
            "is_correct": false
          }
        ],
        "explanation": "Kerusakan berupa robekan atau kerutan pada sediaan histopatologi terutama diakibatkan oleh pisau mikrotom yang tumpul/rusak, sudut kemiringan pisau (clearance angle) yang salah, atau kecepatan memotong yang tidak stabil.",
        "difficulty": "medium"
      }
    ]
  }
];

  for (const setData of questionSetsData) {
    const catId = catMap.get(setData.category_slug) || allCategories[0].id;

    
    let setRecord = await knex('question_sets').where('title', setData.title).first();
    if (!setRecord) {
      const [inserted] = await knex('question_sets')
        .insert({
          category_id: catId,
          title: setData.title,
          description: setData.description,
          status: 'published',
        })
        .returning('*');
      setRecord = inserted;
    } else {
      
      await knex('question_sets')
        .where('id', setRecord.id)
        .update({
          category_id: catId,
          description: setData.description,
          status: 'published',
        });
    }

    console.log(`Populating Question Set: "${setData.title}" (${setData.questions.length} questions)...`);

    for (const q of setData.questions) {
      
      let existingQ = await knex('questions')
        .where('question_set_id', setRecord.id)
        .andWhere('question_text', q.question_text)
        .first();

      let qId: string;
      if (!existingQ) {
        const [insertedQ] = await knex('questions')
          .insert({
            category_id: catId,
            question_set_id: setRecord.id,
            question_text: q.question_text,
            explanation: q.explanation,
            difficulty: q.difficulty,
            status: 'published',
          })
          .returning('*');
        qId = insertedQ.id;

        
        const optionsToInsert = q.options.map((opt: any, index: number) => ({
          question_id: qId,
          option_label: opt.option_label,
          option_text: opt.option_text,
          is_correct: opt.is_correct,
          sort_order: index + 1,
        }));

        await knex('question_options').insert(optionsToInsert);
      } else {
        qId = existingQ.id;
        await knex('questions')
          .where('id', qId)
          .update({
            explanation: q.explanation,
            difficulty: q.difficulty,
            status: 'published',
          });

        
        const existingOpts = await knex('question_options').where('question_id', qId);
        if (existingOpts.length === 0) {
          const optionsToInsert = q.options.map((opt: any, index: number) => ({
            question_id: qId,
            option_label: opt.option_label,
            option_text: opt.option_text,
            is_correct: opt.is_correct,
            sort_order: index + 1,
          }));
          await knex('question_options').insert(optionsToInsert);
        }
      }
    }
  }

  console.log('✓ Successfully seeded all TLM Question Banks from folder!');
}
