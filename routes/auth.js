const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();


// create a user using: POST "/api/auth". Doesn't require auth 

router.post('/',[
    // body('name').isLength({min:5}),
    // body('email').isEmail(),
    // body('password').isLength({min:8}),
    // to add custom msg for validation
    body('name','Enter a valid name').isLength({min:5}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password is not strong, atleast it should have 8 characters').isLength({min:8}),

], async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }


    const {name, email, password} = req.body;
    try{

        // Checking if a user with the same email already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({errors: [{msg:'Email already registered'}]})
        }

        // If email is unique, create the new user
        const newUser = new User({
            name,
            email,
            password,
        });

        await newUser.save();
        res.json(newUser); // Sending the created user as response
    }
    

    catch(error){
        console.error(err.message);
        res.status(500).send('Server Error');

    }

    // res.send(req.body);

    // User.create({
    //     name: req.body.name,
    //     password: req.body.password,
    //     email: req.body.email,
    //     }).then(user => res.json(user));

});


module.exports = router; 

// NOTE: custom validator can also be created