# Nivix - Hybrid Blockchain Platform

A hybrid blockchain payment platform combining Solana for fast transactions and Hyperledger Fabric for KYC/AML compliance.

## Overview

Nivix is a payment platform that leverages the strengths of two blockchain technologies:
- **Solana**: Fast, low-cost transactions for payments
- **Hyperledger Fabric**: Private, permissioned blockchain for regulatory compliance and KYC data

## Repository Structure

This repository is organized as follows:

```
NIVIX/
├── solana/                 # Solana blockchain components
│   ├── nivix_protocol/     # Nivix payment protocol implementation
│   └── bridge-service/     # Service connecting Solana with Hyperledger
│
├── hyperledger/            # Hyperledger Fabric components
│   ├── collections_config.json  # Private data collections configuration
│   └── README-NIVIX.md     # Hyperledger setup instructions
│
└── fabric-samples/         # Fabric network configuration and chaincode
    └── chaincode-nivix-kyc/ # KYC management chaincode
```

## Quick Start

1. Clone this repository
2. Run the setup script: `./setup.sh`
3. Follow the detailed instructions in [SETUP.md](SETUP.md)

For a technical understanding of the platform architecture, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Getting Started

### Prerequisites
- Node.js v16+
- Rust and Cargo
- Solana CLI tools
- Docker and Docker Compose
- Hyperledger Fabric binaries

### Setup Instructions
1. Clone this repository
2. See [hyperledger/README-NIVIX.md](hyperledger/README-NIVIX.md) for Hyperledger Fabric setup
3. See [solana/nivix_protocol/README.md](solana/nivix_protocol/README.md) for Solana protocol setup
4. See [solana/bridge-service/README.md](solana/bridge-service/README.md) for bridge service setup

## Development

The bridge service facilitates communication between the Solana and Hyperledger Fabric networks, allowing for:
- KYC verification before processing Solana payments
- Recording transaction details in the permissioned Hyperledger network
- Cross-chain transaction verification

## License

MIT

## Contact

For inquiries, please contact [Your Contact Information]
# Nivix
