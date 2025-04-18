
import { toast } from "sonner";

export interface DuaCategory {
  id: number;
  name: string;
  nameEn: string;
}

export interface Dua {
  id: number;
  title: string;
  text: string;
  category: string;
  categoryId: number;
}

export const getDuaCategories = async (): Promise<DuaCategory[]> => {
  try {
    const response = await fetch("https://www.hisnmuslim.com/api/ar/husn_categories.json");
    if (!response.ok) throw new Error("Failed to fetch dua categories");
    const data = await response.json();
    return data.categories;
  } catch (error) {
    toast.error("حدث خطأ أثناء تحميل أقسام الأدعية");
    return mockDuaCategories;
  }
};

export const getDuas = async (categoryId: number): Promise<Dua[]> => {
  try {
    const response = await fetch(`https://www.hisnmuslim.com/api/ar/husn_duas/${categoryId}.json`);
    if (!response.ok) throw new Error("Failed to fetch duas");
    const data = await response.json();
    return data.duas;
  } catch (error) {
    toast.error("حدث خطأ أثناء تحميل الأدعية");
    return mockDuasByCategory[categoryId] || [];
  }
};

// Mock data as fallback with more duas per category
const mockDuaCategories: DuaCategory[] = [
  { id: 1, name: "أذكار الصباح والمساء", nameEn: "morning-evening" },
  { id: 2, name: "أدعية المتوفى", nameEn: "deceased" },
  { id: 3, name: "أدعية الاستغفار", nameEn: "forgiveness" },
  { id: 4, name: "أدعية القرآن", nameEn: "quran" },
];

const mockDuasByCategory: Record<number, Dua[]> = {
  1: [
    {
      id: 1,
      title: "دعاء الصباح",
      text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
      category: "أذكار الصباح والمساء",
      categoryId: 1
    },
    {
      id: 2,
      title: "دعاء المساء",
      text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
      category: "أذكار الصباح والمساء",
      categoryId: 1
    },
    {
      id: 3,
      title: "دعاء عند الاستيقاظ",
      text: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
      category: "أذكار الصباح والمساء",
      categoryId: 1
    },
    {
      id: 4,
      title: "دعاء عند النوم",
      text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      category: "أذكار الصباح والمساء",
      categoryId: 1
    },
    {
      id: 5,
      title: "دعاء لبس الثوب",
      text: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا (الثَّوْبَ) وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
      category: "أذكار الصباح والمساء",
      categoryId: 1
    },
    {
      id: 6,
      title: "الذكر عند المطر",
      text: "اللَّهُمَّ صَيِّبًا نَافِعًا",
      category: "أذكار الصباح والمساء",
      categoryId: 1
    }
  ],
  2: [
    {
      id: 7,
      title: "الدعاء للميت في الصلاة عليه",
      text: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ",
      category: "أدعية المتوفى",
      categoryId: 2
    },
    {
      id: 8,
      title: "الدعاء للميت بعد الدفن",
      text: "اللَّهُمَّ ثَبِّتْهُ، اللَّهُمَّ اغْفِرْ لَهُ، اللَّهُمَّ افْسَحْ لَهُ فِي قَبْرِهِ وَنَوِّرْ لَهُ فِيهِ",
      category: "أدعية المتوفى",
      categoryId: 2
    },
    {
      id: 9,
      title: "الدعاء للفرط في الصلاة عليه",
      text: "اللَّهُمَّ اجْعَلْهُ فَرَطًا وَذُخْرًا لِوَالِدَيْهِ، وَشَفِيعًا مُجَابًا",
      category: "أدعية المتوفى",
      categoryId: 2
    },
    {
      id: 10,
      title: "دعاء التعزية",
      text: "إِنَّ لِلَّهِ مَا أَخَذَ، وَلَهُ مَا أَعْطَى، وَكُلُّ شَيْءٍ عِنْدَهُ بِأَجَلٍ مُسَمًّى... فَلْتَصْبِرْ وَلْتَحْتَسِبْ",
      category: "أدعية المتوفى",
      categoryId: 2
    },
    {
      id: 11,
      title: "دعاء زيارة القبور",
      text: "السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ، وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَاحِقُونَ، أَسْأَلُ اللَّهَ لَنَا وَلَكُمُ الْعَافِيَةَ",
      category: "أدعية المتوفى",
      categoryId: 2
    }
  ],
  3: [
    {
      id: 12,
      title: "سيد الاستغفار",
      text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
      category: "أدعية الاستغفار",
      categoryId: 3
    },
    {
      id: 13,
      title: "الاستغفار باسم الله الغفور",
      text: "أَسْتَغْفِرُ اللَّهَ الْغَفُورَ الرَّحِيمَ",
      category: "أدعية الاستغفار",
      categoryId: 3
    },
    {
      id: 14,
      title: "استغفار النبي ﷺ",
      text: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
      category: "أدعية الاستغفار",
      categoryId: 3
    },
    {
      id: 15,
      title: "الاستغفار للمؤمنين",
      text: "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِلَّذِينَ آمَنُوا رَبَّنَا إِنَّكَ رَءُوفٌ رَحِيمٌ",
      category: "أدعية الاستغفار",
      categoryId: 3
    },
    {
      id: 16,
      title: "الاستغفار بعد المجلس",
      text: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
      category: "أدعية الاستغفار",
      categoryId: 3
    },
    {
      id: 17,
      title: "الاستغفار بعد الصلاة",
      text: "أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ",
      category: "أدعية الاستغفار",
      categoryId: 3
    }
  ],
  4: [
    {
      id: 18,
      title: "دعاء من القرآن",
      text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      category: "أدعية القرآن",
      categoryId: 4
    },
    {
      id: 19,
      title: "دعاء موسى عليه السلام",
      text: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
      category: "أدعية القرآن",
      categoryId: 4
    },
    {
      id: 20,
      title: "دعاء الوالدين",
      text: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
      category: "أدعية القرآن",
      categoryId: 4
    },
    {
      id: 21,
      title: "دعاء المغفرة",
      text: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
      category: "أدعية القرآن",
      categoryId: 4
    },
    {
      id: 22,
      title: "دعاء التثبيت",
      text: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
      category: "أدعية القرآن",
      categoryId: 4
    },
    {
      id: 23,
      title: "دعاء القبول",
      text: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ وَتُبْ عَلَيْنَا إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
      category: "أدعية القرآن",
      categoryId: 4
    }
  ]
};
