export const getMissionStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return { label: "À venir", color: "success" };
  if (now >= start && now <= end) return { label: "En cours", color: "warning" };
  if (now > end) return { label: "Terminée", color: "danger" };
  return { label: "Inconnu", color: "secondary" };
};