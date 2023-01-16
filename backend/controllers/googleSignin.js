const express = require('express');
const router = express.Router();
const multer = require("multer");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require('google-auth-library');

const upload = multer({ dest: 'uploads/' });

const User = require('../models/userSchema');




const createTransporter = async () => {
    const oauth2Client = new OAuth2Client(
        process.env.GOOGLE_MAIL_CLIENT_ID,
        process.env.GOOGLE_MAIL_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"  
    ); 
    
    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_MAIL_REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
          if (err) {
            reject("Failed to create access token :(");
          }
          resolve(token);
        });
    });


    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.GOOGLE_EMAIL,
          accessToken,
          clientId: process.env.GOOGLE_MAIL_CLIENT_ID,
          clientSecret: process.env.GOOGLE_MAIL_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_MAIL_REFRESH_TOKEN
        }
    });

    return transporter;
};


const sendEmail = async (emailOptions) => {
    try {
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(emailOptions);  
    } catch (error) {
        console.log(error);
    }
};



module.exports = router.post('/googleSignIn', async(req, res)=>{
    const recievedToken = req.body.jwtIDToken

    const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,  
    ); 

    try {

        const ticket = await client.verifyIdToken({
            idToken: recievedToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
    
        const payload = ticket.getPayload();

        const userExist = await User.findOne({ email: payload.email });

        if(userExist){

            await User.updateOne({ "_id": userExist._id }, {
                $set:{
                    name: payload.name,
                    image: payload.picture,
                }
            });

            let token = await userExist.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })

            const userProfile = {
                id: userExist._id,
                name: payload.name,
                email: payload.email,
                image: payload.picture,
            };
    
            console.log("user updated")
            res.status(201).send(userProfile)
            
        }
        else{
            const data = new User({  
                name: payload.name,
                email: payload.email,
                image: payload.picture,
            });
 
            await data.save();

            const newUser = await User.findOne({ email: payload.email });
            
            let token = await newUser.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })

            const userProfile = {
                id: newUser._id,
                name: payload.name,
                email: payload.email,
                image: payload.picture,
            };

            res.status(201).send(userProfile)
        }

    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
});





module.exports = router.post('/createNewUser', upload.single("userImage"), async(req, res)=>{
    const {userName, userEmail, userPassword, userCnfrmPass} = req.body;
    const userImage = req.file;

    if(!userName || !userEmail || !userPassword || !userCnfrmPass){
        return res.status(422).json({ error: "Please filled the form properly"})
    }
    const userExist = await User.findOne({ email: userEmail });
    try {
        if(userExist){
            return res.status(201).json({message: "User already exisit."})
        }
        else if(userPassword != userCnfrmPass){
            return res.status(422).json({error: "Passowrds are not matching"})
        }
        else{

            const data = new User({  
                name: userName,
                email: userEmail,
                userPassword: userPassword,
                userCnfrmPass: userCnfrmPass,
                imageName: userImage.originalname,
                image: userImage.path,
                imageType: userImage.mimetype,
                imageSize: userImage.size,
                accountVerified: false,
            });
    
            await data.save();

            const newUser = await User.findOne({ email: userEmail });

            let token = await newUser.generateAuthToken();

            const url = `http://localhost:5000/verify/${token}`


            sendEmail({
                subject: "Verify Account",
                from: process.env.GOOGLE_EMAIL,
                to: userEmail,
                text: "I am sending an email from nodemailer!",
                html: `Click <a href = '${url}'>here</a> to confirm your email.`
              });

            res.status(201).json({ message: `An Email has been sent to your account : ${userEmail} please verify`});
        }
        
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
}); 




module.exports = router.post('/signInUser', async(req, res)=>{
    const {userEmail, userPassword} = req.body;

    const userExist = await User.findOne({ email: userEmail, accountVerified: true});
    
    if (!userExist) {
        return res.status(404).send({ 
           message: "User does not exist or account not verified." 
        });
     }

     const matchPassword = await bcrypt.compare(userPassword, userExist.userPassword); 

    try {
        if (userExist && matchPassword){

            
            
            const userProfile = {
                id: userExist._id,
                name: userExist.name,
                email: userExist.email,
                image: userExist.image,
            };

            let token = await userExist.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })


            res.status(201).json(userProfile);
    
        }else{
            res.status(400).json({message: "invalid crededntials or unverified account"})
        }
        
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
});  



module.exports = router.get('/verify/:token', async(req, res)=>{
    const {token} = req.params
   
    if(!token){
        return res.status(4222).send({message: "Token not found"});
    }
  
    try{
    
        let payload = jwt.verify(token, process.env.ACCESS_TOKEN_KEY); 
    
        const user = await User.findOne({ _id: payload._id }).exec();
        if (!user) {
           return res.status(404).send({ 
              message: "User does not  exists" 
           });
        }
       
        user.accountVerified = true;
        await user.save();
        return res.status(200).send({
              message: "Account Verified"
        });
     } catch (err) {
        return res.status(500).send(err);
     }
    
}); 




module.exports = router.get('/userSignOut', async(req, res)=>{
    res.clearCookie("jwtoken");
    res.status(201).send({message: "logout successfull"});
    
});   