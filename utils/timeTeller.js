function getFormattedDateTime() {
  const date = new Date();

  // Options for formatting date and time
  const options = {
    weekday: 'long', // e.g., "Monday"
    year: 'numeric', // e.g., "2023"
    month: 'long', // e.g., "May"
    day: 'numeric', // e.g., "30"
    hour: 'numeric', // e.g., "4"
    minute: 'numeric', // e.g., "30"
    second: 'numeric', // e.g., "45"
    hour12: true // Use 12-hour format
  };

  // Convert date to human-readable string
  const formattedDateTime = date.toLocaleString('en-US', options);

  return formattedDateTime;
}

// Example usage
const humanReadableDateTime = getFormattedDateTime();

module.exports = {humanReadableDateTime}