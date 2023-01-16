const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }, 
    image: {
        type: String,
    },
    userPassword: { 
        type: String,
    },
    userCnfrmPass: {
        type: String,
    },
    imageName: {
        type: String,
    },
    imageType: {
        type: String,
    },
    imageSize: {
        type: String,
    },
    accountVerified: {
        type: Boolean,
    },
    friends:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }]      
},{timestamps:true})



// hashing password

userSchema.pre('save', async function(next){
    
    if(this.isModified('userPassword')){
        this.userPassword =  await bcrypt.hash(this.userPassword, 12);
        this.userCnfrmPass =  await bcrypt.hash(this.userCnfrmPass, 12);
    }
    next();

});



//generating token
userSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id: this._id}, process.env.ACCESS_TOKEN_KEY, {expiresIn: "7d"});
        return token;

    }catch(err){
        console.log(err);
    }
}


userSchema.index({ name: "text", email: "text" });

const User = mongoose.model('USER', userSchema);

module.exports = User;


