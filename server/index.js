// Import necessary libraries for the server:
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import pg from "pg";

import formatDate from "./utils/formatDate.js";

// cd /g/nowGitRepos/note-take 

// Load env variables:
config();

// Create Express instance:
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Specify ports:
const serverPort = process.env.SERVER_PORT;
const serverHost = process.env.SERVER_HOST;
const clientHost = process.env.CLIENT_HOST;
const clientPort = process.env.CLIENT_PORT;

// External API data:
const jokeAPI = process.env.JOKE_API;
const quoteToken = process.env.FAVQS_TOKEN;
const quoteURL = process.env.FAVQS_URL;

// Enable CORS for all routes:
app.use(
    cors({
        origin: `${clientHost}:${clientPort}`,
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
        const dbQuery = await db.query("SELECT * from note_take ORDER by id DESC");
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
        const allNotes = await db.query("SELECT * from note_take ORDER by id DESC");
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
        const allNotes = await db.query("SELECT * from note_take ORDER by id DESC");
        res.json(allNotes.rows);
        // res.status(200).json({ message: "Note deleted from DB." });
    } catch (error) {
        console.error("DELETE '/delete/:id' error:", error);
        res.status(500).send("Server error, delete unsuccessful.");
    }
});

// Route to delete all notes:
app.delete("/delete-all", async (req, res) => {
    try {
        await db.query("DELETE FROM note_take");
        console.log(`Deleted all notes!`);
        await db.query("SELECT * from note_take ORDER by id DESC");
        res.status(200).json({ message: "All notes deleted from DB." });
    } catch (error) {
        console.error("DELETE '/delete-all' error:", error);
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
        const allNotes = await db.query("SELECT * from note_take ORDER by id DESC");
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
        const response = await axios.get(`${jokeAPI}`, {
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

// Route to get a quote:
app.get("/quote", async (req, res) => {
    try {
        const MAX_ATTEMPTS = 5;
        let attempts = 0;
        let quoteData = null;

        while (attempts < MAX_ATTEMPTS) {
            attempts++;
            try {
                const response = await axios.get(quoteURL, {
                    headers: {
                        Authorization: `Token token="${quoteToken}"`,
                    },
                });
                if (response.status !== 200) {
                    console.log(
                        `Quote request attempt ${attempts}: Bad status code ${response.status}`
                    );
                    continue;
                }
                const { body, author, favorites_count, upvotes_count, downvotes_count } =
                    response.data.quote;

                if (!body || !author) {
                    console.log(`Quote request attempt ${attempts}: No title or author.`);
                    continue;
                }
                if ((favorites_count < 2 && upvotes_count < 2) || downvotes_count > 2) {
                    console.log(`Attempt ${attempts}: Quote doesn't meet criteria.`);
                    continue;
                }
                quoteData = response.data;
                console.log("Successfully requested and served quote.");
                break;
            } catch (error) {
                console.error(
                    `Unsuccessful quote request after ${attempts} attempts:`,
                    error.message
                );
                continue;
            }
        }
        if (quoteData) {
            console.log(`Successful quote request after ${attempts} attempt(s)!`);
            res.json(quoteData);
        } else {
            console.log(`Sending fallback note after ${MAX_ATTEMPTS} tries.`);
            res.json({
                quote: { body: "No quote available at the moment", author: "Anonymous" },
            });
        }
    } catch (error) {
        console.error("Quote request failed!", error);
        res.status(500).send("Error requesting quote :(");
    }
});

// Lissten for incoming connections, make server accessible:
app.listen(serverPort, () => console.log(`Server running on ${serverHost}:${serverPort}`));
