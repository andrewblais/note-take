import { useState } from "react";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";

import axios from "axios";

function OneNote(noteProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(noteProps.noteTitle);
    const [editedContent, setEditedContent] = useState(noteProps.noteContent);

    const handleEdit = () => setIsEditing(true);

    const handleSave = async () => {
        try {
            const updatedNote = { title: editedTitle, content: editedContent };
            await axios.put(
                `http://localhost:4000/edit/${noteProps.id}`,
                updatedNote
            );
            const response = await axios.get("http://localhost:4000/");
            noteProps.setCurrentNotes(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update note:", error);
            alert("Failed to add your changes.");
        }
    };

    const cancelEditing = () => {
        setEditedTitle(noteProps.noteTitle);
        setEditedContent(noteProps.noteContent);
        setIsEditing(false);
    };

    return (
        <div className="note">
            {isEditing ? (
                <>
                    <input
                        className="note-title"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                    ></input>
                    <textarea
                        className="note-content"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    />
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
                    <div className="note-title-date">
                        <h1 className="note-title">{noteProps.noteTitle}</h1>
                        <p className="note-date">{noteProps.noteDate}</p>
                    </div>
                    <div className="note-content">{noteProps.noteContent}</div>
                    <button className="button-right" onClick={handleEdit}>
                        <Tooltip title="Edit Note">
                            <EditIcon />
                        </Tooltip>
                    </button>
                    <button
                        className="button-left"
                        onClick={() => {
                            noteProps.deleteClick(noteProps.id);
                        }}
                    >
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
