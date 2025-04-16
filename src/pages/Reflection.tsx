import { useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { reflections } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { BookOpen, Quote, Calendar, Heart, HelpCircle, Star } from "lucide-react";

// Extended reflections data with more items and categories
const extendedReflections = [
  ...reflections,
  {
    id: 6,
    title: "التقوى",
    text: "التقوى هي خوف الله واجتناب ما نهى عنه وفعل ما أمر به. وقد وصف الله سبحانه وتعالى المتقين في القرآن الكريم بقوله: (الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ).",
    author: "ابن كثير",
    category: "الأخلاق"
  },
  {
    id: 7,
    title: "الدعاء",
    text: "الدعاء هو العبادة، كما أخبر النبي صلى الله عليه وسلم، وهو من أعظم وسائل التقرب إلى الله تعالى. فمن أراد أن يستجيب الله له، فليستجب لله فيما أمره به.",
    author: "ابن تيمية",
    category: "العبادات"
  },
  {
    id: 8,
    title: "الحكمة",
    text: "الحكمة هي وضع الشيء في موضعه، وإعطاء كل ذي حق حقه، وهي من أعظم الصفات التي ينبغي أن يتحلى بها المسلم. قال تعالى: (يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ وَمَن يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا).",
    author: "الشيخ محمد متولي الشعراوي",
    category: "الأخلاق"
  },
  {
    id: 9,
    title: "البر والإحسان",
    text: "البر والإحسان من أعظم الصفات التي يجب أن يتحلى بها المؤمن. قال تعالى: (إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَى وَيَنْهَى عَنِ الْفَحْشَاءِ وَالْمُنكَرِ وَالْبَغْيِ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُونَ).",
    author: "الإمام البخاري",
    category: "المعاملات"
  },
  {
    id: 10,
    title: "الصحبة الصالحة",
    text: "الصحبة الصالحة مهمة في حياة المسلم، فالمرء على دين خليله، فلينظر أحدكم من يخالل. المرء يتأثر بمن حوله من الأصدقاء إما سلبًا أو إيجابًا، لذلك كان حريًا بالمسلم أن يختار صحبته بعناية.",
    author: "ابن القيم الجوزية",
    category: "المعاملات"
  }
];

// Daily hadiths
const dailyHadiths = [
  {
    text: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى",
    source: "صحيح البخاري"
  },
  {
    text: "من حسن إسلام المرء تركه ما لا يعنيه",
    source: "سنن الترمذي"
  },
  {
    text: "الدين النصيحة",
    source: "صحيح مسلم"
  }
];

// Wisdom quotes
const wisdomQuotes = [
  {
    text: "العلم في الصغر كالنقش على الحجر",
    author: "مثل عربي"
  },
  {
    text: "قيمة المرء ما يحسنه",
    author: "علي بن أبي طالب"
  },
  {
    text: "العلم بلا عمل كالشجر بلا ثمر",
    author: "حكمة إسلامية"
  }
];

const ReflectionPage = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string | null>(null);
  const itemsPerPage = 3;

  // Get unique categories
  const categories = Array.from(
    new Set(extendedReflections.map((r: any) => r.category))
  ).filter(Boolean);

  // Filter and paginate reflections
  const filteredReflections = filter
    ? extendedReflections.filter((r: any) => r.category === filter)
    : extendedReflections;

  const totalPages = Math.ceil(filteredReflections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReflections = filteredReflections.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Get random quote from array
  const getRandomItem = (array: any[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const dailyHadith = getRandomItem(dailyHadiths);
  const wisdomQuote = getRandomItem(wisdomQuotes);
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-2">تأملات إسلامية</h1>
          <p className="text-muted-foreground">تأملات وأفكار من العلماء والمفكرين المسلمين</p>
        </div>

        {/* Filter by category */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => {
              setFilter(null);
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setFilter(category);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-6">
          {paginatedReflections.map((reflection: any) => (
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
                <CardDescription>
                  {reflection.author} {reflection.category && `• ${reflection.category}`}
                </CardDescription>
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
              {reflection.source && (
                <CardFooter className="text-sm text-muted-foreground">
                  المصدر: {reflection.source}
                </CardFooter>
              )}
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(Math.max(1, currentPage - 1));
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(Math.min(totalPages, currentPage + 1));
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        
        {/* Daily wisdom section */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Hadith of the day */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Quote className="h-5 w-5 text-primary" />
                <CardTitle>حديث اليوم</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="arabic-text text-xl font-amiri leading-loose">
                "{dailyHadith.text}"
              </p>
              <p className="mt-2 text-muted-foreground">{dailyHadith.source}</p>
            </CardContent>
          </Card>

          {/* Wisdom quote */}
          <Card className="bg-secondary/50 border-secondary/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <CardTitle>قول مأثور</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="arabic-text text-xl font-amiri leading-loose">
                "{wisdomQuote.text}"
              </p>
              <p className="mt-2 text-muted-foreground">- {wisdomQuote.author}</p>
            </CardContent>
          </Card>
        </div>

        {/* Ayah of the day - keep existing card */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>آية اليوم</CardTitle>
            </div>
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
