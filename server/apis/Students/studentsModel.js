const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
    auto_id:{type:Number,default:0},
    name:{type:String,default:""},
    email:{type:String,default:""},
    gender:{type:String,default:""},
    contact:{type:String,default:""},
    // course:{type:String,default:""},
    enrollment_year:{type:String,default:""},
    image:{type:String,default:"no_image.jpg"},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
    departmentId:{type:mongoose.Schema.Types.ObjectId,ref:"departments"},
    courseId:{type:mongoose.Schema.Types.ObjectId,ref:"courses"},
    status:{type:Boolean,default:true},
    created_at:{type:Date,default:Date.now()},
    updated_at:{type:Date,default:""},

})

module.exports = new mongoose.model("students",studentSchema)