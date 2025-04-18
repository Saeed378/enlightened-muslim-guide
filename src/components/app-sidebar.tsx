import { Link, useLocation } from "react-router-dom";
import { Book, Clock, BookOpen, LucideIcon, BookText, X, BookMarked, Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
}

function SidebarItem({ icon: Icon, label, href, isActive }: SidebarItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-primary/5"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}

export function AppSidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  
  const navigationItems = [
    {
      icon: Book,
      label: "القرآن الكريم",
      href: "/",
    },
    {
      icon: BookMarked,
      label: "التفاسير",
      href: "/tafseer/1/1",
    },
    {
      icon: BookText,
      label: "الأحاديث",
      href: "/hadith",
    },
    {
      icon: BookOpen,
      label: "الأدعية",
      href: "/duas",
    },
    {
      icon: Bookmark,
      label: "المفضلة",
      href: "/favorites",
    },
    {
      icon: BookOpen,
      label: "التفكير",
      href: "/reflection",
    },
    {
      icon: Clock,
      label: "مواقيت الصلاة",
      href: "/prayer-times",
    },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex w-64 flex-col border-l bg-background transition-transform duration-300 ease-in-out lg:right-auto lg:flex lg:w-64",
        isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b lg:hidden">
        <span className="font-semibold">القائمة</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="lg:hidden"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-6 px-3">
        <nav className="flex flex-col gap-2">
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={
                item.href === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.href)
              }
            />
          ))}
        </nav>
      </div>
      
      <div className="border-t p-4 mt-auto">
        <p className="text-xs text-center text-muted-foreground">
          تم تطوير التطبيق بواسطة م. فارس
        </p>
        <p className="text-xs text-center text-muted-foreground mt-1">
          تطبيق القرآن الكريم © {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
}
