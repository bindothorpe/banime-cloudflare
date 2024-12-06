import { NextRequest } from "next/server";
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { animeId: string } }
) {
  try {
    const animeId = decodeURIComponent(params.animeId.trim());
    const data = await hianime.getEpisodes(animeId);
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to fetch episodes" },
      { status: 500 }
    );
  }
}