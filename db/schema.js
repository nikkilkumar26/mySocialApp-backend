const mongoose = require('mongoose');
const {ObjectId}= mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        followers:[
            {
                type:ObjectId,ref:"open_media"
            }
        ],
        following:[
            {
                type:ObjectId,ref:"open_media"
            }
        ],
        profpic:{
            type:String,
            default:"https://res.cloudinary.com/nik/image/upload/v1603821183/guest-user_iqegdo.jpg"
        },
        resetToken:String,
        expireToken:Date

    }
)

mongoose.model("open_media",userSchema);