const express = require("express");
const router = express.Router();
const {
  addReview,
  getDoctorReviews,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.post("/", protect, authorize("patient"), addReview);
router.get("/doctor/:doctorId", getDoctorReviews);

module.exports = router;