const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/myproject")
// mongoose.connect("mongodb+srv://amar:02052025@cluster0.khvl6rj.mongodb.net/myproject")

    .then(() => {
        console.log("database connected");

    })
    .catch((err) => {
        console.log("error is:", err);

    })