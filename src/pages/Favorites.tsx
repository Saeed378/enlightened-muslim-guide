
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BookText, Book, Bookmark, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FavoriteSurah {
  surahNumber: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  addedAt: string;
}

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteSurah[]>([]);
  const [activeTab, setActiveTab] = useState("surahs");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch favorites from localStorage
  useEffect(() => {
    setIsLoading(true);
    try {
      const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(savedFavorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
      toast.error("حدث خطأ أثناء تحميل المفضلة");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFavorite = (surahNumber: number) => {
    const newFavorites = favorites.filter(fav => fav.surahNumber !== surahNumber);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
    toast.success("تمت إزالة السورة من المفضلة");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-2">المفضلة</h1>
          <p className="text-muted-foreground">السور والآيات التي أضفتها إلى المفضلة</p>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full">
            <TabsTrigger value="surahs" className="flex-1">
              <Book className="h-4 w-4 mr-2" />
              السور
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">
              <BookText className="h-4 w-4 mr-2" />
              الملاحظات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="surahs" className="mt-6">
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <Skeleton className="h-6 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : favorites.length > 0 ? (
                favorites.map((surah) => (
                  <Card key={surah.surahNumber} className="overflow-hidden">
                    <div className="flex">
                      <div className="flex-1">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm mr-2">
                              {surah.surahNumber}
                            </span>
                            <span className="font-amiri">سورة {surah.name}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {surah.englishName} • {surah.numberOfAyahs} آيات
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            أُضيفت بتاريخ {new Date(surah.addedAt).toLocaleDateString('ar-SA')}
                          </p>
                          <div className="mt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/surah/${surah.surahNumber}`)}
                            >
                              الانتقال إلى السورة
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                      <div className="flex items-center px-4">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeFavorite(surah.surahNumber)}
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">إزالة من المفضلة</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">لم تضف أي سور للمفضلة</h3>
                  <p className="text-muted-foreground mb-4">يمكنك إضافة السور للمفضلة من صفحة قراءة السورة</p>
                  <Button onClick={() => navigate("/")}>
                    تصفح القرآن الكريم
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <NotesTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

const NotesTab = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Array<{surahNumber: number, content: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all notes from localStorage
  useEffect(() => {
    setIsLoading(true);
    try {
      const allNotes = [];
      // Loop through localStorage looking for notes
      for (let i = 1; i <= 114; i++) {
        const noteContent = localStorage.getItem(`notes-surah-${i}`);
        if (noteContent && noteContent.trim() !== '') {
          allNotes.push({
            surahNumber: i,
            content: noteContent
          });
        }
      }
      setNotes(allNotes);
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteNote = (surahNumber: number) => {
    localStorage.removeItem(`notes-surah-${surahNumber}`);
    setNotes(notes.filter(note => note.surahNumber !== surahNumber));
    toast.success("تم حذف الملاحظة بنجاح");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <BookText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">لا توجد ملاحظات</h3>
        <p className="text-muted-foreground mb-4">يمكنك إضافة ملاحظات من صفحة قراءة السورة</p>
        <Button onClick={() => navigate("/")}>
          تصفح القرآن الكريم
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.surahNumber} className="overflow-hidden">
          <div className="flex">
            <div className="flex-1">
              <CardHeader>
                <CardTitle className="text-lg">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm mr-2">
                    {note.surahNumber}
                  </span>
                  ملاحظات حول السورة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-right font-amiri p-3 bg-muted/50 rounded-md mb-3">
                  {note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content}
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/surah/${note.surahNumber}`)}
                  >
                    الانتقال إلى السورة
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive"
                    onClick={() => deleteNote(note.surahNumber)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FavoritesPage;
