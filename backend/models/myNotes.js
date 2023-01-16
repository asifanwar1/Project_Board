const mongoose = require('mongoose');

const myNotes = new mongoose.Schema({
    userRef: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    noteTitle: { 
        type : String,
        required: true
    },
    noteText: {
        type : String,
        required: true
    },
    noteDate: {
        type : Date,
        required: true
    },
      
    
})


const MyNotes = mongoose.model('MYNOTES', myNotes);

module.exports = MyNotes;


