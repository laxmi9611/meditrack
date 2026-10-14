const express = require("express");
const router = express.Router();
const {
  createPrescription,
  getByAppointment,
  getMyPrescriptions,
  downloadPDF,
} = require("../controllers/prescriptionController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/my", protect, getMyPrescriptions);
router.get("/appointment/:appointmentId", protect, getByAppointment);
router.post("/", protect, authorize("doctor"), createPrescription);
router.get("/:id/pdf", protect, downloadPDF);

module.exports = router;