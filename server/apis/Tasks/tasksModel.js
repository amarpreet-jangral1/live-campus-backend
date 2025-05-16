const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    auto_id: { type: Number, default: 0 },
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "complaints" },
    deadline: { type: String, default: "" },
    hodId: { type:mongoose.Schema.Types.ObjectId,ref:"hods" },
    status: { type: Boolean, default: false },   //false-pending,true-completed
    created_at: { type: Date, default: Date.now() },

})

module.exports = new mongoose.model("tasks", taskSchema)