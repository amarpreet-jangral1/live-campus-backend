const routes = require("express").Router()
const certificateController = require("../apis/certificate/certificateController")
const complaintsController = require("../apis/Complaints/complaintsController")
const coursesController = require("../apis/Courses/coursesController")
const deptController = require("../apis/Depts/deptController")
const gatepassController = require("../apis/Gatepass/gatepassController")
const studentsController = require("../apis/Students/studentsController")
const hodController = require("../apis/Hod/hodController")
const tasksController = require("../apis/Tasks/tasksController")
const dashboardController = require("../apis/Dashboard/dashboardController")
const userController = require("../apis/User/userController")
const profileController = require("../apis/User/profileController")
const paymentController = require("../apis/payment/paymentController")
const multer = require("multer")
const memoryStorage = multer.memoryStorage()
const upload = multer({ memoryStorage })

//user routes

routes.post("/user/login", userController.login);

//courses
routes.post("/course/getall", coursesController.getall)
routes.post("/course/getsingle", coursesController.getSingle)
routes.post("/course/getpagination", coursesController.getpagination)

//dept
routes.post("/dept/getall", deptController.getall)
routes.post("/dept/getsingle", deptController.getSingle)
routes.post("/dept/getpagination", deptController.getpagination)


//students

routes.post("/students/getsingle", studentsController.getSingle)
routes.post("/students/getpagination", studentsController.getpagination)


//hod
routes.post("/hod/getall", hodController.getall)
routes.post("/hod/getsingle", hodController.getSingle)
routes.post("/hod/getpagination", hodController.getpagination)




//middleware
routes.use(require("../middleware/middleware"))


routes.post("/user/changepassword", userController.changepassword);

//complaints routes

routes.post("/complaint/add", upload.single("image"), complaintsController.add)
routes.post("/complaint/delete", complaintsController.deleteone)
routes.post("/complaint/update", complaintsController.update)
routes.post("/complaint/statusUpdate", complaintsController.statusUpdate)
routes.post("/complaint/getall", complaintsController.getall)
routes.post("/complaint/getsingle", complaintsController.getSingle)

//certificate routes

routes.post("/certificate/add", certificateController.add)
// routes.post("/certificate/delete", complaintsController.deleteone)
routes.post("/certificate/update", upload.single("image"), certificateController.update)
// routes.post("/certificate/statusUpdate", complaintsController.statusUpdate)
routes.post("/certificate/getall", certificateController.getall)
routes.post("/certificate/getsingle", certificateController.getSingle)



//courses controller

routes.post("/course/add", coursesController.add)
routes.post("/course/delete", coursesController.deleteone)
routes.post("/course/update", coursesController.update)
routes.post("/course/statusUpdate", coursesController.statusUpdate)

//dept controller

// routes.post("/dept/add",department_upload.single("image"),deptController.add)
// routes.post("/dept/add",upload.single("image"),deptController.add)
routes.post("/dept/add", deptController.add)
routes.post("/dept/delete", deptController.deleteone)
routes.post("/dept/update", deptController.update)
// routes.post("/dept/update",upload.single("image"),deptController.update)
routes.post("/dept/statusUpdate", deptController.statusUpdate)


//gatepass routes
routes.post("/gatepass/add", gatepassController.add)
// routes.post("/gatepass/delete", gatepassController.deleteone)
routes.post("/gatepass/update", upload.single("image"), gatepassController.update)
// routes.post("/gatepass/statusUpdate", gatepassController.statusUpdate)
routes.post("/gatepass/getall", gatepassController.getall)
routes.post("/gatepass/getsingle", gatepassController.getSingle)
// routes.post("/gatepass/getpagination", gatepassController.getpagination)

//students routes

routes.post("/students/add", upload.single("image"), studentsController.add)
// routes.post("/students/add",upload.single("image"),studentsController.add)
routes.post("/students/delete", studentsController.deleteone)
routes.post("/students/update", upload.single("image"), studentsController.update)
routes.post("/students/statusUpdate", studentsController.statusUpdate)
routes.post("/students/getall", studentsController.getall)
routes.post("/students/getStudentByUserId", studentsController.getStudentByUserId)
routes.post("/payment/pay", paymentController.pay);
routes.post("/payment/getall", paymentController.getall);



// hod routes
routes.post("/hod/add", upload.single("image"), hodController.add)
routes.post("/hod/delete", hodController.deleteone)
routes.post("/hod/update", upload.single("image"), hodController.update)
routes.post("/hod/statusUpdate", hodController.statusUpdate)


//tasks routes

routes.post("/tasks/add", tasksController.add)
routes.post("/tasks/delete", tasksController.deleteone)
routes.post("/tasks/update", tasksController.update)
routes.post("/tasks/statusUpdate", tasksController.statusUpdate)
routes.post("/tasks/getall", tasksController.getall)
routes.post("/tasks/getsingle", tasksController.getSingle)
routes.post("/tasks/getpagination", tasksController.getpagination)


//dashboard
routes.post("/dashboard", dashboardController.dashboard)
routes.post("/adminProfile", profileController.adminProfile)
routes.post("/studentProfile", profileController.studentProfile)
routes.post("/hodProfile", profileController.hodProfile)




module.exports = routes