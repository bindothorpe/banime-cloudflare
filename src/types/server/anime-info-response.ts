import { Episodes, MostPopularAnime } from "./anime-shared";
import { Response } from "./response";

export interface AnimeInfoResponse extends Response {
    data: AnimeInfoData;
}

export interface AnimeInfoData {
    anime: AnimeInfo;
    seasons: Season[];
    mostPopularAnimes: MostPopularAnime[];
    recommendedAnimes: RecommendedAnime[];
    relatedAnimes: RelatedAnime[];
}

export interface AnimeInfo {
    info: Info;
    moreInfo: MoreInfo;
}

export interface Info {
    id: string;
    anilistId: number;
    malId: number;
    name: string;
    poster: string;
    description: string;
    stats: Stats;
    promotionalVideos: PromotionalVideo[];
    charactersVoiceActors: CharacterVoiceActor[];
}

export interface Stats {
    rating: string;
    quality: string;
    episodes: Episodes;
    type: string;
    duration: string;
}

export interface PromotionalVideo {
    title: string | undefined;
    source: string | undefined;
    thumbnail: string | undefined;
}

export interface CharacterVoiceActor {
    character: Character;
    voiceActor: VoiceActor;
}

export interface Character {
    id: string;
    poster: string;
    name: string;
    cast: string;
}

export interface VoiceActor {
    id: string;
    poster: string;
    name: string;
    cast: string;
}

export interface MoreInfo {
    japanese: string;
    synonyms: string;
    aired: string;
    premiered: string;
    duration: string;
    status: string;
    malscore: string;
    genres: string[];
    studios: string;
    producers: string[];
}

export interface RecommendedAnime {
    id: string;
    name: string;
    jname: string;
    poster: string;
    duration: string;
    type: string;
    rating: string | null;
    episodes: Episodes;
}

export interface RelatedAnime {
    id: string;
    name: string;
    jname: string;
    poster: string;
    episodes: Episodes;
    type: string;
}

export interface Season {
    id: string;
    name: string;
    title: string;
    poster: string;
    isCurrent: boolean;
}