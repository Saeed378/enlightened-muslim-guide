
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAyahTafseer, getTafseerEditions, TafseerEdition } from "@/services/api";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Tafseer = () => {
  const { surahId, ayahId } = useParams<{ surahId: string; ayahId: string }>();
  const [selectedTafseer, setSelectedTafseer] = useState<string | null>(null);

  const { data: tafseerEditions, isLoading: editionsLoading } = useQuery({
    queryKey: ["tafseerEditions"],
    queryFn: getTafseerEditions,
  });

  const { 
    data: tafseer, 
    isLoading: tafseerLoading,
    error: tafseerError 
  } = useQuery({
    queryKey: ["tafseer", surahId, ayahId, selectedTafseer],
    queryFn: () => getAyahTafseer(surahId!, ayahId!, selectedTafseer),
    enabled: !!surahId && !!ayahId && !!selectedTafseer,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching tafseer:", error);
        toast.error("حدث خطأ أثناء تحميل التفسير");
      }
    }
  });

  useEffect(() => {
    if (tafseerEditions && tafseerEditions.length > 0 && !selectedTafseer) {
      setSelectedTafseer(tafseerEditions[0].identifier);
    }
  }, [tafseerEditions, selectedTafseer]);

  const handleTafseerChange = (tafseerId: string) => {
    setSelectedTafseer(tafseerId);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-2">تفسير الآية</h1>
          <p className="text-muted-foreground">اختر تفسير للاطلاع على معاني الآية</p>
        </div>

        <Tabs 
          value={selectedTafseer || ""} 
          onValueChange={handleTafseerChange}
          className="w-full"
        >
          <div className="overflow-x-auto pb-2">
            <TabsList className="w-full justify-start">
              {editionsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-32" />
                ))
              ) : (
                tafseerEditions?.map((edition: TafseerEdition) => (
                  <TabsTrigger key={edition.identifier} value={edition.identifier}>
                    {edition.name}
                  </TabsTrigger>
                ))
              )}
            </TabsList>
          </div>

          {selectedTafseer && (
            <TabsContent value={selectedTafseer} className="mt-6">
              <div className="space-y-4">
                {tafseerLoading ? (
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-24 w-full" />
                    </CardContent>
                  </Card>
                ) : tafseer ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-amiri">
                        {tafseer.text}
                      </CardTitle>
                      <CardDescription>
                        {tafseer.author_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="arabic-text text-lg leading-loose font-amiri">{tafseer.resource_name}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">لا يوجد تفسير متاح لهذه الآية حالياً.</p>
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

export default Tafseer;
