const complaintsModel = require("./complaintsModel")
const studentModel = require("../Students/studentsModel")
const { uploadImg } = require("../../utilities/helper")

const add = async (req, res) => {
    //client null validation
    var errMsgs = []
    if (!req.body.complaintRegarding) {
        errMsgs.push("complaint title is required!!")
    }
    if (!req.body.complaintDescription) {
        errMsgs.push("complaint Description is required!!")
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
        let complaintscount = await complaintsModel.countDocuments()
        studentModel.findOne({ userId: req.decoded._id })
            .then(async (studentData) => {
                // console.log(studentData);

                if (!!studentData) {
                    //insertion new entry
                    let complaintobj = new complaintsModel()
                    complaintobj.auto_id = complaintscount + 1
                    complaintobj.studentId = studentData._id
                    complaintobj.departmentId = studentData.departmentId
                    complaintobj.complaintRegarding = req.body.complaintRegarding
                    complaintobj.complaintDescription = req.body.complaintDescription
                    complaintobj.addedbyId = req.decoded._id

                    if (req.file) {
                        try {
                            let url = await uploadImg(req.file.buffer)
                            complaintobj.image = url
                        }
                        catch (err) {
                            res.send({
                                status: 500,
                                success: false,
                                message: "Error while upload image"
                            })
                        }
                    }
                    complaintobj.save()
                        .then((comdata) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Data inserted successfully!!",
                                data: comdata
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
                        message: "please login to make a complaint"
                    })
                }

            })
            .catch((err) => {
                res.send({
                    status: 500,
                    success: false,
                    message: "Internal server error in catch",
                    errmsg: err.message
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
        complaintsModel.deleteOne({ _id: req.body._id })
            .then((complaintsdata) => {
                if (complaintsdata == null) {
                    res.json({
                        sttaus: 422,
                        success: false,
                        message: "data not found"
                    })
                }
                else {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Data deleted!!",
                        data: complaintsdata
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

const update = (req, res) => {

    // console.log(req.body)

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
        complaintsModel.findOne({ _id: req.body._id })
            .then((complaintsdata) => {
                if (complaintsdata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found!!"
                    })
                }
                else {
                    //update data 
                    if (req.body.complaintResponse) {
                        complaintsdata.complaintResponse = req.body.complaintResponse
                    }

                    if (req.body.complaintStatus) {
                        complaintsdata.complaintStatus = req.body.complaintStatus
                    }

                    // if (req.body.hodId) {
                    //     complaintsdata.hodId = req.body.hodId
                    // }

                    complaintsdata.save()
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
        complaintsModel.findOne({ _id: req.body._id })
            .then((complaintsdata) => {
                if (complaintsdata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found",
                    })
                }
                else {
                    //update status
                    complaintsdata.status = req.body.status
                    complaintsdata.save()
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
    let total_count = await complaintsModel.countDocuments()
    complaintsModel.find()
        // .populate("")
        .populate("studentId")
        .populate("departmentId")
        .populate("hodId")
        .populate("addedbyId")
        .then((addsdata) => {
            res.json({
                status: 200,
                success: true,
                message: "Data loaded successfully!!",
                TotalCount: total_count,
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
        complaintsModel.findOne({ _id: req.body._id })
            .populate("studentId")
            .populate("departmentId")
            .populate("hodId")
            .populate("addedbyId")
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
        complaintsModel.find()
            .populate("studentId")
            .populate("departmentId")
            .populate("hodId")
            .limit(limit)
            .skip(skip)
            .then((complaint_data) => {
                res.send({
                    status: 200,
                    success: true,
                    message: "pagination done",
                    data: complaint_data
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