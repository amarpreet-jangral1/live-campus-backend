const mongoose = require("mongoose")

const deptSchema = new mongoose.Schema({
    auto_id: { type: Number, default: 0 },
    dept_name: { type: String, default: "" },
    // HOD:{type:String,default:""},
    // description:{type:String,default:""},
    // image:{type:String,default:"no_image.jpg"},
    status: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },

})

module.exports = new mongoose.model("departments", deptSchema)