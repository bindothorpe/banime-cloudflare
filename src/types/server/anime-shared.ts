export interface Episodes {
    sub: number;
    dub: number;
}

export interface MostPopularAnime {
    id: string;
    name: string;
    jname: string;
    poster: string;
    episodes: Episodes;
    type: string;
  }