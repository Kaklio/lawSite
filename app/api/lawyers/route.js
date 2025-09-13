// app/api/lawyers/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Lawyer from "@/models/lawyer";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const practice = searchParams.get("practice");
  const sort = searchParams.get("sort") || "sections";
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const courts = searchParams.getAll("courts");
  const languages = searchParams.getAll("languages");

  const matchStage = {};

  if (city) matchStage.Cities = city;
  if (practice) matchStage.practices = practice;
  if (courts.length) matchStage.courts = { $in: courts };
  if (languages.length) matchStage.languages = { $in: languages };

const sortStage = {};
const sortParam = sort || "sections";

if (sortParam.startsWith("alphabetical")) {
  const direction = sortParam.endsWith("_asc") ? 1 : -1;
  sortStage.name = direction;
} 
else if (sortParam.startsWith("experience")) {
  const direction = sortParam.endsWith("_asc") ? 1 : -1;
  sortStage.experience = direction;
} 
else {
  sortStage["sectionsCount"] = -1; // Default sort
}
//////




  const pipeline = [
    {
      $addFields: {
        sectionsCount: { $size: { $objectToArray: "$sections" } }
      }
    },
    { $match: matchStage },
    {
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              practices: { $addToSet: "$practices" },
              Cities: { $addToSet: "$Cities" },
              courts: { $addToSet: "$courts" },
              languages: { $addToSet: "$languages" }
            }
          }
        ],
        data: [
          { $sort: sortStage },
          { $skip: skip },
          { $limit: limit }
        ],
        totalCount: [
          { $count: "count" }
        ]
      }
    }
  ];

  try {
    const [result] = await Lawyer.aggregate(pipeline);

    const flattenedCounts = {
      practices: {},
      Cities: {},
    };

    // Flatten practice/city counts dynamically
    const lawyers = result.data || [];
    lawyers.forEach((lawyer) => {
      lawyer.practices?.forEach((p) => {
        flattenedCounts.practices[p] = (flattenedCounts.practices[p] || 0) + 1;
      });
      lawyer.Cities?.forEach((c) => {
        flattenedCounts.Cities[c] = (flattenedCounts.Cities[c] || 0) + 1;
      });
    });

    return NextResponse.json({
      total: result.totalCount[0]?.count || 0,
      lawyers: result.data,
      filterCounts: flattenedCounts
    });
  } catch (err) {
    console.error("Lawyer fetch error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
