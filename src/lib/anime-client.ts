import { HiAnime } from "aniwatch";

class AnimeClient {
  private scraper: HiAnime.Scraper;

  constructor() {
    this.scraper = new HiAnime.Scraper();
  }

  async getEpisodes(animeId: string) {
    return this.scraper.getEpisodes(animeId.trim());
  }

  async getAnimeInfo(animeId: string) {
    return this.scraper.getInfo(animeId.trim());
  }

  async getCategoryAnime(categoryName: HiAnime.AnimeCategories, page: number = 1) {
    return this.scraper.getCategoryAnime(categoryName, page);
  }

  async getEpisodeServers(animeEpisodeId: string) {
    return this.scraper.getEpisodeServers(animeEpisodeId);
  }

  async getEpisodeSources(
    animeEpisodeId: string,
    server: HiAnime.AnimeServers = HiAnime.Servers.VidStreaming,
    category: "sub" | "dub" | "raw" = "sub"
  ) {
    return this.scraper.getEpisodeSources(animeEpisodeId, server, category);
  }

  async getGenreAnime(genreName: string, page: number = 1) {
    return this.scraper.getGenreAnime(genreName.trim(), page);
  }

  async getHomePage() {
    return this.scraper.getHomePage();
  }

  async getProducerAnime(producerName: string, page: number = 1) {
    return this.scraper.getProducerAnimes(producerName.trim(), page);
  }

  async search(query: string, page: number = 1, filters: HiAnime.SearchFilters = {}) {
    return this.scraper.search(query, page, filters);
  }
}

// Create and export a singleton instance
export const animeClient = new AnimeClient();

// Also export the class if someone needs a separate instance
export default AnimeClient;