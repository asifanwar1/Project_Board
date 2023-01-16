const mongoose = require('mongoose');

const projectNotification = new mongoose.Schema({
    projectRef: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
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
    memberImage: {
        type : String,
        required: true
    },
    uniqueId: {
        type : String,
        required: true
    }, 
    notificationDate: {
        type : Date,
        required: true
    },     
    
})


const ProjectNotification = mongoose.model('PROJECTNOTIFICATION', projectNotification);

module.exports = ProjectNotification;


