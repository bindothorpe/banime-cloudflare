import { Episodes, MostPopularAnime } from './anime-shared';
import {Response} from './response';

export interface SearchResponse extends Response {
  data: SearchData;
}

export interface SearchData {
  animes: Anime[];
  mostPopularAnimes: MostPopularAnime[];
  searchQuery: string;
  // searchFilters: SearchFilters;
  totalPages: number;
  hasNextPage: boolean;
  currentPage: number;
}
export interface Anime {
  id: string;
  name: string;
  jname: string;
  poster: string;
  duration: string;
  type: string;
  rating: string;
  episodes: Episodes;
}
