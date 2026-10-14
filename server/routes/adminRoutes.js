const express = require("express");
const router = express.Router();
const {
  getDashboard,
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
  getAllUsers,
  deleteUser,
  getAllAppointments,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboard);

router.get("/doctors", getAllDoctors);
router.put("/doctors/:id/approve", approveDoctor);
router.put("/doctors/:id/reject", rejectDoctor);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

router.get("/appointments", getAllAppointments);

module.exports = router;