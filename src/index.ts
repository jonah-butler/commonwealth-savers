import { Account } from './accounts/account';
import {
  type DistributionParams,
  DistributionStyle,
} from './accounts/account.types';

const startingBalance = 10000;

const sourceAccountA = new Account({
  name: 'source account',
  balance: startingBalance,
});

const recipientA = new Account({ name: 'recipient a' });
const recipientB = new Account({ name: 'recipient b' });
const recipientC = new Account({ name: 'recipient c' });

const transferParamsEqual: DistributionParams = {
  amount: startingBalance, // transfer full balance from source account
  distributionStyle: DistributionStyle.Equal,
  recipients: [
    { account: recipientA },
    { account: recipientB },
    { account: recipientC },
  ],
};

console.log('Feature 1: Distribute funds evenly across all 3 accounts');
console.log('');
console.log('------------------------------------------------------');
console.log('');
console.log(
  `transferring ${sourceAccountA.balancePretty} equally across ${transferParamsEqual.recipients.length} accounts`,
);
console.log(`source account starting balance: ${sourceAccountA.balancePretty}`);
console.log(`recipient a starting balance: ${recipientA.balancePretty}`);
console.log(`recipient b starting balance: ${recipientB.balancePretty}`);
console.log(`recipient c starting balance: ${recipientC.balancePretty}`);

// perform transfer
sourceAccountA.transfer(transferParamsEqual);

console.log(
  `source account resulting balance: ${sourceAccountA.balancePretty}`,
);
console.log(`recipient a resulting balance: ${recipientA.balancePretty}`);
console.log(`recipient b resulting balance: ${recipientB.balancePretty}`);
console.log(`recipient c resulting balance: ${recipientC.balancePretty}`);

console.log('');
console.log('------------------------------------------------------');
console.log('');
console.log(
  'Feature 2: Distribute some funds proportionally across 3 accounts, with a remaining balance in the source account',
);
console.log('');
console.log('------------------------------------------------------');
console.log('');

const sourceAccountB = new Account({ name: 'source account b', balance: 1000 });

const recipientD = new Account({ name: 'recipient d' });
const recipientE = new Account({ name: 'recipient e' });
const recipientF = new Account({ name: 'recipient f' });

const transferParamsProportional: DistributionParams = {
  distributionStyle: DistributionStyle.Proportional,
  recipients: [
    { account: recipientD, amount: 500 },
    { account: recipientE, amount: 300 },
    { account: recipientF, amount: 199.99 },
  ],
};

const totalTransfer = transferParamsProportional.recipients.reduce(
  (acc, curr) => acc + curr.amount,
  0,
);

console.log(
  `transferring a total of $${totalTransfer} across ${transferParamsProportional.recipients.length} accounts`,
);

console.log(`source account starting balance: ${sourceAccountB.balancePretty}`);
console.log(`recipient d starting balance: ${recipientD.balancePretty}`);
console.log(`recipient e starting balance: ${recipientE.balancePretty}`);
console.log(`recipient f starting balance: ${recipientF.balancePretty}`);

sourceAccountB.transfer(transferParamsProportional);

console.log(
  `source account resulting balance: ${sourceAccountB.balancePretty}`,
);
console.log(`recipient d resulting balance: ${recipientD.balancePretty}`);
console.log(`recipient e resulting balance: ${recipientE.balancePretty}`);
console.log(`recipient f resulting balance: ${recipientF.balancePretty}`);
