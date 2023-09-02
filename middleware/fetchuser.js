const jwt = require('jsonwebtoken');
const JWT_SECRET_SIGN = "abc";

//middleware function to authenticate user 
const fetchuser = (req,res,next) =>{
    // Get the user from the jwt token and add id to req object 
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error : {
            "error": "Unauthorized",
            "message": "You are not authorized to access this resource. Please log in or sign up to access this feature."
          }});
    }
    try{

        const data = jwt.verify(token,JWT_SECRET_SIGN);
        req.user = data.user;
        next();
    }
    catch(error){
        res.status(401).send({error : {
            "error": "Unauthorized",
            "message": "You are not authorized to access this resource. Please log in or sign up to access this feature."
          }});

    }

}

module.exports = fetchuser;