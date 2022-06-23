import express from 'express';
import cors from 'cors';
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import dayjs from "dayjs";
import joi from "joi";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.URL_MONGO);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("chat_uol");
});

app.get("/participants", async (_, res) => {

	try {
		const participants = await db.collection("participants").find({}).toArray();
		res.send(participants);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post("/participants", async (req, res) => {

	try {
		const { name } = req.body;

		const userSchema = joi.object({
			name: joi.string().min(1).required(),
		});

		const nameValidation = userSchema.validate(req.body);
		if (nameValidation.error) {
			res.sendStatus(422);
			return;
		}

		const nameDuplicated = await db.collection("participants").findOne({ name: name });
		if (nameDuplicated) {
			res.sendStatus(409);
			return;
		}

		await db.collection("participants").insertOne({
			name,
			lastStatus: Date.now(),
		})

		/* await database.collection("messages").insertOne({
			from: name,
			to: "Todos",
			text: "entra na sala...",
			type: "status",
			time: dayjs().locale("pt-br").format("HH:mm:ss"),
		}); */

		res.sendStatus(201);

	} catch (error) {
		res.status(500).send(error);
	}



});

app.get("/messages", async (_, res) => {

	try {
		const messages = await db.collection("messages").find({}).toArray();
		res.send(messages);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post("/messages", (req, res) => {



	db.collection("messages").insertOne(req.body).then(() => {
		res.sendStatus(201);
	});
});

app.post("/status", (req, res) => {

});



app.listen(5000); 