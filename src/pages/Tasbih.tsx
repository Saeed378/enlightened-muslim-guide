
import { useState, useEffect } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Circle, RotateCcw } from "lucide-react";
import confetti from 'canvas-confetti';

const TasbihPage = () => {
  const [count, setCount] = useState<number>(() => {
    const saved = localStorage.getItem('tasbihCount');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('tasbihCount', count.toString());
    
    if (count === 100) {
      celebrate();
    }
  }, [count]);

  const handleCount = () => {
    setCount(prev => prev + 1);
  };

  const handleReset = () => {
    setCount(0);
    toast.success('تم إعادة تعيين العداد');
  };

  const celebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    toast.success('ما شاء الله! أكملت 100 تسبيحة 🎉');
  };

  return (
    <AppLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">السبحة الإلكترونية</h1>
          <p className="text-muted-foreground">اضغط على الدائرة للتسبيح</p>
        </div>

        <button
          onClick={handleCount}
          className="group relative w-48 h-48 rounded-full bg-gradient-to-br from-islamic-green to-islamic-gold transition-transform duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          <div className="absolute inset-1 bg-background rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-islamic-green group-hover:scale-110 transition-transform">
              {count}
            </span>
          </div>
        </button>

        <Button 
          variant="outline" 
          onClick={handleReset}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          إعادة تعيين
        </Button>

        <div className="fixed bottom-8 right-8">
          <Button
            size="lg"
            className="rounded-full w-16 h-16 shadow-lg"
            onClick={handleCount}
          >
            <Circle className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default TasbihPage;
