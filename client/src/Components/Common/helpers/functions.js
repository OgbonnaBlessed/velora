// Helper function to format time as 'hour:minute AM/PM'
export const formatTime = (date) =>
  new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
}).format(new Date(date));

// Helper function to format date as 'Month Day, Year'
export const formatDate = (dateString) => {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
};