const certificateModel = require("./certificateModel")
const { uploadImg } = require("../../utilities/helper")
const studentModel = require("../Students/studentsModel")

//insertion with validations
const add = async (req, res) => {
    //client null validation
    var errMsgs = []
    if (!req.body.description) {
        errMsgs.push("description is required!!")
    }

    if (errMsgs.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {

        // unique check 
        let certificatecount = await certificateModel.countDocuments()
        certificateModel.findOne({
            $and: [
                { studentId: req.body.studentId },
                { courseId: req.body.courseId },
                { departmentId: req.body.departmentId }
            ]
        })
            .then(async (certificatedata) => {

                if (certificatedata == null) {
                    //insertion new entry
                    studentModel.findOne({ userId: req.decoded._id })
                        .then((studentData) => {

                            let certificateobj = new certificateModel()
                            certificateobj.auto_id = certificatecount + 1
                            certificateobj.studentId = studentData._id
                            certificateobj.description = req.body.description
                            certificateobj.courseId = studentData.courseId
                            certificateobj.departmentId = studentData.departmentId
                            certificateobj.save()

                                .then((prodata) => {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Request has been sent successfully!!",
                                        data: prodata
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
                        .catch()
                }
                else {
                    res.json({
                        status: 422,
                        success: false,
                        message: "data already exists"
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

const apply = async (req, res) => {
    var errMsgs = []

    if (!req.body.student_name) {
        errMsgs.push("student_name is required!!")
    }
    if (!req.body.course) {
        errMsgs.push("course is required!!")
    }
    if (!req.body.department) {
        errMsgs.push("department is required!!")
    }
    if (!req.body.semester) {
        errMsgs.push("semester is required!!")
    }
    if (!req.body.phone) {
        errMsgs.push("phone is required!!")
    }
    if (!req.body.type) {
        errMsgs.push("type is required!!")
    }
    if (errMsgs.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        // unique check 
        let certificatecount = await certificateModel.countDocuments()
        certificateModel.findOne({ student_name: req.body.student_name })
            .then(async (data) => {
                //insertion new entry
                let certificateobj = new certificateModel()
                certificateobj.auto_id = certificatecount + 1
                certificateobj.student_name = req.body.student_name
                certificateobj.course = req.body.course
                certificateobj.department = req.body.department
                certificateobj.semester = req.body.semester
                certificateobj.phone = req.body.phone
                certificateobj.type = req.body.type
                certificateobj.save()
                    .then((data) => {
                        res.send({
                            status: 200,
                            success: true,
                            message: "Apply Successfully!!",
                            data: data
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
        certificateModel.deleteOne({ _id: req.body._id })
            .then((coursedata) => {
                res.json({
                    status: 200,
                    success: true,
                    message: "Data deleted!!",
                    data: coursedata
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
        certificateModel.findOne({ _id: req.body._id })
            .then(async (certificatedata) => {

                if (certificatedata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found!!"
                    })
                }
                else {
                    //update data 
                    if (req.body.requestStatus) {
                        certificatedata.requestStatus = req.body.requestStatus
                    }

                    certificatedata.issuedDate = Date.now()

                    if (req.file) {

                        // console.log(req.file)

                        try {
                            let url = await uploadImg(req.file.buffer)
                            certificatedata.image = url
                        }
                        catch (err) {
                            res.send({
                                status: 500,
                                success: false,
                                message: "Error while upload image",
                                errmsg: err.message
                            })
                        }
                    }

                    certificatedata.save()
                        .then((updateddata) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Data updated Successfully!",
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
        certificateModel.findOne({ _id: req.body._id })
            .then((certificatedata) => {
                if (certificatedata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found",
                    })
                }
                else {
                    //update status
                    certificatedata.status = req.body.status
                    certificatedata.save()
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
    let totalcount = await certificateModel.countDocuments()
    certificateModel.find()
        .populate("studentId")
        .populate("courseId")
        .populate("departmentId")
        .then(certificatedata => {
            res.json({
                status: 200,
                success: true,
                message: "Data loaded successfully!!",
                TotalCount: totalcount,
                data: certificatedata
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
        certificateModel.findOne({ _id: req.body._id })
            .populate("studentId")
            .populate("courseId")
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
        certificateModel.find()
            .populate("certificateId")
            .populate("studentId")
            .limit(limit)
            .skip(skip)
            .then((certificate_data) => {
                res.send({
                    status: 200,
                    success: true,
                    message: "pagination done",
                    data: certificate_data
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



module.exports = { add, deleteone, update, statusUpdate, getall, getSingle, getpagination, apply }