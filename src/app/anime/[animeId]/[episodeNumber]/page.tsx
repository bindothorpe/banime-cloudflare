import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimeInfoResponse } from "@/types/server/anime-info-response";
import { Episode, EpisodesResponse } from "@/types/server/episode-response";
import { ServerResponse } from "@/types/server/server-response";
import { SourceResponse } from "@/types/server/source-response";
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
import VideoPlayer from "@/components/pages/anime/watch/video-player";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// API Functions
async function getAnimeInfo(animeId: string) {
  const response = await fetch(`${API_URL}/api/anime/${animeId}`, {
    cache: "no-store",
  });
  return response.json() as Promise<AnimeInfoResponse>;
}

async function getAnimeEpisodes(animeId: string) {
  const response = await fetch(`${API_URL}/api/anime/${animeId}/episodes`, {
    cache: "no-store",
  });
  return response.json() as Promise<EpisodesResponse>;
}

async function getEpisodeServers(episodeId: string) {
  const response = await fetch(
    `${API_URL}/api/episode/servers?animeEpisodeId=${episodeId}`,
    { cache: "no-store" }
  );
  return response.json() as Promise<ServerResponse>;
}

async function getEpisodeSources(episodeId: string, serverName: string) {
  const response = await fetch(
    `${API_URL}/api/episode/sources?animeEpisodeId=${episodeId}&server=${serverName}&category=sub`,
    { cache: "no-store" }
  );
  return response.json() as Promise<SourceResponse>;
}

// Sub-components
type EpisodeNavigationProps = {
  animeId: string;
  animeName: string;
  episodeNumber: number;
};

function EpisodeNavigation({
  animeId,
  animeName,
  episodeNumber,
}: EpisodeNavigationProps) {
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
  name: string;
  poster: string;
  description: string;
};

function AnimeDetails({ name, poster, description }: AnimeDetailsProps) {
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
        <div className="text-gray-400">
          <ShowMoreText text={description} />
        </div>
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
  const [animeResponse, episodesResponse] = await Promise.all([
    getAnimeInfo(resolvedParams.animeId),
    getAnimeEpisodes(resolvedParams.animeId),
  ]);

  const currentEpisode = episodesResponse.data.episodes.find(
    (episode: Episode) =>
      episode.number === parseInt(resolvedParams.episodeNumber)
  );

  if (!currentEpisode) return null;

  // Episode-specific data fetch
  const serverResponse = await getEpisodeServers(currentEpisode.episodeId);

  if (!serverResponse.success || serverResponse.data.sub.length === 0) {
    return <ErrorMessage message="No servers available" />;
  }

  const sourceResponse = await getEpisodeSources(
    currentEpisode.episodeId,
    serverResponse.data.sub[0].serverName
  );

  if (!sourceResponse.success || !sourceResponse.data.sources[0]) {
    return <ErrorMessage message="No source available" />;
  }

  const subtitleUrl = sourceResponse.data.tracks.find(
    (track) => track.default
  )?.file;

  const { info } = animeResponse.data.anime;

  async function getEpisodes(seasonId: string) {
    "use server";
    const response = await getAnimeEpisodes(seasonId);
    return response.data.episodes;
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
            url: sourceResponse.data.sources[0].url,
            subtitle: {
              url: subtitleUrl,
              type: "vtt",
              encoding: "utf-8",
              escape: true,
              style: {
                color: "#FFFFFF",
                fontSize: "24px",
              },
            },
            subtitleOffset: true,
            setting: true,
          }}
          sourceData={sourceResponse.data}
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
          animeResponse={animeResponse}
          episodesResponse={episodesResponse}
          initialEpisodes={episodesResponse.data.episodes}
          onSeasonChange={getEpisodes}
        />
      </section>
    </div>
  );
}
