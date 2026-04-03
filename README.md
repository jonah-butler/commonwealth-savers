## Commonwealth Savers Technical Exercise

> Write a function that allows a customer to distribute funds from a single source account with a value of
> $10,000, across three (3) target accounts. Assume the function is already aware of the customer’s account
> and its balance of $10,000. The function needs to include the following features:

1. Distribute all funds evenly across all target accounts.
2. Distribute funds from the source account to a combination of the target accounts. Use either an
   even distribution or specific amounts, while keeping a remaining balance in the source account.

## Running the Project

> This setup guide assumes the user has both npm/node installed

_install dependencies_

`npm i`

_run tests_

`npm run test`

_build and run project_

`npm run start`

## Description

This project includes an `Account` class:

### `Account`

- Usage:

```typescript
//optional starting balance
const account = new Account({ name: 'account name', balance: 100 });

// or deposit after initialization
account.deposit(100); // in dollars
```

it includes the following method for transferring funds across accounts:

- `.transfer()`
- Params

```typescript
<DistributionParams>
```

- Examples

> transfer style 1: Proportional Distribution

```typescript
const transferParamsProportional: DistributionParams = {
  distributionStyle: DistributionStyle.Proportional,
  recipients: [
    { account: recipientD, amount: 500 },
    { account: recipientE, amount: 300 },
    { account: recipientF, amount: 199.99 },
  ],
};
```

> transfer style 2: Equal Distribution

```typescript
const transferParamsEqual: DistributionParams = {
  amount: 1000.19,
  distributionStyle: DistributionStyle.Equal,
  recipients: [
    { account: recipientA },
    { account: recipientB },
    { account: recipientC },
  ],
};
```
