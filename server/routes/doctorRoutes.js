const express = require("express");
const router = express.Router();
const {
  createOrUpdateProfile,
  getDoctors,
  getDoctorById,
  getMyProfile,
  updateAvailability,
  getSpecialties,
  seedSpecialties,
} = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Public routes
router.get("/", getDoctors);
router.get("/specialties", getSpecialties);
router.post("/seed-specialties", seedSpecialties);

// Doctor-only routes (before /:id so they don't get treated as IDs)
router.get("/me", protect, authorize("doctor"), getMyProfile);
router.post("/profile", protect, authorize("doctor"), createOrUpdateProfile);
router.put(
  "/availability",
  protect,
  authorize("doctor"),
  updateAvailability
);

// Dynamic route LAST
router.get("/:id", getDoctorById);

module.exports = router;