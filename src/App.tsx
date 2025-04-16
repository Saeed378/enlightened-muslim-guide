
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import Index from "./pages/Index";
import SurahDetail from "./pages/SurahDetail";
import Hadith from "./pages/Hadith";
import Reflection from "./pages/Reflection";
import PrayerTimes from "./pages/PrayerTimes";
import Tafseer from "./pages/Tafseer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/surah/:id" element={<SurahDetail />} />
            <Route path="/hadith" element={<Hadith />} />
            <Route path="/reflection" element={<Reflection />} />
            <Route path="/prayer-times" element={<PrayerTimes />} />
            <Route path="/tafseer/:surahId/:ayahId" element={<Tafseer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
