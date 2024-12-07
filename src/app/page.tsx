import { Top10Tabs } from "@/components/pages/home/top-10-tabs";
import { TopCard } from "@/components/pages/home/top-card";
import { animeClient } from "@/lib/anime-client";
import { HiAnime } from "aniwatch";

export default async function Home() {
  const response: HiAnime.ScrapedHomePage | undefined =
    await animeClient.getHomePage();

  // You might want to handle the error case
  if (!response) {
    // Handle error - maybe return an error component
    return <div>Failed to load home page</div>;
  }

  const results: HiAnime.ScrapedHomePage = response;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-4 space-y-8">
          {/* Latest Episodes */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Latest Episodes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {results.latestEpisodeAnimes
                .filter((anime) => anime.id && anime.name && anime.poster)
                .map((anime) => (
                  <TopCard
                    key={anime.id}
                    id={anime.id}
                    name={anime.name}
                    poster={anime.poster}
                    episodes={anime.episodes}
                    type={anime.type}
                  />
                ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Top Airing */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Top Airing</h2>
            <div className="grid grid-cols-1 gap-4">
              {results.topAiringAnimes.slice(0, 5).map((anime) => (
                <TopCard
                  key={anime.id}
                  id={anime.id}
                  name={anime.name}
                  poster={anime.poster}
                  episodes={anime.episodes}
                  type={anime.type}
                  orientation="horizontal"
                />
              ))}
            </div>
          </section>

          {/* Top 10 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Top 10</h2>
            <Top10Tabs
              today={results.top10Animes.today}
              week={results.top10Animes.week}
              month={results.top10Animes.month}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
