import { NextRequest } from "next/server";
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const categoryName = decodeURIComponent(params.name.trim()) as HiAnime.AnimeCategories;
    const searchParams = request.nextUrl.searchParams;
    const page = Number(decodeURIComponent(searchParams.get("page") || "")) || 1;

    const data = await hianime.getCategoryAnime(categoryName, page);
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to fetch category anime" },
      { status: 500 }
    );
  }
}