const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const studentsModel = require("../Students/studentsModel");
const userModel = require("../User/userModel")
const paymentModel = require("./paymentModel");


const pay = async(req, res) => {
    console.log("✅ Incoming body:", req.body);
    const { userId, amount,sem,sessionId,courseId } = req.body;

    let errmsg = [];
    if (!userId) errmsg.push("userId is required!!");
    if (!sem) errmsg.push("sem is required!!");
    if (!amount) errmsg.push("amount is required!!");
    if (errmsg.length > 0) {
        res.send({
            status:422,
            success: false,
            message: errmsg
        });
    }
    console.log("student _id",userId )
    console.log("Received userId:", userId);
    studentsModel.findById(req.body.userId)

        .then((student) => {
        console.log("student",student);                
            const razorpay = new Razorpay({
                key_id: "rzp_test_tZKpEudNpEdH7d",          // replace with your key
                key_secret: "O1Sml1OHHpqgdtJ6avR2LIAH"       // replace with your secret
            });

            const options = {
                amount: amount * 100, // paise
                currency: "INR",
                receipt: "receipt_order_" + Date.now()
            };

            razorpay.orders.create(options)
                .then(order => {

                    const newPayment = new paymentModel({
                        userId: student._id, // ✅ Use ID from fetched document
                        sem,
                        amount,
                        paymentStatus: "Paid",
                        sessionId,
                        courseId
                    });
                    
                    newPayment.save()
                        .then(saved => {
                            res.send({
                                status:200,
                                success: true,
                                message: "Razorpay order created & payment initialized",
                                order,
                                paymentRecord: saved
                            });
                        })
                        .catch(err => {
                            res.send({
                                status:500,
                                success: false,
                                message: "Failed to save payment data",
                                err
                            })
                        });
                })
                .catch(err => {
                    res.send({
                        status:500,
                        success: false,
                        message: "Failed to create Razorpay order",
                        err: err?.message || err // Show actual error
                    });
                });
        })
        .catch(err => {
            res.send({
                status:500,
                success: false,
                message: "Error finding student",
                err
            });
        });
};

const getall = async (req, res) => {
    let totalcount = await paymentModel.countDocuments()
    // paymentModel.find(req.body)
    paymentModel.find().populate('userId') // ✅ Now works because it's stored as ObjectId
    .populate('courseId')
    .populate("userId")
    .populate("sessionId")
        .then(allpayment => {
            res.json({
                status: 200,
                success: true,
                message: "Data loaded successfully!!",
                TotalCount: totalcount,
                data: allpayment
            });
        })
        .catch(err => {
            res.send({
                status: 500,
                success: false,
                message: "Internal server error line 357",
                error: err.message
            });
        });
};

module.exports = { pay ,getall};
