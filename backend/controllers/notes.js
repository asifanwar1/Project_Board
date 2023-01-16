const express = require('express');
const router = express.Router();
const userAuth = require("../middelware/userAuth");

const User = require('../models/userSchema');
const MyNotes = require('../models/myNotes');


module.exports = router.post('/addNewnote', userAuth, async(req, res)=>{
    const myNoteTitle = req.body.noteTitle;
    const myNoteText = req.body.noteText;

    try {
        const data = new MyNotes({  
            userRef: req.userID,
            noteTitle: myNoteTitle,
            noteText: myNoteText,
            noteDate: Date.now(),
        });

        await data.save();

        res.status(201).send({message: "Note created"});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }

});



module.exports = router.get('/getallNotes', userAuth, async(req, res)=>{
    const findNotes = await MyNotes.find({ userRef: req.userID });
    try {
        res.status(201).send(findNotes);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});




module.exports = router.post('/updateCurrentNote', userAuth, async(req, res)=>{
    const myNoteTitle = req.body.noteTitle;
    const myNoteText = req.body.noteText;
    const myNoteId = req.body.noteId;

    try {
        const findNote = await MyNotes.updateOne({ _id: myNoteId },{
            $set: {
                "userRef": req.userID,
                "noteTitle": myNoteTitle,
                "noteText": myNoteText,
                "noteDate": Date.now(),
            }
        });
        

        res.status(201).send({message: "Note Updated"});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }

});



module.exports = router.post('/deleteCurrentNote', userAuth, async(req, res)=>{
    const noteId = req.body.noteId;

    const deleteSelectedNote = await MyNotes.deleteOne({ _id: noteId });
    try {
        res.status(201).send({message: "Note deleted"});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});