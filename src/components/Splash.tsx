
import { useEffect, useState } from 'react';

export const Splash = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center animate-fade-in">
      <div className="w-64 h-64 relative">
        <img
          src="/quran-splash.png"
          alt="القرآن الكريم"
          className="w-full h-full object-contain animate-scale-in"
        />
      </div>
    </div>
  );
};
