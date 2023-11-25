// Slots API
type Slots = Array<Slot>;

type PaxAvailability = {
  type: string;
  name?: string;
  description?: string;
  price: Price;
  min?: number;
  max?: number;
  remaining: number;
};

type Price = {
  finalPrice: number;
  currencyCode: string;
  originalPrice: number;
};

type Slot = {
  startTime: string;
  startDate: string;
  price: Price;
  remaining: number;
  paxAvailability: Array<PaxAvailability>;
};
