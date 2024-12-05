import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AnimeEpisodeGridButtonProps {
  animeId: string;
  number: number;
  isCurrent?: boolean;
  isWatched?: boolean;
}

export function AnimeEpisodeGridButton({
  animeId,
  number,
  isCurrent,
  isWatched,
}: AnimeEpisodeGridButtonProps) {
  return (
    <Link href={`/anime/${animeId}/${number}`}>
      <Button
        className={`w-full ${isCurrent ? "border-2 border-primary" : ""}`}
        variant={isWatched ? "default" : "outline"}
      >
        {number}
      </Button>
    </Link>
  );
}
