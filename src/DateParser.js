const transformDateTime = date => {
  const day = `${
    date.getDate().toString().length === 1 ? "0" : ""
  }${date.getDate()}`;
  const month = `${
    date.getMonth().toString().length === 1 ? "0" : ""
  }${date.getMonth()+1}`;
  const year = date.getYear() - 100;
  const hour = `${
    date.getHours().toString().length === 1 ? "0" : ""
  }${date.getHours()}`;
  const minutes = `${
    date.getMinutes().toString().length === 1 ? "0" : ""
  }${date.getMinutes()}`;

  return `20${year}-${month}-${day} ${hour}:${minutes}`;
};

const transformDate = date => {
  const day = `${
    date.getDate().toString().length === 1 ? "0" : ""
  }${date.getDate()}`;
  const month = `${
    date.getMonth().toString().length === 1 ? "0" : ""
  }${date.getMonth()+1}`;
  const year = date.getYear() - 100;
  return `20${year}-${month}-${day}`;
};

const today = transformDate(new Date());
const threeDaysAgo = transformDate(new Date(Date.now() - 3 * 24 * 3600 * 1000));
const dateWithTime = `${threeDaysAgo} 07:00`

const now = transformDateTime(new Date());

export { today, threeDaysAgo, now, dateWithTime, transformDate, transformDateTime };
