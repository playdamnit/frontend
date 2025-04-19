import { NextResponse } from "next/server";
import axios from "axios";
import { getIGDBToken } from "@/utils/igdb/token";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { endpoint, data } = body;

    const accessToken = await getIGDBToken();

    const response = await axios.post(
      `https://api.igdb.com/v4/${endpoint}`,
      data,
      {
        headers: {
          Authorization: accessToken,
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Accept: "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("IGDB API Error:", {
      status: error.response?.status,
      data: error.response?.data,
    });

    return NextResponse.json(
      { error: error.message, details: error.response?.data },
      { status: error.response?.status || 500 }
    );
  }
}
