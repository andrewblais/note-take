// Component representing a single note, allowing view, edit, and delete operations.

import { useState } from "react";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";

import axios from "axios";

function OneNote(noteProps) {
    // Read environment variables for server host/port:
    const serverHost = import.meta.env.VITE_SERVER_HOST;
    const serverPort = import.meta.env.VITE_SERVER_PORT;

    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(noteProps.noteTitle);
    const [editedContent, setEditedContent] = useState(noteProps.noteContent);

    // Toggle editing mode:
    const handleEdit = () => setIsEditing(true);

    // Save edited note to backend and refresh note list:
    const handleSave = async () => {
        try {
            const updatedNote = { title: editedTitle, content: editedContent };
            await axios.put(`${serverHost}:${serverPort}/edit/${noteProps.id}`, updatedNote);
            const response = await axios.get(`${serverHost}:${serverPort}/`);
            noteProps.setCurrentNotes(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update note:", error);
            alert("Failed to add your changes.");
        }
    };

    // Cancel editing and revert changes:
    const cancelEditing = () => {
        setEditedTitle(noteProps.noteTitle);
        setEditedContent(noteProps.noteContent);
        setIsEditing(false);
    };

    return (
        <div className="note">
            {isEditing ? (
                <>
                    {/*  Editable fields for title and content: */}
                    <input
                        className="note-title"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}></input>
                    <textarea
                        className="note-content"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    />

                    {/*  Buttons for cancelling or saving changes: */}
                    <button className="button-left" onClick={cancelEditing}>
                        <Tooltip title="Cancel Edit">
                            <CloseIcon />
                        </Tooltip>
                    </button>
                    <button className="button-right" onClick={handleSave}>
                        <Tooltip title="Save Changes">
                            <SaveIcon />
                        </Tooltip>
                    </button>
                </>
            ) : (
                <>
                    {/*  Static display of title, date, and content: */}
                    <div className="note-title-date">
                        <h1 className="note-title">{noteProps.noteTitle}</h1>
                        <p className="note-date">{noteProps.noteDate}</p>
                    </div>
                    <div className="note-content">{noteProps.noteContent}</div>

                    {/*  Buttons for editing or deleting the note: */}
                    <button className="button-right" onClick={handleEdit}>
                        <Tooltip title="Edit Note">
                            <EditIcon />
                        </Tooltip>
                    </button>
                    <button
                        className="button-left"
                        onClick={() => {
                            noteProps.deleteClick(noteProps.id);
                        }}>
                        <Tooltip title="Delete Note">
                            <DeleteOutlineIcon />
                        </Tooltip>
                    </button>
                </>
            )}
        </div>
    );
}

export default OneNote;
