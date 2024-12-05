import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeCharacters } from "./anime-characters";
import { AnimeGridCard } from "./anime-grid-card";
import { AnimeInfoData } from "@/types/server/anime-info-response";

interface AnimeTabsProps {
  data: AnimeInfoData;
}

export function AnimeTabs({ data }: AnimeTabsProps) {
  return (
    <Tabs
      defaultValue={data.seasons.length > 0 ? "seasons" : "related"}
      className="w-full"
    >
      <TabsList>
        {data.seasons.length > 0 && (
          <TabsTrigger value="seasons">Seasons</TabsTrigger>
        )}
        <TabsTrigger value="related">Related</TabsTrigger>
        <TabsTrigger value="characters">Characters</TabsTrigger>
        <TabsTrigger value="recommended">Recommended</TabsTrigger>
      </TabsList>

      <TabsContent value="characters" className="mt-4">
        <AnimeCharacters
          characters={data.anime.info.charactersVoiceActors || []}
        />
      </TabsContent>

      <TabsContent value="related" className="mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {data.relatedAnimes.map((anime) => (
            <AnimeGridCard
              key={anime.id}
              id={anime.id}
              name={anime.name}
              poster={anime.poster}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="recommended" className="mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {data.recommendedAnimes.map((anime) => (
            <AnimeGridCard
              key={anime.id}
              id={anime.id}
              name={anime.name}
              poster={anime.poster}
            />
          ))}
        </div>
      </TabsContent>

      {data.seasons.length > 0 && (
        <TabsContent value="seasons" className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {data.seasons.map((season) => (
              <AnimeGridCard
                key={season.id}
                id={season.id}
                name={season.title}
                poster={season.poster}
                isCurrent={season.isCurrent}
              />
            ))}
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
