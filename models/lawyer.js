// models/lawyer.js
import mongoose from "mongoose";

const LawyerSchema = new mongoose.Schema({
  id: Number,
  name: String,
  titles: [String],
  practices: [String],
  Cities: [String],
  email: String,
  phoneRequestLink: String,
  experience: String,
  courts: [String],
  languages: [String],
  image: String,
  sections: mongoose.Schema.Types.Mixed
});

export default mongoose.models.Lawyer || mongoose.model("Lawyer", LawyerSchema);
