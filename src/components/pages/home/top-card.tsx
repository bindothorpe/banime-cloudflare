import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { HiAnime } from "aniwatch";

interface TopCardProps {
  id: string | null;
  name: string | null;
  poster: string | null;
  episodes?: {
    sub: number | null;
    dub: number | null;
  };
  type?: string | null;
  rank?: number | null;
  aspectRatio?: string;
  orientation?: "vertical" | "horizontal";
}

export function TopCard({
  id,
  name,
  poster,
  episodes,
  type,
  rank,
  aspectRatio = "aspect-[3/4]",
  orientation = "vertical",
}: TopCardProps) {
  if (!id || !name || !poster) return null;

  return (
    <Link href={`/anime/${id}`} className="contents">
      <Card
        className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
          orientation === "horizontal" ? "flex" : "h-full"
        }`}
      >
        <div
          className={`${orientation === "horizontal" ? "w-16 shrink-0" : ""} 
            ${aspectRatio} relative`}
        >
          {rank && (
            <div className="absolute top-1 left-1 z-10">
              <Badge variant="secondary" className="text-sm font-bold">
                {rank}
              </Badge>
            </div>
          )}
          <Image
            src={poster}
            alt={name}
            fill
            sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={`object-cover ${
              orientation === "horizontal" ? "rounded-l-lg" : "rounded-t-lg"
            }`}
            priority
          />
        </div>
        <CardHeader className="p-3 space-y-2 flex-1">
          <h3 className="text-sm font-medium line-clamp-2">{name}</h3>
          {(episodes || type) && (
            <div className="flex flex-wrap gap-1">
              {type && (
                <Badge variant="secondary" className="text-xs">
                  {type}
                </Badge>
              )}
              {(episodes?.sub ?? 0) > 0 && (
                <Badge variant="outline" className="text-xs">
                  {episodes?.sub} EP
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
