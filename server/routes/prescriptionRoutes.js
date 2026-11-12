const express = require("express");
const router = express.Router();
const {
  createPrescription,
  getByAppointment,
  getMyPrescriptions,
  downloadPDF,
  getPrescriptionById,
} = require("../controllers/prescriptionController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Static routes must come first
router.get("/my", protect, getMyPrescriptions);
router.get("/appointment/:appointmentId", protect, getByAppointment);

// Create route
router.post("/", protect, authorize("doctor"), createPrescription);

// Dynamic routes
router.get("/:id/pdf", protect, downloadPDF);
router.get("/:id", protect, getPrescriptionById);

module.exports = router;