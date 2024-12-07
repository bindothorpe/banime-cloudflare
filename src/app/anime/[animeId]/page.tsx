import { AnimeInfo } from "@/components/pages/anime/info/anime-info";
import { AnimeTabs } from "@/components/pages/anime/info/anime-tabs";
import { AnimeEpisodeGridButton } from "@/components/pages/anime/shared/anime-episode-grid-button";
import { Badge } from "@/components/ui/badge";
import { HiAnime } from "aniwatch";
import { animeClient } from "@/lib/anime-client";

type AnimePageProps = Promise<{ animeId: string }>;

export default async function AnimePage(props: { params: AnimePageProps }) {
  const params = await props.params;
  const animeInfo = await animeClient.getAnimeInfo(params.animeId);
  const episodes = await animeClient.getEpisodes(params.animeId);

  if (!animeInfo.anime?.info || !episodes.episodes) {
    return <div>Failed to load anime information</div>;
  }

  const { info } = animeInfo.anime;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <AnimeInfo anime={animeInfo.anime} />

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{info.name}</h1>
            <div className="flex gap-2 mb-4">
              {info.stats.rating && <Badge>{info.stats.rating}</Badge>}
              {info.stats.quality && (
                <Badge variant="outline">{info.stats.quality}</Badge>
              )}
            </div>
            {info.description && (
              <p className="text-gray-500">{info.description}</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Episodes</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {episodes.episodes.map((episode) => (
                <AnimeEpisodeGridButton
                  key={episode.number}
                  animeId={info.id ?? ""}
                  number={episode.number}
                  isCurrent={false}
                  isWatched={false}
                />
              ))}
            </div>
          </div>

          <AnimeTabs data={animeInfo} />
        </div>
      </div>
    </div>
  );
}
