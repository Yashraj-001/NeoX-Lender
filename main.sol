//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AssetTrading {

    struct Loan {
        address borrower;
        uint256 amount;
        uint256 interestRate;
        uint256 term;
        uint256 repaymentDate;
        bool isRepaid;
    }

    struct Trade {
        address traderA;
        address traderB;
        uint256 assetAmount;
        bool isCompleted;
    }

    mapping(address => uint256) public balances; 
    mapping(uint256 => Loan) public loans; 
    mapping(uint256 => Trade) public trades; 
    uint256 public loanCount;
    uint256 public tradeCount;

    address public constant MY_WALLET = 0x02fDd964c9209b8c571B8a5B262E55Ed37a7d90f;

    event LoanCreated(uint256 loanId, address borrower, uint256 amount);
    event LoanRepaid(uint256 loanId);
    event TradeExecuted(uint256 tradeId, address traderA, address traderB, uint256 assetAmount);

    function lend(uint256 amount, uint256 interestRate, uint256 term) external {
        require(balances[msg.sender] >= amount, "Insufficient balance.");
        loanCount++;
        loans[loanCount] = Loan(msg.sender, amount, interestRate, term, block.timestamp + term, false);
        balances[msg.sender] -= amount;
        emit LoanCreated(loanCount, msg.sender, amount);
    }

    function borrow(uint256 loanId) external {
        Loan storage loan = loans[loanId];
        require(!loan.isRepaid, "Loan already repaid.");
        require(msg.sender != loan.borrower, "Cannot borrow your own loan.");
        balances[msg.sender] += loan.amount;
        loan.isRepaid = true; 
    }

    function repayLoan(uint256 loanId) external payable {
        Loan storage loan = loans[loanId];
        require(msg.sender == loan.borrower, "Only borrower can repay.");
        require(msg.value >= loan.amount + (loan.amount * loan.interestRate) / 100, "Insufficient repayment amount.");
        loan.isRepaid = true;
        emit LoanRepaid(loanId);
    }

    function trade(address traderB, uint256 assetAmount) external {
        require(balances[msg.sender] >= assetAmount, "Insufficient balance for trading.");
        tradeCount++;
        trades[tradeCount] = Trade(msg.sender, traderB, assetAmount, false);
        balances[msg.sender] -= assetAmount;
        balances[traderB] += assetAmount;
        trades[tradeCount].isCompleted = true; 
        emit TradeExecuted(tradeCount, msg.sender, traderB, assetAmount);
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance.");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}
