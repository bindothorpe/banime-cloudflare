import { Top10Tabs } from "@/components/pages/home/top-10-tabs";
import { TopCard } from "@/components/pages/home/top-card";
import { HomeResponse } from "@/types/server/home-response";

export default async function Home() {
  const data = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/home", {
    cache: "no-store",
  });
  const results: HomeResponse = await data.json();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-4 space-y-8">
          {/* Latest Episodes */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Latest Episodes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {results.data.latestEpisodeAnimes.map((anime) => (
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
              {results.data.topAiringAnimes.slice(0, 5).map((anime) => (
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
              today={results.data.top10Animes.today}
              week={results.data.top10Animes.week}
              month={results.data.top10Animes.month}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
