// Displays a random quote retrieved from the server

import axios from "axios";
import { useEffect, useState } from "react";

// Server endpoint:
const serverHost = import.meta.env.VITE_SERVER_HOST;
const serverPort = import.meta.env.VITE_SERVER_PORT;
const quoteURL = `${serverHost}:${serverPort}/quote`;

function Quote() {
    // Quote content and author state:
    const [quoteBody, setQuoteBody] = useState("");
    const [quoteAuthor, setQuoteAuthor] = useState("");

    useEffect(() => {
        // Fetch quote from server:
        const getQuote = async () => {
            try {
                const serverResponse = await axios.get(quoteURL);
                setQuoteBody(serverResponse.data.quote.body);
                setQuoteAuthor(serverResponse.data.quote.author);
            } catch (error) {
                console.error("Error getting quote:", error);
            }
        };
        getQuote();
    }, []);

    return (
        <>
            <div className="footer-quote">
                <p>{quoteBody}</p>
                <p>
                    <a href="https://favqs.com/" target="_blank">
                        {quoteAuthor}
                    </a>
                </p>
                <p></p>
            </div>
        </>
    );
}

export default Quote;
