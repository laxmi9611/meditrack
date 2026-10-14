const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { generatePrescriptionPDF } = require("../utils/generatePDF");
const { sendEmail, emailTemplates } = require("../utils/sendEmail");

// @desc   Create prescription (doctor)
// @route  POST /api/prescriptions
exports.createPrescription = async (req, res) => {
  try {
    const {
      appointmentId,
      diagnosis,
      medicines,
      advice,
      followUpDate,
    } = req.body;

    if (!appointmentId || !diagnosis || !medicines?.length) {
      return res
        .status(400)
        .json({ message: "Appointment, diagnosis and medicines required" });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate("patient", "name email")
      .populate("doctor", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const existing = await Prescription.findOne({ appointment: appointmentId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Prescription already exists for this appointment" });
    }

    const prescription = await Prescription.create({
      appointment: appointmentId,
      patient: appointment.patient._id,
      doctor: req.user._id,
      diagnosis,
      medicines,
      advice: advice || "",
      followUpDate: followUpDate || null,
    });

    // Link to appointment
    appointment.prescription = prescription._id;
    appointment.status = "completed";
    await appointment.save();

    // Notify patient
    await Notification.create({
      recipient: appointment.patient._id,
      sender: req.user._id,
      type: "prescription-ready",
      message: "Your prescription is ready to view",
      appointment: appointment._id,
    });

    // Send email
    const template = emailTemplates.prescriptionReady(
      appointment.patient.name,
      appointment.doctor.name
    );
    sendEmail({ to: appointment.patient.email, ...template });

    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get prescription by appointment ID
// @route  GET /api/prescriptions/appointment/:appointmentId
exports.getByAppointment = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      appointment: req.params.appointmentId,
    })
      .populate("patient", "name email avatar")
      .populate("doctor", "name email avatar")
      .populate("appointment");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    const isPatient =
      prescription.patient._id.toString() === req.user._id.toString();
    const isDoctor =
      prescription.doctor._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get my prescriptions (patient)
// @route  GET /api/prescriptions/my
exports.getMyPrescriptions = async (req, res) => {
  try {
    const query =
      req.user.role === "doctor"
        ? { doctor: req.user._id }
        : { patient: req.user._id };

    const prescriptions = await Prescription.find(query)
      .populate("doctor", "name avatar")
      .populate("patient", "name avatar")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Download prescription as PDF
// @route  GET /api/prescriptions/:id/pdf
exports.downloadPDF = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("patient", "name email")
      .populate("doctor", "name email");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    const isPatient =
      prescription.patient._id.toString() === req.user._id.toString();
    const isDoctor =
      prescription.doctor._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    generatePrescriptionPDF(
      prescription,
      prescription.doctor,
      prescription.patient,
      res
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};