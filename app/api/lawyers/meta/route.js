import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Lawyer from "@/models/lawyer";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const practice = searchParams.get("practice");

  const match = {};
  if (city) match.Cities = city;
  if (practice) match.practices = practice;

  const cities = await Lawyer.distinct("Cities", match);
  const practices = await Lawyer.distinct("practices", match);

  return NextResponse.json({
    cities: cities.sort(),
    practices: practices.sort()
  });
}
