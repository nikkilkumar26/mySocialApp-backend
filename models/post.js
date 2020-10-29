const mongoose = require('mongoose');
const {ObjectId}= mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId,ref:"open_media"}],
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"open_media"}
    }],
    postedBy:{
        type: ObjectId,
        ref:"open_media"
    }
})


mongoose.model("Post",postSchema);