export const formatSearchStartDate = (dateString) => {
  if (!dateString) return null;
  return dateString + "T00:00:00";
};

export const formatSearchEndDate = (dateString) => {
  if (!dateString) return null;
  return dateString + "T23:59:59";
};

export const formatLocalDateTimeForBackend = (dateTimeString) => {
  if (!dateTimeString) return null;
  return dateTimeString.slice(0, 19);
};


export const updateMissionDateTime = (currentDateTime, newValue, type) => {
  let datePart = "";
  let timePart = "";
  
  if (currentDateTime && currentDateTime.includes('T')) {
    [datePart, timePart] = currentDateTime.split('T');
  }
  
  if (type === "date") {
    datePart = newValue;
  } else if (type === "time") {
    timePart = newValue;
    if (timePart && timePart.length === 5) {
      timePart = `${timePart}:00`;
    }
  }
  
  return datePart && timePart ? `${datePart}T${timePart}` : datePart ? `${datePart}T00:00:00` : "";
};

export const formatMissionDateTime = (startDate, endDate) => {
  if (!startDate || !endDate) return null;

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const start = new Date(startDate);
  const end = new Date(endDate);

  const startFormatted = start.toLocaleString("fr-FR", options).replace(",", " à");
  const endFormatted = end.toLocaleString("fr-FR", options).replace(",", " à");

  return `Du ${startFormatted} au ${endFormatted}`;
};