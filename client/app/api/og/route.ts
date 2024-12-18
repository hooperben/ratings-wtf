import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?app_id=${
        process.env.OG_API_KEY
      }`,
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error fetching OpenGraph data" },
      { status: 500 },
    );
  }
}
