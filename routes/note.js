const express = require('express');
const router = express.Router();
const Note = require('../models/DiaryPageSchema');
const fetchuser = require('../middleware/fetchuser');
const {body, validationResult} = require('express-validator');

// ROUTE 1 : Get all note using: GET "/api/note/fetchallnote". Login required
router.get('/fetchallnotes',fetchuser,async (req,res)=>{

try{    // as middleware is used req.user will have user 
   const Note = await Note.find({user:req.user.id})
    res.json(Note);
}
catch(error){
    console.error(error.message);
    res.status(500).send("It's not you , It's us \n Server Error.");
}
});


// ROUTE 2 : Add a new note using: POST "/api/note/addnote". Login required
router.post('/addnote',fetchuser,[
    body('title','Enter a valid string').isLength({min: 4}),
    body('description','Enter a valid description').isLength({min:5})
],async (req,res)=>{
    try{

        // checking for validation errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const {title, description, tag} = req.body;
        // Checking if  same note already exists
        // const existingNote = await Note.findOne({description});
        // if(!existingNote){
        //     return res.status(400).json({errors: [{msg:'You already have note with the same description'}]})
        // }


        const newNote = new Note({
            title, description, tag, user: req.user.id
        })
        
        // returns saved note
        const savedNote = await newNote.save();
        res.json(newNote);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("It's not you , It's us \n Server Error.");
    }
   
});


// ROUTE 3 : update an existing note using: PATCH "/api/note/updatenote". Login required
// for updation put/patch request is used but we can also use post 
router.patch('/updatenote/:id',fetchuser,[
    body('title','Enter a valid string').isLength({min: 4}),
    body('description','Enter a valid description').isLength({min:10})
], async (req,res)=>{
    try {
        const {title,description,tag}=req.body;
        // creating a newNote object
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        // Finding the note to be updated and updating it
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Access Denied");
        }

        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({note});

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("It's not you , It's us \n Server Error.");
        
    }

});


// ROUTE 4 : deleting an existing note using: DELETE "/api/Note/deletenote". Login required
router.delete('/deletenote/:id',fetchuser, async(req, res)=>{
        try {

            
            
        } catch (error) {
            console.error(error.message);
            res.status(500).send("It's not you , It's us \n Server Error.");
        }

    }
)

module.exports = router;