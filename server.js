import express from 'express';
import dbConnect from './app/utils/dbConnect.js';
import router from './app/config/routes.js';
import dotenv from "dotenv";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

dotenv.config({
    path: './.env'
})

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser())
const port = process.env.PORT || 8000;

app.get('/ping', (req, res) => {
    res.send("I am Live");
});
app.use("/api/v1", router);

dbConnect();




app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});
