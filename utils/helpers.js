module.exports = {
  
  format_date: (date) => {
    if (!(date instanceof Date)) {
      // Handle the case when date is not a Date object, return a default or appropriate value
      return "Invalid Date";
    }
    return date.toLocaleDateString();
  }
};

