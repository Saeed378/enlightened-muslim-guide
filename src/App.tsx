import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Splash } from "@/components/Splash";

import Index from "./pages/Index";
import SurahDetail from "./pages/SurahDetail";
import Hadith from "./pages/Hadith";
import Reflection from "./pages/Reflection";
import PrayerTimes from "./pages/PrayerTimes";
import Tafseer from "./pages/Tafseer";
import Favorites from "./pages/Favorites"; // New import
import NotFound from "./pages/NotFound";
import Duas from "./pages/Duas";
import TasbihPage from "./pages/Tasbih";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <ThemeProvider defaultTheme="light">
        <Splash onFinish={() => setShowSplash(false)} />
      </ThemeProvider>
    );
  }

  return (
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
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/duas" element={<Duas />} />
              <Route path="/tasbih" element={<TasbihPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
