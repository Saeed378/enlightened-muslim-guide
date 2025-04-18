
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

// Mock data as fallback
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
    }
  ],
  2: [
    {
      id: 3,
      title: "الدعاء للميت في الصلاة عليه",
      text: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ",
      category: "أدعية المتوفى",
      categoryId: 2
    }
  ],
  3: [
    {
      id: 4,
      title: "سيد الاستغفار",
      text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
      category: "أدعية الاستغفار",
      categoryId: 3
    }
  ],
  4: [
    {
      id: 5,
      title: "دعاء من القرآن",
      text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      category: "أدعية القرآن",
      categoryId: 4
    }
  ]
};
