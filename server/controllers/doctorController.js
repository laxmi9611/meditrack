const DoctorProfile = require("../models/DoctorProfile");
const User = require("../models/User");
const Specialty = require("../models/Specialty");

// @desc   Create or update doctor profile
// @route  POST /api/doctors/profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const {
      specialty,
      experience,
      qualification,
      about,
      consultationFee,
      languages,
    } = req.body;

    if (!specialty || !experience || !qualification || !consultationFee) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const profileData = {
      user: req.user._id,
      specialty,
      experience,
      qualification,
      about,
      consultationFee,
      languages: languages || [],
    };

    let profile = await DoctorProfile.findOne({ user: req.user._id });

    if (profile) {
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      profile = await DoctorProfile.create(profileData);
    }

    const populated = await DoctorProfile.findById(profile._id)
      .populate("user", "name email avatar phone")
      .populate("specialty", "name slug icon");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get all approved doctors
// @route  GET /api/doctors
exports.getDoctors = async (req, res) => {
  try {
    const { specialty, search, sort } = req.query;
    const query = { isApproved: true };

    if (specialty) query.specialty = specialty;

    const sortBy = {};
    if (sort === "fee_asc") sortBy.consultationFee = 1;
    else if (sort === "fee_desc") sortBy.consultationFee = -1;
    else if (sort === "rating") sortBy.rating = -1;
    else if (sort === "experience") sortBy.experience = -1;
    else sortBy.createdAt = -1;

    let doctors = await DoctorProfile.find(query)
      .populate("user", "name email avatar")
      .populate("specialty", "name slug icon")
      .sort(sortBy);

    if (search) {
      const q = search.toLowerCase();
      doctors = doctors.filter(
        (d) =>
          d.user?.name?.toLowerCase().includes(q) ||
          d.specialty?.name?.toLowerCase().includes(q)
      );
    }

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get doctor by ID
// @route  GET /api/doctors/:id
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await DoctorProfile.findById(req.params.id)
      .populate("user", "name email avatar phone")
      .populate("specialty", "name slug icon");

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get my doctor profile
// @route  GET /api/doctors/me
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ user: req.user._id })
      .populate("user", "name email avatar phone")
      .populate("specialty", "name slug icon");

    if (!profile) {
      return res.status(404).json({ message: "Profile not created yet" });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Update availability
// @route  PUT /api/doctors/availability
exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const profile = await DoctorProfile.findOneAndUpdate(
      { user: req.user._id },
      { availability },
      { new: true }
    );

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile.availability);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get all specialties
// @route  GET /api/doctors/specialties
exports.getSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.find().sort({ name: 1 });
    res.json(specialties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Seed default specialties
// @route  POST /api/doctors/seed-specialties
exports.seedSpecialties = async (req, res) => {
  try {
    const defaults = [
      { name: "General Physician", slug: "general-physician", icon: "🩺" },
      { name: "Cardiologist", slug: "cardiologist", icon: "❤️" },
      { name: "Dermatologist", slug: "dermatologist", icon: "🧴" },
      { name: "Pediatrician", slug: "pediatrician", icon: "👶" },
      { name: "Orthopedic", slug: "orthopedic", icon: "🦴" },
      { name: "Neurologist", slug: "neurologist", icon: "🧠" },
      { name: "Gynecologist", slug: "gynecologist", icon: "👩" },
      { name: "Psychiatrist", slug: "psychiatrist", icon: "🧘" },
      { name: "ENT Specialist", slug: "ent-specialist", icon: "👂" },
      { name: "Dentist", slug: "dentist", icon: "🦷" },
    ];

    for (const s of defaults) {
      await Specialty.findOneAndUpdate({ slug: s.slug }, s, { upsert: true });
    }

    res.json({ message: "Specialties seeded", count: defaults.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};