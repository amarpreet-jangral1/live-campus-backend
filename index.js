const express = require("express")
const app = express();
const port = 9000;
const db = require("./server/config/db")
const nodemailer = require("nodemailer");
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
const cors = require("cors")
app.use(cors())
app.use(express.static(__dirname + "/server/public/"))

// require("dotenv").config()
const routes = require("./server/routes/apiRoutes")
app.use("/apis", routes)
const seeder = require("./server/config/seeder")
seeder.adminRegister()
app.listen(port, () => {
    console.log("server connected", port);

})