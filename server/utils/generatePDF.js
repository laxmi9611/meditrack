const PDFDocument = require("pdfkit");

const generatePrescriptionPDF = (prescription, doctor, patient, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // Set response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=prescription-${prescription._id}.pdf`
  );

  doc.pipe(res);

  // Header
  doc
    .fontSize(24)
    .fillColor("#0d9488")
    .text("MediTrack", { align: "center" });

  doc
    .fontSize(12)
    .fillColor("#666")
    .text("Hospital Management System", { align: "center" });

  doc.moveDown();
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke("#0d9488");

  doc.moveDown();
  doc.fontSize(16).fillColor("#000").text("PRESCRIPTION", { align: "center" });

  doc.moveDown(2);

  // Doctor info
  doc.fontSize(11).fillColor("#000");
  doc.text(`Doctor: Dr. ${doctor.name}`);
  doc.text(`Specialty: ${doctor.specialty || "General"}`);
  doc.text(`Email: ${doctor.email}`);
  doc.moveDown();

  // Patient info
  doc.text(`Patient: ${patient.name}`);
  doc.text(`Email: ${patient.email}`);
  doc.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  // Diagnosis
  doc.fontSize(12).fillColor("#0d9488").text("Diagnosis:");
  doc.fontSize(11).fillColor("#000").text(prescription.diagnosis);
  doc.moveDown();

  // Medicines
  doc.fontSize(12).fillColor("#0d9488").text("Medicines:");
  doc.moveDown(0.5);

  prescription.medicines.forEach((med, i) => {
    doc
      .fontSize(11)
      .fillColor("#000")
      .text(`${i + 1}. ${med.name}`, { continued: false });
    doc.fontSize(10).fillColor("#555");
    doc.text(`   Dosage: ${med.dosage}`);
    doc.text(`   Duration: ${med.duration}`);
    if (med.notes) doc.text(`   Notes: ${med.notes}`);
    doc.moveDown(0.5);
  });

  doc.moveDown();

  // Advice
  if (prescription.advice) {
    doc.fontSize(12).fillColor("#0d9488").text("Advice:");
    doc.fontSize(11).fillColor("#000").text(prescription.advice);
    doc.moveDown();
  }

  // Follow-up
  if (prescription.followUpDate) {
    doc
      .fontSize(11)
      .fillColor("#000")
      .text(
        `Follow-up: ${new Date(prescription.followUpDate).toLocaleDateString()}`
      );
  }

  // Footer
  doc.moveDown(3);
  doc
    .fontSize(10)
    .fillColor("#888")
    .text("This is a computer-generated prescription.", { align: "center" });
  doc.text("MediTrack © 2026", { align: "center" });

  doc.end();
};

module.exports = { generatePrescriptionPDF };