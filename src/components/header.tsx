
import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  toggleSidebar: () => void;
  isMobile: boolean;
}

export function Header({ toggleSidebar, isMobile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="font-bold text-xl text-islamic-green">القرآن الكريم</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
