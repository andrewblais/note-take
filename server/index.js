// Import necessary libraries for the server:
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import pg from "pg";

import formatDate from "./utils/formatDate.js";

// cd G:/nowCoding/yu-web-dev/sec36React/AllSectionProjects/keeperApp/note-take

// Load env variables:
config();

// Create Express instance:
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Specify port:
const serverPort = process.env.SERVER_PORT;

// Enable CORS for all routes:
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
    })
);

// Configure PostgreSQL database connection.
//  Ensure pgAdmin 4 is running locally:
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect();

// // DATABASE ROUTES...
// Basic route:
app.get("/", async (req, res) => {
    try {
        const dbQuery = await db.query(
            "SELECT * from note_take ORDER by id DESC"
        );
        console.log("Successfully served notes from database.");
        res.json(dbQuery.rows); // Serve notes to frontend
    } catch (error) {
        console.error("GET '/' DB request error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to add notes:
app.post("/add", async (req, res) => {
    const { title, content, date } = req.body;
    try {
        await db.query(
            "INSERT INTO note_take (note_title, note_date, note_content) VALUES ($1, $2, $3)",
            [title.trim(), date, content.trim()]
        );
        console.log("Successfully added note to database.");
        const allNotes = await db.query(
            "SELECT * from note_take ORDER by id DESC"
        );
        res.json(allNotes.rows);
    } catch (error) {
        console.error("POST '/add' error:", error);
        res.status(500).send("Failed to add note to DB.");
    }
});

// Route to delete a note:
app.delete("/delete/:id", async (req, res) => {
    const noteID = parseInt(req.params.id);
    try {
        await db.query("DELETE FROM note_take WHERE id = ($1)", [noteID]);
        console.log(`Deleted note with ID ${noteID}.`);
        console.log("Note deleted from DB.");
        const allNotes = await db.query(
            "SELECT * from note_take ORDER by id DESC"
        );
        res.json(allNotes.rows);
        // res.status(200).json({ message: "Note deleted from DB." });
    } catch (error) {
        console.error("DELETE '/delete/:id' error:", error);
        res.status(500).send("Server error, delete unsuccessful.");
    }
});

app.put("/edit/:id", async (req, res) => {
    const noteID = parseInt(req.params.id);
    const { title, content } = req.body;
    const date = formatDate("abbr");
    try {
        await db.query(
            "UPDATE note_take SET note_title = $1, note_content = $2, note_date = $3 WHERE id = $4",
            [title.trim(), content.trim(), date, noteID]
        );
        console.log("Successfully edited/updated note in DB.");
        const allNotes = await db.query(
            "SELECT * from note_take ORDER by id DESC"
        );
        res.json(allNotes.rows);
    } catch (error) {
        console.error("PUT '/edit' error:", error);
        res.status(500).send("Failed to update note. ¯\\_(ツ)_/¯");
    }
});

// // EXTERNAL API ROUTES:
// Route to get a joke:
app.get("/joke", async (req, res) => {
    try {
        const response = await axios.get("https://icanhazdadjoke.com/", {
            headers: { Accept: "application/json" },
        });
        if (!response.status === 200) {
            res.status(response.status).send("Failed to get joke");
        }
        console.log("Successfully requested and served joke.");
        res.json(response.data);
    } catch (error) {
        console.error("Failed to make request:", error);
    }
});

// Lissten for incoming connections, make server accessible:
app.listen(serverPort, () =>
    console.log(`Server running on http://localhost:${serverPort}`)
);
