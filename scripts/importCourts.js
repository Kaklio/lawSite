import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { connectDB } from "../lib/db.js";
import Court from "../models/Court.js";

const COURTS_PATH = path.join(process.cwd(), "courts.json");

const run = async () => {
  await connectDB();

  const rawData = fs.readFileSync(COURTS_PATH, "utf-8");
  const courts = JSON.parse(rawData);

  for (const court of courts) {
    const formattedCourt = {
      id: court.id,
      courtName: court["Court Name"],
      address: court["Address & Location"],
      contact: court.Contact,
      city: court.City,
      type: court.Type,
    };

    try {
      await Court.updateOne({ id: formattedCourt.id }, formattedCourt, { upsert: true });
      console.log(`✅ Inserted/Updated: ${formattedCourt.courtName}`);
    } catch (err) {
      console.error(`❌ Failed to insert ${formattedCourt.courtName}:`, err.message);
    }
  }

  console.log("✅ All court entries imported.");
  mongoose.connection.close();
};

run();
