import { Episodes } from './anime-shared';
import { Response } from './response';

export interface HomeResponse extends Response {
    data: HomeData;
}

export interface HomeData {
    spotlightAnimes: RankedAnime[];
    trendingAnimes: TrendingAnime[];
    latestEpisodeAnimes: LatestEpisodeAnime[];
    topUpcomingAnimes: TopUpcomingAnime[];
    top10Animes: {
        today: Top10Anime[];
        week: Top10Anime[];
        month: Top10Anime[];
    };
    topAiringAnimes: TopAiringAnime[];
    mostPopularAnimes: MostPopularAnime[];
    mostFavoriteAnimes: MostFavoriteAnime[];
    latestCompletedAnimes: LatestCompletedAnime[];
    genres: string[];
}

export interface RankedAnime {
    rank: number;
    id: string;
    name: string;
    description: string;
    poster: string;
    jname: string;
    episodes: Episodes;
    type: string;
    otherInfo: string[];
}

export interface TrendingAnime {
    rank: number;
    id: string;
    name: string;
    jname: string;
    poster: string;
}

export interface LatestEpisodeAnime {
    id: string;
    name: string;
    jname: string;
    poster: string;
    duration: string;
    type: string;
    rating: string | null;
    episodes: Episodes;
}

export interface TopUpcomingAnime {
    id: string;
    name: string;
    jname: string;
    poster: string;
    duration: string;
    type: string;
    rating: string | null;
    episodes: Episodes;
}

export interface Top10Anime {
    id: string;
    rank: number;
    name: string;
    jname: string;
    poster: string;
    episodes: Episodes;
}

export interface TopAiringAnime {
    id: string;
    name: string;
    jname: string;
    poster: string;
    episodes: Episodes;
    type: string;
}

export interface MostPopularAnime {
    id: string;
    name: string;
    jname: string;
    poster: string;
    episodes: Episodes;
    type: string;
}

export interface MostFavoriteAnime {
    id: string;
    name: string;
    jname: string;
    poster: string;
    episodes: Episodes;
    type: string;
}

export interface LatestCompletedAnime {
    id: string;
    name: string;
    jname: string;
    poster: string;
    episodes: Episodes;
    type: string;
}