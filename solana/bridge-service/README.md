# Nivix Bridge Service

The Nivix Bridge Service connects the Solana blockchain with Hyperledger Fabric to enable a hybrid blockchain architecture for the Nivix payment platform.

## Features

- KYC verification for transactions using Hyperledger Fabric
- Transaction record syncing from Solana to Hyperledger
- Unified API for interacting with both blockchains
- Secure user registration across both platforms

## Prerequisites

- Node.js v16+
- npm v7+
- Access to a running Hyperledger Fabric network
- Access to Solana (devnet or mainnet)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Quadwinner/Nivix.git
cd Nivix/bridge-service
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
# Bridge service configuration
PORT=3000
NODE_ENV=development

# Solana configuration
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PROGRAM_ID=6WapLzABgaKEBBos6NTTyNJajhe2uFZ27MUpYAwWcBzM

# Hyperledger Fabric configuration
FABRIC_CHANNEL_NAME=mychannel
FABRIC_CHAINCODE_NAME=nivix-kyc
FABRIC_MSP_ID=Org1MSP
FABRIC_USER=admin

# Security
JWT_SECRET=nivix-platform-secret-key
```

## Setup

### Hyperledger Fabric Configuration

1. Set the `FABRIC_PATH` environment variable to point to your Fabric installation:
```bash
export FABRIC_PATH=/path/to/your/fabric
```

2. Update the connection profile in `config/connection-org1.json` with the correct paths and settings for your Fabric network.

3. Create the wallet directory:
```bash
mkdir -p wallet
```

4. Copy admin credentials from your Fabric network to the wallet directory.

### Solana Configuration

1. Update the Solana RPC URL in the `.env` file.

## Usage

### Starting the Service

Start the bridge service:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### API Endpoints

#### Bridge Operations

- `POST /api/bridge/verify-transfer` - Verify KYC and execute a transfer
- `POST /api/bridge/sync-transaction` - Sync a Solana transaction to Hyperledger
- `GET /api/bridge/user/:solanaAddress` - Get combined user data
- `POST /api/bridge/register-user` - Register a user on both platforms

#### Fabric Operations

- `GET /api/fabric/kyc/:solanaAddress` - Get KYC status
- `POST /api/fabric/kyc` - Store KYC data
- `POST /api/fabric/transaction` - Record a transaction
- `GET /api/fabric/transaction/:txId` - Get transaction details

#### Solana Operations

- `GET /api/solana/balance/:address` - Get Solana balance
- `GET /api/solana/transaction/:signature` - Get transaction details
- `POST /api/solana/transfer` - Submit a transfer
- `GET /api/solana/user/:address` - Get user data
- `GET /api/solana/wallet/:address/:currency` - Get wallet data

## Security

This service handles sensitive KYC information and transaction data. Ensure:

1. The service runs in a secure environment
2. Use HTTPS for all API endpoints in production
3. Implement proper authentication for API endpoints
4. Store private keys securely
5. Set a strong `JWT_SECRET` in the .env file

## License

Proprietary - All rights reserved. 