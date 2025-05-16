const mongoose = require("mongoose")

const hodModel = new mongoose.Schema({
    auto_id: { type: Number, default: 0 },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "departments" },
    qualification: { type: String, default: "" },
    contact: { type: String, default: "" },
    address: { type: String, default: "" },
    image: { type: String, default: "" },
    status: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: "" },
})

module.exports = new mongoose.model("hods", hodModel)