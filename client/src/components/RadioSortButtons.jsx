// Group of radio buttons for sorting notes

import RadioSortButton from "./RadioSortButton";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faA, faZ } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";

function RadioSortButtons(buttonsProps) {
    return (
        <>
            <div
                className="btn-group"
                role="group"
                aria-label="Radio buttons toggle sort order by date or alphabetically.">
                <RadioSortButton
                    identifier={"date-descending"}
                    onSort={buttonsProps.onSort}
                    isDefaultChecked={true}
                    buttonText={
                        <>
                            <Tooltip title="Sort: New to Old">
                                <FontAwesomeIcon icon={faArrowDown} />
                                <FontAwesomeIcon icon={faClock} />
                            </Tooltip>
                        </>
                    }
                />

                <RadioSortButton
                    identifier={"date-ascending"}
                    onSort={buttonsProps.onSort}
                    isDefaultChecked={false}
                    buttonText={
                        <>
                            <Tooltip title="Sort: Old to New">
                                <FontAwesomeIcon icon={faClock} />
                                <FontAwesomeIcon icon={faArrowUp} />
                            </Tooltip>
                        </>
                    }
                />

                <RadioSortButton
                    identifier={"title-ascending"}
                    onSort={buttonsProps.onSort}
                    isDefaultChecked={false}
                    buttonText={
                        <>
                            <Tooltip title="Sort: Alphabetical">
                                <FontAwesomeIcon icon={faA} />
                                <FontAwesomeIcon icon={faZ} />
                            </Tooltip>
                        </>
                    }
                />

                <RadioSortButton
                    identifier={"title-descending"}
                    onSort={buttonsProps.onSort}
                    isDefaultChecked={false}
                    buttonText={
                        <>
                            <Tooltip title="Sort: Reverse Alphabetical">
                                <FontAwesomeIcon icon={faZ} />
                                <FontAwesomeIcon icon={faA} />
                            </Tooltip>
                        </>
                    }
                />
            </div>
        </>
    );
}

export default RadioSortButtons;
