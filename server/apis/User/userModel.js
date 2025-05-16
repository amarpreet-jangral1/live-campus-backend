const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    autoId: { type: Number, default: 0 },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    password: { type: String, default: "" },
    userType: { type: String, default: "" },     //1-admin, 2-HOD, 3-student
    status: { type: String, default: "active" },
    created_at: { type: Date, default: Date.now() },
})

module.exports = new mongoose.model("users", userSchema)