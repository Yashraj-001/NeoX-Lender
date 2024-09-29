const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class AssetTrading {
    constructor() {
        this.balances = {};
        this.loans = {};
        this.trades = {};
        this.loanCount = 0;
        this.tradeCount = 0;
        this.MY_WALLET = '0x02fDd964c9209b8c571B8a5B262E55Ed37a7d90f';
    }

    createLoan(borrower, amount, interestRate, term) {
        if (this.balances[borrower] < amount) {
            throw new Error("Insufficient balance.");
        }
        this.loanCount++;
        this.loans[this.loanCount] = {
            borrower: borrower,
            amount: amount,
            interestRate: interestRate,
            term: term,
            repaymentDate: Date.now() + term * 1000, // Assuming term is in seconds
            isRepaid: false,
        };
        this.balances[borrower] -= amount;
        console.log(`LoanCreated: Loan ID ${this.loanCount}, Borrower ${borrower}, Amount ${amount}`);
    }

    borrowLoan(loanId, borrower) {
        const loan = this.loans[loanId];
        if (loan.isRepaid) {
            throw new Error("Loan already repaid.");
        }
        if (borrower === loan.borrower) {
            throw new Error("Cannot borrow your own loan.");
        }
        this.balances[borrower] = (this.balances[borrower] || 0) + loan.amount;
        loan.isRepaid = true;
    }

    repayLoan(loanId, borrower, payment) {
        const loan = this.loans[loanId];
        if (borrower !== loan.borrower) {
            throw new Error("Only borrower can repay.");
        }
        const requiredRepayment = loan.amount + (loan.amount * loan.interestRate) / 100;
        if (payment < requiredRepayment) {
            throw new Error("Insufficient repayment amount.");
        }
        loan.isRepaid = true;
        console.log(`LoanRepaid: Loan ID ${loanId}`);
    }

    trade(traderA, traderB, assetAmount) {
        if ((this.balances[traderA] || 0) < assetAmount) {
            throw new Error("Insufficient balance for trading.");
        }
        this.tradeCount++;
        this.trades[this.tradeCount] = {
            traderA: traderA,
            traderB: traderB,
            assetAmount: assetAmount,
            isCompleted: false,
        };
        this.balances[traderA] -= assetAmount;
        this.balances[traderB] = (this.balances[traderB] || 0) + assetAmount;
        this.trades[this.tradeCount].isCompleted = true;
        console.log(`TradeExecuted: Trade ID ${this.tradeCount}, Trader A ${traderA}, Trader B ${traderB}, Asset Amount ${assetAmount}`);
    }

    deposit(user, amount) {
        this.balances[user] = (this.balances[user] || 0) + amount;
    }

    withdraw(user, amount) {
        if ((this.balances[user] || 0) < amount) {
            throw new Error("Insufficient balance.");
        }
        this.balances[user] -= amount;
    }

    getBalance(user) {
        return this.balances[user] || 0;
    }
}

const trading = new AssetTrading();

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
    while (true) {
        console.log("\nChoose an action:");
        console.log("1. Deposit");
        console.log("2. Create Loan");
        console.log("3. Borrow Loan");
        console.log("4. Repay Loan");
        console.log("5. Trade");
        console.log("6. Get Balance");
        console.log("7. Exit");

        const choice = await askQuestion("Enter your choice: ");

        switch (choice) {
            case '1':
                const depositUser = await askQuestion("Enter your address: ");
                const depositAmount = parseFloat(await askQuestion("Enter amount to deposit: "));
                trading.deposit(depositUser, depositAmount);
                console.log(`Deposited ${depositAmount} to ${depositUser}`);
                break;

            case '2':
                const loanUser = await askQuestion("Enter your address: ");
                const loanAmount = parseFloat(await askQuestion("Enter loan amount: "));
                const interestRate = parseFloat(await askQuestion("Enter interest rate: "));
                const term = parseInt(await askQuestion("Enter term in seconds: "));
                try {
                    trading.createLoan(loanUser, loanAmount, interestRate, term);
                } catch (error) {
                    console.log(error.message);
                }
                break;

            case '3':
                const borrowUser = await askQuestion("Enter your address: ");
                const loanId = parseInt(await askQuestion("Enter loan ID to borrow: "));
                try {
                    trading.borrowLoan(loanId, borrowUser);
                    console.log(`Borrowed loan ID ${loanId}`);
                } catch (error) {
                    console.log(error.message);
                }
                break;

            case '4':
                const repayUser = await askQuestion("Enter your address: ");
                const repayLoanId = parseInt(await askQuestion("Enter loan ID to repay: "));
                const repaymentAmount = parseFloat(await askQuestion("Enter repayment amount: "));
                try {
                    trading.repayLoan(repayLoanId, repayUser, repaymentAmount);
                } catch (error) {
                    console.log(error.message);
                }
                break;

            case '5':
                const traderA = await askQuestion("Enter your address (Trader A): ");
                const traderB = await askQuestion("Enter address of Trader B: ");
                const assetAmount = parseFloat(await askQuestion("Enter asset amount to trade: "));
                try {
                    trading.trade(traderA, traderB, assetAmount);
                } catch (error) {
                    console.log(error.message);
                }
                break;

            case '6':
                const balanceUser = await askQuestion("Enter your address: ");
                const balance = trading.getBalance(balanceUser);
                console.log(`Balance of ${balanceUser}: ${balance}`);
                break;

            case '7':
                console.log("Exiting...");
                rl.close();
                return;

            default:
                console.log("Invalid choice. Please try again.");
        }
    }
}

main().catch(console.error);
