// app/api/courts/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Court from "@/models/Court";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");

    let filter = {};
    if (city) {
      filter.city = city;
    }

    const courts = await Court.find(filter).sort({ city: 1 });
    return NextResponse.json({ success: true, courts });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
