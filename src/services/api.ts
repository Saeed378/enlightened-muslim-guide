import axios from "axios";

const BASE_URL = "https://api.alquran.cloud/v1";

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
  ayahs: Ayah[];
}

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
        const response = await axios.get(`https://api.quran.com/api/v4/quran/ Tafsir/1/1/${surahNumber}:${ayahNumber}`);
        return response.data;
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
