import { Account } from '../accounts/account';
import {
  DistributionParams,
  DistributionStyle,
  ERRORS,
} from '../accounts/account.types';

describe('Testing the Account class transfer/deposit/deduct functionality', () => {
  it('balance returns the cents value', () => {
    const startingAmount = 10;
    const account = new Account({
      name: 'Test Account',
      balance: startingAmount,
    });

    expect(account.balance).toBe(startingAmount * 100);
  });

  it('equal style transfer of 500.50', () => {
    const initialBalance = 1000;
    const amountToTransfer = 500.5;

    const sourceAccount = new Account({
      name: 'source account',
      balance: initialBalance,
    });

    const recipientA = new Account({ name: 'recipient account a' });
    const recipientB = new Account({ name: 'recipient account b' });
    const recipientC = new Account({ name: 'recipient account c' });

    const transfer: DistributionParams = {
      amount: amountToTransfer,
      distributionStyle: DistributionStyle.Equal,
      recipients: [
        { account: recipientA },
        { account: recipientB },
        { account: recipientC },
      ],
    };

    sourceAccount.transfer(transfer);

    expect(sourceAccount.balance).toBe(49950);
    expect(recipientA.balance).toBe(16684);
    expect(recipientB.balance).toBe(16683);
    expect(recipientC.balance).toBe(16683);
  });

  it('0.01 split among 3 recipients', () => {
    const initialBalance = 10;
    const amountToTransfer = 0.01;

    const sourceAccount = new Account({
      name: 'source account',
      balance: initialBalance,
    });

    const recipientA = new Account({ name: 'recipient account a' });
    const recipientB = new Account({ name: 'recipient account b' });
    const recipientC = new Account({ name: 'recipient account c' });

    const transfer: DistributionParams = {
      amount: amountToTransfer,
      distributionStyle: DistributionStyle.Equal,
      recipients: [
        { account: recipientA },
        { account: recipientB },
        { account: recipientC },
      ],
    };

    sourceAccount.transfer(transfer);

    expect(sourceAccount.balance).toBe(999);
    expect(recipientA.balance).toBe(1);
    expect(recipientB.balance).toBe(0);
    expect(recipientC.balance).toBe(0);
  });

  it('1.00 split among 3 recipients', () => {
    const initialBalance = 10;
    const amountToTransfer = 1;

    const sourceAccount = new Account({
      name: 'source account',
      balance: initialBalance,
    });

    const recipientA = new Account({ name: 'recipient account a' });
    const recipientB = new Account({ name: 'recipient account b' });
    const recipientC = new Account({ name: 'recipient account c' });

    const transfer: DistributionParams = {
      amount: amountToTransfer,
      distributionStyle: DistributionStyle.Equal,
      recipients: [
        { account: recipientA },
        { account: recipientB },
        { account: recipientC },
      ],
    };

    sourceAccount.transfer(transfer);

    expect(sourceAccount.balance).toBe(900);
    expect(recipientA.balance).toBe(34);
    expect(recipientB.balance).toBe(33);
    expect(recipientC.balance).toBe(33);
  });

  // Requirement #1
  // Distribute funds evenly across all target accounts
  it('10,000 across three target accounts', () => {
    const initialBalance = 10000;
    const amountToTransfer = initialBalance;

    const sourceAccount = new Account({
      name: 'source account',
      balance: initialBalance,
    });

    const recipientA = new Account({ name: 'recipient account a' });
    const recipientB = new Account({ name: 'recipient account b' });
    const recipientC = new Account({ name: 'recipient account c' });

    const transfer: DistributionParams = {
      amount: amountToTransfer,
      distributionStyle: DistributionStyle.Equal,
      recipients: [
        { account: recipientA },
        { account: recipientB },
        { account: recipientC },
      ],
    };

    sourceAccount.transfer(transfer);

    expect(sourceAccount.balance).toBe(0);
    expect(recipientA.balance).toBe(333334);
    expect(recipientB.balance).toBe(333333);
    expect(recipientC.balance).toBe(333333);

    expect(
      (recipientA.balance + recipientB.balance + recipientC.balance) / 100,
    ).toBe(amountToTransfer);
  });

  // Requirement #2
  // Distribute funds to a combination of target accounts while
  // keeping a remaining balance in the source account.
  it('distributing a combination of amounts with remaining balance', () => {
    const initialBalance = 10000;

    const sourceAccount = new Account({
      name: 'source account',
      balance: initialBalance,
    });

    const recipientA = new Account({ name: 'recipient account a' });
    const recipientB = new Account({ name: 'recipient account b' });
    const recipientC = new Account({ name: 'recipient account c' });

    // total: 4446.84
    const transfer: DistributionParams = {
      distributionStyle: DistributionStyle.Proportional,
      recipients: [
        { account: recipientA, amount: 1500 },
        { account: recipientB, amount: 172.5 },
        { account: recipientC, amount: 2774.34 },
      ],
    };

    sourceAccount.transfer(transfer);

    expect(sourceAccount.balance).toBe(555316);
    expect(recipientA.balance).toBe(150000);
    expect(recipientB.balance).toBe(17250);
    expect(recipientC.balance).toBe(277434);

    const totalTransfer = transfer.recipients.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    );
    expect(totalTransfer).toBe(4446.84);
    expect(sourceAccount.balance).toBe((initialBalance - totalTransfer) * 100);
  });

  it('proportional fails if total exceeds balance', () => {
    const initialBalance = 10000;

    const sourceAccount = new Account({
      name: 'source account',
      balance: initialBalance,
    });

    const recipientA = new Account({ name: 'recipient account a' });
    const recipientB = new Account({ name: 'recipient account b' });
    const recipientC = new Account({ name: 'recipient account c' });

    const transfer: DistributionParams = {
      distributionStyle: DistributionStyle.Proportional,
      recipients: [
        { account: recipientA, amount: 4000 },
        { account: recipientB, amount: 4000 },
        { account: recipientC, amount: 4000 },
      ],
    };

    const result = sourceAccount.transfer(transfer);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERRORS.INSUFFICIENT_FUNDS);
    }
  });

  it('proportional fails - no recipients for transfer', () => {
    const initialBalance = 10000;

    const sourceAccount = new Account({
      name: 'source account',
      balance: initialBalance,
    });

    const transfer: DistributionParams = {
      distributionStyle: DistributionStyle.Proportional,
      recipients: [],
    };

    const result = sourceAccount.transfer(transfer);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERRORS.NO_RECIPIENTS);
    }
  });

  it('equal fails if total exceeds balance', () => {
    const initialBalance = 10000;

    const sourceAccount = new Account({
      name: 'source account',
      balance: initialBalance,
    });

    const recipientA = new Account({ name: 'recipient account a' });
    const recipientB = new Account({ name: 'recipient account b' });
    const recipientC = new Account({ name: 'recipient account c' });

    const transfer: DistributionParams = {
      distributionStyle: DistributionStyle.Equal,
      amount: 15000,
      recipients: [
        { account: recipientA },
        { account: recipientB },
        { account: recipientC },
      ],
    };

    const result = sourceAccount.transfer(transfer);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERRORS.INSUFFICIENT_FUNDS);
    }
  });

  it('equal fails - no recipients for transfer', () => {
    const initialBalance = 10000;

    const sourceAccount = new Account({
      name: 'source account',
      balance: initialBalance,
    });

    const transfer: DistributionParams = {
      distributionStyle: DistributionStyle.Equal,
      amount: 10000,
      recipients: [],
    };

    const result = sourceAccount.transfer(transfer);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERRORS.NO_RECIPIENTS);
    }
  });
});
