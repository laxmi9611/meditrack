const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dosage: { type: String, required: true }, // e.g., "1 tablet twice a day"
    duration: { type: String, required: true }, // e.g., "5 days"
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    diagnosis: { type: String, required: true, maxlength: 500 },
    medicines: [medicineSchema],
    advice: { type: String, default: "", maxlength: 1000 },
    followUpDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);