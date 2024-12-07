import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HiAnime } from "aniwatch";
import { animeClient } from "@/lib/anime-client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import ShowMoreText from "@/components/pages/anime/shared/show-more-text";
import AnimeSeasonsCombobox from "@/components/pages/anime/watch/anime-seasons-combobox";
import VideoPlayer, {
  SourceData,
} from "@/components/pages/anime/watch/video-player";
import { ServerResponse } from "http";

function transformToSourceData(
  sources: HiAnime.ScrapedAnimeEpisodesSources
): SourceData {
  return {
    sources: sources.sources.map((source) => ({
      url: source.url,
      quality: source.quality,
    })),
    tracks:
      sources.subtitles?.map((subtitle) => ({
        file: subtitle.url,
        kind: "subtitles",
        label: subtitle.lang,
        default: subtitle.lang === "English",
      })) || [],
    intro: sources.intro,
    outro: undefined,
  };
}

// Sub-components
type EpisodeNavigationProps = {
  animeId: string | null;
  animeName: string | null;
  episodeNumber: number;
};

function EpisodeNavigation({
  animeId,
  animeName,
  episodeNumber,
}: EpisodeNavigationProps) {
  if (!animeId || !animeName) return null;

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/anime/${animeId}`}>
            {animeName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Episode {episodeNumber}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

type AnimeDetailsProps = {
  name: string | null;
  poster: string | null;
  description: string | null;
};

function AnimeDetails({ name, poster, description }: AnimeDetailsProps) {
  if (!name || !poster) return null;

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div className="hidden md:block relative aspect-[3/4] w-full">
        <Image
          src={poster}
          alt={name}
          fill
          className="rounded-lg object-cover"
          sizes="(min-width: 768px) 33vw, 100vw"
          priority
        />
      </div>
      <div className="col-span-4 md:col-span-3 h-fit">
        <h2 className="text-xl font-bold mb-4">{name}</h2>
        {description && (
          <div className="text-gray-400">
            <ShowMoreText text={description} />
          </div>
        )}
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="bg-gray-900 border-none">
        <CardContent className="p-6 text-center">
          <h1 className="text-xl font-bold mb-2">Server Error</h1>
          <p>{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Component
type AnimeEpisodePageProps = Promise<{
  animeId: string;
  episodeNumber: string;
}>;

export default async function AnimeEpisodePage({
  params,
}: {
  params: AnimeEpisodePageProps;
}) {
  const resolvedParams = await params;

  // Initial data fetch
  const [animeInfo, episodes] = await Promise.all([
    animeClient.getAnimeInfo(resolvedParams.animeId),
    animeClient.getEpisodes(resolvedParams.animeId),
  ]);

  if (!animeInfo.anime?.info || !episodes.episodes) {
    return <ErrorMessage message="Failed to load anime information" />;
  }

  const currentEpisode = episodes.episodes.find(
    (episode) => episode.number === parseInt(resolvedParams.episodeNumber)
  );

  if (!currentEpisode?.episodeId) {
    return <ErrorMessage message="Episode not found" />;
  }

  // Episode-specific data fetch
  const servers = await animeClient.getEpisodeServers(currentEpisode.episodeId);

  if (!servers.sub || servers.sub.length === 0) {
    return <ErrorMessage message="No servers available" />;
  }

  const sources = await animeClient.getEpisodeSources(
    currentEpisode.episodeId,
    servers.sub[0].serverName as HiAnime.AnimeServers
  );

  if (!sources.sources?.[0]) {
    return <ErrorMessage message="No source available" />;
  }

  const sourceData = transformToSourceData(sources);
  const defaultTrack = sourceData.tracks.find((track) => track.default);

  const { info } = animeInfo.anime;

  async function getEpisodes(seasonId: string) {
    "use server";
    const seasonEpisodes = await animeClient.getEpisodes(seasonId);
    return seasonEpisodes.episodes;
  }

  return (
    <div className="container mx-auto px-4">
      <EpisodeNavigation
        animeId={info.id}
        animeName={info.name}
        episodeNumber={currentEpisode.number}
      />

      <div className="aspect-video w-full rounded-lg overflow-hidden mb-8">
        <VideoPlayer
          option={{
            url: sources.sources[0].url,
            subtitle: defaultTrack
              ? {
                  url: defaultTrack.file,
                  type: "vtt",
                  encoding: "utf-8",
                  escape: true,
                  style: {
                    color: "#FFFFFF",
                    fontSize: "24px",
                  },
                }
              : undefined,
            subtitleOffset: true,
            setting: true,
          }}
          sourceData={sourceData}
          className="w-full h-full"
        />
      </div>

      <AnimeDetails
        name={info.name}
        poster={info.poster}
        description={info.description}
      />

      <Separator className="mb-8" />

      <section className="pb-16">
        <AnimeSeasonsCombobox
          animeInfo={animeInfo}
          episodes={episodes}
          initialEpisodes={episodes.episodes}
          onSeasonChange={getEpisodes}
        />
      </section>
    </div>
  );
}
