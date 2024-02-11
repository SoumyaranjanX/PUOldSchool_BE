import mongoose from 'mongoose';
import dbConfig from '../config/dbConfig.js';

const dbConnect = () => {
    mongoose.connect(dbConfig.getConnectionString())
        .then(() => console.log('Connected to MongoDB'))
        .catch(error => console.error('MongoDB connection error:', error));
};

export default dbConnect;
