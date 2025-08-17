const formatDate = (dateString) => {
  // Manejar diferentes formatos de fecha
  let date;
  if (dateString.includes("Z") || dateString.includes("T")) {
    // Formato ISO
    date = new Date(dateString);
  } else {
    // Timestamp en milisegundos
    date = new Date(parseInt(dateString));
  }

  if (isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default formatDate;
