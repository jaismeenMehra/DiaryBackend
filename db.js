const mongoose = require('mongoose');
const mongoURI = "mongodb://0.0.0.0:27017/Diary";




const connectToMongo =  async ()=>{
try{

    await mongoose.connect(mongoURI);
    console.log("connected to mongo sucessfully");
}
catch(error){
    console.log(error);
    process.exit();
}
}

module.exports = connectToMongo;