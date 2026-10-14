const User = require("../models/User");
const DoctorProfile = require("../models/DoctorProfile");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const { sendEmail, emailTemplates } = require("../utils/sendEmail");

// @desc   Get dashboard stats
// @route  GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      pendingDoctors,
      completedAppointments,
      recentAppointments,
    ] = await Promise.all([
      User.countDocuments({ role: "patient" }),
      User.countDocuments({ role: "doctor" }),
      Appointment.countDocuments(),
      DoctorProfile.countDocuments({ isApproved: false }),
      Appointment.countDocuments({ status: "completed" }),
      Appointment.find()
        .populate("patient", "name email")
        .populate("doctor", "name email")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // Monthly stats (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Appointment.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      pendingDoctors,
      completedAppointments,
      recentAppointments,
      monthlyStats,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get all doctors (pending + approved)
// @route  GET /api/admin/doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find()
      .populate("user", "name email avatar phone isVerified")
      .populate("specialty", "name icon")
      .sort({ createdAt: -1 });

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Approve doctor
// @route  PUT /api/admin/doctors/:id/approve
exports.approveDoctor = async (req, res) => {
  try {
    const profile = await DoctorProfile.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Mark user verified
    await User.findByIdAndUpdate(profile.user._id, { isVerified: true });

    // Send email
    const template = emailTemplates.doctorVerified(profile.user.name);
    sendEmail({ to: profile.user.email, ...template });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Reject / unapprove doctor
// @route  PUT /api/admin/doctors/:id/reject
exports.rejectDoctor = async (req, res) => {
  try {
    const profile = await DoctorProfile.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get all users
// @route  GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Delete user
// @route  DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get all appointments
// @route  GET /api/admin/appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};