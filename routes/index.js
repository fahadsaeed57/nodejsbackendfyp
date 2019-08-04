var express = require('express');
var router = express.Router();
var con = require('../dbcon');
const { Expo } = require('expo-server-sdk');
const { check, validationResult } = require('express-validator/check');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.post('/pushtoken',function (req,res) {
//   con.connect(function(err){

//       var sql = "call addpushtoken(?,@pushtokenexist);";
//       con.query(sql,[req.body.token.value],function(err,result){
//         if(result[0][0].pushers=='1'){
//           res.json({"message":"device already registered"})
//         }
//         else if(result[0][0].pushers=='0'){
//           res.json({"message":"inserted successfully"})
//         }
//         else{
//           // console.log(result[0][0].pushers)
//           res.json({"message":"some thing went wrong try again"})
//         }

//       })




//   });
// });



router.get('/student', function (req, res) {


  let sql = `select s.enrollment_num,s.student_name,
  s.father_name,s.roll_num,s.student_phone,s.parent_email,
  s.parent_phone,s.address,s.encoded_face_img,b.batch_name,
  se.section_name,p.program_name from students s
      inner join batch b on b.id = s.batch_id
      inner join section se on se.id = s.section_id
      inner join program p on p.id = s.program_id`;
  con.query(sql, (err, result) => {
    // console.log(result);
    res.json({ "students": result })
  })





});
router.post('/teacher/departments',
  [

    
    check('teacher_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the teacher_id').isLength({min:1})
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let sql = `select distinct d.* from course_teacher_session cts
    inner join course_program cp on cts.course_id = cp.course_id
    inner join program p on cp.program_id = p.id
    inner join department d on p.department_id = d.id
    inner join session s on cts.session_id = s.id
    where cts.teacher_id = ? and s.is_active = 1`;
    con.query(sql, [req.body.teacher_id], (err, result) => {
      if (result.length != 0) {
        // console.log(result)
        res.json({ "departments": result, "message": "1" })
      }
      else {
        res.json({ "departments": null, "message":"0" })
      }
      // console.log(result);

    })





  });

  router.post('/teacher/programs',
  [

    
    check('teacher_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the teacher_id').isLength({min:1}),
    check('department_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the department_id').isLength({min:1})
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let sql = `select distinct p.* from course_teacher_session cts
    inner join course_program cp on cts.course_id = cp.course_id
    inner join program p on cp.program_id = p.id
    inner join session s on cts.session_id = s.id
    where cts.teacher_id = ? and p.department_id = ? and s.is_active = 1`;
    con.query(sql, [req.body.teacher_id,req.body.department_id], (err, result) => {
      if (result.length != 0) {
        // console.log(result)
        res.json({ "programs": result, "message": "1" })
      }
      else {
        res.json({ "programs": null, "message":"0" })
      }
      // console.log(result);

    })





  });
  router.post('/teacher/batches',
  [

    
    check('teacher_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the teacher_id').isLength({min:1}),
    check('program_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the program_id').isLength({min:1})
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let sql = `select distinct b.*
    from session s
    inner join course_teacher_session cts on s.id = cts.session_id
    inner join batch b on s.batch_id = b.id
    where cts.teacher_id = ? and s.program_id = ? and s.is_active = 1`;
    con.query(sql, [req.body.teacher_id,req.body.program_id], (err, result) => {
      if (result.length != 0) {
        // console.log(result)
        res.json({ "batches": result, "message": "1" })
      }
      else {
        res.json({ "batches": null, "message":"0" })
      }
      // console.log(result);

    })





  });

  router.post('/teacher/sections',
  [

    
    check('teacher_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the teacher_id').isLength({min:1}),
    check('program_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the program_id').isLength({min:1}),
    check('batch_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the batch_id').isLength({min:1})
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let sql = `select distinct sec.*
    from session s
    inner join course_teacher_session cts on s.id = cts.session_id
    inner join section sec on s.section_id = sec.id
    where cts.teacher_id = ? and s.program_id = ? and s.batch_id = ? and s.is_active = 1
    order by sec.id asc`;
    con.query(sql, [req.body.teacher_id,req.body.program_id,req.body.batch_id], (err, result) => {
      if (result.length != 0) {
        // console.log(result)
        res.json({ "sections": result, "message": "1" })
      }
      else {
        res.json({ "sections": null, "message":"0" })
      }
      // console.log(result);

    })





  });
  router.post('/teacher/courses',
  [

    
    check('teacher_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the teacher_id').isLength({min:1}),
    check('program_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the program_id').isLength({min:1}),
    check('batch_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the batch_id').isLength({min:1}),
    check('section_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the section_id').isLength({min:1})
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let sql = `select id as session_id
    from session
    where program_id = ? and batch_id = ? and section_id = ? and is_active = 1
    order by year desc, semester asc 
    limit 1  `;
    con.query(sql, [req.body.program_id,req.body.batch_id,req.body.section_id], (err, result) => {
      if (result.length != 0) {
        // console.log(result)
        // res.json({ "batches": result, "message": "1" })
        let sql2=`select c.id,c.course_name 
        from course c
        inner join course_teacher_session cts on c.id = cts.course_id
        inner join course_program cp on c.id = cp.course_id
        where cts.teacher_id = ? and cp.program_id = ? and cts.session_id = ?`
        con.query(sql2,[req.body.teacher_id,req.body.program_id,result[0].session_id],(err,result)=>{
            res.json({ "courses": result, "message": "1" })
        })
      }
      else {
        res.json({ "courses": null, "message":"0" })
      }
      // console.log(result);

    })





  });


  router.post('/teacher/startattendance',
  [

    
    check('teacher_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the teacher_id').isLength({min:1}),
    check('program_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the program_id').isLength({min:1}),
    check('batch_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the batch_id').isLength({min:1}),
    check('section_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the section_id').isLength({min:1}),
    check('course_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the course_id').isLength({min:1})
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    
    let sql = `
INSERT INTO attendance_main (
    attendance_date,
    attendance_time,
    status,
    latitude,
    longitude,
    distance,
    course_id,
    session_id,
    teacher_id
)

SELECT 
    '${req.body.attendance_date}',
   '${req.body.attendance_time}',
    0,
    ${req.body.latitude},
    ${req.body.longitude},
    ${req.body.distance},
    ${req.body.course_id},
    id,
    ${req.body.teacher_id}
	from session
    where program_id = ${req.body.program_id} and batch_id = ${req.body.batch_id} and section_id = ${req.body.section_id} and is_active = 1
    order by year desc, semester asc 
    limit 1`;
console.log(sql);
    con.query(sql, (err, result) => {
      // console.log(req.body)
        // console.log(result)
        // res.json({ "batches": result, "message": "1" })
        let sql2=`INSERT INTO attendance_student (
          attendance_id,
          isPresent,
          student_id
      )
      SELECT 
          ?,
          0,
          css.student_id
      FROM 
          course_student_session css
      inner join students st on css.student_id = st.id
      WHERE 
          css.course_id = ? and st.program_id = ? and st.section_id = ? and st.batch_id = ?`
          var attendance_id =result.insertId;
        con.query(sql2,[result.insertId,req.body.course_id,req.body.program_id,req.body.section_id,req.body.batch_id],(err,result)=>{
            if(result){
              con.query("select * from course where id =?",[req.body.course_id],(errors,resultmain)=>{
                res.json({ "attendance_id":attendance_id,"course":resultmain, "message": "1" })
              })
              
            }
            else{
              res.json({ "message": "0" })
            }
            
        })
      

    })





  });

  router.get('/teacher/getattendance', (req, res) => {

    
    let sql = `select st.id,st.student_name,st.roll_num,atu.isPresent
    from attendance_student atu
    inner join students st on st.id = atu.student_id
    where atu.attendance_id = ?`;
    con.query(sql, [req.query.id], (err, result) => {
      if (result.length != 0) {
        // console.log(result)
        res.json({ "students": result, "message": "1" })
      }
      else {
        res.json({ "students": null, "message":"0" })
      }
      // console.log(result);

    })





  });
  router.get('/teacher/unsavedattendance', (req, res) => {

    
    let sql = `select am.id as attendance_id,am.attendance_date as attendance_date ,c.course_name as course_name from attendance_main am
    inner join course c on am.course_id=c.id
    where am.teacher_id = ? and am.status = 0`;
    con.query(sql, [req.query.id], (err, result) => {
      if (result.length != 0) {
        // console.log(result)
        res.json({ "attendances": result, "message": "1" })
      }
      else {
        res.json({ "attendances": null, "message":"0" })
      }
      // console.log(result);

    })





  });
  router.post('/teacher/closeattendance',
  [

    
    check('attendance_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the attendance_id').isLength({min:1})
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let sql = `update attendance_main set status = 1 where id = ?`;
    con.query(sql, [req.body.attendance_id], (err, result) => {
      if (result) {
        // console.log(result)
        res.json({  "message": "1" })
      }
      else {
        res.json({  "message":"0" })
      }
      // console.log(result);

    })





  });

  router.post('/teacher/markattendance',
  [

    
    check('student_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the student_id').isLength({min:1}),
    check('attendance_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the attendance_id').isLength({min:1})
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let sql = `UPDATE attendance_student SET isPresent = IF (isPresent, 0, 1)  where student_id = ? and attendance_id = ?`;
    con.query(sql, [req.body.student_id,req.body.attendance_id], (err, result) => {
      if (result) {
        // console.log(result)
        res.json({  "message": "1" })
      }
      else {
        res.json({  "message":"0" })
      }
      // console.log(result);

    })





  });
  router.post('/teacher/login',
  [

    check('email').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the email').isLength({min:1}),

    check('password').isLength({ min: 1 })
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let sql = "select * from teachers where email=? and password=?";
    con.query(sql, [req.body.email.trim(), req.body.password.trim()], (err, result) => {
      if (result.length != 0) {
        // console.log(result)
        res.json({ "teacher": result, "message": "success" })
      }
      else {
        res.json({ "teacher": null, "message": "email or password incorrect" })
      }
      // console.log(result);

    })





  });
  
router.post('/student/login',
  [

    check('enrollment_num').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the username').isLength({min:1}),

    check('password').isLength({ min: 1 })
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let sql = "select * from students where enrollment_num=? and password=?";
    con.query(sql, [req.body.enrollment_num.trim(), req.body.password.trim()], (err, result) => {
      if (result.length != 0) {
        // console.log(result)
        res.json({ "student": result, "message": "success" })
      }
      else {
        res.json({ "student": null, "message": "enrollment number or password incorrect" })
      }
      // console.log(result);

    })





  });

  router.post('/student/currentcourses',
  [

    check('student_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the student_id').isInt(),

    
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let sql = `select c.id,c.course_name,c.course_code,(c.credit_hours - c.practical_hours) as theory, c.practical_hours as practical
    from course_student_session css
    join course c on c.id = css.course_id
    join session s on s.id = css.session_id
    join students st on st.id = css.student_id
    where s.is_active = 1 and css.student_id = ?`;
    con.query(sql, [req.body.student_id.trim()], (err, result) => {
      if (result.length != 0) {
        // console.log(result)
        res.json({ "courses": result, "message": "success" })
      }
      else {
        res.json({ "student": null, "message": "Not enrolled in any course for now" })
      }
      // console.log(result);

    })






  });
  router.post('/student/currentsession',
  [

    check('batch_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the batch_id').isInt(),
    check('section_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the section_id').isInt(),
    check('program_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the program_id').isInt()
    


    
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let sql = `select semester,year,id from session where batch_id = ? and section_id = ? and program_id = ? and is_active = 1`;
    con.query(sql, [req.body.batch_id.trim(),req.body.section_id.trim(),req.body.program_id.trim()], (err, result) => {
      if (result.length != 0) {
        // console.log(result)
        res.json({ "current_session": result, "message": "success" })
      }
      else {
        res.json({ "student": null, "message": "No active session" })
      }
      // console.log(result);

    })





  });

  router.post('/student/oldsessions',
  [

    check('batch_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the batch_id').isInt(),
    check('section_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the section_id').isInt(),
    check('program_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the program_id').isInt()
    


    
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let sql = `select semester,year from session where batch_id = ? and section_id = ? and program_id = ? and is_active = 0`;
    con.query(sql, [req.body.batch_id.trim(),req.body.section_id.trim(),req.body.program_id.trim()], (err, result) => {
      if (result.length != 0) {
        // console.log(result)
        res.json({ "current_session": result, "message": "success" })
      }
      else {
        res.json({ "student": null, "message": "No active session" })
      }
      // console.log(result);

    })





  });
  function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
    }
  }

  router.post('/student/markattendance',
  [

    check('student_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the student_id').isInt(),
    check('attendance_id').custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the attendance_id').isInt()
    


    
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let sql = `select am.attendance_date as dated ,am.attendance_time , latitude,am.id as attendance_id, am.status , longitude , am.distance ,c.course_name , t.teacher_name from attendance_main am
    join course c on c.id = am.course_id
    join teachers t on t.id =  am.teacher_id
    where am.id = ? and am.status = 1`;
    var sql2 = `update attendance_student set isPresent = 1 where student_id = ? and attendance_id=?`
    con.query(sql, [req.body.attendance_id], (err, result) => {
      if (result.length != 0) {

        var distbetweencords = distance(result[0].latitude,result[0].longitude,req.body.lat,req.body.log,"K")
        if((result[0].distance/1000) > distbetweencords){
          con.query(sql2,[req.body.student_id,req.body.attendance_id],(err,result2)=>{
                res.json({"attendance_details":result[0],"student_cords":{"lat":req.body.lat,"long":req.body.log},"message":"Attendance Marked Successfully"})
          })
        }
        else{
          res.json({ "attendance_details": null, "message": "Sorry you are out of defined range of attendance your attendance can't be marked"})
          // console.log("Sorry you are out of defined range of attendance your attendance can't be marked")
        }
        // console.log(result)
        // res.json({ "attendance_details": result, "message": "success" })

      }
      else {
        res.json({"attendance_details":null ,"message": "No Attendance found" })
      }
      // console.log(result);

    })





  });

router.post('/student/update/image', function (req, res) {


  let sql = "update students set encoded_face_img=? where enrollment_num=? and password=?";
  if (req.body.enrollment_num != "", req.body.password != "") {
    con.query(sql, [req.body.encoded_base64img, req.body.enrollment_num, req.body.password], (err, result) => {
      if (err) res.json({ "error": err })

      if (result.changedRows == 1) {
        res.json({ "message": "updated successfully" })
      }
      else {
        res.json({ "message": "No data to update" })
      }

    })

  }
  else {
    res.json({ "message": "Fill all required data" })
  }






});

router.get('/sendnotification', function (req, res, next) {
  let somePushTokens = [];
  con.connect(function (err) {
    var sql = "SELECT device_token FROM device_token_notification";
    con.query(sql, function (err, result) {
      if (err) throw err;
      if (result.length != 0) {
        for (var i = 0; i < result.length; i++) {
          somePushTokens.push(result[i].pushtoken)
        }
      }

      // Create a new Expo SDK client
      let expo = new Expo();

      // Create the messages that you want to send to clents
      let messages = [];
      for (let pushToken of somePushTokens) {

        messages.push({
          to: pushToken,
          sound: 'default',
          body: 'Hi Message from Fahad',
          channelId: "chat-messages",
          data: { withSome: 'data' },
        })
      }


      let chunks = expo.chunkPushNotifications(messages);
      let tickets = [];
      (async () => {

        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);

          } catch (error) {
            console.error(error);
          }
        }
      })();

      let receiptIds = [];
      for (let ticket of tickets) {

        if (ticket.id) {
          receiptIds.push(ticket.id);
        }
      }

      let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
      (async () => {

        for (let chunk of receiptIdChunks) {
          try {
            let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
            console.log(receipts);

            for (let receipt of receipts) {
              if (receipt.status === 'ok') {
                continue;
              } else if (receipt.status === 'error') {
                console.error(`There was an error sending a notification: ${receipt.message}`);
                if (receipt.details && receipt.details.error) {

                  console.error(`The error code is ${receipt.details.error}`);
                }
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      })();
    });

  });

  res.json({ "message": "Notification sent successfully" })

})
module.exports = router;
