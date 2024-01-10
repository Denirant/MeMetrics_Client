function convertDateFromString(dateString) {
  const parts = dateString.split(".");

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const convertedDate = new Date(year, month, day);

  return convertedDate;
}

function convertDateToString(date) {

  date = new Date(date);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  const dateString = `${day}.${month}.${year}`;

  return dateString;
}

function ShortConvertDateToString(date) {

  date = new Date(date);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  const dateString = `${day}.${month}`;

  return dateString;
}

export { convertDateFromString, convertDateToString, ShortConvertDateToString };
