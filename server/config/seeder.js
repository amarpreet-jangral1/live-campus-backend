const userModel=require("../apis/User/userModel")
const bcrypt=require("bcrypt")
const saltround=10;
const adminRegister=()=>{
    userModel.findOne({email:"admin@gmail.com"})
    .then((userdata)=>{
        if(userdata==null){
            let userObj = new userModel()
            userObj.name = "admin"
            userObj.email = "admin@gmail.com"
            userObj.password = bcrypt.hashSync("123",saltround)
            userObj.userType = 1
            userObj.save()
            .then(()=>{
                console.log("admin added successfully!!");
            })
            .catch((err)=>{
                console.log("internal server err ",err);
            })

        }
        else{
            console.log("admin already exists!!");
        }
    })
    
}
module.exports={adminRegister}