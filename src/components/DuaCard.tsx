
import { BookOpen, BookMarked, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dua } from "@/services/duas";

interface DuaCardProps {
  dua: Dua;
}

export const DuaCard = ({ dua }: DuaCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{dua.title}</CardTitle>
        <BookOpen className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <p className="text-lg font-amiri leading-relaxed mb-4">{dua.text}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">{dua.category}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <BookMarked className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
