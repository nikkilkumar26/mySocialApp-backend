const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../db/keys')
const mongoose = require ('mongoose')
const Usr = mongoose.model("open_media")
module.exports =(req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization)
    {
        res.status(401).json({error:"You must be logged In"})
    }
    const token = authorization.replace("Bearer ","");
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            res.status(401).json({error:"You must be logged In"})
        }
        const {_id} =payload
        Usr.findById(_id).then(data=>{
            req.Usr = data
            next()
        })
        
    })
}