const studentsModel = require("./studentsModel")
const userModel = require("../User/userModel")
const bcrypt = require('bcrypt');
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
    if (!req.body.gender) {
        errMsgs.push("gender is required!!")
    }
    if (!req.body.contact) {
        errMsgs.push("contact is required!!")
    }
    if (!req.body.courseId) {
        errMsgs.push("course is required!!")
    }
    if (!req.body.departmentId) {
        errMsgs.push("Department is required!!")
    }
    if (!req.body.enrollment_year) {
        errMsgs.push("enrollment_year is required!!")
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
        let studentscount = await studentsModel.countDocuments()
        let usercount = await userModel.countDocuments()

        userModel.findOne({ email: req.body.email })
            .then((userdata) => {
                // console.log(complaintsdata);
                if (userdata == null) {
                    //new entry
                    let userObj = new userModel()
                    userObj.auto_id = usercount + 1
                    userObj.name = req.body.name
                    userObj.email = req.body.email
                    userObj.password = bcrypt.hashSync(req.body.password, 10)
                    userObj.userType = 3
                    userObj.save()
                        .then(async (userData) => {
                            let studentObj = new studentsModel()
                            studentObj.auto_id = studentscount + 1
                            studentObj.userId = userData._id
                            studentObj.departmentId = req.body.departmentId
                            studentObj.name = req.body.name
                            studentObj.email = req.body.email
                            studentObj.gender = req.body.gender
                            studentObj.contact = req.body.contact
                            studentObj.courseId = req.body.courseId
                            studentObj.enrollment_year = req.body.enrollment_year
                            // studentObj.image="student/"+req.file.filename
                            if (req.file) {
                                try {
                                    let url = await uploadImg(req.file.buffer)
                                    studentObj.image = url
                                }
                                catch (err) {
                                    res.send({
                                        status: 500,
                                        success: false,
                                        message: "Error while upload image"
                                    })

                                }
                            }
                            studentObj.save()
                                .then((studentdata) => {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Student Register Successfully!",
                                        data: studentdata
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
                    res.json({
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

const deleteone = (req, res) => {
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
        // delete 
        studentsModel.findOne({ _id: req.body._id })
        .then((student) => {
            if (!student) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: "Student not found!"
                });
            }
            const userId = student.userId;
            studentsModel.deleteOne({ _id: req.body._id })
               
                    .then((studentData) => {
                    if (userId) {
                        // Delete the user linked to the student
                        userModel.deleteOne({ _id: userId })
                            .then(() => {
                                res.json({
                                    status: 200,
                                    success: true,
                                    message: "Data deleted!!",
                                    data: studentData
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
                            message: "Student Not Found",
                            data: studentData
                        });
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
        studentsModel.findOne({ _id: req.body._id })
            .then(async (studentsdata) => {

                if (studentsdata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found!!"
                    })
                }
                else {
                    //update data 
                    if (req.body.name) {
                        studentsdata.name = req.body.name
                    }
                    if (req.body.email) {
                        studentsdata.email = req.body.email
                    }
                    if (req.body.gender) {
                        studentsdata.gender = req.body.gender
                    }
                    if (req.body.courseId) {
                        studentsdata.courseId = req.body.courseId
                    }
                    if (req.body.departmentId) {
                        studentsdata.departmentId = req.body.departmentId
                    }
                    if (req.body.contact) {
                        studentsdata.contact = req.body.contact
                    }
                    if (req.body.enrollment_year) {
                        studentsdata.enrollment_year = req.body.enrollment_year
                    }
                    if (req.file) {
                        // studentsdata.image = "student/" + req.file.filename
                        try {
                            let url = await uploadImg(req.file.buffer)
                            studentsdata.image = url
                        }
                        catch (err) {
                            res.send({
                                status: 500,
                                success: false,
                                message: "Error while upload image"
                            })
                        }
                    }
                    studentsdata.updated_at = Date.now()
                    studentsdata.save()
                        .then((updateddata) => {

                            userModel.findOne({ _id: studentsdata.userId })
                                .then((udata) => {
                                    if (req.body.name) {
                                        udata.name = req.body.name
                                    }
                                    if (req.body.email) {
                                        udata.email = req.body.email
                                    }
                                    udata.save()
                                        .then(updateddata => {
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
        studentsModel.findOne({ _id: req.body._id })
            .then((studentsdata) => {
                if (studentsdata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found",
                    })
                }
                else {
                    //update status
                    studentsdata.status = req.body.status
                    studentsdata.save()
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
    let totalcount = await studentsModel.countDocuments()
    studentsModel.find(req.body)
        .populate("userId")
        .populate("departmentId")
        .populate("courseId")
        // .populate("")
        .then((addsdata) => {
            res.json({
                status: 200,
                success: true,
                TotalCount: totalcount,
                message: "Data loaded successfully!!",
                data: addsdata
            })
        })
        .catch(err => {
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
        studentsModel.findOne({ _id: req.body._id })
            .populate("userId")
            .populate("departmentId")
            .populate("courseId")
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
        studentsModel.find()
            .populate("userId")
            .populate("departmentId")
            .limit(limit)
            .skip(skip)
            .then((student_data) => {
                res.send({
                    status: 200,
                    success: true,
                    message: "pagination done",
                    data: student_data
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


// routes/students.js or wherever your routes are defined
const getStudentByUserId = (req, res) => {
    let errMsgs = [];
    if (!req.body.userId) {
        errMsgs.push("userId is required!");
    }

    if (errMsgs.length > 0) {
        return res.json({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    studentsModel.findOne({ userId: req.body.userId })
        .populate("userId")
        .populate("departmentId")
        .populate("courseId")
        .then((student) => {
            if (!student) {
                return res.status(404).json({
                    success: false,
                    status: 404,
                    message: "Student not found",
                    data: null
                });
            }

            res.json({
                success: true,
                status: 200,
                message: "Student fetched by userId",
                data: student
            });
        })
        .catch((err) => {
            res.json({
                status: 500,
                success: false,
                message: "Internal server error",
                err: err.message
            });
        });
};

  
module.exports = { add, deleteone, update, statusUpdate, getall, getSingle, getpagination, getStudentByUserId }