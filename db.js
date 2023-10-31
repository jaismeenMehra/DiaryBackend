const mongoose = require('mongoose');
// connection string to connect to "Diary database"
const mongoURI = "mongodb://0.0.0.0:27017/Diary";



// function to connect to database
const connectToMongo =  async ()=>{
try{
    // .connect function does not support callbacks now
    await mongoose.connect(mongoURI);
    console.log("connected to mongo sucessfully");
}
catch(error){
    console.log(error);
    process.exit();
}
}

module.exports = connectToMongo;