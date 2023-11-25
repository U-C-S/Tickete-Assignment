type LeapApiResponse = Item[];

interface Item {
  startDate: string;
  startTime: string;
  endTime: string;
  providerSlotId: string;
  remaining: number;
  currencyCode: string;
  variantId: number;
  paxAvailability: IPaxAvailability[];
}

interface IPaxAvailability {
  max: number;
  min: number;
  remaining: number;
  type: string;
  isPrimary?: boolean;
  description: string;
  name: string;
  price: Price;
}

interface IPrice {
  discount: number;
  finalPrice: number;
  originalPrice: number;
  currencyCode: string;
}
