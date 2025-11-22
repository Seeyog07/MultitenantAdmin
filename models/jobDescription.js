import mongoose from "mongoose";
 
const jdSchema = new mongoose.Schema(
  {
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: true,
    },
 
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // HR
      required: true,
    },
 
    jobSummary: {
      type: String,
      required: true,
    },
 
    responsibilities: {
      type: [String],
      required: true,
    },
 
    requirements: {
      type: [String],
      required: true,
    },
 
    benefits: {
      type: [String],
      default: [],
    },
 
    additionalNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
 
export default mongoose.model("JD", jdSchema);