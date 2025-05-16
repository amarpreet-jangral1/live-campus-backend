const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'students'},
    sessionId:{type:mongoose.Schema.Types.ObjectId, ref:'users'},
    courseId:{type:mongoose.Schema.Types.ObjectId, ref:'courses'},
    amount: { type: Number, required: true },
    sem: {type: Number,required: true,min: 1,max: 10},
    paymentStatus:{type:String,default:"unpaid"},
    createdAt: { type: Date, default: Date.now }
});

module.exports = new mongoose.model("Payment", paymentSchema);
