const userModel = require('./userModel')
const studentModel = require('../Students/studentsModel')
const hodModel = require('../Hod/hodModel')

let adminProfile = (req,res)=>{

    userModel.findOne({_id: req.decoded._id})
    .then((userdata) => {
        res.send({
            status: 200,
            success: true,
            message: "Data loaded!!",
            data: userdata
        })
    })
}

let studentProfile = (req,res)=>{

    studentModel.findOne({userId: req.decoded._id})
    .populate('departmentId')
    .populate('userId')
    .populate('courseId')
    .then((userdata) => {
        res.send({
            status: 200,
            success: true,
            message: "Data loaded!!",
            data: userdata
        })
    })
}

let hodProfile = (req,res)=>{

    hodModel.findOne({userId: req.decoded._id})
    .populate('departmentId')
    .populate('userId')
    .then((userdata) => {
        res.send({
            status: 200,
            success: true,
            message: "Data loaded!!",
            data: userdata
        })
    })
}

module.exports = {
    adminProfile,
    studentProfile,
    hodProfile
}

