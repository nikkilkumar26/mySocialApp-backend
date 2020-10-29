var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const {MONGOURI} = require('../db/keys');


require('../db/schema');
// mongoose.model("open_media");

mongoose.connect(MONGOURI,{
   useNewUrlParser: true ,
   useUnifiedTopology: true 
});

mongoose.connection.on('connected',()=>{
  console.log("MongoDb Atlas is Connected");
}
)

mongoose.connection.on('error',(err)=>{
  console.log("MongoDb Atlas is throwing error ==> "+err);
}
)


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
