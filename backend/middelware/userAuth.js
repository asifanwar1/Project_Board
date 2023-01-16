const jwt = require("jsonwebtoken");
const User = require('../models/userSchema');

const authUser = async (req, res, next) =>{

    try {
        
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY); 
     
        const rootUser = await User.findOne({_id: verifyToken._id});
        
        if(!rootUser){ throw new Error('User not found')};

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id; 

        next(); 

    } catch (error) {
    
        res.status(401).send('Unautorized: No token provided')
        console.log(error);
    }
}

module.exports = authUser
