# Nivix Architecture

This document explains the technical architecture of the Nivix hybrid blockchain platform.

## Overview

Nivix combines two blockchain technologies, Solana and Hyperledger Fabric, to create a payment platform that is both fast and compliant with regulatory requirements. The architecture is designed to ensure:

1. Fast and low-cost transactions via Solana
2. Secure KYC/AML compliance via Hyperledger Fabric
3. Reliable cross-chain communication via the bridge service

## Architecture Diagram

```
┌────────────────────┐      ┌────────────────────┐
│                    │      │                    │
│   Solana Network   │◄────►│  Bridge Service    │◄────►┌────────────────────┐
│                    │      │                    │      │                    │
└────────────────────┘      └────────────────────┘      │ Hyperledger Fabric │
                                                        │                    │
┌────────────────────┐                                  └────────────────────┘
│                    │
│    User Wallet     │
│                    │
└────────────────────┘
```

## Components

### 1. Solana Program (nivix_protocol)

The Solana program handles:
- User payment transactions
- Token transfers
- Payment verification
- Integration with the bridge service

The Solana program is built using Anchor framework and provides:
- Payment instruction processing
- Account management
- Transaction verification
- Token handling

### 2. Hyperledger Fabric Chaincode (nivix-kyc)

The Hyperledger Fabric chaincode handles:
- KYC information storage and management
- Private data collections for sensitive information
- Transaction recording
- Compliance verification

The chaincode is written in Go and implements:
- KYC record creation/update/query
- Transaction recording
- Access control for private data
- Compliance verification logic

### 3. Bridge Service

The bridge service acts as the mediator between the two blockchain networks:

- **API Layer**: Provides endpoints for:
  - Solana transaction verification
  - KYC status checking
  - Cross-chain transaction recording
  
- **Service Layer**: Implements:
  - Fabric client integration
  - Solana client integration
  - Transaction synchronization logic
  - Error handling and recovery

- **Configuration**: Manages:
  - Connection details for both networks
  - Authentication credentials
  - API keys and security

## Data Flow

1. **KYC Registration**:
   - User submits KYC information
   - Data is stored in Hyperledger private data collections
   - KYC status is updated in public state

2. **Payment Processing**:
   - User initiates payment on Solana
   - Bridge service verifies KYC status with Hyperledger
   - If approved, transaction proceeds on Solana
   - Transaction details are recorded in Hyperledger

3. **Verification**:
   - Transaction records can be verified on both chains
   - Bridge service provides API for cross-chain verification

## Security Considerations

- Sensitive KYC data is stored only in Hyperledger Fabric private collections
- Bridge service uses secure connection configurations
- API access is controlled through authentication
- Solana program uses PDAs for secure account management

## Scalability

- Solana provides high transaction throughput (>50,000 TPS)
- Bridge service can be horizontally scaled
- Hyperledger Fabric can be expanded with additional organizations and channels

## Future Enhancements

- Multi-token support
- Additional compliance frameworks
- Cross-chain atomic transactions
- Enhanced analytics and reporting 