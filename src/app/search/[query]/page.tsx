import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Anime, SearchResponse } from "@/types/server/search-response";
import Image from "next/image";
import Link from "next/link";

interface SearchPageProps {
  params: {
    query: string;
  };
}

export default async function SearchPage({ params }: SearchPageProps) {
  const searchQuery = decodeURIComponent(params.query);
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${searchQuery}&page=1`,
    { cache: "no-store" }
  );
  const response: SearchResponse = await data.json();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-500">
          Showing results for &quot;{searchQuery}&quot;
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
        {response.data.animes.length > 0 ? (
          response.data.animes.map((anime: Anime) => (
            <Link
              href={`/anime/${anime.id}`}
              key={anime.id}
              className="contents"
            >
              <Card className="hover:shadow-lg transition-all duration-300 h-full hover:-translate-y-1 w-full">
                <div className="aspect-[3/4] relative">
                  <Image
                    src={anime.poster}
                    alt={anime.name}
                    fill
                    sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover rounded-t-lg"
                    priority
                  />
                </div>
                <CardHeader className="p-3 space-y-2">
                  <CardTitle className="text-sm font-medium line-clamp-2">
                    {anime.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {anime.type}
                    </Badge>
                    {anime.episodes.sub > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {anime.episodes.sub} EP
                      </Badge>
                    )}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardHeader>
                <CardTitle>No results found</CardTitle>
                <CardDescription>
                  Try adjusting your search terms or try a different search
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
