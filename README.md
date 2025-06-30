# Aggregator Registry Smart Contract (Ethereum + Hardhat)

This project implements a domain-based aggregator registry smart contract using Solidity on the Ethereum blockchain. It allows aggregator addresses to register a unique domain name with associated DID and CID metadata, and update that information later. It enforces one registration per address and prevents duplicate domain registrations.

## Setup

### Install Dependencies

```bash
npm install
```

### Build the Program
```bash
npx hardhat compile
```

### Run Deployment Script
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```
Replace <network-name> with your target network (eg. sepolia).

### Run Tests
```bash
npx hardhat test
```

### Author

	•	Ashmita Pandey
	•	GitHub: https://github.com/ashmita123
	•	LinkedIn: https://linkedin.com/in/ashmitapandey

### License

MIT License

