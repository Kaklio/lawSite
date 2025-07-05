import mongoose from "mongoose";

const courtSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  courtName: { type: String, required: true },
  address: { type: String },
  contact: {
    type: mongoose.Schema.Types.Mixed, // Can be string or object
  },
  city: { type: String },
  type: { type: String },
});

const Court = mongoose.models.Court || mongoose.model("Court", courtSchema);

export default Court;
