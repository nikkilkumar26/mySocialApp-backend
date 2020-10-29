var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const requireLogin=require('../middleware/requireLogin');
const Post =mongoose.model("Post");
const User = mongoose.model("open_media");


router.get('/user/:id', requireLogin,function(req, res, next) {

  User.findOne({_id:req.params.id})
  .select("-password")
  .then(user=>{
    
    Post.find({postedBy:req.params.id})
    .populate("postedBy","_id name")
    .exec((err,posts)=>{
      if(err){
        return res.status(422).json({error:err})
      }
      res.json({user,posts})
    })
  }).catch(err=>{
    return res.status(404).json({error:"User not found"})
  })

});


router.put('/follow',requireLogin,(req,res)=>{
  User.findByIdAndUpdate(req.body.followId,{
    $push:{followers:req.Usr._id}
  },{new:true},(err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }
    else{
      User.findByIdAndUpdate(req.Usr._id,{
        $push:{following:req.body.followId}

        
      },{new:true}).select("-password").then(result=>{
        res.json(result)
      }).catch(err=>{
        return res.status(422).json({error:err})
      })
    }
  }
  )
})

router.put('/unfollow',requireLogin,(req,res)=>{
  User.findByIdAndUpdate(req.body.unfollowId,{
    $pull:{followers:req.Usr._id}
  },{new:true},(err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }
    else{
      User.findByIdAndUpdate(req.Usr._id,{
        $pull:{following:req.body.unfollowId}
        
      },{new:true}).select("-password").then(result=>{
        res.json(result)
      }).catch(err=>{
        return res.status(422).json({error:err})
      })
    }
  }
  )
})

router.put('/updateprofpic',requireLogin,(req,res)=>{
  User.findByIdAndUpdate(req.Usr._id,{$set:{profpic:req.body.profpic}},{new:true},(err,result)=>{
    if(err){
      return res.status(422).json({err:"Updation failed"})
    }
    res.json(result)
  })
}
)

module.exports = router;
