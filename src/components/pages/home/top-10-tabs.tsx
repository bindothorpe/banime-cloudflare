"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Top10Anime } from "@/types/server/home-response";
import { TopCard } from "./top-card";

interface Top10TabsProps {
  today: Top10Anime[];
  week: Top10Anime[];
  month: Top10Anime[];
}

export function Top10Tabs({ today, week, month }: Top10TabsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDisplayedAnimes = (animes: Top10Anime[]) => {
    return isExpanded ? animes : animes.slice(0, 5);
  };

  return (
    <Tabs defaultValue="today" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="today" className="flex-1">
          Today
        </TabsTrigger>
        <TabsTrigger value="week" className="flex-1">
          Week
        </TabsTrigger>
        <TabsTrigger value="month" className="flex-1">
          Month
        </TabsTrigger>
      </TabsList>
      {["today", "week", "month"].map((period) => (
        <TabsContent key={period} value={period} className="mt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {getDisplayedAnimes(
                period === "today" ? today : period === "week" ? week : month
              ).map((anime) => (
                <TopCard
                  key={anime.id}
                  id={anime.id}
                  name={anime.name}
                  poster={anime.poster}
                  episodes={anime.episodes}
                  rank={anime.rank}
                  orientation="horizontal"
                />
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show Less" : "Show All"}
            </Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
