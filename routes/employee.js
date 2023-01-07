const e = require('express')
var express = require('express')
var router = express.Router()
var pool = require('./pool')
var upload = require('./multer')

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get('/employeeinterface', function (req, res) {
  var admin = JSON.parse(localStorage.getItem('ADMIN'))
  if (admin){
    res.render('employeeinterface', { message: '' })
  }
  else
    res.render('adminlogin', { message: '' })
})
router.get('/displayemployeedetails', function (req, res) {
  var admin = JSON.parse(localStorage.getItem('ADMIN'))
  if (!admin) {
    res.render('adminlogin', { message: '' })
  }
  else {
    pool.query("select E.*,(select S.statename from state S where S.sid=E.state) as state,(select C.cityname from cities C where C.cid=E.city) as city from empdata E",
      function (error, result) {

        if (error) {
          console.log(error)
          res.render('displayemployeedetails', { 'data': [], 'message': 'Server Error' })

        }
        else {

          res.render('displayemployeedetails', { 'data': result, 'message': ' display Successfully' })
        }


      })
  }
})
router.get('/searchbyid', function (req, res) {
  pool.query("select E.*,(select S.statename from state S where S.sid=E.state) as state,(select C.cityname from cities C where C.cid=E.city) as city from empdata E where emp_id=?", [req.query.eid], function (error, result) {

    if (error) {
      console.log(error)
      res.render('empbyid', { 'data': [], 'message': 'Server Error' })

    }
    else {

      res.render('empbyid', { 'data': result[0], 'message': ' display Successfully' })
    }


  })
})


router.post('/employeesubmit', upload.single('picture'), function (req, res) {
  //console.log("sdfghjkh", req.query)
  pool.query("insert into empdata (first_name, last_name, gender, state, city, DOB, mob, Address, picture)values(?,?,?,?,?,?,?,?,?)",
    [req.body.first_name, req.body.last_name, req.body.gender, req.body.state, req.body.city, req.body.DOB, req.body.mob, req.body.Address, req.file.originalname],
    function (error, result) {
      if (error) {
        console.log(error)
        res.render('employeeinterface', { 'message': 'Server Error' })

      }
      else {

        res.render('employeeinterface', { 'message': 'Record added Successfully' })
      }
    })
})
router.get('/fetchstates', function (req, res) {
  pool.query("select * from state", function (error, result) {
    if (error) {
      res.status(500).json({ result: [], message: 'Server Error' })
    }
    else {
      res.status(200).json({ result: result, message: 'successful' })
    }
  })
})
router.get('/fetchcities', function (req, res) {
  pool.query("select * from cities where sid=?", [req.query.sid], function (error, result) {
    if (error) {
      res.status(500).json({ result: [], message: 'Server Error' })
    }
    else {
      res.status(200).json({ result: result })
    }
  })
})

router.post('/employee_Edit_Delete', function (req, res) {
  console.log(":lHAARAA", req.body)
  var types = req.body.btn
  console.log(types)
  if (types == "Edit") {
    pool.query("update empdata set first_name=?, last_name=?, gender=?, state=?, city=?, DOB=?, mob=?, address=? where emp_id=?",
      [req.body.first_name, req.body.last_name, req.body.gender, req.body.state, req.body.city, req.body.DOB, req.body.mob, req.body.Address, req.body.emp_id],
      function (error, result) {
        if (error) {
          console.log(error)
          res.redirect('/employee/displayemployeedetails')
        }
        else {
          console.log(result)
          res.redirect('/employee/displayemployeedetails')
        }
      })
  }
  else {
    pool.query("delete from empdata where emp_id=?", [req.body.emp_id],
      function (error, result) {
        if (error) {
          console.log(error)
          res.redirect('/employee/displayemployeedetails')
        }
        else {
          res.redirect('/employee/displayemployeedetails')
        }

      })
  }
})

router.get('/searchbyidforimage', function (req, res) {
  pool.query("select E.*,(select S.statename from state S where S.sid=E.state) as state,(select C.cityname from cities C where C.cid=E.city) as city from empdata E where emp_id=?",
    [req.query.eid], function (error, result) {

      if (error) {
        console.log(error)
        res.render('showimage', { 'data': [], 'message': 'Server Error' })

      }
      else {

        res.render('showimage', { 'data': result[0], 'message': ' display Successfully' })
      }


    })
})
router.post('/editimage', upload.single('picture'), function (req, res) {
  //console.log("sdfghjkh", req.query)
  pool.query("update empdata set picture=? where emp_id=?",
    [req.file.originalname, req.body.emp_id],
    function (error, result) {
      if (error) {
        console.log(error)
        res.redirect('/employee/displayemployeedetails')

      }
      else {

        res.redirect('/employee/displayemployeedetails')
      }
    })
})

module.exports = router;