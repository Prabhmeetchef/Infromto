import { NextRequest, NextResponse } from "next/server";
import airports from "@/lib/airports.json"; // Adjust path if needed

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase() || "";

  if (!query) {
    return NextResponse.json([], { status: 200 });
  }

  const filteredAirports = airports
    .filter((airport) =>
      `${airport.name} ${airport.city} ${airport.code}`
        .toLowerCase()
        .includes(query)
    )
    .slice(0, 10); // Return top 10 matches

  return NextResponse.json(filteredAirports);
}
