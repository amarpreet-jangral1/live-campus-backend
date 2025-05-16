const gatepassModel = require("./gatepassModel")
const { uploadImg } = require("../../utilities/helper")
const studentModel = require("../Students/studentsModel")

const add = async (req, res) => {
    //client null validation
    var errMsgs = []
    if (!req.body.description) {
        errMsgs.push("description is required!!")
    }

    if (!req.body.startDate) {
        errMsgs.push("startDate is required!!")
    }

    if (!req.body.endDate) {
        errMsgs.push("endDate is required!!")
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
        let gatepasscount = await gatepassModel.countDocuments()

        gatepassModel.findOne({
            $and: [
                { studentId: req.body.studentId },
                { courseId: req.body.courseId },
                { departmentId: req.body.departmentId }
            ]
        })
            .then(async (gatepassdata) => {

                if (gatepassdata == null) {
                    //insertion new entry
                    studentModel.findOne({ userId: req.decoded._id })
                        .then((studentData) => {

                            let gatepassObj = new gatepassModel()
                            gatepassObj.auto_id = gatepasscount + 1
                            gatepassObj.studentId = studentData._id
                            gatepassObj.description = req.body.description
                            gatepassObj.startDate = req.body.startDate
                            gatepassObj.endDate = req.body.endDate
                            gatepassObj.courseId = studentData.courseId
                            gatepassObj.departmentId = studentData.departmentId
                            gatepassObj.save()
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
        gatepassModel.deleteOne({ _id: req.body._id })
            .then((gatepassdata) => {
                res.json({
                    status: 200,
                    success: true,
                    message: "Data deleted!!",
                    data: gatepassdata
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
        gatepassModel.findOne({ _id: req.body._id })
            .then(async (gatepassdata) => {

                if (gatepassdata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found!!"
                    })
                }
                else {
                    //update data 
                    if (req.body.requestStatus) {
                        gatepassdata.requestStatus = req.body.requestStatus
                    }

                    if (req.file) {

                        // console.log(req.file)

                        try {
                            let url = await uploadImg(req.file.buffer)
                            gatepassdata.image = url
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

                    gatepassdata.save()
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
        gatepassModel.findOne({ _id: req.body._id })
            .then((gatepassdata) => {
                if (gatepassdata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found",
                    })
                }
                else {
                    //update status
                    gatepassdata.status = req.body.status
                    gatepassdata.save()
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

    let totalcount = await gatepassModel.countDocuments()

    gatepassModel.find()
        .populate("studentId")
        .populate("courseId")
        .populate("departmentId")
        .then(gatepassData => {
            res.json({
                status: 200,
                success: true,
                message: "Data loaded successfully!!",
                TotalCount: totalcount,
                data: gatepassData
            });
        })
        .catch(err => {
            res.send({
                status: 500,
                success: false,
                message: "Internal server error",
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
        gatepassModel.findOne({ _id: req.body._id })
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
        gatepassModel.find()
            .limit(limit)
            .skip(skip)
            .then((gatepass_data) => {
                res.send({
                    status: 200,
                    success: true,
                    message: "pagination done",
                    data: gatepass_data
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