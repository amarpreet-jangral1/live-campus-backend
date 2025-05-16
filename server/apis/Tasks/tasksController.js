const tasksModel = require("./tasksModel")
const complaintsModel = require("../Complaints/complaintsModel")

const add = async (req, res) => {
    //client null validation
    var errMsgs = []

    if (!req.body.complaintId) {
        errMsgs.push("complaint is required!!")
    }

    if (!req.body.deadline) {
        errMsgs.push("deadline is required!!")
    }

    if (!req.body.hodId) {
        errMsgs.push("hodId is required!!")
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
        let taskscount = await tasksModel.countDocuments()
        tasksModel.findOne({ complaintId: req.body.complaintId })
            .then((tasksdata) => {
                // console.log(complaintsdata);
                if (tasksdata == null) {
                    //insertion new entry
                    let tasksobj = new tasksModel()
                    tasksobj.auto_id = taskscount + 1
                    tasksobj.complaintId = req.body.complaintId
                    tasksobj.deadline = req.body.deadline
                    tasksobj.hodId = req.body.hodId
                    tasksobj.save()
                        .then((comdata) => {
                            complaintsModel.findOne({ _id: req.body.complaintId })
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
                                        if (req.body.hodId) {
                                            complaintsdata.hodId = req.body.hodId
                                        }
                                        complaintsdata.complaintStatus = "Assigned to HOD"

                                        complaintsdata.save()
                                            .then((updateddata) => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Task assigned Successfully!",
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
                else {
                    res.json({
                        status: 422,
                        success: false,
                        message: "complaint already assigned to HOD"
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
        tasksModel.deleteOne({ _id: req.body._id })
            .then((studentdata) => {
                res.json({
                    status: 200,
                    success: true,
                    message: "Data deleted!!",
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
        tasksModel.findOne({ _id: req.body._id })
            .then((tasksdata) => {

                if (tasksdata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found!!"
                    })
                }
                else {
                    //update data 
                    if (req.body.status) {
                        tasksdata.status = req.body.status
                    }

                    tasksdata.save()
                        .then((updateddata) => {
                            complaintsModel.findOne({ _id: tasksdata.complaintId })
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
                                        if (req.body.status) {
                                            complaintsdata.complaintStatus = "Resolved"
                                        }
                                        complaintsdata.save()
                                            .then((updateddata) => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Task assigned Successfully!",
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
        tasksModel.findOne({ _id: req.body._id })
            .then((tasksdata) => {
                if (tasksdata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found",
                    })
                }
                else {
                    //update status
                    tasksdata.status = req.body.status
                    tasksdata.save()
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
    let totalcount = await tasksModel.countDocuments()
    tasksModel.find(req.body)
        .populate("complaintId")
        .populate("hodId")
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
        tasksModel.findOne({ _id: req.body._id })
            .populate("complaintId")
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
        tasksModel.find()
            .limit(limit)
            .skip(skip)
            .then((task_data) => {
                res.send({
                    status: 200,
                    success: true,
                    message: "pagination done",
                    data: task_data
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