import axios from "axios";

import OneNote from "./OneNote";

function AllNotes(allNotesProps) {
    const serverHost = import.meta.env.VITE_SERVER_HOST;
    const serverPort = import.meta.env.VITE_SERVER_PORT;

    async function deleteNote(id) {
        const noteToDelete = allNotesProps.currentNotes.find((note) => note.id === id);

        if (!noteToDelete) return alert("Note not found?!");

        const noteTitle = noteToDelete.note_title;
        const noteContent = noteToDelete.note_content.slice(0, 10);
        const confirmDelete = window.confirm(`Delete "${noteTitle}": ${noteContent}...?`);

        if (confirmDelete) {
            try {
                const serverResponse = await axios.delete(
                    `${serverHost}:${serverPort}/delete/${id}`
                );
                allNotesProps.setCurrentNotes(serverResponse.data);
            } catch (error) {
                console.error("Error deleting note:", error);
                alert("Failed to delete note!");
            }
        }
    }

    return (
        <>
            {allNotesProps.currentNotes.map((note) => (
                <OneNote
                    key={note.id}
                    id={note.id}
                    noteTitle={note.note_title}
                    noteDate={note.note_date}
                    noteContent={note.note_content}
                    deleteClick={deleteNote}
                    setCurrentNotes={allNotesProps.setCurrentNotes}
                />
            ))}
        </>
    );
}

export default AllNotes;
