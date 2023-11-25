// Dates API
type DateAvailability = {
  date: string;
  price: Price;
};
type DateInventory = {
  dates: Array<DateAvailability>;
};