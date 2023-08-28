const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


// create a user using: POST "/api/auth/createuser". Login not required 

router.post('/createuser',[
    // body('name').isLength({min:5}),
    // body('email').isEmail(),
    // body('password').isLength({min:8}),
    // to add custom msg for validation
    body('name','Enter a valid name').isLength({min:5}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password is not strong, atleast it should have 8 characters').isLength({min:8}),

], async (req,res)=>{

    const errors = validationResult(req);
    // const JWT_SECRET_SIGN =  process.env.AUTHENTICATION_SECRET_KEY; this is not working needs to be debug leaving for now
    const JWT_SECRET_SIGN =  "abc";
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

        // generating salt
        const salt = await bcrypt.genSalt(8);

        // hashing the password
        const hashedPassword = await bcrypt.hash(password,salt);
        
        // If email is unique, create the new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        
        const data ={
            user:{
                id: newUser.id,
            }
        }
        
        // console.log('JWT_SECRET_SIGN:', JWT_SECRET_SIGN);
        
        const authToken = jwt.sign(data, JWT_SECRET_SIGN);
        // const authToken = jwt.sign(Payload data, secret key);

        // console.log(authToken);
        
        await newUser.save();
        res.json({authToken:authToken});


        // res.json(newUser);  Sending the created user as response
    }
    

    catch(error){
        console.error(error.message);
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