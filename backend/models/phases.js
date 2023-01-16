const mongoose = require('mongoose');

const phases = new mongoose.Schema({
    projectRef: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    allPhases: [
        {
            phaseId: { 
                type : String,
                required: true
            },
            phaseNum: {
                type : String,
                required: true
            },
            phaseTitle: {
                type : String,
                required: true
            },
            memberRef: {
                type : mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            memberName: {
                type : String,
                required: true
            },
            uniqueId: {
                type : String,
                required: true
            },
        } 
    ],    
    
})


const Phases = mongoose.model('PHASES', phases);

module.exports = Phases;


