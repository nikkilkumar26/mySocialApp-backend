var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("open_media");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} =require('../db/keys');
const requirelogin = require('../middleware/requireLogin');
const crypto = require('crypto')
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sndmail26@gmail.com', // generated ethereal user
      pass: 'sendmailtoeveryone', // generated ethereal password
    },
  });


router.get('/protected',requirelogin,(req,res)=>{
    res.send("im protected")
})

router.get('/',(req,res)=>{
    res.send("im from auth");
})

router.post('/signup',(req,res)=>{
    let {name,email,password,profpic} = req.body;
   if(!email || !password || !name){
       return res.status(422).json({error:"please add all field"});
   }
   
  User.findOne({email:email}).then((e)=>{
      if(e){
      return res.status(422).json({error:"user exist"})
    }
    bcrypt.hash(password,12)
    .then(hashedpassword=>{
        const user = new User({
            email,
            password: hashedpassword,
            name,
            profpic
        })
        user.save()
        .then(user=>{
            transporter.sendMail({
                from: 'sndmail26@gmail.com',
                to: user.email,
                subject: 'Signup Success',
                html: "<h1>Welcome to Global Media</h2><br/> <p> Thanks for supporting us in Beta Program (: (; </p>"
              })
            .then(res.json({message:" Successfully signedup !!!!"}))
         } )
        .catch(err=>
            {
                console.log(err);
            })
    })
    
  })
  .catch(err=>
    {
        console.log(err);
    })

})

router.post('/signin',(req,res)=>{
    let {email,password,followers,following} = req.body
    if(!email || !password){
        return res.status(422).json({error:"Fields cannot be Incomplete"})
    }
    User.findOne({email:email})
    .then(e=>{
        if(!e){
           return res.status(422).json({error:"Invalid UserName or password"})
        }
        bcrypt.compare(password,e.password)
        .then(matched=>{
            if(matched){
                // res.json({message:" successfully signedIn"})
                const token = jwt.sign({_id:e._id},JWT_SECRET)
                const {_id,name,email,followers,following,profpic} = e;
            
                res.json({token,user:{_id,name,email,followers,following,profpic}})
            }
            else{
                return res.status(422).json({error:"Invalid UserName or Password"})
            }
        })
        .catch(err=>
            {
                console.log(err);
            })
    })
})

router.post('/resetpassword',(req,res)=>{
    crypto.randomBytes(32,(err,Buffer)=>{
        if(err){
            console.log(err)
        }
        const token = Buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User Not Found"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 10800000
            user.save().then((result)=>{
                transporter.sendMail({
                    from: 'sndmail26@gmail.com',
                    to: user.email,
                    subject: 'Password Reset',
                    html: `<p> You are requested for Password reset </p>
                            <h5>Click in this <a href="https://nikkil-global-media-site.netlify.app/${token}">link</a> to reset password</h5>`
                  })
            }).then( res.json({message:"Check you Email Inbox if not check Spam"}))
           

        })
    })
})

router.post('/newpassword',(req,res)=>{
    const newpassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Session Expired"})
        }
        bcrypt.hash(newpassword,12).then(hashedpassword=>{
            user.password = hashedpassword;
            user.resetToken = undefined;
            user.expireToken= undefined;
            user.save().then((saveuser)=>{
                res.json({message:" Password updated "})
            })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports= router;
