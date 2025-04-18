
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Surah, getSurahs } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/layouts/AppLayout";

// Helper function to normalize Arabic text (remove diacritics/fancy characters)
const normalizeArabicText = (text: string): string => {
  return text
    .replace(/[\u064B-\u065F]/g, '') // Remove Arabic diacritics (Tashkeel)
    .replace(/\u0671/g, 'ا') // Replace different forms of Alef
    .replace(/[\u0622\u0623\u0625]/g, 'ا')
    .replace(/\u0624/g, 'و') // Replace Waw with Hamza
    .replace(/\u0626/g, 'ي') // Replace Yaa with Hamza
    .replace(/\u0629/g, 'ه') // Replace Taa Marbuta with Haa
    .replace(/\u0649/g, 'ى') // Replace Alef Maksura with Yaa
    .toLowerCase();
};

const QuranHomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: surahs, isLoading, error } = useQuery({
    queryKey: ["surahs"],
    queryFn: getSurahs
  });

  const filteredSurahs = surahs?.filter((surah) => {
    if (!searchTerm.trim()) return true;
    
    // Normalize the search term and surah properties
    const searchLower = normalizeArabicText(searchTerm.toLowerCase());
    
    // Apply normalization to Arabic name
    const nameMatch = normalizeArabicText(surah.name).includes(searchLower);
    
    // Check for matches in English name (case-insensitive)
    const englishNameMatch = surah.englishName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check for matches in English translation (case-insensitive)
    const translationMatch = surah.englishNameTranslation.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check for matches in surah number
    const numberMatch = surah.number.toString().includes(searchTerm);
    
    // Check for matches in revelation type (Meccan/Medinan)
    const revelationMatch = 
      (searchLower === "مكية" && surah.revelationType === "Meccan") ||
      (searchLower === "مدنية" && surah.revelationType === "Medinan") ||
      surah.revelationType.toLowerCase().includes(searchTerm.toLowerCase());
    
    return nameMatch || englishNameMatch || translationMatch || numberMatch || revelationMatch;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-2">القرآن الكريم</h1>
          <p className="text-muted-foreground">اختر سورة للقراءة والاستماع</p>
        </div>
        
        <div className="relative w-full max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن سورة بالاسم أو الرقم..."
            className="pl-10 rtl:pr-10 rtl:pl-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-20 mb-1" />
                  <Skeleton className="h-4 w-40" />
                </CardHeader>
                <CardContent className="pb-4">
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-xl text-destructive">حدث خطأ أثناء تحميل البيانات</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <>
            {filteredSurahs && filteredSurahs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSurahs.map((surah) => (
                  <Link key={surah.number} to={`/surah/${surah.number}`}>
                    <Card className="overflow-hidden hover:border-primary transition-all cursor-pointer hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                            {surah.number}
                          </span>
                          <CardTitle className="text-xl font-amiri">{surah.name}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">{surah.englishName} • {surah.englishNameTranslation}</p>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {surah.numberOfAyahs} آيات
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-lg text-muted-foreground">لا توجد نتائج مطابقة للبحث</p>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default QuranHomePage;
