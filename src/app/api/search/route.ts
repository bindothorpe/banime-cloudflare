import { NextRequest } from "next/server";
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let query = decodeURIComponent(searchParams.get("q") || "");
    const pageNo = Number(decodeURIComponent(searchParams.get("page") || "")) || 1;
    
    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== "q" && key !== "page") {
        filters[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });

    const data = await hianime.search(query, pageNo, filters);
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}