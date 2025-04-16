
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSurahDetail, getSurahAudio, SurahDetail as SurahDetailType } from "@/services/api";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ChevronLeft, Play, Pause, Volume2 } from "lucide-react";
import { toast } from "sonner";

const SurahDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const surahNumber = parseInt(id || "1");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: surah, isLoading, error } = useQuery({
    queryKey: ["surah", surahNumber],
    queryFn: () => getSurahDetail(surahNumber)
  });

  // Load audio source when surah loads
  useEffect(() => {
    const loadAudio = async () => {
      try {
        const src = await getSurahAudio(surahNumber);
        setAudioSrc(src);
      } catch (error) {
        console.error("Error loading audio:", error);
        toast.error("حدث خطأ أثناء تحميل الصوت");
      }
    };
    
    loadAudio();
  }, [surahNumber]);

  // Handle audio play/pause
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error("Error playing audio:", err);
          toast.error("حدث خطأ أثناء تشغيل الصوت");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    if (audio) {
      audio.addEventListener("ended", handleEnded);
      return () => {
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  const navigateToPrevSurah = () => {
    if (surahNumber > 1) {
      navigate(`/surah/${surahNumber - 1}`);
    }
  };

  const navigateToNextSurah = () => {
    if (surahNumber < 114) {
      navigate(`/surah/${surahNumber + 1}`);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="text-center">
              <Skeleton className="h-8 w-32 mx-auto mb-2" />
              <Skeleton className="h-6 w-48 mx-auto" />
            </div>
            <Card>
              <CardContent className="p-4">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-xl text-destructive">حدث خطأ أثناء تحميل البيانات</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              إعادة المحاولة
            </Button>
          </div>
        ) : surah ? (
          <div className="space-y-4">
            <div className="text-center animate-fade-in">
              <h1 className="text-3xl font-bold tracking-tight mb-2 font-amiri">سورة {surah.name}</h1>
              <p className="text-muted-foreground">{surah.englishName} • {surah.numberOfAyahs} آيات • {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}</p>
            </div>

            <Card className="border-primary/50">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <Button 
                    variant="outline" 
                    className="rounded-full w-12 h-12 p-0 flex items-center justify-center text-primary"
                    onClick={toggleAudio}
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <audio ref={audioRef} src={audioSrc} />
                </div>
                
                <div className="space-y-4">
                  {surah.ayahs.map((ayah) => (
                    <div key={ayah.number} className="pb-2 border-b border-muted last:border-0">
                      <p className="text-xl leading-relaxed text-right font-amiri arabic-text">
                        {ayah.text} 
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm mr-2">
                          {ayah.numberInSurah}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center mt-6">
              <Button 
                variant="outline" 
                onClick={navigateToPrevSurah} 
                disabled={surahNumber === 1}
                className="flex items-center gap-2"
              >
                <ChevronRight className="h-4 w-4" />
                <span>السورة السابقة</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/tafseer/${surahNumber}/1`)}
                className="flex items-center gap-2"
              >
                <span>التفسير</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={navigateToNextSurah}
                disabled={surahNumber === 114}
                className="flex items-center gap-2"
              >
                <span>السورة التالية</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
};

export default SurahDetailPage;
