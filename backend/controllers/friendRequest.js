const express = require('express');
const router = express.Router();
const userAuth = require("../middelware/userAuth");


const User = require('../models/userSchema');
const FriendRequest = require('../models/friendRequest');
const Chat = require('../models/chatSchema'); 


module.exports = router.get('/getFriends', userAuth, async(req, res)=>{
    const getUser = await User.findOne({ _id: req.userID });
    let friendsProfile = [];
    
    try {

        let runMap = getUser.friends.map( async (friends)=>{
            let userProfile = await User.findOne({ _id: friends })
            let userObj = {
                _id: userProfile._id,
                name: userProfile.name,
                image:userProfile.image,
            }
            friendsProfile.push(userObj) 
        })
        
        await Promise.all(runMap);
       
        res.status(201).send(friendsProfile);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});


module.exports = router.post('/sendingRequest', userAuth, async(req, res)=>{
    const personId = req.body.personId;
    const senderRequestExist = await FriendRequest.findOne({ sender: req.userID, receiver: personId});
    const reveiverRequestExist = await FriendRequest.findOne({ sender: personId, receiver: req.userID});
    

    try {

        if(senderRequestExist || reveiverRequestExist){
            res.status(201).send({message: "Request is pending"});
        }
        else{
            const data = new FriendRequest({  
                sender: req.userID,
                receiver: personId,
            });
    
            await data.save();

            res.status(201).send({message: "Request sent successfully"});
        }
        
    } catch (error) {
         res.status(500).send(error.message);
        console.log(error)
    }
});





module.exports = router.get('/requestSentBYMe', userAuth, async(req, res)=>{
    const getRequests = await FriendRequest.find({ sender: req.userID, isAccepted: false });
    let friendsProfile = [];
    
    try {
        if(getRequests){
            let runMap = getRequests.map( async (element)=>{
                let userProfile = await User.findOne({ _id: element.receiver });
                let userObj = {
                    _id: userProfile._id,
                    name: userProfile.name,
                    image:userProfile.image,
                }
                friendsProfile.push(userObj) 
            })
            
            await Promise.all(runMap);
           
            res.status(201).send(friendsProfile);
        }
        else{
            res.status(201).send([]);
        }
        
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});






module.exports = router.get('/getRequest', userAuth, async(req, res)=>{
    const getRequests = await FriendRequest.find({ receiver: req.userID, isAccepted: false });
    let friendsProfile = [];
    
    try {
        if(getRequests){
            let runMap = getRequests.map( async (element)=>{
                let userProfile = await User.findOne({ _id: element.sender });
                let userObj = {
                    _id: userProfile._id,
                    name: userProfile.name,
                    image:userProfile.image,
                }
                friendsProfile.push(userObj) 
            })
            
            await Promise.all(runMap);
           
            res.status(201).send(friendsProfile);
        }
        else{
            res.status(201).send([]);
        }
        
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});



module.exports = router.post('/acceptRequest', userAuth, async(req, res)=>{
    const personId = req.body.personId;
    const getRequest = await FriendRequest.findOne({ sender: personId, receiver: req.userID });
    const receivingUser = await User.findOne({ _id: req.userID });
    const sendingUser = await User.findOne({ _id: personId });

    try {
        if(getRequest){
           
            getRequest.isAccepted = true;
            await getRequest.save();
    
            receivingUser.friends.push(sendingUser._id);
            await receivingUser.save();

            sendingUser.friends.push(receivingUser._id);
            await sendingUser.save();

            const data = new Chat({  
                users: [req.userID, personId],
            });
    
            await data.save();
    
            res.status(201).send({message: "Request accepted"});
        }
        
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});




module.exports = router.post('/cancelRequest', userAuth, async(req, res)=>{
    const personId = req.body.personId;
    const getRequest = await FriendRequest.findOne({ sender: req.userID, receiver: personId, isAccepted: false });
    try {
        if(getRequest){
            const deleteRequest = await FriendRequest.deleteOne({ sender: req.userID, receiver: personId, isAccepted: false });
            res.status(201).send({message: "Request Deleted"});
        }
        else{
            res.status(201).send({message: "Request Is accepted by the receiving member. If you want to undo request Please go to chat box & delete member."});
        }
    
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});