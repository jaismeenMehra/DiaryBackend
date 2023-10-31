const express = require('express');
const User = require('../models/User');
const dotenv = require('dotenv').config()
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const fetchuser  = require('../middleware/fetchuser');

// secret signature
const JWT_SECRET_SIGN =  "abc";

//  ROUTE 1 : create a user using: POST "/api/auth/signup". Login not required 
router.post('/signup',[
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
    // console.log('JWT_SECRET_SIGN:', JWT_SECRET_SIGN);
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
        
        
        const authToken = jwt.sign(data, JWT_SECRET_SIGN);
        // const authToken = jwt.sign(Payload data, secret key);

        // console.log(authToken);
        
        await newUser.save();
        res.json({authToken:authToken});


        // res.json(newUser);  Sending the created user as response
    }
    

    catch(error){
        console.error(error.message);
        res.status(500).send("It's not you , It's us \n Server Error.");

    }


    // res.send(req.body);
    // User.create({
    //     name: req.body.name,
    //     password: req.body.password,
    //     email: req.body.email,
    //     }).then(user => res.json(user));

});


// ROUTE 2 : Authenticate a user using: POST "/api/auth/login". Login not required
router.post('/login',

[body('email','Enter a valid email').isEmail(),
body('password','Password can not be blank').exists()],

async (req,res) =>{
    // checking for validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email, password} = req.body;

    try{
        // Checking if  user exists
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({errors: [{msg:'Please try to login with correct credentials. If not registered then sign up to access the platform \'s features.'}]})
        }


        // Compairing eneterd password with the user's actual password
        const passwordCompare = await bcrypt.compare(password,existingUser.password);
        if(!passwordCompare){
            return res.status(400).json({error: "Please try to login with correct credentials"})
        }

        const data = {
            user:{
                id: existingUser.id,
            }
        }

        const authToken = jwt.sign(data,JWT_SECRET_SIGN);
        res.json({authToken});


    }
    catch(error){
        console.error(error.message);
        res.status(500).send("It's not you , It's us \n Server Error.")

    }


});


// ROUTE 3 : Get loggedin user details using: POST "/api/auth/userdetails". Login required

router.post('/userdetails', fetchuser,async (req,res)=>{

    try {
        const userId = req.user.id;
        // we can not select and send password of user that is why - password
        const loggedinUser = await User.findById(userId).select("-password");
        res.json(loggedinUser);

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("It's not you , It's us \n Server Error.")
    }

} )


module.exports = router; 

// NOTE: custom validator can also be created