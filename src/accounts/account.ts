import {
  type AccountParams,
  type DistributionParams,
  type DistributionRecipientsEqual,
  type DistributionRecipientsProportional,
  type TransferResult,
  DistributionStyle,
  ERRORS,
} from './account.types';

export class Account {
  private _balance: number; // stored in cents

  name: string = '';

  constructor({ name, balance }: AccountParams) {
    this.name = name;
    this._balance = balance ? Account.toCents(balance) : 0;
  }

  get balance(): number {
    return this._balance;
  }

  /**
   *
   * @param amount amount in dollars
   * @returns <number> represented in cents
   * ---------------
   * converts a dollar amount to cents for internal calculations/storage
   * ex. 10.50 becomes 1050
   * ---------------
   */
  private static toCents(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   *
   * @param amount amount in cents
   * @returns <number> represented in dollars to 100th decimal place
   * ---------------
   * converts a cents amount to dollars for external display
   * ex. 1050 becomes 10.50
   * ---------------
   */
  private static toDollars(amount: number): number {
    return +(amount / 100).toFixed(2);
  }

  private deduct(amountInCents: number): void {
    this._balance -= amountInCents;
  }

  /**
   *
   * @param amount the amount to be evenly distributed among recipients - in dollars
   * @param recipients
   * @returns <void>
   * @throws <Error> on insufficient funds
   * ---------------
   * an equal group transfer accepts a target amount to be evenly distributed among recipients.
   * any remaining cents will be distributed to the first recipient.
   * ---------------
   */
  private handleEqualStyleTransfer(
    amount: number,
    recipients: DistributionRecipientsEqual[],
  ): void {
    const remainingCents = Account.toCents(amount) % recipients.length;
    const amountInCents = Math.floor(
      Account.toCents(amount) / recipients.length,
    );

    const amountInDollars = Account.toDollars(amountInCents);
    const remainingDollars = Account.toDollars(remainingCents);

    const totalInCents = Account.toCents(amount);
    if (totalInCents > this.balance) {
      throw new Error(ERRORS.INSUFFICIENT_FUNDS);
    }

    for (const recipient of recipients) {
      recipient.account.deposit(amountInDollars);
      this.deduct(amountInCents);
    }

    if (remainingCents > 0) {
      recipients[0].account.deposit(remainingDollars);
      this.deduct(remainingCents);
    }
  }

  /**
   *
   * @param recipients the recipients with included amount to transfer
   * @throws <Error> on insufficient funds
   * ---------------
   * a proportional group transfer will be only allowed if
   * the total amount expected for each recipient is <= the
   * source account balance. partial transfers are not allowed.
   * ---------------
   */
  private handleProportionalStyleTransfer(
    recipients: DistributionRecipientsProportional[],
  ): void {
    const totalInCents = this.calculateRecipientTotal(recipients);

    if (totalInCents > this.balance) {
      throw new Error(ERRORS.INSUFFICIENT_FUNDS);
    }

    for (const recipient of recipients) {
      recipient.account.deposit(recipient.amount);
      this.deduct(Account.toCents(recipient.amount));
    }
  }

  /**
   *
   * @param recipients <DistributionRecipientsProportional[]>
   * @returns <number> total amount in cents to be transferred to all recipients
   * ---------------
   * calculates the total amount to be transferred to all recipients in a proportional transfer
   * ---------------
   */
  private calculateRecipientTotal(
    recipients: DistributionRecipientsProportional[],
  ): number {
    return Account.toCents(
      recipients.reduce((sum, recipient) => sum + recipient.amount, 0),
    );
  }

  deposit(amountInDollars: number): void {
    const amountInCents = Account.toCents(amountInDollars);
    const newBalance = this._balance + amountInCents;

    this._balance = newBalance;
  }

  transfer(params: DistributionParams): TransferResult {
    if (params.recipients.length === 0) {
      return { success: false, error: ERRORS.NO_RECIPIENTS };
    }

    const { recipients, distributionStyle } = params;

    try {
      switch (distributionStyle) {
        case DistributionStyle.Equal:
          this.handleEqualStyleTransfer(params.amount, recipients);
          break;
        case DistributionStyle.Proportional:
          this.handleProportionalStyleTransfer(recipients);
          break;
        default:
          return { success: false, error: ERRORS.UNSUPPORTED_DISTRIBUTION };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : ERRORS.TRANSFER_FAILED,
      };
    }
  }

  get balancePretty(): string {
    return `$${Account.toDollars(this._balance)}`;
  }
}
