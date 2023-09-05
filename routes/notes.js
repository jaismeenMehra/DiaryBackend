const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');
const {body, validationResult} = require('express-validator');

// ROUTE 1 : Get all notes using: GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes',fetchuser,async (req,res)=>{

try{    // as middleware is used req.user will have user 
   const notes = await Notes.find({user:req.user.id})
    res.json(notes);
}
catch(error){
    console.error(error.message);
    res.status(500).send("It's not you , It's us \n Server Error.");
}
});


// ROUTE 2 : Add a new note using: POST "/api/notes/addnote". Login required
router.post('/addnote',fetchuser,[
    body('title','Enter a valid string').isLength({min: 4}),
    body('description','Enter a valid description').isLength({min:10})
],async (req,res)=>{
    try{

        // checking for validation errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const {title, description, tag} = req.body;
        const newNote = new Notes({
            title, description, tag, user: req.user.id
        })
        
        const savedNote = await newNote.save();
        res.json(newNote);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("It's not you , It's us \n Server Error.");
    }
   
});


module.exports = router;