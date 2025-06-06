// // scripts/importLawyers.js
// import fs from "fs";
// import path from "path";
// import mongoose from "mongoose";
// import { connectDB } from "./lib/db.js";
// import Lawyer from "./models/lawyer.js";

// const DATA_DIR = path.join(process.cwd(), "scraped-lawyers");

// const run = async () => {
//   await connectDB();

//   const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));

//   for (const file of files) {
//     const filePath = path.join(DATA_DIR, file);
//     const raw = fs.readFileSync(filePath, "utf-8");
//     const data = JSON.parse(raw);

//     try {
//       await Lawyer.updateOne({ id: data.id }, data, { upsert: true });
//       console.log(`✅ Inserted/Updated: ${file}`);
//     } catch (err) {
//       console.error(`❌ Failed to insert ${file}:`, err.message);
//     }
//   }

//   console.log("✅ All lawyer profiles imported.");
//   mongoose.connection.close();
// };

// run();
