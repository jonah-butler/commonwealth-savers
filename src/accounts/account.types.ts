import { Account } from './account';

export type AccountParams = {
  name: string;
  balance?: number;
};

export enum DistributionStyle {
  Equal,
  Proportional,
}

export type Cents = number;
export type Dollars = number;

export type TransferResult =
  | { success: true }
  | { success: false; error: string };

export type DistributionRecipientsEqual = { account: Account };
export type DistributionRecipientsProportional = DistributionRecipientsEqual & {
  amount: number; // in dollars
};

export type DistributionParams =
  | {
      amount: number; // in dollars
      recipients: DistributionRecipientsEqual[];
      distributionStyle: DistributionStyle.Equal;
    }
  | {
      recipients: DistributionRecipientsProportional[];
      distributionStyle: DistributionStyle.Proportional;
    };

export const ERRORS = {
  INSUFFICIENT_FUNDS: 'insufficient funds',
  NO_RECIPIENTS: 'no recipients provided',
  UNSUPPORTED_DISTRIBUTION: 'unsupported distribution style',
  TRANSFER_FAILED: 'transfer failed',
};
