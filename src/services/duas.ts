
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

// Pagination interface
export interface PaginatedDuas {
  duas: Dua[];
  totalPages: number;
  currentPage: number;
}

export const getDuaCategories = async (): Promise<DuaCategory[]> => {
  try {
    const response = await fetch("https://www.hisnmuslim.com/api/ar/husn_categories.json");
    if (!response.ok) {
      console.log("Falling back to mock categories data");
      return mockDuaCategories;
    }
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.log("Error fetching categories, using mock data", error);
    return mockDuaCategories;
  }
};

export const getDuas = async (categoryId: number, page: number = 1): Promise<PaginatedDuas> => {
  const pageSize = 6; // Number of duas per page
  
  try {
    const response = await fetch(`https://www.hisnmuslim.com/api/ar/husn_duas/${categoryId}.json`);
    if (!response.ok) {
      console.log("Falling back to mock duas data");
      return paginateDuas(mockDuasByCategory[categoryId] || [], page, pageSize);
    }
    
    const data = await response.json();
    if (data.duas && data.duas.length > 0) {
      return paginateDuas(data.duas, page, pageSize);
    } else {
      console.log("API returned empty duas, using mock data");
      return paginateDuas(mockDuasByCategory[categoryId] || [], page, pageSize);
    }
  } catch (error) {
    console.log("Error fetching duas, using mock data", error);
    return paginateDuas(mockDuasByCategory[categoryId] || [], page, pageSize);
  }
};

// Helper function to paginate duas
const paginateDuas = (duas: Dua[], page: number, pageSize: number): PaginatedDuas => {
  const totalPages = Math.ceil(duas.length / pageSize);
  const validPage = Math.min(Math.max(1, page), totalPages || 1);
  
  const startIndex = (validPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDuas = duas.slice(startIndex, endIndex);
  
  return {
    duas: paginatedDuas,
    totalPages,
    currentPage: validPage
  };
};

// Mock data as fallback with more duas per category
const mockDuaCategories: DuaCategory[] = [
  { id: 1, name: "أذكار الصباح والمساء", nameEn: "morning-evening" },
  { id: 2, name: "أدعية المتوفى", nameEn: "deceased" },
  { id: 3, name: "أدعية الاستغفار", nameEn: "forgiveness" },
  { id: 4, name: "أدعية القرآن", nameEn: "quran" },
];

// Greatly expanded mock data - creating 30+ duas for each category
const generateMockDuas = (categoryId: number, categoryName: string, count: number): Dua[] => {
  const duas: Dua[] = [];
  
  // We'll reuse some basic templates but make them unique
  const titleTemplates = [
    "دعاء {index}",
    "ذكر {index}",
    "استغفار {index}",
    "تسبيح {index}",
    "شكر {index}"
  ];
  
  const textTemplates = [
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي",
    "اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي، وَاحْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي، وَعَنْ يَمِينِي وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",
    "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ، سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ"
  ];
  
  for (let i = 0; i < count; i++) {
    const titleTemplate = titleTemplates[i % titleTemplates.length];
    const textTemplate = textTemplates[i % textTemplates.length];
    
    duas.push({
      id: categoryId * 1000 + i,
      title: titleTemplate.replace("{index}", `${i + 1}`),
      text: textTemplate + ` (${i + 1})`,
      category: categoryName,
      categoryId: categoryId
    });
  }
  
  return duas;
};

const mockDuasByCategory: Record<number, Dua[]> = {
  1: generateMockDuas(1, "أذكار الصباح والمساء", 35),
  2: generateMockDuas(2, "أدعية المتوفى", 32),
  3: generateMockDuas(3, "أدعية الاستغفار", 30),
  4: generateMockDuas(4, "أدعية القرآن", 33)
};

// Add original mock duas to beginning of each category for better content quality
const originalMockDuas = {
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
      id: 7,
      title: "الدعاء للميت في الصلاة عليه",
      text: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ",
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
    }
  ],
  4: [
    {
      id: 18,
      title: "دعاء من القرآن",
      text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      category: "أدعية القرآن",
      categoryId: 4
    }
  ]
};

// Replace the first duas in each category with the original high-quality ones
Object.keys(originalMockDuas).forEach(categoryId => {
  const numericCategoryId = Number(categoryId);
  mockDuasByCategory[numericCategoryId] = [
    ...originalMockDuas[numericCategoryId],
    ...mockDuasByCategory[numericCategoryId].slice(originalMockDuas[numericCategoryId].length)
  ];
});
