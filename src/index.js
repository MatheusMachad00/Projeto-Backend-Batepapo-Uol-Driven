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

app.get("/participants", async (_, res) => {
	try {
		await mongoClient.connect();
		const db = mongoClient.db("chat_uol");

		const participants = await db.collection("participants").find({}).toArray();
		res.send(participants);
		mongoClient.close();
	} catch (error) {
		res.status(500).send(error);
		mongoClient.close();
	}
});

app.post("/participants", async (req, res) => {

	try {
		await mongoClient.connect();
		const db = mongoClient.db("chat_uol");

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

		await db.collection("messages").insertOne({
			from: name,
			to: "Todos",
			text: "entra na sala...",
			type: "status",
			time: dayjs().locale("pt-br").format("HH:mm:ss"),
		});

		res.sendStatus(201);
		mongoClient.close();

	} catch (error) {
		res.status(500).send(error);
		console.error(error);
		mongoClient.close();
	}

});

app.get("/messages", async (_, res) => {
	try {
		await mongoClient.connect();
		const db = mongoClient.db("chat_uol");

		const messages = await db.collection("messages").find({}).toArray();
		res.send(messages);
		mongoClient.close();

	} catch (error) {
		res.status(500).send(error);
		mongoClient.close();
	}
});

app.post("/messages", async (req, res) => {
	try {
		await mongoClient.connect();
		const db = mongoClient.db("chat_uol");

		const { to, text, type } = req.body;
		const user = req.headers.user; //headers = object | header = function

		const msgSchema = joi.object({
			to: joi.string().min(1).required(),
			text: joi.string().min(1).required(),
			type: joi.required().valid("message", "private_message")
		});

		const msgValidation = msgSchema.validate(req.body);

		const userValidation = await db.collection("participants").findOne({ name: user });

		if (!userValidation) {
			res.sendStatus(422);
			mongoClient.close();
			return;
		}

		if (msgValidation.error) {
			res.sendStatus(422);
			mongoClient.close();
			return;
		}

		await db.collection("messages").insertOne({
			from: user,
			to: to,
			text: text,
			type: type,
			time: dayjs().locale("pt-br").format("HH:mm:ss"),
		});

		res.sendStatus(201);
		mongoClient.close();

	} catch (error) {
		res.status(500).send(error);
		mongoClient.close();
	}

});

app.post("/status", async (req, res) => {

	try {
		await mongoClient.connect();
		const db = mongoClient.db("chat_uol");

		const user = req.headers.user;

		mongoClient.close();
	} catch (error) {
		
		mongoClient.close();
	}
});



app.listen(5000); 