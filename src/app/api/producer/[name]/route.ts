import { NextRequest } from "next/server";
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const producerName = decodeURIComponent(params.name.trim());
    const searchParams = request.nextUrl.searchParams;
    const page = Number(decodeURIComponent(searchParams.get("page") || "")) || 1;

    const data = await hianime.getProducerAnimes(producerName, page);
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to fetch producer anime" },
      { status: 500 }
    );
  }
}