import JD from "../models/jobDescription.js";
import Offer from "../models/Offer.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
 
// -------------------------------------------
// HR Creates JD
// -------------------------------------------
export const createJD = asyncHandler(async (req, res, next) => {
  const { offerId } = req.params;
  const { jobSummary, responsibilities, requirements, benefits, additionalNotes } = req.body;
 
  // Validate offer exists
  const offer = await Offer.findById(offerId);
  if (!offer) return next(new ErrorResponse("Offer not found", 404));
 
  // Only assigned HR can create JD
  if (offer.assignedTo.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse("Not authorized to create JD for this offer.", 403));
  }
 
  const jd = await JD.create({
    offerId,
    createdBy: req.user._id,
    jobSummary,
    responsibilities,
    requirements,
    benefits,
    additionalNotes,
  });
 
  // Update offer status
  offer.status = "JD Created";
  await offer.save();
 
  res.status(201).json({
    success: true,
    message: "JD created successfully.",
    jd,
  });
});