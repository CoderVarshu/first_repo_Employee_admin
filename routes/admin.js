var express = require('express');
var router = express.Router();
var pool = require("./pool")

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get("/adminlogin", function (req, res, next) {
  res.render("adminlogin", { message: "" })
}); 

router.get("/adminlogout", function (req, res, next) {
  localStorage.clear()
  res.render("adminlogin", { message: "" })
});
router.post("/checkpassword", function (req, res, next) {
  pool.query("select * from employee_details.admin where email_id=? or mobile_number=? and password=?",
    [req.body.email_address, req.body.email_address, req.body.pass],
    function (error, result) {
      if (error) {
        console.log(error)
        res.render("adminlogin", { message: "Server Error" })
      }
      else {
        if (result.length == 1) {
          // console.log()
          localStorage.setItem("ADMIN",JSON.stringify(result[0]))
          res.render("dashBoard", { Data: result[0] })
        }
        else {
          res.render("adminlogin", { message: 'invalid email address or password' })
        }
      }
    })
});
module.exports = router;
