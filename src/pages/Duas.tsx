
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/layouts/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDuas, getDuaCategories } from "@/services/duas";
import { DuaCard } from "@/components/DuaCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const DuasPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1); // Default to first category
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["duaCategories"],
    queryFn: getDuaCategories,
  });

  const { data: paginatedDuas, isLoading: isDuasLoading } = useQuery({
    queryKey: ["duas", selectedCategoryId, currentPage],
    queryFn: () => getDuas(selectedCategoryId, currentPage),
  });

  // Reset page when changing category
  const handleCategoryChange = (value: string) => {
    const category = categories?.find(cat => cat.nameEn === value);
    if (category) {
      setSelectedCategoryId(category.id);
      setCurrentPage(1); // Reset to first page when changing category
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pagination component with page numbers
  const renderPagination = (totalPages: number) => {
    if (totalPages <= 1) return null;

    // Function to render page links with ellipsis for large numbers of pages
    const renderPageLinks = () => {
      const pageItems = [];
      
      // Always show first page
      pageItems.push(
        <PaginationItem key="page-1">
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Calculate visible page range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Show ellipsis if needed before startPage
      if (startPage > 2) {
        pageItems.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Show page numbers
      for (let i = startPage; i <= endPage; i++) {
        pageItems.push(
          <PaginationItem key={`page-${i}`}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Show ellipsis if needed after endPage
      if (endPage < totalPages - 1) {
        pageItems.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Always show last page if there are multiple pages
      if (totalPages > 1) {
        pageItems.push(
          <PaginationItem key={`page-${totalPages}`}>
            <PaginationLink
              isActive={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      return pageItems;
    };

    return (
      <Pagination className="my-6">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>
          )}
          
          {renderPageLinks()}
          
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    );
  };

  if (isCategoriesLoading || isDuasLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
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
          onValueChange={handleCategoryChange}
        >
          <TabsList className="w-full justify-start mb-4 overflow-x-auto">
            {categories?.map((category) => (
              <TabsTrigger key={category.id} value={category.nameEn}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories?.map((category) => (
            <TabsContent key={category.id} value={category.nameEn}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedDuas?.duas.map((dua) => (
                  <DuaCard key={dua.id} dua={dua} />
                ))}
              </div>
              
              {/* Pagination component */}
              {paginatedDuas && renderPagination(paginatedDuas.totalPages)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default DuasPage;
