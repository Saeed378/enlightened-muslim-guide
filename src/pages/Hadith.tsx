
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHadithCollections, getHadithsByCollection } from "@/services/api";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const HadithPage = () => {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ["hadithCollections"],
    queryFn: getHadithCollections
  });

  const { 
    data: hadiths, 
    isLoading: hadithsLoading,
    error: hadithError 
  } = useQuery({
    queryKey: ["hadiths", selectedCollection, page],
    queryFn: () => getHadithsByCollection(selectedCollection || "bukhari", page, limit),
    enabled: !!selectedCollection,
    retry: 1
  });

  // Set default collection when collections are loaded
  useEffect(() => {
    if (collections && collections.length > 0 && !selectedCollection) {
      setSelectedCollection(collections[0].id);
    }
  }, [collections, selectedCollection]);

  // Handle API error
  useEffect(() => {
    if (hadithError) {
      console.error("Hadith fetch error:", hadithError);
    }
  }, [hadithError]);

  const handleCollectionChange = (collectionId: string) => {
    setSelectedCollection(collectionId);
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-2">الأحاديث النبوية</h1>
          <p className="text-muted-foreground">اختر كتاب الحديث لقراءة الأحاديث</p>
        </div>

        <Tabs 
          value={selectedCollection || ""} 
          onValueChange={handleCollectionChange}
          className="w-full"
        >
          <div className="overflow-x-auto pb-2">
            <TabsList className="w-full justify-start">
              {collectionsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-20" />
                ))
              ) : (
                collections?.map((collection) => (
                  <TabsTrigger key={collection.id} value={collection.id}>
                    {collection.name}
                  </TabsTrigger>
                ))
              )}
            </TabsList>
          </div>

          {selectedCollection && (
            <TabsContent value={selectedCollection} className="mt-6">
              <div className="space-y-4">
                {hadithsLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <Skeleton className="h-4 w-16" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-24 w-full" />
                      </CardContent>
                    </Card>
                  ))
                ) : hadiths && hadiths.length > 0 ? (
                  <>
                    {hadiths.map((hadith) => (
                      <Card key={hadith.number}>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm mr-2">
                              {hadith.number}
                            </span>
                            <span>حديث رقم {hadith.number}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="arabic-text text-lg leading-loose font-amiri">{hadith.arab}</p>
                          {hadith.id && (
                            <p className="text-sm mt-4 text-muted-foreground">{hadith.id}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    <div className="flex justify-between items-center mt-6">
                      <Button 
                        variant="outline" 
                        onClick={handlePreviousPage} 
                        disabled={page === 1}
                        className="flex items-center gap-2"
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span>السابق</span>
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        صفحة {page}
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleNextPage}
                        className="flex items-center gap-2"
                      >
                        <span>التالي</span>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">لا توجد أحاديث متاحة حالياً. يرجى اختيار كتاب آخر.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default HadithPage;
