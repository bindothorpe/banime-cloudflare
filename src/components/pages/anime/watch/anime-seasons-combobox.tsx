"use client";

import { HiAnime } from "aniwatch";
import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/custom-ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AnimeEpisodeGridButton } from "../shared/anime-episode-grid-button";

type AnimeSeasonsComboboxProps = {
  animeInfo: HiAnime.ScrapedAnimeAboutInfo;
  episodes: HiAnime.ScrapedAnimeEpisodes;
  onSeasonChange: (seasonId: string) => Promise<HiAnime.AnimeEpisode[]>;
  initialEpisodes: HiAnime.AnimeEpisode[];
};

export default function AnimeSeasonsCombobox({
  animeInfo,
  episodes,
  onSeasonChange,
  initialEpisodes,
}: AnimeSeasonsComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [currentEpisodes, setEpisodes] = React.useState(initialEpisodes);
  const [id, setId] = React.useState("");

  const seasons = animeInfo.seasons
    .filter((season) => season.id && season.title)
    .map((season) => ({
      id: season.id!,
      label: season.title!,
    }));

  React.useEffect(() => {
    if (seasons.length > 0 && !id) {
      setId(
        seasons.find((season) => season.id === animeInfo.anime.info?.id)?.id ??
          seasons[0].id
      );
    }
  }, [seasons, id, animeInfo.anime.info?.id]);

  const handleSeasonChange = async (seasonId: string) => {
    const newEpisodes = await onSeasonChange(seasonId);
    setEpisodes(newEpisodes);
  };

  if (seasons.length === 0) {
    return (
      <>
        <h3 className="text-xl font-bold mb-4">Episodes</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {episodes.episodes
            .filter((ep) => ep.episodeId)
            .map((episode) => (
              <AnimeEpisodeGridButton
                key={episode.number}
                animeId={animeInfo.anime.info?.id ?? ""}
                number={episode.number}
                isCurrent={false}
                isWatched={false}
              />
            ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-4 grid grid-cols-3 md:grid-cols-6 gap-2">
        <div className="col-span-3 md:col-span-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                <span className="truncate">
                  {id
                    ? seasons.find((season) => season.id === id)?.label ??
                      "Select season..."
                    : "Select season..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full" align="start">
              <Command className="w-full">
                <CommandList>
                  <CommandEmpty>No seasons found.</CommandEmpty>
                  <CommandGroup>
                    {seasons.map((season) => (
                      <CommandItem
                        key={season.id}
                        value={season.id}
                        onSelect={() => {
                          setId(season.id);
                          handleSeasonChange(season.id);
                          setOpen(false);
                        }}
                      >
                        {season.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {currentEpisodes
          .filter((ep) => ep.episodeId)
          .map((episode) => (
            <AnimeEpisodeGridButton
              key={episode.number}
              animeId={id}
              number={episode.number}
              isCurrent={false}
              isWatched={false}
            />
          ))}
      </div>
    </>
  );
}
