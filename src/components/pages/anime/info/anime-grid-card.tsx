import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface AnimeGridCardProps {
  id: string;
  name: string;
  poster: string;
  isCurrent?: boolean;
}

export function AnimeGridCard({
  id,
  name,
  poster,
  isCurrent,
}: AnimeGridCardProps) {
  return (
    <Link href={`/anime/${id}`}>
      <Card
        className={`hover:shadow-lg transition-all duration-300 ${
          isCurrent ? "ring-2 ring-primary" : ""
        }`}
      >
        <div className="aspect-[3/4] relative">
          <Image
            src={poster}
            alt={name}
            fill
            className="rounded-t-lg object-cover"
            sizes="(min-width: 768px) 25vw, 50vw"
          />
        </div>
        <CardHeader className="p-3">
          <CardTitle className="text-sm h-12 flex items-center overflow-hidden">
            {name}
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
