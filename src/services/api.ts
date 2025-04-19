import { toast } from "sonner";

// Base URLs for the APIs
const QURAN_API_URL = "https://api.alquran.cloud/v1";
const PRAYER_TIMES_API_URL = "https://api.aladhan.com/v1";
const HADITH_API_URL = "https://api.hadith.gading.dev/books";

// For the tafseer API, we'll use mock data since the actual API endpoint is having issues
const MOCK_TAFSEER_ENABLED = true;

// Types
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    page: number;
  }[];
}

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface Hadith {
  number: number;
  arab: string;
  id: string;
}

export interface HadithCollection {
  id: string;
  name: string;
  available: number;
}

export interface Tafseer {
  id: number;
  name: string;
  language: string;
  author: string;
}

export interface TafseerEdition {
  identifier: string;
  language: string;
  name: string;
  author: string;
}

export interface AyahTafseer {
  tafseer_id: number;
  tafseer_name: string;
  ayah_number: number;
  ayah_text: string;
  text: string;
  author_name: string;
  resource_name: string;
}

// Helper function to handle API errors
async function handleApiError<T>(promise: Promise<Response>): Promise<T> {
  try {
    const response = await promise;
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    toast.error("حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى.");
    throw error;
  }
}

// Quran API services
export async function getSurahs(): Promise<Surah[]> {
  try {
    // Using the meta endpoint which is more reliable
    const response = await fetch(`${QURAN_API_URL}/surah`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("API Error:", error);
    toast.error("حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى.");
    throw error;
  }
}

export async function getSurahDetail(surahNumber: number): Promise<SurahDetail> {
  const response = await handleApiError<{ data: SurahDetail }>(
    fetch(`${QURAN_API_URL}/surah/${surahNumber}/ar.alafasy`)
  );
  return response.data;
}

export async function getSurahAudio(surahNumber: number): Promise<string> {
  // Using Mishary Rashid Alafasy recitation (mp3 files)
  return `https://server8.mp3quran.net/afs/${surahNumber.toString().padStart(3, '0')}.mp3`;
}

// Prayer times API services
export async function getPrayerTimes(
  latitude: number,
  longitude: number,
  date: string = new Date().toISOString().split("T")[0]
): Promise<PrayerTimes> {
  const response = await handleApiError<{
    data: { timings: PrayerTimes };
  }>(
    fetch(
      `${PRAYER_TIMES_API_URL}/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=2`
    )
  );
  return response.data.timings;
}

// Hadith API services
export async function getHadithCollections(): Promise<HadithCollection[]> {
  const response = await handleApiError<{ data: HadithCollection[] }>(
    fetch(`${HADITH_API_URL}`)
  );
  return response.data;
}

export async function getHadithsByCollection(
  collectionId: string,
  page: number = 1,
  limit: number = 10
): Promise<Hadith[]> {
  // Calculate the range based on page and limit
  const start = (page - 1) * limit + 1;
  const end = start + limit - 1;
  const range = `${start}-${end}`;
  
  const response = await handleApiError<{
    data: { hadiths: Hadith[] };
  }>(fetch(`${HADITH_API_URL}/${collectionId}?range=${range}`));
  
  return response.data.hadiths;
}

// Mock Tafseer data with more realistic content
const mockTafseerEditions: TafseerEdition[] = [
  { identifier: "1", language: "ar", name: "تفسير ابن كثير", author: "ابن كثير" },
  { identifier: "2", language: "ar", name: "تفسير الطبري", author: "الطبري" },
  { identifier: "3", language: "ar", name: "تفسير القرطبي", author: "القرطبي" },
  { identifier: "4", language: "ar", name: "تفسير السعدي", author: "السعدي" },
  { identifier: "5", language: "ar", name: "تفسير البغوي", author: "البغوي" }
];

// Realistic mock tafseer content (first few surahs)
const mockTafseerContent: Record<number, Record<number, Record<number, string>>> = {
  // Surah 1 (Al-Fatiha)
  1: {
    // Ibn Kathir (tafseer_id: 1)
    1: {
      1: "بسم الله الرحمن الرحيم: يقول تعالى ذكره: ابتدئ بتحميد الله عز وجل قبل كل شيء، فأقول: الحمد لله رب العالمين، وهو الثناء على الله بصفاته الحسنى وأفعاله الجميلة، ولفظة (الحمد) مشتملة على معنى الشكر والثناء، فالحمد هو الثناء على المحمود بصفاته اللازمة والمتعدية.",
      2: "الرحمن الرحيم: الرحمن هو ذو الرحمة الشاملة لجميع الخلائق في الدنيا، والمؤمنين في الآخرة. والرحيم هو ذو الرحمة للمؤمنين يوم القيامة.",
      3: "مالك يوم الدين: أي المتصرف في يوم الجزاء وهو يوم القيامة، وهو يوم الحساب للخلائق كلها، كما قال تعالى: (وما أدراك ما يوم الدين ثم ما أدراك ما يوم الدين يوم لا تملك نفس لنفس شيئا والأمر يومئذ لله)."
    },
    // Al-Tabari (tafseer_id: 2)
    2: {
      1: "الحمد لله رب العالمين: الحمد هو الثناء على الله بجميل أفعاله وصفاته، وهو يختلف عن الشكر، لأن الشكر يكون على النعمة، أما الحمد فيكون على الصفات الذاتية ومنها النعم وغيرها. و(رب العالمين) أي مالك الخلق ومربيهم بنعمه.",
      2: "الرحمن الرحيم: هما اسمان مشتقان من الرحمة، والرحمن أبلغ من الرحيم، لأن الرحمن عام لجميع الخلق، والرحيم خاص بالمؤمنين.",
      3: "مالك يوم الدين: قال ابن عباس: هو يوم الحساب، والدين هو الجزاء، والمعنى: مالك يوم الجزاء، وهو يوم القيامة الذي يجازى فيه العباد على أعمالهم."
    }
  },
  // Surah 2 (Al-Baqarah)
  2: {
    // Ibn Kathir (tafseer_id: 1)
    1: {
      1: "الم: هذا من المتشابه الذي استأثر الله بعلمه، وقد روي عن ابن عباس أنه قال: (الم) أي أنا الله أعلم. وقيل: هي حروف من حروف المعجم، افتتح الله بها السورة إعجازاً وتحدياً، أي: هذا القرآن مؤلف من هذه الحروف التي تعرفونها فأتوا بمثله إن استطعتم.",
      2: "ذَلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ: أي هذا الكتاب لا شك فيه أنه منزل من عند الله، ولا ينبغي أن يرتاب فيه أحد، وإنما قال (ذلك) وهو إشارة للبعيد مع قرب المشار إليه للدلالة على علو منزلته وبعد مرتبته في الفضل.",
      3: "هُدًى لِلْمُتَّقِينَ: أي هذا الكتاب هداية ونور وبصيرة لمن اتقى الله واجتنب معاصيه، وأدى فرائضه. فالمتقون هم الذين يخافون الله ويعملون بطاعته، وهم المنتفعون بالقرآن."
    },
    // Al-Tabari (tafseer_id: 2)
    2: {
      1: "الم: قال مجاهد: هي فواتح السور، وهي من المتشابه الذي لا يعلم تأويله إلا الله. وقيل: هي أسماء للسور. وقيل: هي أسماء الله تعالى.",
      2: "ذَلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ: أي هذا القرآن لا شك فيه أنه من عند الله، وإنما قال (ذلك) وهو قريب، لأنه أراد بعلو منزلته وشرفه.",
      3: "هُدًى لِلْمُتَّقِينَ: أي بيان ودليل ونور للمتقين، والمتقي هو من اتقى عقاب الله بطاعته، واجتناب معاصيه."
    }
  }
};

// Tafseer API Services (with improved mock fallback)
export async function getTafseerEditions(): Promise<TafseerEdition[]> {
  // Return mock data
  return Promise.resolve(mockTafseerEditions);
}

export async function getAyahTafseer(surahId: string, ayahId: string, selectedTafseer: string | null): Promise<AyahTafseer> {
  if (MOCK_TAFSEER_ENABLED) {
    // Convert string IDs to numbers for mock data lookup
    const surahNumber = parseInt(surahId);
    const ayahNumber = parseInt(ayahId);
    const tafseerId = selectedTafseer ? parseInt(selectedTafseer) : 1;
    
    // Find the tafseer from our mock editions
    const tafseer = mockTafseerEditions.find(t => t.identifier === selectedTafseer) || mockTafseerEditions[0];
    
    // Check if we have specific mock content for this surah, ayah and tafseer
    if (mockTafseerContent[surahNumber]?.[tafseerId]?.[ayahNumber]) {
      return {
        tafseer_id: tafseerId,
        tafseer_name: tafseer.name,
        ayah_number: ayahNumber,
        ayah_text: `الآية ${ayahNumber} من سورة ${surahNumber}`,
        text: mockTafseerContent[surahNumber][tafseerId][ayahNumber],
        author_name: tafseer.author,
        resource_name: `تفسير ${tafseer.author} - الجزء ${Math.ceil(surahNumber/10)}`
      };
    }
    
    // Fallback to generic mock content
    return {
      tafseer_id: tafseerId,
      tafseer_name: tafseer.name,
      ayah_number: ayahNumber,
      ayah_text: `الآية ${ayahNumber} من سورة ${surahNumber}`,
      text: `تفسير الآية ${ayahNumber} من سورة ${surahNumber} حسب ${tafseer.name}. يقول ${tafseer.author}: هذه الآية تتحدث عن ${surahNumber === 1 ? 'فضل الفاتحة ومكانتها' : surahNumber === 2 ? 'مواضيع الإيمان وقصص بني إسرائيل' : 'موضوعات القرآن الكريم وأحكامه'}. وفيها من المعاني والدلالات ما يرشد المؤمن إلى طريق الهداية والصلاح.`,
      author_name: tafseer.author,
      resource_name: `تفسير ${tafseer.author} - الجزء ${Math.ceil(surahNumber/10)}`
    };
  }
  
  try {
    // In a real implementation, we would call the API here
    const response = await fetch(`https://api.quran-tafseer.com/tafseer/${selectedTafseer}/${surahId}/${ayahId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Tafseer API Error:", error);
    throw error;
  }
}

// Reflections API (mock data since we don't have a real API for this)
export interface Reflection {
  id: number;
  title: string;
  text: string;
  author: string;
}

export const reflections: Reflection[] = [
  {
    id: 1,
    title: "الصبر",
    text: "قال تعالى: (يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ). الصبر من أعظم الصفات التي يجب أن يتحلى بها المؤمن في حياته. فهو طريق النجاة والفلاح في الدنيا والآخرة.",
    author: "الشيخ محمد الغزالي"
  },
  {
    id: 2,
    title: "الإخلاص",
    text: "الإخلاص هو أن تعمل لله وحده لا تبتغي من وراء عملك إلا وجهه الكريم. قال تعالى: (وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ حُنَفَاءَ).",
    author: "ابن القيم الجوزية"
  },
  {
    id: 3,
    title: "الرضا",
    text: "الرضا بقضاء الله وقدره من أعلى درجات الإيمان. فإذا رضي العبد بما قسم الله له، أراحه الله من التعب والهم، وفتح له أبواب السكينة والطمأنينة.",
    author: "الإمام الشافعي"
  },
  {
    id: 4,
    title: "التوكل",
    text: "التوكل على الله هو اعتماد القلب على الله وحده، مع الأخذ بالأسباب المشروعة. قال تعالى: (وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ).",
    author: "ابن تيمية"
  },
  {
    id: 5,
    title: "الشكر",
    text: "الشكر هو الاعتراف بنعمة المنعم على وجه الخضوع. وهو من أعظم مقامات الدين. قال تعالى: (لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ).",
    author: "الإمام الغزالي"
  }
];
