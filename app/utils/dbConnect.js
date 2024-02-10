const mongoose = require('mongoose');
const dbConfig = require('../config/dbConfig')
const dbConnect = () => {
    mongoose.connect(dbConfig.getConnectionString())
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('MongoDB connection error:', error));

}

module.exports = dbConnect;