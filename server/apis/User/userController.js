const userModel = require("./userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretkey = "123@#";

const login = async (req, res) => {
    const errMsgs = [];

    if (!req.body.email) {
        errMsgs.push("Email is required!!");
    }
    if (!req.body.password) {
        errMsgs.push("Password is required!!");
    }

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }
    let TotalCount = await userModel.countDocuments()
    userModel.findOne({ email: req.body.email })
        .then((userdata) => {
            console.log(userdata);
            
            if (!userdata) {
                return res.json({
                    status: 422,
                    success: false,
                    message: "User not exist!!",
                });
            }
            if(userdata.status === false){
                return res.json({
                    status:404,
                    success:false,
                    message: "Your account is blocked. Please Contact Admin!!"
                })

            }




            bcrypt.compare(req.body.password, userdata.password, function (err, isMatch) {
                if (!isMatch) {
                    return res.json({
                        status: 422,
                        success: false,
                        message: "Wrong Password!!",
                    });
                }

                const payload = {
                    _id: userdata._id,
                    name: userdata.name,
                    email: userdata.email,
                    userType: userdata.userType,
                    autoId: TotalCount + 1
                };

                const token = jwt.sign(payload, secretkey);
                return res.send({
                    status: 200,
                    success: true,
                    message: "Login successfully!!",
                    data: userdata,
                    token: token
                });
            });
        })
        .catch((err) => {
            res.send({
                status: 500,
                success: false,
                message: "Internal server error",
                errmsg: err
            });
        });
};



const changepassword = (req, res) => {
    var errMsgs = []
    if (!req.body.userId) {
        errMsgs.push("userId is required!!")
    }
    if (!req.body.oldpassword) {
        errMsgs.push("oldpassword is required!!")
    }
    if (!req.body.newpassword) {
        errMsgs.push("newpassword is required!!")
    }
    if (!req.body.confirmpassword) {
        errMsgs.push("confirmpassword is required!!")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        if (req.body.newpassword == req.body.confirmpassword) {
            userModel.findOne({ _id: req.body.userId })
                .then((userdata) => {
                    if (userdata == null) {
                        res.send({
                            status: 404,
                            success: false,
                            message: "User Not Found"
                        })
                    }
                    else {
                        bcrypt.compare(req.body.oldpassword, userdata.password, function (err, ismatch) {
                            if (!ismatch) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Old Password is wrong!!"
                                })
                            }
                            else {
                                //updation
                                userdata.password = bcrypt.hashSync(req.body.newpassword, 10)
                                userdata.save()
                                    .then((updated_data) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "password updated successfully!!",
                                            data: updated_data
                                        })
                                    })
                                    .catch((err) => {
                                        res.send({
                                            status: 500,
                                            success: false,
                                            message: "Internal Server Error!!"
                                        })
                                    })
                            }
                        })
                    }

                })
                .catch((err) => {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Internal Server Error!!",
                        errmsg: err
                    })
                })
        }
        else {
            res.send({
                status: 422,
                success: false,
                message: "newpassword is not match with confirmpassword!!"
            })
        }
    }
}


module.exports = { login, changepassword }