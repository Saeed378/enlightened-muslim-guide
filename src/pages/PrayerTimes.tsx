
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPrayerTimes } from "@/services/api";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

const PrayerTimesPage = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [locationName, setLocationName] = useState<string>("تحديد الموقع...");
  
  const { data: prayerTimes, isLoading, error, refetch } = useQuery({
    queryKey: ["prayerTimes", location?.lat, location?.lng, date],
    queryFn: () => 
      location 
        ? getPrayerTimes(location.lat, location.lng, date) 
        : Promise.reject("No location available"),
    enabled: !!location
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          
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
          toast.error("لم نتمكن من تحديد موقعك. يرجى السماح بالوصول إلى الموقع.");
          setLocationName("تعذر تحديد الموقع");
        }
      );
    } else {
      toast.error("متصفحك لا يدعم تحديد الموقع الجغرافي.");
      setLocationName("تعذر تحديد الموقع");
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

  const prayerNames = {
    Fajr: "الفجر",
    Sunrise: "الشروق",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء"
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-2">مواقيت الصلاة</h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <p>{locationName}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">مواقيت الصلاة اليوم</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString("ar-EG", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
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
                <button 
                  onClick={handleRefresh}
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {prayerTimes && Object.entries(prayerTimes).map(([key, value]) => {
                  if (key === "Fajr" || key === "Sunrise" || key === "Dhuhr" || key === "Asr" || key === "Maghrib" || key === "Isha") {
                    return (
                      <div 
                        key={key} 
                        className="flex justify-between items-center p-4 rounded-lg border hover:border-primary transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          <span className="font-medium">{prayerNames[key as keyof typeof prayerNames]}</span>
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
        
        <Card>
          <CardHeader>
            <CardTitle>نصائح للصلاة</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              <li>حافظ على الصلاة في وقتها.</li>
              <li>توضأ بشكل صحيح قبل كل صلاة.</li>
              <li>صلِ بخشوع وتركيز.</li>
              <li>احرص على أداء السنن الراتبة بعد الفرائض.</li>
              <li>قم بصلاة الجماعة في المسجد كلما أمكن ذلك.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PrayerTimesPage;
