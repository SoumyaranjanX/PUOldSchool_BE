require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose');

const importRoutes = require('./app/utils/importRoutes');

const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}`;

// Connect to MongoDB
mongoose.connect(connectionString)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('MongoDB connection error:', error));

const app = express();
const port = 8000;

importRoutes(app);
app.get('/ping', (req, res)=>{
    res.send("I am Live");
})


app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`)
})