require("dotenv").config();
const mongoose = require('mongoose')


mongoose.connect(process.env.DB_MONGO, { useNewUrlParser: true})


mongoose.connection.on('error', error=>{
    console.log(error)
})

// importar los modelos 
require('../models/Users');
require('../models/Jobs');