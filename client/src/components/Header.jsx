import formatDate from "./formatDate";

function Header() {
    return (
        <header className="header">
            <div className="page-title">
                <a href="https://code.visualstudio.com/" target="_blank">
                    <img className="pencil-img" src="/pencil_120.png" />
                </a>
                <h1>NoteTake</h1>
            </div>
            <h3>{formatDate("full")}</h3>
        </header>
    );
}

export default Header;
