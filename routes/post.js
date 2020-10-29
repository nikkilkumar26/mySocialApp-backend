var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const requireLogin=require('../middleware/requireLogin');
const Post =mongoose.model("Post");

router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/subpost',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.Usr.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})




router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic_url} = req.body
    
    if(!title || !body || !pic_url){
        console.log("please print")
        res.status(422).json({error:"Add all Fields add"})
    }
    req.Usr.password = undefined
    const post =new Post({
        title,
        body,
        pic:pic_url,
        postedBy: req.Usr,
    })
    post.save().then(result=>{
        res.json({post: result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy: req.Usr._id})
    
    .populate("postedBy","_id name")
   
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>
        {
            console.log(err)
        })
})
    
router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.Usr._id}
    },{
        new:true
    }).populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.Usr._id}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment ={
        text:req.body.text,
        postedBy: req.Usr._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
          
        }
        else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
   
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){

            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.Usr._id.toString() ){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})


module.exports = router