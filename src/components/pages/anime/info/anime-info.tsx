import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { HiAnime } from "aniwatch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AnimeInfoProps {
  anime: HiAnime.ScrapedAnimeAboutInfo["anime"];
}

function AnimeDetails({ anime }: AnimeInfoProps) {
  if (!anime?.info || !anime?.moreInfo) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="text-gray-500">Type:</span>
        <span>{anime.info.stats.type}</span>
        <span className="text-gray-500">Episodes:</span>
        <span>
          Sub: {anime.info.stats.episodes.sub}
          {anime.info.stats.episodes.dub &&
            anime.info.stats.episodes.dub > 0 &&
            ` / Dub: ${anime.info.stats.episodes.dub}`}
        </span>
        <span className="text-gray-500">Status:</span>
        <span>{anime.moreInfo.status}</span>
        <span className="text-gray-500">Duration:</span>
        <span>{anime.moreInfo.duration}</span>
        <span className="text-gray-500">Studios:</span>
        <span>{anime.moreInfo.studios}</span>
        <span className="text-gray-500">Premiered:</span>
        <span>{anime.moreInfo.premiered}</span>
        <span className="text-gray-500">Japanese:</span>
        <span>{anime.moreInfo.japanese}</span>
        <span className="text-gray-500">Score:</span>
        <span>{anime.moreInfo.malscore}</span>
      </div>
      {Array.isArray(anime.moreInfo.genres) &&
        anime.moreInfo.genres.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Genres</h3>
            <div className="flex flex-wrap gap-1">
              {anime.moreInfo.genres.map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        )}

      {Array.isArray(anime.moreInfo.producers) &&
        anime.moreInfo.producers.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Producers</h3>
            <div className="flex flex-wrap gap-1">
              {anime.moreInfo.producers.map((producer) => (
                <Badge key={producer} variant="outline" className="text-xs">
                  {producer}
                </Badge>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

export function AnimeInfo({ anime }: AnimeInfoProps) {
  if (!anime?.info) return null;

  return (
    <div className="w-full">
      <div className="relative aspect-[3/4] w-full mb-8">
        <Image
          src={anime.info.poster ?? ""}
          alt={anime.info.name ?? ""}
          fill
          className="rounded-lg object-cover"
          sizes="(min-width: 768px) 33vw, 100vw"
          priority
        />
      </div>

      <Card>
        <CardContent className="py-0 md:p-6 px-4">
          <div className="hidden md:block">
            <AnimeDetails anime={anime} />
          </div>

          <div className="md:hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="info" className="border-none">
                <AccordionTrigger>
                  <h3 className="text-lg font-medium no-underline">
                    More Info
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <AnimeDetails anime={anime} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
