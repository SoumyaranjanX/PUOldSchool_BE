const express = require('express')

const importRoutes = require('./app/utils/importRoutes');
const dbConnect = require('./app/utils/dbConnect');

const app = express();
app.use(express.json());
const port = process.env.PORT || 8000;

importRoutes(app);
app.get('/ping', (req, res)=>{
    res.send("I am Live");
})

dbConnect();

app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`)
})