
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSurahDetail, getSurahAudio, SurahDetail } from "@/services/api";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Pause, Volume2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const SurahDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const surahId = parseInt(id || "1");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: surah, isLoading } = useQuery({
    queryKey: ["surah", surahId],
    queryFn: () => getSurahDetail(surahId),
    enabled: !isNaN(surahId)
  });

  useEffect(() => {
    if (surahId && !isNaN(surahId)) {
      const src = getSurahAudio(surahId);
      setAudioSrc(src);
    }
  }, [surahId]);

  useEffect(() => {
    return () => {
      // Clean up audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setLoading(true);
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
        toast.error("حدث خطأ أثناء تشغيل الصوت");
        setLoading(false);
      });
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (isNaN(surahId)) {
    navigate("/");
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleBackToHome}
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة إلى القائمة</span>
          </Button>

          {audioSrc && (
            <Button
              onClick={handlePlayPause}
              variant="outline"
              className="flex items-center gap-2"
              disabled={loading}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>{isPlaying ? "إيقاف" : "استماع"}</span>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-primary/5 p-6 rounded-lg text-center space-y-2 border">
              <h1 className="text-3xl font-bold font-amiri">
                سورة {surah?.name}
              </h1>
              <p className="text-muted-foreground">
                {surah?.englishName} • {surah?.englishNameTranslation} • {surah?.numberOfAyahs} آيات • {surah?.revelationType === "Meccan" ? "مكية" : "مدنية"}
              </p>
              <p className="text-sm">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            </div>

            <div className="space-y-4">
              {surah?.ayahs.map((ayah) => (
                <div
                  key={ayah.number}
                  className="p-4 rounded-lg bg-card border hover:border-primary transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                      {ayah.numberInSurah}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      صفحة {ayah.page} • جزء {ayah.juz}
                    </span>
                  </div>
                  <p className="arabic-text text-lg leading-loose font-amiri">{ayah.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <audio
          ref={audioRef}
          src={audioSrc}
          onPlay={() => {
            setIsPlaying(true);
            setLoading(false);
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setIsPlaying(false);
            setLoading(false);
            toast.error("حدث خطأ أثناء تحميل الملف الصوتي");
          }}
          onLoadStart={() => setLoading(true)}
          onCanPlay={() => setLoading(false)}
        />
      </div>
    </AppLayout>
  );
};

export default SurahDetailPage;
