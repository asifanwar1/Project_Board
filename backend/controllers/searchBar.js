const express = require('express');
const router = express.Router();
const userAuth = require("../middelware/userAuth");


const User = require('../models/userSchema');


module.exports = router.post('/searchBar', userAuth, async(req, res)=>{
    const searchInput = req.body.searchInput;
    
    const findUsers = await User.find({ $text: {$search: searchInput} });
  
    try {
        if(findUsers){
            res.status(201).send(findUsers);
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});