export function formatDateTime(start_time, end_time) {
  // Helper functions to format date and time
  function formatDate(date) {
    return new Date(date).toLocaleString('default', {
      // year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function formatTime(date) {
    return new Date(date).toLocaleString('default', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Use this if you prefer AM/PM format
    });
  }

  const startDate = formatDate(start_time);
  const startTime = formatTime(start_time);

  if (end_time) {
    const endDate = formatDate(end_time);
    const endTime = formatTime(end_time);

    if (startDate === endDate) {
      // Same date, format as "Feb 14, 2024 • 12:00 PM - 1:00 PM"
      return `${startDate} • ${startTime} - ${endTime}`;
    } else {
      // Different dates, format as "Feb 14, 2024 • 12:00 AM - Feb 15, 2024 • 12:00 AM"
      return `${startDate} • ${startTime} - ${endDate} • ${endTime}`;
    }
  } else {
    // Only start_time is provided, format as "Feb 14, 2024 • 12:00 PM"
    // return `${startDate} • ${startTime}`;
    return `${startDate}`;
  }
}
