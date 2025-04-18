
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/layouts/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDuas, getDuaCategories } from "@/services/duas";
import { DuaCard } from "@/components/DuaCard";
import { Skeleton } from "@/components/ui/skeleton";

const DuasPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1); // Default to first category
  
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["duaCategories"],
    queryFn: getDuaCategories,
  });

  const { data: duas, isLoading: isDuasLoading } = useQuery({
    queryKey: ["duas", selectedCategoryId],
    queryFn: () => getDuas(selectedCategoryId),
  });

  if (isCategoriesLoading || isDuasLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-48" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-2">الأدعية والأذكار</h1>
          <p className="text-muted-foreground">مجموعة من الأدعية والأذكار المأثورة</p>
        </div>

        <Tabs 
          defaultValue={categories?.[0]?.nameEn} 
          dir="rtl"
          onValueChange={(value) => {
            const category = categories?.find(cat => cat.nameEn === value);
            if (category) {
              setSelectedCategoryId(category.id);
            }
          }}
        >
          <TabsList className="w-full justify-start mb-4">
            {categories?.map((category) => (
              <TabsTrigger key={category.id} value={category.nameEn}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories?.map((category) => (
            <TabsContent key={category.id} value={category.nameEn}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {duas
                  ?.filter((dua) => dua.categoryId === category.id)
                  .map((dua) => (
                    <DuaCard key={dua.id} dua={dua} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default DuasPage;
