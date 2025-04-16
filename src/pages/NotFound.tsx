
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background islamic-pattern">
      <div className="text-center p-8 bg-background/80 backdrop-blur-sm rounded-lg border max-w-md mx-auto">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-foreground mb-6">الصفحة غير موجودة</p>
        <p className="text-muted-foreground mb-8">
          نأسف، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها.
        </p>
        <Button asChild>
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
