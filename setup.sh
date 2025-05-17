#!/bin/bash

# Nivix Setup Script
# This script helps set up the Nivix hybrid blockchain platform

echo "===== Nivix Platform Setup ====="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v16+ and try again."
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm and try again."
    exit 1
fi

# Check Rust and Cargo
if ! command -v cargo &> /dev/null; then
    echo "Rust/Cargo is not installed. Please install Rust and try again."
    exit 1
fi

# Check Solana CLI
if ! command -v solana &> /dev/null; then
    echo "Solana CLI is not installed. Please install Solana CLI tools and try again."
    exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker and try again."
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

echo "All prerequisites are met!"
echo ""

# Setup Bridge Service
echo "Setting up Bridge Service..."
cd solana/bridge-service
npm install
if [ ! -f .env ]; then
    cp env.example .env
    echo "Created .env file from template. Please update with your configuration."
fi
cd ../..
echo "Bridge Service setup complete!"
echo ""

# Setup Solana Program
echo "Setting up Solana Program..."
cd solana/nivix/nivix_protocol
npm install
echo "Solana Program setup complete!"
echo ""

# Setup Info
echo "===== Setup Information ====="
echo "1. Hyperledger Fabric: See 'hyperledger/README-NIVIX.md' for setup instructions."
echo "2. Solana Program: Navigate to 'solana/nivix/nivix_protocol' and run 'cargo build-bpf' to build."
echo "3. Bridge Service: Update the '.env' file in 'solana/bridge-service' with your configuration."
echo ""
echo "For detailed instructions, refer to SETUP.md in the root directory."
echo ""
echo "Nivix setup preparation complete!" 