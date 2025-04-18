
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pray, BookMarked, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Dua {
  id: number;
  title: string;
  text: string;
  category: string;
}

const duas: Dua[] = [
  {
    id: 1,
    title: "دعاء الصباح",
    text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    category: "أذكار الصباح"
  },
  {
    id: 2,
    title: "دعاء المساء",
    text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    category: "أذكار المساء"
  },
  {
    id: 3,
    title: "دعاء دخول المسجد",
    text: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    category: "أدعية المسجد"
  },
  {
    id: 4,
    title: "دعاء الخروج من المسجد",
    text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    category: "أدعية المسجد"
  },
];

const DuasPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-2">الأدعية والأذكار</h1>
          <p className="text-muted-foreground">مجموعة من الأدعية والأذكار المأثورة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {duas.map((dua) => (
            <Card key={dua.id} className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">{dua.title}</CardTitle>
                <pray className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-lg font-amiri leading-relaxed mb-4">{dua.text}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-muted-foreground">{dua.category}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <BookMarked className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default DuasPage;
