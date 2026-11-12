const Appointment = require("../models/Appointment");
const DoctorProfile = require("../models/DoctorProfile");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { sendEmail, emailTemplates } = require("../utils/sendEmail");
const crypto = require("crypto");

// @desc   Book an appointment
// @route  POST /api/appointments
exports.bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      date,
      timeSlot,
      reason,
      symptoms,
      consultationType,
    } = req.body;

    if (!doctorId || !date || !timeSlot || !reason) {
      return res.status(400).json({ message: "All required fields needed" });
    }

    const doctorProfile = await DoctorProfile.findById(doctorId).populate(
      "user",
      "name email"
    );
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check for existing appointment at same slot
    const conflict = await Appointment.findOne({
      doctor: doctorProfile.user._id,
      date: new Date(date),
      "timeSlot.start": timeSlot.start,
      status: { $in: ["pending", "confirmed"] },
    });

    if (conflict) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // Generate unique room ID for video consultation
    const roomId =
      "meditrack-" + crypto.randomBytes(8).toString("hex");

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorProfile.user._id,
      doctorProfile: doctorProfile._id,
      date: new Date(date),
      timeSlot,
      reason,
      symptoms: symptoms || "",
      consultationType: consultationType || "in-person",
      roomId,
      fee: doctorProfile.consultationFee,
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("patient", "name email avatar")
      .populate("doctor", "name email avatar");

    // Create notification for doctor
    await Notification.create({
      recipient: doctorProfile.user._id,
      sender: req.user._id,
      type: "appointment-booked",
      message: `New appointment request from ${req.user.name}`,
      appointment: appointment._id,
    });

    // Send email to patient
    const template = emailTemplates.appointmentBooked(
      req.user.name,
      doctorProfile.user.name,
      new Date(date).toLocaleDateString(),
      `${timeSlot.start} - ${timeSlot.end}`
    );
    sendEmail({ to: req.user.email, ...template });

    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Slot already booked" });
    }
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get my appointments
// @route  GET /api/appointments/my
exports.getMyAppointments = async (req, res) => {
  try {
    const query =
      req.user.role === "doctor"
        ? { doctor: req.user._id }
        : { patient: req.user._id };

    const appointments = await Appointment.find(query)
      .populate("patient", "name email avatar phone")
      .populate("doctor", "name email avatar phone")
      .populate("doctorProfile", "specialty consultationFee")
      .populate({
        path: "doctorProfile",
        populate: { path: "specialty", select: "name icon" },
      })
      .sort({ date: -1, "timeSlot.start": -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get appointment by ID
// @route  GET /api/appointments/:id
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email avatar phone dateOfBirth gender")
      .populate("doctor", "name email avatar phone")
      .populate({
        path: "doctorProfile",
        populate: { path: "specialty", select: "name icon" },
      })
      .populate("prescription");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Authorization
    const isPatient = appointment.patient._id.toString() === req.user._id.toString();
    const isDoctor = appointment.doctor._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isPatient && !isDoctor && !isAdmin) {
  return res.status(403).json({ message: "Not authorized" });
}

// Ensure prescription is a plain ID string, not an object
const appointmentData = appointment.toObject();
if (appointmentData.prescription && typeof appointmentData.prescription === "object") {
  appointmentData.prescription = appointmentData.prescription._id;
}

res.json(appointmentData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Update appointment status (doctor only)
// @route  PUT /api/appointments/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status, doctorNotes } = req.body;
    const appointment = await Appointment.findById(req.params.id).populate(
      "patient",
      "name email"
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    appointment.status = status;
    if (doctorNotes) appointment.doctorNotes = doctorNotes;
    await appointment.save();

    // Notify patient
    await Notification.create({
      recipient: appointment.patient._id,
      sender: req.user._id,
      type: `appointment-${status}`,
      message: `Your appointment has been ${status}`,
      appointment: appointment._id,
    });

    // Send email
    const template = emailTemplates.appointmentStatus(
      appointment.patient.name,
      req.user.name,
      status
    );
    sendEmail({ to: appointment.patient.email, ...template });

    res.json(appointment);
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Cancel appointment (patient)
// @route  PUT /api/appointments/:id/cancel
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (appointment.status === "completed") {
      return res
        .status(400)
        .json({ message: "Cannot cancel completed appointment" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    await Notification.create({
      recipient: appointment.doctor,
      sender: req.user._id,
      type: "appointment-cancelled",
      message: `Appointment cancelled by ${req.user.name}`,
      appointment: appointment._id,
    });

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get booked slots for a doctor on a date
// @route  GET /api/appointments/booked-slots?doctorId=&date=
exports.getBookedSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "doctorId and date required" });
    }

    const doctorProfile = await DoctorProfile.findById(doctorId);
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointments = await Appointment.find({
      doctor: doctorProfile.user,
      date: new Date(date),
      status: { $in: ["pending", "confirmed"] },
    });

    const bookedSlots = appointments.map((a) => a.timeSlot.start);

    res.json({ bookedSlots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};