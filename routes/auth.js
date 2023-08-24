const express = require('express');
const router = express.Router();

// create a user using: POST "/api/auth". Doesn't require auth 

router.get('/',(req,res)=>{


    
    console.log(req.body);

});


module.exports = router;