import { NextRequest } from "next/server";
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const animeEpisodeId = decodeURIComponent(searchParams.get("animeEpisodeId") || "");
    const server = decodeURIComponent(
      searchParams.get("server") || HiAnime.Servers.VidStreaming
    ) as HiAnime.AnimeServers;
    const category = decodeURIComponent(searchParams.get("category") || "sub") as "sub" | "dub" | "raw";

    const data = await hianime.getEpisodeSources(animeEpisodeId, server, category);
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to fetch episode sources" },
      { status: 500 }
    );
  }
}