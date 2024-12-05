import {Response} from './response';

export interface EpisodesResponse extends Response {
    data: EpisodeData;
}

export interface EpisodeData {
    totalEpisodes: number;
    episodes: Episode[];
    }

export interface Episode {
    title: string;
    episodeId: string;
    number: number;
    isFiller: boolean;
}