const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
    auto_id: { type: Number, default: 0 },
    Dept_id: { type: mongoose.Schema.Types.ObjectId, ref: 'departments' },
    course_name: { type: String, default: "" },
    course_code: { type: String, default: "" },
    // duration:{type:String,default:""},
    // Description:{type:String,default:""},
    status: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now() },

})

module.exports = new mongoose.model("courses", courseSchema)