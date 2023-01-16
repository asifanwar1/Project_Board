const express = require('express');
const router = express.Router();
const userAuth = require("../middelware/userAuth");


const User = require('../models/userSchema');
const Message = require('../models/message');
const Chat = require('../models/chatSchema'); 


module.exports = router.post('/getAllMsgs', userAuth, async(req, res)=>{
    const selectedId = req.body.selectedId;
    const getChat = await Chat.findOne({ users: {$all: [selectedId, req.userID] } });
    const getMessages = await Message.find({ ChatId: getChat._id });

    try {
 
        res.status(201).send({getAllMessages: getMessages, chatExist: getChat});

    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    } 
});



module.exports = router.post('/getAllGroupMsgs', userAuth, async(req, res)=>{
    const selectedId = req.body.selectedId;
    const getChat = await Chat.findOne({ _id: selectedId });
    const getMessages = await Message.find({ ChatId: getChat._id });

    try {
 
        res.status(201).send({getAllMessages: getMessages, chatExist: getChat});

    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    } 
});



module.exports = router.post('/sendingGroupMsg', userAuth, async(req, res)=>{
    const {selectedId, txtInput} = req.body;
    console.log(selectedId)
    const getChat = await Chat.findOne({ _id: selectedId});
    try {    
        const newMessage = new Message({   
            sender: req.userID,
            ChatId: getChat._id,
            message: txtInput,
        });

        await newMessage.save();
       
        res.status(201).send({newMessage, getChat});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});


module.exports = router.post('/sendingMsg', userAuth, async(req, res)=>{
    const {selectedId, txtInput} = req.body;
    const getChat = await Chat.findOne({ users:{ $all: [selectedId, req.userID] }});
    try {    
        const newMessage = new Message({   
            sender: req.userID,
            ChatId: getChat._id,
            message: txtInput,
        });

        await newMessage.save();
       
        res.status(201).send({newMessage, getChat});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});


module.exports = router.get('/allGroupChats', userAuth, async(req, res)=>{
    // const findChats = await Chat.find({ users : req.userID , isGroupChat: true});
    const findChats = await Chat.find({ users:{ $all: [req.userID]} , isGroupChat: true});
    try {

        res.status(201).send(findChats);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});

