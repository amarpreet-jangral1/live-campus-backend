const mongoose = require("mongoose")

const complaintSchema = new mongoose.Schema({
    auto_id: { type: Number, default: 0 },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "students" },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "departments" },
    hodId: { type: mongoose.Schema.Types.ObjectId, ref: "hods" },
    addedbyId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    complaintRegarding: { type: String, default: "" },
    complaintDescription: { type: String, default: "" },
    complaintResponse: { type: String, default: "" },
    complaintStatus: { type: String, default: 'Pending' }, //Pending, Assigned, Resolved, Cancelled
    isAnonymous: { type: Boolean, default: "false" },
    image: { type: String, default: "no-image.jpg" },
    status: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },

})

module.exports = new mongoose.model("complaints", complaintSchema)