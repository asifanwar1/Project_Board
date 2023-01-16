const mongoose = require('mongoose');

const addTask = new mongoose.Schema({
    userRef: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    allTasks: [
        {
            task: { 
                type : String,
                required: true
            },
            category: {
                type : String,
                required: true
            },
            date: {
                type : Date,
                required: true
            },
            taskStatus: {
                type : String,
                default: "Pending"
            }
        } 
    ],    
    
})


const AddTask = mongoose.model('ADDTASK', addTask);

module.exports = AddTask;


