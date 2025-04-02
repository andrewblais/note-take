import { useEffect, useState } from "react";
import axios from "axios";

function Joke() {
    const [joke, setJoke] = useState("");

    useEffect(() => {
        const getJoke = async () => {
            try {
                const serverResponse = await axios.get(
                    `http://localhost:4000/joke`
                );
                setJoke(serverResponse.data.joke);
            } catch (error) {
                console.error("Error getting joke:", error);
            }
        };
        getJoke();
    }, []);

    return (
        <>
            <a
                href="https://icanhazdadjoke.com"
                target="_blank"
                className="joke"
            >
                {joke}
            </a>
        </>
    );
}

export default Joke;
