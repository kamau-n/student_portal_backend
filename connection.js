//database connection
const mysql = require("mysql")

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "kamau"
});

conn.connect(function(err) {
    if (err) {
        console.log("there was an error in the database connecton")
        console.log(err.message)

    } else {


        console.log("connection successfull")
    }
})

module.exports = conn