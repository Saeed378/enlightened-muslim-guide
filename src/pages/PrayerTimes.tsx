import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPrayerTimes, NextPrayer } from "@/services/api";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const PrayerTimesPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [city, setCity] = useState<string>("");
  const [prayerTimes, setPrayerTimes] = useState<Record<string, string> | null>(null);
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get user's location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          fetchCityName(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "فشل تحديد الموقع",
            description: "الرجاء إدخال الموقع يدوياً",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "المتصفح لا يدعم تحديد الموقع",
        description: "الرجاء إدخال الموقع يدوياً",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    // Fetch prayer times when location and date are available
    if (latitude && longitude && date) {
      fetchPrayerTimes(latitude, longitude, date);
    }
  }, [latitude, longitude, date]);

  const fetchCityName = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      if (data.address) {
        setCity(data.address.city || data.address.town || data.address.village || "");
      }
    } catch (error) {
      console.error("Error fetching city name:", error);
      setCity("غير معروف");
    }
  };

  const fetchPrayerTimes = async (latitude: number, longitude: number, date: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      // Format date to dd-MM-yyyy as required by the API
      const formattedDate = format(date, "dd-MM-yyyy");
      const prayerTimesData = await getPrayerTimes(latitude, longitude, formattedDate);
      setPrayerTimes(prayerTimesData);
      
      // Calculate and set the next prayer
      const nextPrayerInfo = calculateNextPrayer(prayerTimesData);
      setNextPrayer(nextPrayerInfo);
    } catch (error: any) {
      console.error("Error fetching prayer times:", error);
      setError(error.message || "Failed to fetch prayer times");
      toast({
        title: "فشل تحميل مواقيت الصلاة",
        description: "الرجاء المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      toast({
        title: "الرجاء إدخال الموقع",
        description: "الرجاء إدخال خط الطول والعرض",
        variant: "destructive",
      });
      return;
    }
    fetchPrayerTimes(latitude, longitude, date || new Date());
  };

  const formatTimeRemaining = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} ساعة و ${remainingMinutes} دقيقة`;
  };

  const calculateNextPrayer = (prayerTimes: Record<string, string> | null): NextPrayer | null => {
    if (!prayerTimes) return null;

    const prayerMapping: Record<string, string> = {
      Fajr: "الفجر",
      Sunrise: "الشروق",
      Dhuhr: "الظهر",
      Asr: "العصر",
      Maghrib: "المغرب",
      Isha: "العشاء"
    };

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    let nextPrayer = null;
    let minDiff = Infinity;

    // Find the next prayer time
    Object.entries(prayerTimes).forEach(([key, time]) => {
      if (prayerMapping[key]) {
        const [hours, minutes] = time.split(':').map(Number);
        const prayerTimeInMinutes = hours * 60 + minutes;
        const diff = prayerTimeInMinutes - currentTime;

        if (diff > 0 && diff < minDiff) {
          minDiff = diff;
          nextPrayer = {
            name: prayerMapping[key],
            time: time,
            timeRemaining: formatTimeRemaining(diff)
          };
        }
      }
    });

    // If no prayer is left for today, the next prayer is Fajr tomorrow
    if (!nextPrayer && prayerTimes.Fajr) {
      const [hours, minutes] = prayerTimes.Fajr.split(':').map(Number);
      const fajrTimeInMinutes = hours * 60 + minutes;
      const diff = (24 * 60) - currentTime + fajrTimeInMinutes;
      
      nextPrayer = {
        name: prayerMapping.Fajr,
        time: prayerTimes.Fajr,
        timeRemaining: formatTimeRemaining(diff)
      };
    }

    return nextPrayer;
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4 text-center">مواقيت الصلاة</h1>

        {/* Date Selection */}
        <Card className="w-full mb-4">
          <CardHeader>
            <CardTitle>اختر التاريخ</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Calendar
              mode="single"
              locale={ar}
              selected={date}
              onSelect={setDate}
              className={cn("border rounded-md")}
            />
            {date ? (
              <p className="text-sm text-muted-foreground">
                {format(date, "PPPP", { locale: ar })}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                الرجاء اختيار تاريخ
              </p>
            )}
          </CardContent>
        </Card>

        {/* Location Input */}
        <Card className="w-full mb-4">
          <CardHeader>
            <CardTitle>أدخل موقعك</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLocationSubmit} className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">خط العرض</Label>
                  <Input
                    type="number"
                    id="latitude"
                    placeholder="أدخل خط العرض"
                    value={latitude !== null ? latitude.toString() : ""}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">خط الطول</Label>
                  <Input
                    type="number"
                    id="longitude"
                    placeholder="أدخل خط الطول"
                    value={longitude !== null ? longitude.toString() : ""}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                  />
                </div>
              </div>
              <Button type="submit">تحديث المواقيت</Button>
            </form>
            {city && <p className="mt-2">المدينة: {city}</p>}
          </CardContent>
        </Card>

        {/* Prayer Times Display */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : prayerTimes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(prayerTimes)
              .filter(([prayer]) => ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(prayer))
              .map(([prayer, time]) => (
                <Card key={prayer}>
                  <CardHeader>
                    <CardTitle>
                      {prayer === 'Fajr' && 'الفجر'}
                      {prayer === 'Sunrise' && 'الشروق'}
                      {prayer === 'Dhuhr' && 'الظهر'}
                      {prayer === 'Asr' && 'العصر'}
                      {prayer === 'Maghrib' && 'المغرب'}
                      {prayer === 'Isha' && 'العشاء'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">{time}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <div className="text-center">
            {!isLoading && !error && (
              <p>الرجاء إدخال الموقع والتاريخ لعرض مواقيت الصلاة.</p>
            )}
          </div>
        )}

        {/* Next Prayer Display */}
        {nextPrayer && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>الصلاة القادمة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">
                {nextPrayer.name}: {nextPrayer.time}
              </p>
              <p>الوقت المتبقي: {nextPrayer.timeRemaining}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default PrayerTimesPage;
