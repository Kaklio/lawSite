import mongoose from "mongoose";

const CaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Case || mongoose.model("Case", CaseSchema);