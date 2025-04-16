
import { toast } from "sonner";

// Base URLs for the APIs
const QURAN_API_URL = "https://api.alquran.cloud/v1";
const PRAYER_TIMES_API_URL = "https://api.aladhan.com/v1";
const HADITH_API_URL = "https://api.hadith.gading.dev/books";

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
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
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

export interface AyahTafseer {
  tafseer_id: number;
  tafseer_name: string;
  ayah_number: number;
  ayah_text: string;
  text: string;
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

// Quran API services - Using a more reliable endpoint
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

// Tafseer API Services
export async function getTafseerList(): Promise<Tafseer[]> {
  try {
    const response = await fetch("https://api.quran-tafseer.com/tafseer");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Tafseer API Error:", error);
    toast.error("حدث خطأ أثناء تحميل بيانات التفسير. الرجاء المحاولة مرة أخرى.");
    throw error;
  }
}

export async function getAyahTafseer(tafsirId: number, surahNumber: number, ayahNumber: number): Promise<AyahTafseer> {
  try {
    const response = await fetch(`https://api.quran-tafseer.com/tafseer/${tafsirId}/${surahNumber}/${ayahNumber}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Tafseer API Error:", error);
    toast.error("حدث خطأ أثناء تحميل بيانات التفسير. الرجاء المحاولة مرة أخرى.");
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
