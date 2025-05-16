const coursesModel = require("./coursesModel")

const add = async (req, res) => {
    //client null validation
    var errMsgs = []
    if (!req.body.Dept_id) {
        errMsgs.push("Dept_id is required!!")
    }
    // if(!req.body.Dept_name){
    //         errMsgs.push("Dept_name is required!!")
    // }
    if (!req.body.course_name) {
        errMsgs.push("course_name is required!!")
    }
    if (!req.body.course_code) {
        errMsgs.push("course_code is required!!")
    }
    // if(!req.body.duration){
    //     errMsgs.push("duration is required!!")
    // }
    // if(!req.body.Description){ 
    //     errMsgs.push("description is required!!")
    // }
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
        let coursescount = await coursesModel.countDocuments()
        coursesModel.findOne({ course_code: req.body.course_code })
            .then((coursesdata) => {
                // console.log(complaintsdata);
                if (coursesdata == null) {
                    //insertion new entry
                    let courseobj = new coursesModel()
                    courseobj.auto_id = coursescount + 1
                    courseobj.Dept_id = req.body.Dept_id
                    // courseobj.Dept_name = req.body.Dept_name
                    courseobj.course_name = req.body.course_name
                    courseobj.course_code = req.body.course_code
                    // courseobj.duration = req.body.duration
                    // courseobj.Description = req.body.Description
                    courseobj.save()
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
        coursesModel.deleteOne({ _id: req.body._id })
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
        coursesModel.findOne({ _id: req.body._id })
            .then((coursesdata) => {
                if (coursesdata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found!!"
                    })
                }
                else {
                    //update data 
                    if (req.body.Dept_id) {
                        coursesdata.Dept_id = req.body.Dept_id
                    }
                    if (req.body.course_name) {
                        coursesdata.course_name = req.body.course_name
                    }

                    if (req.body.course_code) {
                        coursesdata.course_code = req.body.course_code
                    }
                    coursesdata.save()
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
        coursesModel.findOne({ _id: req.body._id })
            .then((coursesdata) => {
                if (coursesdata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found",
                    })
                }
                else {
                    //update status
                    coursesdata.status = req.body.status
                    coursesdata.save()
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
    let totalcount = await coursesModel.countDocuments()
    coursesModel.find(req.body)
        .populate("Dept_id")
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
        coursesModel.findOne({ _id: req.body._id })
        .populate("Dept_id")
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
        coursesModel.find()
            .limit(limit)
            .skip(skip)
            .then((course_data) => {
                res.send({
                    status: 200,
                    success: true,
                    message: "pagination done",
                    data: course_data
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