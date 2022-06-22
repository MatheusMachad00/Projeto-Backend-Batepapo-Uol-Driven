import express from 'express';
import cors from 'cors';
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.URL_MONGO);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("chat_uol");
});

app.get("/participants", (_, res) => {
	db.collection("participants").find().toArray().then(participants => {
		res.send(participants);
	});
});

app.post("/participants", (req, res) => {
	db.collection("participants").insertOne(req.body).then(() => {
		res.sendStatus(201);
	});
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