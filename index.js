const connectToMongo = require('./db');
const express = require('express')

connectToMongo();

const app = express()
const port = 5000

app.use(express.json());

// Avalibale Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/note',require('./routes/note'));



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

