const express = require('express');
const User = require('../models/User');
const router = express.Router();


// create a user using: POST "/api/auth". Doesn't require auth 

router.get('/',(req,res)=>{

    const user = User(req.body);
    user.save();
    res.send(req.body);
    console.log(req.body);

});


module.exports = router;