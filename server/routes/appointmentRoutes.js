const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  updateStatus,
  cancelAppointment,
  getBookedSlots,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/booked-slots", protect, getBookedSlots);
router.get("/my", protect, getMyAppointments);
router.post("/", protect, authorize("patient"), bookAppointment);
router.get("/:id", protect, getAppointmentById);
router.put(
  "/:id/status",
  protect,
  authorize("doctor"),
  updateStatus
);
router.put(
  "/:id/cancel",
  protect,
  authorize("patient"),
  cancelAppointment
);

module.exports = router;