const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    users: [{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    isGroupChat: { 
        type: Boolean,
        default: false
    },
    groupName:{
        type: String,
    },
    projectRef: { 
        type : mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },
    groupAdmin: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    
    
}, {timestamps: true},)


const Chat = mongoose.model('CHAT', chatSchema);

module.exports = Chat;


