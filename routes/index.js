var express = require('express');
var router = express.Router();
var con = require('../dbcon');
const {Expo} = require('expo-server-sdk');
/* GET home page. */
router.get('/', function(req, res, next) {
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
router.get('/student',function (req,res) {
  
  
      let sql = "select * from students";
      con.query(sql,(err,result)=>{
        // console.log(result);
        res.json({"students":result})
      })
     
    
   
      

});
router.post('/student/login',function (req,res) {
  
  if(req.body.enrollment_num!="",req.body.password!=""){
  let sql = "select * from students where enrollment_num=? and password=?";
  con.query(sql,[req.body.enrollment_num,req.body.password],(err,result)=>{
    if(result.length!=0){
      // console.log(result)
        res.json({"student":result,"message":"success"})
    }
    else{
      res.json({"student":null,"message":"enrollment number or password incorrect"})
    }
    // console.log(result);
    
  })
}
else{
  res.json({"message:":"Fill all required data"})
}


  

});
router.post('/student/update/image',function (req,res) {
  
  
  let sql = "update students set encoded_face_img=? where enrollment_num=? and password=?";
  if(req.body.enrollment_num!="",req.body.password!=""){
    con.query(sql,[req.body.encoded_base64img,req.body.enrollment_num,req.body.password],(err,result)=>{
      if(err) res.json({"error":err})
       
      if(result.changedRows==1){
        res.json({"message":"updated successfully"})
      }
      else{
       res.json({"message":"No data to update"})
      }
       
     })

  }
  else{
    res.json({"message":"Fill all required data"})
  }
  
 


  

});

router.get('/sendnotification',function(req,res,next){
  let somePushTokens = [];
  con.connect(function(err) {
    var sql = "SELECT device_token FROM device_token_notification";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if(result.length!=0){
          for (var i=0;i<result.length;i++){
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

res.json({"message":"Notification sent successfully"})
 
})
module.exports = router;
