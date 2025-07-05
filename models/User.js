import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String }, // Made optional
  password: { type: String }, // Made optional
  provider: { type: String, enum: ["credentials", "google"], default: "credentials" },
  googleId: { type: String, unique: true, sparse: true }, // For Google users only
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);