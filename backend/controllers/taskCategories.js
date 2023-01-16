const express = require('express');
const router = express.Router();
const userAuth = require("../middelware/userAuth");


const User = require('../models/userSchema');
const Categories = require('../models/newCategory');


module.exports = router.post('/alltaskCategories', userAuth, async(req, res)=>{
    const {name} = req.body;
    console.log(req.userID)
    const categoriesExist = await Categories.findOne({ userRef: req.userID });

    try {
        
        if(categoriesExist){

            categoriesExist.allCatogries.push({
                category: name,
            })

            await categoriesExist.save();

            res.status(201).send({message: "Category added successfully"});

        }
        else{
            const data = new Categories({  
                userRef: req.userID,
                allCatogries: [{
                    category: name
                }]
            });
 
            await data.save();

            res.status(201).send({message: "Category added successfully"});
        }

    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});



module.exports = router.post('/deletingCategory', userAuth, async(req, res)=>{
    const catId = req.body.catId;

    try {

        const updateCategories = await Categories.updateOne(
            { userRef: req.userID},
            {$pull: {
                "allCatogries": {"_id": catId}
            }});

        const getCategories = await Categories.findOne({ userRef: req.userID });
        const allCatogries = getCategories.allCatogries


        res.status(201).send(allCatogries);
        
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});



module.exports = router.get('/showCategories', userAuth, async(req, res)=>{
    const getCategories = await Categories.findOne({ userRef: req.userID });
    try {
        if(getCategories){
            const allCatogries = getCategories.allCatogries
            res.status(201).send(allCatogries);
        }
        else{
            res.status(201).send([]);
        }
        
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});