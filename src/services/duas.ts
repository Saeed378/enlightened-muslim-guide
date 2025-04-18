
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

// Mock API data (replace with actual API when available)
const mockDuaCategories: DuaCategory[] = [
  { id: 1, name: "أذكار الصباح والمساء", nameEn: "morning-evening" },
  { id: 2, name: "أدعية المتوفى", nameEn: "deceased" },
  { id: 3, name: "أدعية الاستغفار", nameEn: "forgiveness" },
  { id: 4, name: "أدعية القرآن", nameEn: "quran" },
];

const mockDuas: Dua[] = [
  {
    id: 1,
    title: "دعاء الصباح",
    text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    category: "أذكار الصباح والمساء",
    categoryId: 1
  },
  {
    id: 2,
    title: "دعاء للميت",
    text: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ",
    category: "أدعية المتوفى",
    categoryId: 2
  },
  {
    id: 3,
    title: "دعاء الاستغفار",
    text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
    category: "أدعية الاستغفار",
    categoryId: 3
  },
];

export const getDuaCategories = async (): Promise<DuaCategory[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDuaCategories), 500);
  });
};

export const getDuas = async (): Promise<Dua[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDuas), 500);
  });
};
