import formatDate from "./formatDate";
import Joke from "./Joke";

function Footer() {
    return (
        <footer>
            <Joke />
            <p>&copy; {formatDate("year")}</p>
        </footer>
    );
}

export default Footer;
