
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSurahDetail, getSurahAudio, SurahDetail as SurahDetailType } from "@/services/api";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ChevronLeft, Play, Pause, SkipBack, SkipForward, Bookmark, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";

const SurahDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const surahNumber = parseInt(id || "1");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notes, setNotes] = useState<string>("");
  const [ayahAudioTimestamps, setAyahAudioTimestamps] = useState<number[]>([]);

  // Get Surah details with improved caching
  const { data: surah, isLoading, error } = useQuery({
    queryKey: ["surah", surahNumber],
    queryFn: () => getSurahDetail(surahNumber),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes to improve performance
    retry: 2
  });

  // Check if surah is in favorites on mount
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav: any) => fav.surahNumber === surahNumber));
    
    // Get notes for this surah
    const savedNotes = localStorage.getItem(`notes-surah-${surahNumber}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [surahNumber]);

  // Load audio source when surah loads - with better error handling
  useEffect(() => {
    const loadAudio = async () => {
      try {
        setIsLoadingAudio(true);
        const src = await getSurahAudio(surahNumber);
        setAudioSrc(src);
        
        // Preload audio
        if (audioRef.current) {
          audioRef.current.load();
        }
      } catch (error) {
        console.error("Error loading audio:", error);
        toast.error("حدث خطأ أثناء تحميل الصوت");
      } finally {
        setIsLoadingAudio(false);
      }
    };
    
    loadAudio();
  }, [surahNumber]);

  // When surah data loads, create estimated timestamps for each ayah
  useEffect(() => {
    if (surah && audioRef.current) {
      // We'll create estimated timestamps once the audio metadata is loaded
      const handleMetadataLoaded = () => {
        if (!audioRef.current) return;
        
        const totalDuration = audioRef.current.duration;
        const ayahCount = surah.numberOfAyahs;
        
        // Simple estimation: divide total duration by number of ayahs
        // This is a simple approach; in a real app, you'd use actual timestamps from an API
        const timestamps: number[] = [];
        const avgAyahDuration = totalDuration / ayahCount;
        
        for (let i = 0; i < ayahCount; i++) {
          timestamps.push(i * avgAyahDuration);
        }
        
        setAyahAudioTimestamps(timestamps);
      };
      
      audioRef.current.addEventListener('loadedmetadata', handleMetadataLoaded);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', handleMetadataLoaded);
        }
      };
    }
  }, [surah]);

  // Handle audio play/pause with better feedback
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        toast.success("جاري تشغيل السورة...");
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error("Error playing audio:", err);
          toast.error("حدث خطأ أثناء تشغيل الصوت");
        });
      }
    }
  };

  // Handle audio timeupdate to track current ayah
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (!audioRef.current || ayahAudioTimestamps.length === 0) return;
      
      const currentTime = audioRef.current.currentTime;
      
      // Find which ayah we're currently playing
      for (let i = ayahAudioTimestamps.length - 1; i >= 0; i--) {
        if (currentTime >= ayahAudioTimestamps[i]) {
          setCurrentAyah(i + 1);
          break;
        }
      }
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
    }
  }, [ayahAudioTimestamps]);

  // Handle previous and next ayah navigation
  const goToPreviousAyah = () => {
    if (!surah || !audioRef.current || !ayahAudioTimestamps.length) return;
    
    const newAyahIndex = Math.max(0, currentAyah - 2);
    const newTime = ayahAudioTimestamps[newAyahIndex];
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentAyah(newAyahIndex + 1);
      
      // If audio is paused, start playing
      if (!isPlaying) {
        toggleAudio();
      }
      
      toast.info(`الانتقال إلى الآية ${newAyahIndex + 1}`);
    }
  };

  const goToNextAyah = () => {
    if (!surah || !audioRef.current || !ayahAudioTimestamps.length) return;
    
    const maxAyahs = surah.numberOfAyahs;
    const newAyahIndex = Math.min(maxAyahs - 1, currentAyah);
    const newTime = ayahAudioTimestamps[newAyahIndex];
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentAyah(newAyahIndex + 1);
      
      // If audio is paused, start playing
      if (!isPlaying) {
        toggleAudio();
      }
      
      toast.info(`الانتقال إلى الآية ${newAyahIndex + 1}`);
    }
  };

  // Toggle favorites functionality
  const toggleFavorite = () => {
    if (!surah) return;
    
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (isFavorite) {
      const newFavorites = favorites.filter((fav: any) => fav.surahNumber !== surahNumber);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast.info("تمت إزالة السورة من المفضلة");
    } else {
      const newFavorite = {
        surahNumber,
        name: surah.name,
        englishName: surah.englishName,
        numberOfAyahs: surah.numberOfAyahs,
        addedAt: new Date().toISOString()
      };
      favorites.push(newFavorite);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
      toast.success("تمت إضافة السورة إلى المفضلة");
    }
  };

  // Save notes function
  const saveNotes = () => {
    localStorage.setItem(`notes-surah-${surahNumber}`, notes);
    toast.success("تم حفظ الملاحظات بنجاح");
  };

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    const handleCanPlayThrough = () => {
      setIsLoadingAudio(false);
    };
    
    if (audio) {
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("canplaythrough", handleCanPlayThrough);
      
      return () => {
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("canplaythrough", handleCanPlayThrough);
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

  const navigateToTafseer = () => {
    navigate(`/tafseer/${surahNumber}/1`);
  };

  // Highlight current ayah
  const isCurrentAyah = (ayahNumber: number) => {
    return ayahNumber === currentAyah;
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
              <div className="flex items-center justify-center gap-2 mb-2">
                <h1 className="text-3xl font-bold tracking-tight font-amiri">سورة {surah.name}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFavorite}
                  className="h-8 w-8"
                >
                  {isFavorite ? <Bookmark className="h-5 w-5 fill-primary text-primary" /> : <BookmarkPlus className="h-5 w-5" />}
                  <span className="sr-only">{isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}</span>
                </Button>
              </div>
              <p className="text-muted-foreground">{surah.englishName} • {surah.numberOfAyahs} آيات • {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}</p>
            </div>

            <Card className="border-primary/50">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4 gap-2">
                  <Button 
                    variant="outline" 
                    className="rounded-full w-10 h-10 p-0 flex items-center justify-center text-primary"
                    onClick={goToPreviousAyah}
                    disabled={currentAyah <= 1 || isLoadingAudio || !ayahAudioTimestamps.length}
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="rounded-full w-12 h-12 p-0 flex items-center justify-center text-primary"
                    onClick={toggleAudio}
                    disabled={isLoadingAudio}
                  >
                    {isLoadingAudio ? (
                      <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    ) : isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="rounded-full w-10 h-10 p-0 flex items-center justify-center text-primary"
                    onClick={goToNextAyah}
                    disabled={currentAyah >= surah.numberOfAyahs || isLoadingAudio || !ayahAudioTimestamps.length}
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  
                  <audio ref={audioRef} src={audioSrc} preload="metadata" />
                </div>
                
                <div className="space-y-4">
                  {surah.ayahs.map((ayah) => (
                    <div 
                      key={ayah.number} 
                      className={`pb-2 border-b border-muted last:border-0 ${isCurrentAyah(ayah.numberInSurah) ? 'bg-primary/5 rounded p-2' : ''}`}
                    >
                      <p className="text-xl leading-relaxed text-right font-amiri arabic-text">
                        {ayah.text} 
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          isCurrentAyah(ayah.numberInSurah) ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                        } text-sm mr-2`}>
                          {ayah.numberInSurah}
                        </span>
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-1 text-xs"
                        onClick={() => navigate(`/tafseer/${surahNumber}/${ayah.numberInSurah}`)}
                      >
                        تفسير الآية
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">ملاحظاتي</h2>
                <textarea
                  className="w-full h-32 p-3 border rounded-md mb-4 resize-none text-right"
                  placeholder="اكتب ملاحظاتك حول السورة هنا..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
                <Button onClick={saveNotes}>حفظ الملاحظات</Button>
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
                onClick={navigateToTafseer}
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
