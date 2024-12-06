import { NextRequest } from "next/server";
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const animeEpisodeId = decodeURIComponent(searchParams.get("animeEpisodeId") || "");

    const data = await hianime.getEpisodeServers(animeEpisodeId);
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to fetch episode servers" },
      { status: 500 }
    );
  }
}