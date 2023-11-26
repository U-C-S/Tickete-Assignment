export type LeapApiResponse = Array<ISlotResponse>;

export interface ISlotResponse {
  startDate: string;
  startTime: string;
  // endTime: string;
  providerSlotId: string; //unique identifer for the slot
  remaining: number;
  // currencyCode: string;
  // variantId: number;
  paxAvailability: Array<IPaxAvailability>;
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
  // discount: number;
  finalPrice: number;
  originalPrice: number;
  currencyCode: string;
}
