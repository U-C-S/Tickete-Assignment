export type LeapApiResponse = Array<ISlotLeapResponse>;

export interface ISlotLeapResponse {
  startDate: string;
  startTime: string;
  // endTime: string;
  providerSlotId: string; //unique identifer for the slot
  remaining: number;
  // currencyCode: string;
  // variantId: number;
  paxAvailability: Array<IPaxAvailabilityLeap>;
}

interface IPaxAvailabilityLeap {
  max: number;
  min: number;
  remaining: number;
  type: string;
  isPrimary?: boolean;
  description: string;
  name: string;
  price: IPriceLeap;
}

interface IPriceLeap {
  // discount: number;
  finalPrice: number;
  originalPrice: number;
  currencyCode: string;
}
