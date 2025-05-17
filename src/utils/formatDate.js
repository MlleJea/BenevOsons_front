
export function formatDateRange(startDateStr, endDateStr) {
    if (!startDateStr || !endDateStr) return "";
  
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
  
    const format = (date) =>
      date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
  
    return `${format(start)} - ${format(end)}`;
  }
  