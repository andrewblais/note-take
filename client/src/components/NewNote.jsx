// Component for creating a new note, joke, or quote using optional animations and icons

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

//  Component `NewNote`:
function NewNote(newNoteProps) {
    const serverHost = import.meta.env.VITE_SERVER_HOST;
    const serverPort = import.meta.env.VITE_SERVER_PORT;

    // Note object and animation state:
    const [newNoteObject, setNewNoteObject] = useState({
        title: "",
        date: "",
        content: "",
    });
    const [zoomIn, setZoomIn] = useState(false);

    // Handle input updates for title and content:
    function handleNewNoteInput(event) {
        const { value, name } = event.target;
        setNewNoteObject((prevValue) => ({ ...prevValue, [name]: value }));
        console.log(newNoteObject);
    }

    // Show buttons and input fields based on content and blur/focus state:
    function onInputBlur(event) {
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

    // Fetch joke from server, create note, and reset input state:
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

    // Fetch quote from server, create note, and reset input state:
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
                {/* Zooming form container with title and content fields: */}
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
                        {/* Save user-typed note: */}
                        <Fab
                            className="add-button button-right"
                            onClick={(event) => {
                                newNoteProps.onAddNewNote(event, {
                                    ...newNoteObject,
                                    date: formatDate("abbr"),
                                });
                                setNewNoteObject({ title: "", content: "" }), setZoomIn(false);
                            }}>
                            <Tooltip title="Save Typed Note">
                                <AddIcon />
                            </Tooltip>
                        </Fab>
                    </Zoom>
                    <Zoom in={zoomIn} timeout={{ enter: 500, exit: 1 }}>
                        {/* Save note populated with a joke: */}
                        <Fab className="add-button button-left" onClick={handleJokeNote}>
                            <Tooltip title="Save Joke Note">
                                <FontAwesomeIcon icon={faFaceSmileWink} fontSize="1.25rem" />
                            </Tooltip>
                        </Fab>
                    </Zoom>
                    <Zoom in={zoomIn} timeout={{ enter: 500, exit: 1 }}>
                        {/* Save note populated with a quote: */}
                        <Fab className="add-button button-middle" onClick={handleQuoteNote}>
                            <Tooltip title="Save Quote Note">
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
