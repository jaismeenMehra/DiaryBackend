const mongoose = require('mongoose');
console.log('Mongoose version:', mongoose.version);
// not supporteds in mongoose v7
// const connectToMongo =  ()=>{
//     mongoose.connect(mongoURI,()=>{
//         console.log("connected to mongo successfully")
//     })
// }