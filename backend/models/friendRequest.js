const mongoose = require('mongoose');

const friendRequest = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isAccepted: {
        type: Boolean, 
        default: false,
    },
        
}, {timestamps: true})

const FriendRequest = mongoose.model('FriendRequest', friendRequest);

module.exports = FriendRequest;