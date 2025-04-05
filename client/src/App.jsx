import axios from "axios";
import { useState, useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import NewNote from "./components/NewNote";
import AllNotes from "./components/AllNotes";
import RadioSortButtons from "./components/RadioSortButtons";
import DeleteAllButton from "./components/DeleteAllButton";

// cd G:/nowGitRepos/note-take

function App() {
    const [currentNotes, setCurrentNotes] = useState([]);
    const serverHost = import.meta.env.VITE_SERVER_HOST;
    const serverPort = import.meta.env.VITE_SERVER_PORT;

    const notesFromDB = async () => {
        try {
            const serverResponse = await axios.get(`${serverHost}:${serverPort}`);
            setCurrentNotes(serverResponse.data);
        } catch (error) {
            console.error("Failed to get notes from DB:", error);
        }
    };

    useEffect(() => {
        notesFromDB();
    }, []); // Empty dependency assures runs only once

    const addNewNote = async (event, newNote) => {
        try {
            const serverResponse = await axios.post(`${serverHost}:${serverPort}/add`, newNote, {
                headers: { "Content-Type": "application/json" },
            });
            setCurrentNotes(serverResponse.data);
            event.preventDefault();
        } catch (error) {
            console.error("Couldn't add note!", error);
        }
    };

    function sortNotes(event) {
        const sortValue = event.target.value;
        setCurrentNotes((prevArr) => {
            const arrayToSort = [...prevArr];
            if (sortValue === "date-ascending") {
                arrayToSort.sort((a, b) => new Date(a.note_date) - new Date(b.note_date));
                ``;
            } else if (sortValue === "date-descending") {
                arrayToSort.sort((a, b) => new Date(b.note_date) - new Date(a.note_date));
            } else if (sortValue === "title-descending") {
                arrayToSort.sort((a, b) => b.note_title.localeCompare(a.note_title));
            } else if (sortValue === "title-ascending") {
                arrayToSort.sort((a, b) => a.note_title.localeCompare(b.note_title));
            }

            return arrayToSort;
        });
    }
    const deleteAllNotes = async () => {
        const confirmDelete = window.confirm("Delete All Notes?");
        if (confirmDelete) {
            try {
                await axios.delete(`${serverHost}:${serverPort}/delete-all`);
                setCurrentNotes([]);
            } catch (error) {
                console.error("Error deleting all notes:", error);
                alert("Failed to delete all notes!");
            }
        }
    };

    return (
        <>
            <Header />
            <div className="buttons-top">
                <RadioSortButtons onSort={sortNotes} />
                <DeleteAllButton deleteAllNotes={deleteAllNotes} />
            </div>
            <div className="notes-container">
                <NewNote onAddNewNote={addNewNote} setCurrentNotes={setCurrentNotes} />
                <AllNotes currentNotes={currentNotes} setCurrentNotes={setCurrentNotes} />
            </div>
            <Footer />
        </>
    );
}

export default App;
