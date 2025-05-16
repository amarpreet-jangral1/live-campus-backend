let jwt = require("jsonwebtoken")
const secretkey = "123@#";
// const secretkey = process.env.JWT_SECRET;

module.exports=(req,res,next)=>{
    let token=req.headers["authorization"]
    jwt.verify(token,secretkey,function(err,data){
        if(err!=null){
            res.send({
                status:422,
                success:false,
                message:"unauthorized access!!"
            })
        }
        else{
            req.decoded = data;
            next();
        }

    })
}