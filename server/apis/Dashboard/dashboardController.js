const hodModel=require("../Hod/hodModel")
const studentModel=require("../Students/studentsModel")
const userModel=require("../User/userModel")
const dashboard=async(req,res)=>{
    var total_hods=0;
    var total_students=0;
    var total_users=0;
    await hodModel.countDocuments()
    .then((t_hod)=>{
        total_hods=t_hod
    })
    await studentModel.countDocuments()
    .then((t_students)=>{
        total_students=t_students
    })
    await userModel.countDocuments()
    .then((t_users)=>{
        total_users=t_users
    }) 
    res.send({
        status:200,
        success:true,
        message:"Dashboard loaded!",
        total_HOD:total_hods,
        total_Students:total_students,
        total_Users:total_users
    })

}
module.exports={dashboard}