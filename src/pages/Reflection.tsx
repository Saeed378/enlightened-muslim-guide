
import { useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { reflections } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const ReflectionPage = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-2">تأملات إسلامية</h1>
          <p className="text-muted-foreground">تأملات وأفكار من العلماء والمفكرين المسلمين</p>
        </div>

        <div className="grid gap-6">
          {reflections.map((reflection) => (
            <Card 
              key={reflection.id} 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-all"
              onClick={() => toggleExpand(reflection.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle>{reflection.title}</CardTitle>
                </div>
                <CardDescription>{reflection.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`arabic-text text-lg leading-relaxed ${expandedId === reflection.id ? '' : 'line-clamp-3'}`}>
                  {reflection.text}
                </p>
                {reflection.text.length > 150 && (
                  <button 
                    className="mt-2 text-primary hover:underline text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(reflection.id);
                    }}
                  >
                    {expandedId === reflection.id ? 'عرض أقل' : 'قراءة المزيد'}
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>آية اليوم</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="arabic-text text-xl font-amiri leading-loose">
              "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ"
            </p>
            <p className="mt-2 text-muted-foreground">سورة البقرة - آية 45</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ReflectionPage;
