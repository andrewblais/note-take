import axios from "axios";

import OneNote from "./OneNote";

function AllNotes(allNotesProps) {
    // Get server host and port from environment variables:
    const serverHost = import.meta.env.VITE_SERVER_HOST;
    const serverPort = import.meta.env.VITE_SERVER_PORT;

    // Function to handle deleting a note by ID:
    async function deleteNote(id) {
        const noteToDelete = allNotesProps.currentNotes.find((note) => note.id === id);

        if (!noteToDelete) return alert("Note not found?!");

        // Grab a portion of the note content for confirmation message:
        const noteTitle = noteToDelete.note_title;
        const noteContent = noteToDelete.note_content.slice(0, 10);

        // Prompt user for confirmation before deleting:
        const confirmDelete = window.confirm(`Delete "${noteTitle}": ${noteContent}...?`);

        if (confirmDelete) {
            try {
                // Send DELETE request to backend API:
                const serverResponse = await axios.delete(
                    `${serverHost}:${serverPort}/delete/${id}`
                );
                // Update notes state after successful deletion:
                allNotesProps.setCurrentNotes(serverResponse.data);
            } catch (error) {
                console.error("Error deleting note:", error);
                alert("Failed to delete note!");
            }
        }
    }

    return (
        <>
            {/* Map over current notes and render each with the OneNote component: */}
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
