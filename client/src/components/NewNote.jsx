// NewNote.jsx
import axios from "axios";
import { useState } from "react";
import formatDate from "./formatDate";

import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmileWink } from "@fortawesome/free-regular-svg-icons";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

function NewNote(newNoteProps) {
    const serverHost = import.meta.env.VITE_SERVER_HOST;
    const serverPort = import.meta.env.VITE_SERVER_PORT;

    const [newNoteObject, setNewNoteObject] = useState({
        title: "",
        date: "",
        content: "",
    });

    const [zoomIn, setZoomIn] = useState(false);

    function handleNewNoteInput(event) {
        const { value, name } = event.target;
        setNewNoteObject((prevValue) => ({ ...prevValue, [name]: value }));
    }

    function onInputBlur(event) {
        // See which field is active:
        if (newNoteObject.title.trim() || newNoteObject.content.trim()) {
            setZoomIn(true);
        } else if (
            !event.relatedTarget ||
            !["note-title", "note-content", "add-button"].some((cls) =>
                event.relatedTarget.className.includes(cls)
            )
        ) {
            setZoomIn(false);
        }
    }

    async function handleJokeNote() {
        try {
            const response = await axios.get(`${serverHost}:${serverPort}/joke`);
            const jokeContent = response.data.joke;
            const jokeTitle = jokeContent.split(" ").slice(0, 3).join(" ");
            const jokeNote = {
                title: `${jokeTitle}...`,
                content: jokeContent,
                date: formatDate("abbr"),
            };

            const addResponse = await axios.post(`${serverHost}:${serverPort}/add`, jokeNote);
            newNoteProps.setCurrentNotes(addResponse.data);
            setNewNoteObject({ title: "", content: "" });
            setZoomIn(false);
        } catch (error) {
            console.error("Error getting or database-izing joke:", error);
        }
    }

    async function handleQuoteNote() {
        try {
            const quoteResponse = await axios.get(`${serverHost}:${serverPort}/quote`);
            const quoteContent = quoteResponse.data.quote.body;
            const quoteTitle = quoteResponse.data.quote.author;
            const quoteNote = {
                title: `${quoteTitle}...`,
                content: quoteContent,
                date: formatDate("abbr"),
            };

            const addResponse = await axios.post(`${serverHost}:${serverPort}/add`, quoteNote);
            newNoteProps.setCurrentNotes(addResponse.data);
            setNewNoteObject({ title: "", content: "" });
            setZoomIn(false);
        } catch (error) {
            console.error("Error getting or database-izing joke:", error);
        }
    }

    return (
        <>
            <div
                className="note"
                style={{
                    height: zoomIn ? "17rem" : "4rem",
                    overflowY: zoomIn ? "auto" : "hidden",
                }}>
                <form>
                    {zoomIn && (
                        <div className="note-title-date">
                            <input
                                type="text"
                                className="note-title"
                                name="title"
                                placeholder="Note Title"
                                value={newNoteObject.title}
                                onChange={handleNewNoteInput}
                                onFocus={() => setZoomIn(true)}
                                onBlur={onInputBlur}></input>
                        </div>
                    )}
                    <textarea
                        className="note-content"
                        name="content"
                        placeholder={
                            zoomIn
                                ? "Type note text and click + button."
                                : "Click here to add new note."
                        }
                        rows={zoomIn ? 3 : 1}
                        value={newNoteObject.content}
                        onChange={handleNewNoteInput}
                        onFocus={() => setZoomIn(true)}
                        onBlur={onInputBlur}
                    />
                    <Zoom in={zoomIn} timeout={{ enter: 500, exit: 1 }}>
                        <Fab
                            className="add-button button-right"
                            onClick={(event) => {
                                newNoteProps.onAddNewNote(event, {
                                    ...newNoteObject,
                                    date: formatDate("abbr"),
                                });
                                setNewNoteObject({ title: "", content: "" }), setZoomIn(false);
                            }}>
                            <Tooltip title="Save Note">
                                <AddIcon />
                            </Tooltip>
                        </Fab>
                    </Zoom>
                    <Zoom in={zoomIn} timeout={{ enter: 500, exit: 1 }}>
                        <Fab className="add-button button-left" onClick={handleJokeNote}>
                            <Tooltip title="Save icanhazdadjoke.com Joke">
                                <FontAwesomeIcon icon={faFaceSmileWink} fontSize="1.25rem" />
                            </Tooltip>
                        </Fab>
                    </Zoom>
                    <Zoom in={zoomIn} timeout={{ enter: 500, exit: 1 }}>
                        <Fab className="add-button button-middle" onClick={handleQuoteNote}>
                            <Tooltip title="Save favqs.com Quote">
                                <FontAwesomeIcon icon={faQuoteLeft} fontSize="1.25rem" />
                            </Tooltip>
                        </Fab>
                    </Zoom>
                </form>
            </div>
        </>
    );
}

export default NewNote;
