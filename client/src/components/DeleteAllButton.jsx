import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumpsterFire } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";

function DeleteAllButton(deleteAllButtonProps) {
    return (
        <>
            <button
                // className="btn-dumpster btn btn-outline-primary"
                className="btn-dumpster btn"
                onClick={deleteAllButtonProps.deleteAllNotes}>
                <Tooltip title="Delete All Notes">
                    <FontAwesomeIcon icon={faDumpsterFire} />
                </Tooltip>
            </button>
            <div className="delete-all"></div>
        </>
    );
}

export default DeleteAllButton;
