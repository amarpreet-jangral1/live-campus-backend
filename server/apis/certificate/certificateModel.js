const mongoose = require("mongoose")

const certificateSchema = new mongoose.Schema({
    auto_id: { type: Number, default: 0 },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "students" },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "departments" },
    description: { type: String, default: "" },
    image: { type: String, default: "no_image.jpg" },
    requestStatus: { type: String, default: "Pending" },
    status: { type: Boolean, default: true },
    issuedDate: { type: Date, default: "" },
    created_at: { type: Date, default: Date.now() },
})

module.exports = new mongoose.model("certificates", certificateSchema)