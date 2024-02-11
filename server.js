import express from 'express';
import dbConnect from './app/utils/dbConnect.js';
import router from './app/config/routes.js';

const app = express();
app.use(express.json());
const port = process.env.PORT || 8000;

app.get('/ping', (req, res) => {
    res.send("I am Live");
});
app.use(router);

dbConnect();

app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});
