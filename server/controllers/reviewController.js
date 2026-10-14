const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const DoctorProfile = require("../models/DoctorProfile");
const Notification = require("../models/Notification");

// @desc   Add review (patient)
// @route  POST /api/reviews
exports.addReview = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;

    if (!appointmentId || !rating || !comment) {
      return res.status(400).json({ message: "All fields required" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (appointment.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Can review only completed appointments" });
    }

    const existing = await Review.findOne({ appointment: appointmentId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already reviewed this appointment" });
    }

    const review = await Review.create({
      doctor: appointment.doctor,
      patient: req.user._id,
      appointment: appointmentId,
      rating,
      comment,
    });

    // Update doctor profile rating
    const reviews = await Review.find({ doctor: appointment.doctor });
    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await DoctorProfile.findOneAndUpdate(
      { user: appointment.doctor },
      { rating: avg.toFixed(1), numReviews: reviews.length }
    );

    // Notify doctor
    await Notification.create({
      recipient: appointment.doctor,
      sender: req.user._id,
      type: "new-review",
      message: `${req.user.name} left you a ${rating}-star review`,
    });

    const populated = await Review.findById(review._id).populate(
      "patient",
      "name avatar"
    );

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get reviews for a doctor
// @route  GET /api/reviews/doctor/:doctorId
exports.getDoctorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ doctor: req.params.doctorId })
      .populate("patient", "name avatar")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};