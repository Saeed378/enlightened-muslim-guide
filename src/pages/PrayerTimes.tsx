import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPrayerTimes } from "@/services/api";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, RefreshCw, Sun, Sunrise, CloudSun, Cloud, Sunset, Moon } from "lucide-react";
import { toast } from "sonner";

const PrayerTimesPage = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [locationName, setLocationName] = useState<string>("تحديد الموقع...");
  const [locationError, setLocationError] = useState<boolean>(false);
  
  const { data: prayerTimes, isLoading, error, refetch } = useQuery({
    queryKey: ["prayerTimes", location?.lat, location?.lng, date],
    queryFn: () => 
      location 
        ? getPrayerTimes(location.lat, location.lng, date) 
        : Promise.reject("No location available"),
    enabled: !!location,
    retry: 2
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setLocationError(false);
          
          // Try to get location name using reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`
            );
            const data = await response.json();
            if (data.address) {
              const city = data.address.city || data.address.town || data.address.village || "";
              const country = data.address.country || "";
              setLocationName(city ? `${city}, ${country}` : country);
            }
          } catch (error) {
            console.error("Error getting location name:", error);
            setLocationName("موقعك الحالي");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(true);
          toast.error("لم نتمكن من تحديد موقعك. يرجى السماح بالوصول إلى الموقع.");
          setLocationName("تعذر تحديد الموقع");
          
          // Use default location (Mecca) when geolocation fails
          setLocation({ lat: 21.3891, lng: 39.8579 });
        }
      );
    } else {
      toast.error("متصفحك لا يدعم تحديد الموقع الجغرافي.");
      setLocationName("تعذر تحديد الموقع");
      // Use default location (Mecca)
      setLocation({ lat: 21.3891, lng: 39.8579 });
    }
  }, []);

  
  // Format the prayer time to a more readable format
  const formatTime = (time: string) => {
    if (!time) return "";
    
    const [hour, minute] = time.split(":");
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? "م" : "ص";
    const hour12 = hourNum % 12 || 12;
    
    return `${hour12}:${minute} ${ampm}`;
  };

  // Prayer names and icons mapping
  const prayerConfig = {
    Fajr: { name: "الفجر", icon: <Sunrise className="h-5 w-5 text-amber-500" /> },
    Sunrise: { name: "الشروق", icon: <Sun className="h-5 w-5 text-amber-500" /> },
    Dhuhr: { name: "الظهر", icon: <CloudSun className="h-5 w-5 text-primary" /> },
    Asr: { name: "العصر", icon: <Cloud className="h-5 w-5 text-primary" /> },
    Maghrib: { name: "المغرب", icon: <Sunset className="h-5 w-5 text-orange-500" /> },
    Isha: { name: "العشاء", icon: <Moon className="h-5 w-5 text-blue-600" /> }
  };

  const handleRefresh = () => {
    refetch();
  };

  // Get current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Find next prayer - fixed to correctly compare times
  const getNextPrayer = () => {
    if (!prayerTimes) return null;
    
    const currentTime = getCurrentTime();
    
    const prayers = [
      { name: "Fajr", time: prayerTimes.Fajr },
      { name: "Sunrise", time: prayerTimes.Sunrise },
      { name: "Dhuhr", time: prayerTimes.Dhuhr },
      { name: "Asr", time: prayerTimes.Asr },
      { name: "Maghrib", time: prayerTimes.Maghrib },
      { name: "Isha", time: prayerTimes.Isha }
    ];
    
    // Convert time strings to minutes since midnight for proper comparison
    const timeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(num => parseInt(num));
      return hours * 60 + minutes;
    };
    
    const currentMinutes = timeToMinutes(currentTime);
    
    // Find the next prayer
    for (const prayer of prayers) {
      const prayerMinutes = timeToMinutes(prayer.time);
      if (prayerMinutes > currentMinutes) {
        return prayer;
      }
    }
    
    // If no prayer is found, the next prayer is Fajr of the next day
    return { name: "Fajr", time: prayerTimes.Fajr };
  };

  const nextPrayer = getNextPrayer();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-2">مواقيت الصلاة</h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <p>{locationName}</p>
            {locationError && (
              <span className="text-destructive text-xs">(تم استخدام موقع افتراضي)</span>
            )}
          </div>
        </div>

        {nextPrayer && !isLoading && !error && (
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-center">الصلاة القادمة</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-6">
              <div className="flex flex-col items-center justify-center">
                {prayerConfig[nextPrayer.name as keyof typeof prayerConfig].icon}
                <h2 className="text-3xl font-bold mt-2">
                  {prayerConfig[nextPrayer.name as keyof typeof prayerConfig].name}
                </h2>
                <p className="text-2xl font-medium mt-1">
                  {formatTime(nextPrayer.time)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">مواقيت الصلاة اليوم</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString("ar-EG", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              className="rounded-full h-10 w-10 p-0"
            >
              <RefreshCw className="h-5 w-5" />
              <span className="sr-only">تحديث</span>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex justify-between items-center p-4 rounded-lg border">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-xl text-destructive">حدث خطأ أثناء تحميل بيانات الصلاة</p>
                <Button 
                  onClick={handleRefresh}
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  إعادة المحاولة
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {prayerTimes && Object.entries(prayerTimes).map(([key, value]) => {
                  if (key in prayerConfig) {
                    const config = prayerConfig[key as keyof typeof prayerConfig];
                    const isNext = nextPrayer && nextPrayer.name === key;
                    
                    return (
                      <div 
                        key={key} 
                        className={`flex justify-between items-center p-4 rounded-lg border ${
                          isNext ? 'bg-primary/10 border-primary' : 'hover:border-primary/50'
                        } transition-colors`}
                      >
                        <div className="flex items-center gap-3">
                          {config.icon}
                          <span className="font-medium">{config.name}</span>
                          {isNext && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                              القادمة
                            </span>
                          )}
                        </div>
                        <span className="text-lg font-medium">{formatTime(value)}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle>نصائح للصلاة</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 list-disc list-inside">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-2"></span>
                <span>حافظ على الصلاة في وقتها.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-2"></span>
                <span>توضأ بشكل صحيح قبل كل صلاة.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-2"></span>
                <span>صلِ بخشوع وتركيز.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-2"></span>
                <span>احرص على أداء السنن الراتبة بعد الفرائض.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-2"></span>
                <span>قم بصلاة الجماعة في المسجد كلما أمكن ذلك.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PrayerTimesPage;
