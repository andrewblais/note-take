// Returns the current date/time in one of three formats:
function formatDate(format = "full") {
    // Arrays for custom formatting:
    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    // Get current date/time info:
    const newDate = new Date();
    const dayIndex = newDate.getDay();
    const day = daysOfWeek[dayIndex];
    const monthIndex = newDate.getMonth();
    const month = months[monthIndex];
    const date = newDate.getDate();
    const year = newDate.getFullYear();
    const time = newDate.toTimeString().slice(0, 5);

    // Format output based on request:
    if (format == "full") {
        return `${day}, ${month} ${date}, ${year}, ${time}`;
    } else if (format == "abbr") {
        return `${newDate.toLocaleDateString()} ${time}`;
    } else if (format == "year") {
        return year;
    }
}

export default formatDate;
