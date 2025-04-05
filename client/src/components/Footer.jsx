import formatDate from "./formatDate";
import Quote from "./Quote";

function Footer() {
    return (
        <footer>
            <div className="footer-all">
                <Quote />
                <div className="footer-date">&copy; {formatDate("year")}</div>
            </div>
        </footer>
    );
}

export default Footer;
