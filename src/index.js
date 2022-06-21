import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());



app.get("/", (_, res) => {

    res.status(200).send('teste');
});

app.post("/participants", (req, res) => {
    
});


app.get("/participants", (req, res) => {
    
});


app.post("/messages", (req, res) => {
    
});

app.get("/messages", (req, res) => {
    
});

app.post("/status", (req, res) => {
    
});



app.listen(5000); 