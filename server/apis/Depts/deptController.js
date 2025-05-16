const deptModel = require("./deptModel")
const { uploadImg } = require("../../utilities/helper")

const add = async (req, res) => {

    //client null validation
    var errMsgs = []
    if (!req.body.dept_name) {
        errMsgs.push("dept_name is required!!")
    }
    // if(!req.body.HOD){
    //         errMsgs.push("HOD is required!!")
    // }
    // if(!req.body.description){ 
    //     errMsgs.push("description is required!!")
    // }
    // if(!req.file){ 
    //     errMsgs.push("image is required!!")
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
        let deptcount = await deptModel.countDocuments()
        deptModel.findOne({ dept_name: req.body.dept_name })
            .then(async (deptdata) => {
                // console.log(complaintsdata);
                if (deptdata == null) {
                    //insertion new entry
                    let deptobj = new deptModel()
                    deptobj.auto_id = deptcount + 1
                    deptobj.dept_name = req.body.dept_name
                    // deptobj.HOD = req.body.HOD
                    // deptobj.description = req.body.description
                    // deptobj.image = "department/"+req.file.filename
                    //  if(req.file){
                    //     try{
                    //         let url = await uploadImg(req.file.buffer)
                    //         deptobj.image = url
                    // }
                    // catch(err){
                    //             res.send({
                    //                 status:500,
                    //                 success:false,
                    //                 message:"Error while upload image"
                    //             })
                    //         }
                    // }                                            
                    deptobj.save()
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
        deptModel.deleteOne({ _id: req.body._id })
            .then((deptdata) => {
                res.json({
                    status: 200,
                    success: true,
                    message: "Data deleted!!",
                    data: deptdata
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
        deptModel.findOne({ _id: req.body._id })
            .then(async (deptdata) => {
                if (deptdata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found!!"
                    })
                }
                else {
                    //update data 
                    if (req.body.dept_name) {
                        deptdata.dept_name = req.body.dept_name
                    }
                    // if(req.body.HOD){
                    //     deptdata.HOD = req.body.HOD
                    // }

                    // if(req.body.description){
                    //     deptdata.description = req.body.description
                    // }
                    //  if(req.file){
                    //     try{
                    //         let url = await uploadImg(req.file.buffer)
                    //         deptdata.image = url
                    //     }
                    //     catch(err){
                    //         res.send({
                    //             status:500,
                    //             success:false,
                    //             message:"Error while upload image"
                    //             })
                    //     }
                    // }
                    // if(req.file){
                    //     deptdata.image = "department/"+req.file.filename
                    // }
                    deptdata.save()
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
        deptModel.findOne({ _id: req.body._id })
            .then((deptdata) => {
                if (deptdata == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found",
                    })
                }
                else {
                    //update status
                    deptdata.status = req.body.status
                    deptdata.save()
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
    let totalcount = await deptModel.countDocuments()
    deptModel.find(req.body)
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
        deptModel.findOne({ _id: req.body._id })
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
        deptModel.find()
            .limit(limit)
            .skip(skip)
            .then((dept_data) => {
                res.send({
                    status: 200,
                    success: true,
                    message: "pagination done",
                    data: dept_data
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