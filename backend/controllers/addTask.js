const express = require('express');
const router = express.Router();
const userAuth = require("../middelware/userAuth");


const User = require('../models/userSchema');
const AddTask = require('../models/addTask');


module.exports = router.post('/addNewTask', userAuth, async(req, res)=>{
    const {task, date, category } = req.body;
    const userExist = await AddTask.findOne({ userRef: req.userID });
    try {

        if(userExist){

            userExist.allTasks.push({
                task: task,
                category: category,
                date: new Date(date)
            })

            await userExist.save();

            res.status(201).send({message: "Task added successfully"});
        }
        else{
            const data = new AddTask({  
                userRef: req.userID,
                allTasks: [{
                    task: task,
                    category: category,
                    date: new Date(date)
                }]
            });
 
            await data.save();

            res.status(201).send({message: "Task added successfully"});
        }

    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});

module.exports = router.get('/showTasks', userAuth, async(req, res)=>{
    const findTasks = await AddTask.findOne({ userRef: req.userID });
    
    try {
        if(findTasks){
            let allTasks = findTasks.allTasks;
            res.status(201).send(allTasks);
        }
        else{
            res.status(201).send([]);
        }
        
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});


module.exports = router.post('/updatingTask', userAuth, async(req, res)=>{
    const {task, date, category, id} = req.body;

    try {
            await AddTask.updateOne(
            { userRef: req.userID, "allTasks._id": id },
            {$set: {
                "allTasks.$.task": task,
                "allTasks.$.category": category,
                "allTasks.$.date": new Date(date),
            }});

            res.status(201).send({message: "Task updated successfully"});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }

});





module.exports = router.post('/deletingselectedTask', userAuth, async(req, res)=>{
    const taskId = req.body.taskId;
    const findTasks = await AddTask.findOne({ userRef : req.userID  });

    try {
        if(findTasks){
            console.log(findTasks)
            let pullSelectedTask = findTasks.allTasks.filter(element1 => element1._id.toString() === taskId);
            console.log(pullSelectedTask)
            findTasks.allTasks = pullSelectedTask;
            await findTasks.save();
            res.status(201).send({message: "Task Deleted"});
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }

});