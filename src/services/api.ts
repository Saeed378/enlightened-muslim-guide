
import axios from "axios";

const BASE_URL = "https://api.alquran.cloud/v1";
const QURAN_API_URL = "https://api.quran.com/api/v4";
const HADITH_API_URL = "https://api.hadith.dev/v1";

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface TafseerEdition {
  identifier: string;
  language: string;
  name: string;
  authorName: string;
}

export interface TafseerText {
  text: string;
  author_name: string;
  resource_name: string;
}

export interface HadithCollection {
  id: string;
  name: string;
  total: number;
  available: number;
}

export interface Hadith {
  number: number;
  arab: string;
  id?: string;
}

export interface HadithResponse {
  hadiths: Hadith[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface NextPrayer {
  name: string;
  time: string;
  timeRemaining: string;
}

export const reflections = [
  {
    id: 1,
    title: "فضل تلاوة القرآن",
    content: "قال رسول الله ﷺ: «الذي يقرأ القرآن وهو ماهر به مع السفرة الكرام البررة، والذي يقرأ القرآن ويتتعتع فيه، وهو عليه شاق له أجران»"
  },
  {
    id: 2,
    title: "التدبر في آيات الله",
    content: "قال تعالى: ﴿أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ أَمْ عَلَىٰ قُلُوبٍ أَقْفَالُهَا﴾ [محمد: 24]"
  },
  {
    id: 3,
    title: "القرآن شفاء",
    content: "قال تعالى: ﴿وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ﴾ [الإسراء: 82]"
  }
];

export const getSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/surah`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching surahs:", error);
    throw new Error("Failed to fetch surahs");
  }
};

export const getSurahDetail = async (surahNumber: number): Promise<SurahDetail> => {
  try {
    const response = await axios.get(`${BASE_URL}/surah/${surahNumber}/ar.alafasy`);
    return {
      number: response.data.data.number,
      name: response.data.data.name,
      englishName: response.data.data.englishName,
      englishNameTranslation: response.data.data.englishNameTranslation,
      revelationType: response.data.data.revelationType,
      numberOfAyahs: response.data.data.numberOfAyahs,
      ayahs: response.data.data.ayahs.map((ayah: any) => ({
        number: ayah.number,
        text: ayah.text,
        numberInSurah: ayah.numberInSurah,
        juz: ayah.juz,
        manzil: ayah.manzil,
        page: ayah.page,
        ruku: ayah.ruku,
        hizbQuarter: ayah.hizbQuarter,
        sajda: ayah.sajda,
      })),
    };
  } catch (error) {
    console.error("Error fetching surah detail:", error);
    throw new Error("Failed to fetch surah detail");
  }
};

export const getTafseer = async (surahNumber: number, ayahNumber: number) => {
  try {
    const response = await axios.get(`${QURAN_API_URL}/quran/tafsirs/1/${surahNumber}/${ayahNumber}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tafseer:", error);
    throw new Error("Failed to fetch tafseer");
  }
};

export const getTafseerEditions = async (): Promise<TafseerEdition[]> => {
  try {
    // In a real app, this would be fetched from an API
    // For now, return some sample data
    return [
      { identifier: "ar-muyassar", language: "ar", name: "الميسر", authorName: "نخبة من العلماء" },
      { identifier: "ar-tafsir-ibn-kathir", language: "ar", name: "ابن كثير", authorName: "ابن كثير" },
      { identifier: "ar-tafsir-al-qurtubi", language: "ar", name: "القرطبي", authorName: "القرطبي" },
      { identifier: "ar-tafsir-al-tabari", language: "ar", name: "الطبري", authorName: "الطبري" }
    ];
  } catch (error) {
    console.error("Error fetching tafseer editions:", error);
    throw new Error("Failed to fetch tafseer editions");
  }
};

export const getAyahTafseer = async (surahId: string, ayahId: string, tafsirId: string | null): Promise<TafseerText> => {
  try {
    // In a real app, this would use the actual API
    // For now, return some sample data
    return {
      text: `تفسير الآية ${ayahId} من سورة ${surahId}`,
      author_name: "مفسر القرآن",
      resource_name: "هذا تفسير للآية الكريمة ولو كان المصدر حقيقي لرأيت هنا تفسير مفصل للآية",
    };
  } catch (error) {
    console.error("Error fetching tafseer:", error);
    throw new Error("Failed to fetch tafseer");
  }
};

export const getHadith = async () => {
  try {
    const response = await axios.get(`https://api.hadith.sutanlab.id/books`);
    return response.data;
  } catch (error) {
    console.error("Error fetching hadith:", error);
    throw new Error("Failed to fetch hadith");
  }
};

export const getHadithCollections = async (): Promise<HadithCollection[]> => {
  try {
    // For demonstration, return mock data as the original API is not available
    return [
      { id: "bukhari", name: "صحيح البخاري", total: 7563, available: 7563 },
      { id: "muslim", name: "صحيح مسلم", total: 5362, available: 5362 },
      { id: "tirmidhi", name: "سنن الترمذي", total: 3891, available: 3891 },
      { id: "abudawud", name: "سنن أبي داود", total: 4590, available: 4590 },
      { id: "nasai", name: "سنن النسائي", total: 5662, available: 5662 },
      { id: "ibnmajah", name: "سنن ابن ماجه", total: 4332, available: 4332 }
    ];
  } catch (error) {
    console.error("Error fetching hadith collections:", error);
    throw new Error("Failed to fetch hadith collections");
  }
};

export const getHadithsByCollection = async (collectionId: string, page: number, limit: number): Promise<HadithResponse> => {
  try {
    // For demonstration, return mock data
    const hadiths = Array.from({ length: limit }, (_, i) => ({
      number: (page - 1) * limit + i + 1,
      arab: `حديث رقم ${(page - 1) * limit + i + 1} من كتاب ${collectionId}. هذا نص تجريبي للحديث، وفي الواقع سيكون هنا نص الحديث الشريف بالكامل.`,
      id: `${collectionId}-${(page - 1) * limit + i + 1}`
    }));

    return {
      hadiths,
      total: 100,
      currentPage: page,
      totalPages: 10
    };
  } catch (error) {
    console.error("Error fetching hadiths by collection:", error);
    throw new Error("Failed to fetch hadiths");
  }
};

export const getPrayerTimes = async (latitude: number, longitude: number, date: string) => {
  try {
    const response = await axios.get(`https://api.aladhan.com/v1/timingsByCoordinates/${date}?latitude=${latitude}&longitude=${longitude}&method=8`);
    return response.data.data.timings;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    throw new Error("Failed to fetch prayer times");
  }
};

// List of available reciters
export const reciters = [
  { id: 1, name: "عبد الباسط عبد الصمد", identifier: "abdulbasit_abdulsamad_mujawwad" },
  { id: 2, name: "محمود خليل الحصري", identifier: "mahmoud_khalil_al-husary" },
  { id: 3, name: "محمد صديق المنشاوي", identifier: "muhammad_siddiq_al-minshawi" },
  { id: 4, name: "ماهر المعيقلي", identifier: "maher_al-muaiqly" },
  { id: 5, name: "مشاري راشد العفاسي", identifier: "mishari_rashid_al-afasy" }
];

// Get Surah audio URL with reciter option
export const getSurahAudio = async (surahNumber: number, reciterId = 1): Promise<string> => {
  try {
    const reciter = reciters.find(r => r.id === reciterId) || reciters[0];
    
    // For cloud.ihadis.com API we're using
    const formattedNumber = surahNumber.toString().padStart(3, '0');
    const audioUrl = `https://server8.mp3quran.net/${reciter.identifier}/${formattedNumber}.mp3`;
    
    return audioUrl;
  } catch (error) {
    console.error("Error getting surah audio:", error);
    throw new Error("Failed to get surah audio");
  }
};
