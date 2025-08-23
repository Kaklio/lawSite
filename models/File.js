import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },
  filetype: { type: String, required: true },
  content: { type: Buffer, required: true },
  size: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.File || mongoose.model("File", FileSchema);