const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');

// Fabric configuration
const channelName = 'mychannel';
const chaincodeName = 'nivix-kyc';
const mspId = 'Org1MSP';
const connectionProfilePath = path.resolve(__dirname, '../../config/connection-org1.json');
const walletPath = path.join(__dirname, '../../wallet');

/**
 * Connect to the Fabric gateway
 * @returns {Promise<{contract, gateway}>} The contract and gateway
 */
async function connectToNetwork() {
  try {
    // Load the connection profile
    const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));
    
    // Create a new file system based wallet for managing identities
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    
    // Check to see if we've already enrolled the admin user
    const identity = await wallet.get('admin');
    if (!identity) {
      throw new Error('Admin identity not found in wallet');
    }
    
    // Create a new gateway for connecting to the peer node
    const gateway = new Gateway();
    await gateway.connect(connectionProfile, {
      wallet,
      identity: 'admin',
      discovery: { enabled: true, asLocalhost: true }
    });
    
    // Get the network (channel) our contract is deployed to
    const network = await gateway.getNetwork(channelName);
    
    // Get the contract from the network
    const contract = network.getContract(chaincodeName);
    
    return { contract, gateway };
  } catch (error) {
    console.error(`Failed to connect to the network: ${error}`);
    throw new Error(`Failed to connect to the Fabric network: ${error.message}`);
  }
}

/**
 * Get KYC status of a Solana address
 * @param {string} solanaAddress - The Solana address to check
 * @returns {Promise<Object>} KYC status
 */
async function getKYCStatus(solanaAddress) {
  try {
    const { contract, gateway } = await connectToNetwork();
    
    try {
      // Submit the transaction
      const result = await contract.evaluateTransaction('GetKYCStatus', solanaAddress);
      return JSON.parse(result.toString());
    } finally {
      // Disconnect from the gateway
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to get KYC status: ${error}`);
    if (error.message.includes('has no KYC record')) {
      return { kycVerified: false, solanaAddress };
    }
    throw new Error(`Failed to get KYC status: ${error.message}`);
  }
}

/**
 * Store KYC data for a user
 * @param {string} userId - User ID
 * @param {string} solanaAddress - Solana wallet address
 * @param {string} fullName - User's full name
 * @param {boolean} kycVerified - KYC verification status
 * @param {string} verificationDate - Date of verification
 * @param {number} riskScore - Risk score (1-100)
 * @param {string} documentHash - Hash of KYC documents
 * @returns {Promise<Object>} Result of the operation
 */
async function storeKYCData(
  userId, 
  solanaAddress, 
  fullName, 
  kycVerified, 
  verificationDate, 
  riskScore, 
  documentHash
) {
  try {
    const { contract, gateway } = await connectToNetwork();
    
    try {
      // Convert kycVerified to string (chaincode expects string arguments)
      const kycVerifiedStr = kycVerified.toString();
      const riskScoreStr = riskScore.toString();
      
      // Submit the transaction
      await contract.submitTransaction(
        'StoreKYCData',
        userId,
        solanaAddress,
        fullName,
        kycVerifiedStr,
        verificationDate,
        riskScoreStr,
        documentHash
      );
      
      return { success: true };
    } finally {
      // Disconnect from the gateway
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to store KYC data: ${error}`);
    throw new Error(`Failed to store KYC data: ${error.message}`);
  }
}

/**
 * Record a transaction from Solana in Hyperledger
 * @param {string} txId - Transaction ID
 * @param {string} solanaSignature - Solana transaction signature
 * @param {string} fromUser - Sender user ID
 * @param {string} toUser - Recipient user ID
 * @param {number} amount - Transaction amount
 * @param {string} currency - Currency code
 * @param {string} timestamp - Transaction timestamp
 * @returns {Promise<Object>} Result of the operation
 */
async function recordTransaction(
  txId,
  solanaSignature,
  fromUser,
  toUser,
  amount,
  currency,
  timestamp
) {
  try {
    const { contract, gateway } = await connectToNetwork();
    
    try {
      // Convert amount to string (chaincode expects string arguments)
      const amountStr = amount.toString();
      
      // Submit the transaction
      await contract.submitTransaction(
        'RecordTransaction',
        txId,
        solanaSignature,
        fromUser,
        toUser,
        amountStr,
        currency,
        timestamp
      );
      
      return { success: true };
    } finally {
      // Disconnect from the gateway
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to record transaction: ${error}`);
    throw new Error(`Failed to record transaction: ${error.message}`);
  }
}

/**
 * Get transaction summary
 * @param {string} txId - Transaction ID
 * @returns {Promise<Object>} Transaction summary
 */
async function getTransactionSummary(txId) {
  try {
    const { contract, gateway } = await connectToNetwork();
    
    try {
      // Submit the transaction
      const result = await contract.evaluateTransaction('GetTransactionSummary', txId);
      return JSON.parse(result.toString());
    } finally {
      // Disconnect from the gateway
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to get transaction summary: ${error}`);
    throw new Error(`Failed to get transaction summary: ${error.message}`);
  }
}

module.exports = {
  getKYCStatus,
  storeKYCData,
  recordTransaction,
  getTransactionSummary
}; 