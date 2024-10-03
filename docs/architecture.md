# Architecture Overview

## Smart Contracts

### Lender.sol
The `Lender.sol` contract manages lending and borrowing of assets on the NeoX-Lender platform. Users can lend Ether to the contract, and it keeps track of balances.

- **lend**: Allows users to lend assets to the platform.
- **borrow**: Users can borrow against their balances.
- **getBalance**: Retrieves the current balance of a user.

### Token.sol
The `Token.sol` contract implements an ERC20 token that is used in the platform for transactions and governance.

## Frontend
The frontend interacts with the smart contracts using Web3.js, allowing users to lend and borrow assets directly from their browser.

## Backend (if any)
No backend exists for this decentralized application, as it relies entirely on smart contracts for business logic and state storage.
