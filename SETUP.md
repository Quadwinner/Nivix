# Nivix Setup Guide

This document provides step-by-step instructions for setting up the Nivix hybrid blockchain platform.

## Prerequisites

- **Node.js v16+**: Required for running the bridge service and Solana JavaScript tools
- **Rust and Cargo**: Required for Solana program development
- **Solana CLI tools**: Required for deploying and interacting with Solana programs
- **Docker and Docker Compose**: Required for running Hyperledger Fabric network
- **Hyperledger Fabric binaries**: Required for Fabric network setup

## 1. Setting Up Hyperledger Fabric

1. Navigate to the Fabric samples directory:
   ```
   cd NIVIX/fabric-samples
   ```

2. Start the test network:
   ```
   ./network.sh up createChannel -c nivixchannel -ca
   ```

3. Deploy the Nivix KYC chaincode:
   ```
   ./network.sh deployCC -ccn nivix-kyc -ccp ../chaincode-nivix-kyc/go -ccl go -ccep "OR('Org1MSP.peer','Org2MSP.peer')" -cccg ../collections_config.json
   ```

4. Refer to `NIVIX/hyperledger/README-NIVIX.md` for more detailed instructions.

## 2. Setting Up Solana Program

1. Navigate to the Nivix protocol directory:
   ```
   cd NIVIX/solana/nivix/nivix_protocol
   ```

2. Build the Solana program:
   ```
   cargo build-bpf
   ```

3. Deploy the program to a local test validator:
   ```
   solana-test-validator
   solana program deploy target/deploy/nivix_protocol.so
   ```

4. Note the program ID for later use in the bridge service.

## 3. Setting Up Bridge Service

1. Navigate to the bridge service directory:
   ```
   cd NIVIX/solana/bridge-service
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the provided `env.example`:
   ```
   cp env.example .env
   ```

4. Update the `.env` file with:
   - Solana program ID obtained in step 2.4
   - Fabric connection information
   - API keys and endpoints

5. Start the bridge service:
   ```
   npm start
   ```

## 4. Testing the Integration

1. Create a KYC record in Hyperledger Fabric:
   ```
   cd NIVIX/fabric-samples/test-network
   ./scripts/invoke-fabric.sh createKYC "user123" "approved" "basic"
   ```

2. Make a payment through the Solana program:
   ```
   cd NIVIX/solana/nivix/nivix_protocol
   npm run payment -- --user user123 --amount 100
   ```

3. Verify the transaction was recorded in both chains:
   ```
   # Check Solana transaction
   npm run check-tx -- --tx <transaction_id>
   
   # Check Hyperledger record
   cd NIVIX/fabric-samples/test-network
   ./scripts/query-fabric.sh getTransactionRecord <transaction_id>
   ```

## Troubleshooting

- If you encounter connection issues with the bridge service, check the network settings in the `.env` file.
- For Hyperledger Fabric errors, check the logs in the Docker containers.
- For Solana deployment issues, ensure your Solana CLI is properly configured for the desired network.

Refer to the individual README files in each component directory for more specific troubleshooting advice. 