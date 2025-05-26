const userModel = require("../User/userModel")
const hodModel = require("./hodModel")
const bcrypt = require("bcrypt")
const { uploadImg } = require("../../utilities/helper")

const add = async (req, res) => {
    //client null validation
    var errMsgs = []
    if (!req.body.name) {
        errMsgs.push("name is required!!")
    }
    if (!req.body.email) {
        errMsgs.push("email is required!!")
    }
    if (!req.body.password) {
        errMsgs.push("password is required!!")
    }
    if (!req.body.departmentId) {
        errMsgs.push("department is required!!")
    }
    if (!req.body.qualification) {
        errMsgs.push("qualification is required!!")
    }
    if (!req.body.contact) {
        errMsgs.push("contact is required!!")
    }
    if (!req.body.address) {
        errMsgs.push("address is required!!")
    }
    if (!req.file) {
        errMsgs.push("image is required!!")
    }
    if (errMsgs.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        // console.log("insertion code ");
        // unique check 
        let hodcount = await hodModel.countDocuments()
        let usercount = await userModel.countDocuments()

        userModel.findOne({ email: req.body.email })
            .then((userdata) => {
                // console.log(complaintsdata);
                if (userdata == null) {
                    let userObj = new userModel()
                    userObj.auto_id = usercount + 1
                    userObj.name = req.body.name
                    userObj.email = req.body.email
                    userObj.password = bcrypt.hashSync(req.body.password, 10)
                    userObj.userType = 2
                    userObj.save()
                        .then(async (userData) => {
                            let hodObj = new hodModel()
                            hodObj.auto_id = hodcount + 1
                            hodObj.userId = userData._id
                            hodObj.name = req.body.name
                            hodObj.departmentId = req.body.departmentId
                            hodObj.qualification = req.body.qualification
                            hodObj.dept_name = req.body.dept_name
                            hodObj.email = req.body.email
                            hodObj.contact = req.body.contact
                            hodObj.address = req.body.address
                            //hodObj.image = "hod/",req.file.filename
                            if (req.file) {
                                try {
                                    let url = await uploadImg(req.file.buffer)
                                    hodObj.image = url
                                }
                                catch (err) {
                                    res.send({
                                        status: 500,
                                        success: false,
                                        message: "Error while upload image"
                                    })
                                }
                            }
                            hodObj.save()
                                .then((hod_data) => {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "HOD register successfully!",
                                        data: hod_data
                                    })
                                })
                                .catch((err) => {
                                    res.send({
                                        status: 500,
                                        success: false,
                                        message: "Internal server error",
                                        errmsg: err
                                    })
                                })
                        })
                        .catch((err) => {
                            res.send({
                                status: 500,
                                success: false,
                                message: "Internal server error",
                                errmsg: err
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Email already taken by another user"
                    })
                }
            })
            .catch((err) => {
                res.send({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                    errmsg: err
                })
            })

    }

}

// const deleteone = (req, res) => {
//     var errMsgs = []
//     if (!req.body._id) {
//         errMsgs.push("_id is required!!")
//     }
//     if (errMsgs.length > 0) {
//         res.json({
//             status: 422,
//             success: false,
//             message: errMsgs
//         })
//     }
//     else {
//         // delete 
//         hodModel.deleteOne({ _id: req.body._id })
//             .then((hoddata) => {
//                 res.json({
//                     status: 200,
//                     success: true,
//                     message: "Data deleted!!",
//                     data: hoddata
//                 })
//             })
//             .catch((err) => {
//                 res.send({
//                     status: 500,
//                     success: false,
//                     message: "Internal server error",
//                     errmsg: err
//                 })
//             })
//     }
// }
const deleteone = (req, res) => {
    let errMsgs = [];
    if (!req.body._id) {
        errMsgs.push("_id is required!!");
    }

    if (errMsgs.length > 0) {
        return res.json({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    hodModel.findOne({ _id: req.body._id })
        .then((hod) => {
            if (!hod) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: "HOD not found!"
                });
            }

            const userId = hod.userId;

            // Delete the HOD
            hodModel.deleteOne({ _id: req.body._id })
                .then((hodData) => {
                    if (userId) {
                        // Delete the linked user
                        userModel.deleteOne({ _id: userId })
                            .then(() => {
                                res.json({
                                    status: 200,
                                    success: true,
                                    message: "Data deleted!!",
                                    data: hodData
                                });
                            })
                            .catch((err) => {
                                res.status(500).json({
                                    status: 500,
                                    success: false,
                                    message: "Error deleting user",
                                    errmsg: err.message
                                });
                            });
                    } else {
                        res.json({
                            status: 200,
                            success: true,
                            message: "HOD Not Found",
                            data: hodData
                        });
                    }
                })
                .catch((err) => {
                    res.status(500).json({
                        status: 500,
                        success: false,
                        message: "Error deleting HOD",
                        errmsg: err.message
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                status: 500,
                success: false,
                message: "Internal server error",
                errmsg: err.message
            });
        });
};


const update = (req, res) => {
    var errMsgs = []
    if (!req.body._id) {
        errMsgs.push("_id is required!!")
    }
    if (errMsgs.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        //update logic
        hodModel.findOne({ _id: req.body._id })
            .then(async (hoddata) => {

                if (hoddata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found!!"
                    })
                }
                else {
                    //update data 
                    if (req.body.name) {
                        hoddata.name = req.body.name
                    }
                    if (req.body.email) {
                        hoddata.email = req.body.email
                    }
                    if (req.body.departmentId) {
                        hoddata.departmentId = req.body.departmentId
                    }
                    if (req.body.contact) {
                        hoddata.contact = req.body.contact
                    }
                    if (req.body.address) {
                        hoddata.address = req.body.address
                    }
                    if (req.body.qualification) {
                        hoddata.qualification = req.body.qualification
                    }
                    // if (req.file) {
                    //     hoddata.image = "hod/", req.file.filename
                    // }
                    if (req.file) {
                        try {
                            let url = await uploadImg(req.file.buffer)
                            hoddata.image = url
                        }
                        catch (err) {
                            res.send({
                                status: 500,
                                success: false,
                                message: "Error while upload image"
                            })
                        }
                    }
                    hoddata.updated_at = Date.now()
                    hoddata.save()
                        .then((updateddata) => {
                            userModel.findOne({ _id: hoddata.userId })
                                .then((udata) => {
                                    if (req.body.name) {
                                        udata.name = req.body.name
                                    }
                                    if (req.body.email) {
                                        udata.email = req.body.email
                                    }
                                    udata.save()
                                        .then(updateUser => {
                                            res.send({
                                                status: 200,
                                                success: true,
                                                message: "Data updated Successfully!",
                                                data: updateddata
                                            })
                                        })
                                })
                        })
                        .catch((err) => {
                            res.send({
                                status: 500,
                                success: false,
                                message: "Internal server error",
                                errmsg: err.message
                            })
                        })
                }

            })
            .catch((err) => {
                res.send({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                    errmsg: err.message
                })
            })
    }
}

const statusUpdate = (req, res) => {
    var errMsgs = []
    if (!req.body._id) {
        errMsgs.push("_id is required!!")
    }
    if (!req.body.status) {
        errMsgs.push("status is required!!")
    }
    if (errMsgs.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        hodModel.findOne({ _id: req.body._id })
            .then((hoddata) => {
                if (hoddata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found",
                    })
                }
                else {
                    //update status
                    hoddata.status = req.body.status
                    hoddata.save()
                        .then((updateddata) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status updated successfully!",
                                data: updateddata
                            })
                        })
                        .catch((err) => {
                            res.send({
                                status: 500,
                                success: false,
                                message: "Internal server error",
                                errmsg: err
                            })
                        })
                }
            })
            .catch((err) => {
                res.send({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                    errmsg: err
                })
            })
    }

}

const getall = async (req, res) => {
    let hodcount = await hodModel.countDocuments()
    hodModel.find(req.body)
        .populate("userId")
        .populate("departmentId")

        .then((addsdata) => {
            res.json({
                status: 200,
                success: true,
                TotalCount: hodcount,
                message: "Data loaded successfully!!",
                data: addsdata
            })
        })
        .catch((err) => {
            res.json({
                status: 500,
                success: false,
                message: "Internal server error", err
            })
        })

}

const getSingle = (req, res) => {
    var errMsgs = []
    if (!req.body._id) {
        errMsgs.push("_id is required!")
    }
    if (errMsgs.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        hodModel.findOne({ _id: req.body._id })
            .populate("userId")
            .populate("departmentId")

            .then((adddata) => {

                res.json({
                    success: true,
                    status: 200,
                    message: "Single Record loaded!",
                    data: adddata
                })
            })
            .catch((err) => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server error", err
                })
            })
    }
}

const getpagination = (req, res) => {
    var errmsg = []
    if (!req.body.pageno) {
        errmsg.push("Page Number is required!")
    }
    if (!req.body.limit) {
        errmsg.push("Limit is required!")
    }
    if (errmsg.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: "error occurs",
            err: errmsg
        })
    }
    else {
        let limit = req.body.limit
        let pageno = req.body.pageno
        let skip = req.body.skip
        if (pageno > 1) {
            skip = (pageno - 1) * limit
        }
        hodModel.find()
            .populate("userId")
            .populate("departmentId")
            .limit(limit)
            .skip(skip)
            .then((hod_data) => {
                res.send({
                    status: 200,
                    success: true,
                    message: "pagination done",
                    data: hod_data
                })
            })
            .catch((err) => {
                res.send({
                    status: 500,
                    success: false,
                    message: "internal server error",
                    errmsg: err
                })
            })

    }
}

module.exports = { add, deleteone, update, statusUpdate, getall, getSingle, getpagination }