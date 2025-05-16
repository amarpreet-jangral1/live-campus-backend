// const routes = require("express").Router()
// const certificateController = require("../apis/Certificates/certificateController")
// const complaintsController = require("../apis/Complaints/complaintsController")
// const coursesController = require("../apis/Courses/coursesController")
// const deptController = require("../apis/Depts/deptController")
// const gatepassController = require("../apis/Gatepass/gatepassController")
// const studentsController = require("../apis/Students/studentsController")
// const hodController = require("../apis/Hod/hodController")
// const tasksController = require("../apis/Tasks/tasksController")
// const dashboardController = require("../apis/Dashboard/dashboardController")
// const userController = require("../apis/User/userController")
// const multer = require("multer")
// const memoryStorage = multer.memoryStorage()
// const upload = multer({memoryStorage})

// //without login pages 
// routes.post("/hod/getall",hodController.getall)
// routes.post("/hod/getpagination",hodController.getpagination)
// routes.post("/tasks/getall",tasksController.getall)
// routes.post("/students/getall",studentsController.getall)
// routes.post("/gatepass/getall",gatepassController.getall)
// routes.post("/dept/getall",deptController.getall)
// routes.post("/course/getall",coursesController.getall)
// routes.post("/complaint/getall",complaintsController.getall)
// routes.post("/certificate/getall",certificateController.getall)


// routes.use(require("../middleware/middleware"))




// //user routes

// routes.post("/user/login", userController.login);
// routes.post("/user/changepassword", userController.changepassword);



// //certificates routes
// // routes.post("/certificate/add",certificate_upload.single("image"),certificateController.add)
// routes.post("/certificate/add",upload.single("image"),certificateController.add)
// routes.post("/certificate/delete",certificateController.deleteone)
// routes.post("/certificate/update",upload.single("image"),certificateController.update)
// routes.post("/certificate/statusUpdate",certificateController.statusUpdate)
// routes.post("/certificate/getsingle",certificateController.getSingle)
// routes.post("/certificate/getpagination",certificateController.getpagination)



// //complaints routes

// routes.post("/complaint/add",complaintsController.add)
// routes.post("/complaint/delete",complaintsController.deleteone)
// routes.post("/complaint/update",complaintsController.update)
// routes.post("/complaint/statusUpdate",complaintsController.statusUpdate)
// routes.post("/complaint/getsingle",complaintsController.getSingle)
// routes.post("/complaint/getpagination",certificateController.getpagination)


// //courses controller

// routes.post("/course/add",coursesController.add)
// routes.post("/course/delete",coursesController.deleteone)
// routes.post("/course/update",coursesController.update)
// routes.post("/course/statusUpdate",coursesController.statusUpdate)
// routes.post("/course/getsingle",coursesController.getSingle)
// routes.post("/course/getpagination",coursesController.getpagination)

// //dept controller

// // routes.post("/dept/add",department_upload.single("image"),deptController.add)
// routes.post("/dept/add",upload.single("image"),deptController.add)
// routes.post("/dept/delete",deptController.deleteone)
// routes.post("/dept/update",upload.single("image"),deptController.update)
// routes.post("/dept/statusUpdate",deptController.statusUpdate)
// routes.post("/dept/getsingle",deptController.getSingle)
// routes.post("/dept/getpagination",deptController.getpagination)


// //gatepass routes
// routes.post("/gatepass/add",gatepassController.add)
// routes.post("/gatepass/delete",gatepassController.deleteone)
// routes.post("/gatepass/update",gatepassController.update)
// routes.post("/gatepass/statusUpdate",gatepassController.statusUpdate)
// routes.post("/gatepass/getsingle",gatepassController.getSingle)
// routes.post("/gatepass/getpagination",gatepassController.getpagination)

// //students routes

// routes.post("/students/add",upload.single("image"),studentsController.add)
// // routes.post("/students/add",upload.single("image"),studentsController.add)
// routes.post("/students/delete",studentsController.deleteone)
// routes.post("/students/update",upload.single("image"),studentsController.update)
// routes.post("/students/statusUpdate",studentsController.statusUpdate)
// routes.post("/students/getsingle",studentsController.getSingle)
// routes.post("/students/getpagination",studentsController.getpagination)


// // hod routes
// routes.post("/hod/add",upload.single("image"),hodController.add)
// routes.post("/hod/delete",hodController.deleteone)
// routes.post("/hod/update",upload.single("image"),hodController.update)
// routes.post("/hod/statusUpdate",hodController.statusUpdate)
// routes.post("/hod/getsingle",hodController.getSingle)

// //tasks routes

// routes.post("/tasks/add",tasksController.add)
// routes.post("/tasks/delete",tasksController.deleteone)
// routes.post("/tasks/update",tasksController.update)
// routes.post("/tasks/statusUpdate",tasksController.statusUpdate)
// routes.post("/tasks/getsingle",tasksController.getSingle)
// routes.post("/tasks/getpagination",tasksController.getpagination)


// //dashboard
// routes.post("/dashboard",dashboardController.dashboard)

// // middleware


// module.exports = routes