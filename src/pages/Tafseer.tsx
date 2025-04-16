
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSurahDetail, getTafseerList, getAyahTafseer, Tafseer } from "@/services/api";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ChevronLeft, BookOpen } from "lucide-react";
import { toast } from "sonner";

const TafseerPage = () => {
  const { surahId, ayahId } = useParams<{ surahId: string, ayahId: string }>();
  const navigate = useNavigate();
  const surahNumber = parseInt(surahId || "1");
  const ayahNumber = parseInt(ayahId || "1");
  const [selectedTafseer, setSelectedTafseer] = useState<number>(1); // Default tafseer id

  // Get Surah details
  const { data: surah, isLoading: surahLoading } = useQuery({
    queryKey: ["surah", surahNumber],
    queryFn: () => getSurahDetail(surahNumber),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes to improve loading speed
    retry: 2
  });

  // Get list of tafseers
  const { data: tafseers, isLoading: tafseersLoading } = useQuery({
    queryKey: ["tafseers"],
    queryFn: getTafseerList,
    staleTime: Infinity, // This data rarely changes
    retry: 3
  });

  // Get tafseer for specific ayah
  const { data: tafseer, isLoading: tafseerLoading } = useQuery({
    queryKey: ["tafseer", selectedTafseer, surahNumber, ayahNumber],
    queryFn: () => getAyahTafseer(selectedTafseer, surahNumber, ayahNumber),
    enabled: !!surah && ayahNumber <= surah.numberOfAyahs,
    retry: 2,
    onError: () => {
      toast.error("تعذر تحميل التفسير، يرجى المحاولة مرة أخرى");
    }
  });

  // Navigate to next/previous ayah
  const navigateToPrevAyah = () => {
    if (ayahNumber > 1) {
      navigate(`/tafseer/${surahNumber}/${ayahNumber - 1}`);
    } else if (surahNumber > 1) {
      // Get the number of ayahs in the previous surah
      getSurahDetail(surahNumber - 1).then(prevSurah => {
        navigate(`/tafseer/${surahNumber - 1}/${prevSurah.numberOfAyahs}`);
      }).catch(() => {
        // Fallback if we can't get the previous surah details
        navigate(`/tafseer/${surahNumber - 1}/1`);
      });
    }
  };

  const navigateToNextAyah = () => {
    if (surah && ayahNumber < surah.numberOfAyahs) {
      navigate(`/tafseer/${surahNumber}/${ayahNumber + 1}`);
    } else if (surahNumber < 114) {
      navigate(`/tafseer/${surahNumber + 1}/1`);
    }
  };

  const handleTafseerChange = (value: string) => {
    setSelectedTafseer(parseInt(value));
  };

  const isLoading = surahLoading || tafseersLoading || tafseerLoading;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-2 font-amiri">التفسير</h1>
          {surah && (
            <p className="text-muted-foreground">
              سورة {surah.name} - الآية {ayahNumber}
            </p>
          )}
        </div>

        {!isLoading && tafseers && (
          <div className="w-full max-w-md mx-auto mb-4">
            <Select value={selectedTafseer.toString()} onValueChange={handleTafseerChange}>
              <SelectTrigger>
                <SelectValue placeholder="اختر التفسير" />
              </SelectTrigger>
              <SelectContent>
                {tafseers.map((tafseer: Tafseer) => (
                  <SelectItem key={tafseer.id} value={tafseer.id.toString()}>
                    {tafseer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-32 mx-auto" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        ) : surah && tafseer ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-center font-amiri">
                {surah.ayahs[ayahNumber - 1]?.text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-primary/5 rounded-md">
                <h3 className="text-lg font-medium mb-2">{tafseer.tafseer_name}</h3>
                <p className="text-lg leading-relaxed font-amiri">{tafseer.text}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">لا يوجد تفسير متاح لهذه الآية.</p>
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <Button 
            variant="outline" 
            onClick={navigateToPrevAyah}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4" />
            <span>الآية السابقة</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/surah/${surahNumber}`)}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4 ml-2" />
            <span>العودة للسورة</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={navigateToNextAyah}
            className="flex items-center gap-2"
          >
            <span>الآية التالية</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default TafseerPage;
