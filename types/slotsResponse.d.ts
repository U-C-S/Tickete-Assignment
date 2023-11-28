import { IPriceLeap } from "./LeapApiResponse";

export type AvailableDatesResponse = string[];

export interface InventoryOnDateResponse {
  id: number;
  slots: {
    id: number;
    startDate: Date;
    startTime: string;
    providerSlotId: string;
    paxAvailability: Array<IPaxAvailability2>;
  }[];
}

interface IPaxAvailability2 {
  max: number;
  min: number;
  remaining: number;
  isPrimary?: boolean;
  price: IPrice2;
  content: IContent;
}

interface IPrice2 extends IPriceLeap {
  id: number;
}

interface IContent {
  id: number;
  name: string;
  description: string;
  type: string;
}
