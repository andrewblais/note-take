// Single radio button for sort selection

function RadioSortButton(buttonProps) {
    return (
        <>
            <input
                type="radio"
                className="btn-check"
                id={buttonProps.identifier}
                name="sort"
                value={buttonProps.identifier}
                autoComplete="off"
                onChange={buttonProps.onSort}
                defaultChecked={buttonProps.isDefaultChecked}
            />
            <label className="btn btn-outline-primary" htmlFor={buttonProps.identifier}>
                {buttonProps.buttonText}
            </label>
        </>
    );
}

export default RadioSortButton;
