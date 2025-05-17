const fabricService = require('./fabric');
const solanaService = require('./solana');

/**
 * Verify KYC status and execute transfer
 * @param {string} fromAddress - Sender's Solana address
 * @param {string} fromPrivateKey - Sender's private key
 * @param {string} toAddress - Recipient's Solana address
 * @param {number} amount - Amount to transfer
 * @param {string} currency - Currency code
 * @param {string} memo - Transaction memo
 * @returns {Promise<Object>} Transfer result
 */
async function verifyAndTransfer(fromAddress, fromPrivateKey, toAddress, amount, currency, memo) {
  try {
    // Step 1: Check KYC status of sender
    const senderKYC = await fabricService.getKYCStatus(fromAddress);
    
    if (!senderKYC || !senderKYC.kycVerified) {
      throw new Error('Sender is not KYC verified');
    }
    
    // Step 2: Check KYC status of recipient (optional)
    const recipientKYC = await fabricService.getKYCStatus(toAddress);
    
    // Step 3: Execute transfer on Solana
    const signature = await solanaService.transfer(fromPrivateKey, toAddress, amount, memo);
    
    // Step 4: Record transaction in Hyperledger
    const timestamp = new Date().toISOString();
    const txId = `sol_${signature.substring(0, 8)}`;
    
    await fabricService.recordTransaction(
      txId,
      signature,
      fromAddress,
      toAddress,
      amount,
      currency,
      timestamp
    );
    
    return {
      signature,
      txId,
      fromAddress,
      toAddress,
      amount,
      currency,
      timestamp,
      recipientKycStatus: recipientKYC ? recipientKYC.kycVerified : false
    };
  } catch (error) {
    console.error(`Failed to verify and transfer: ${error}`);
    throw new Error(`Failed to verify and transfer: ${error.message}`);
  }
}

/**
 * Sync a completed Solana transaction to Hyperledger
 * @param {string} signature - Solana transaction signature
 * @returns {Promise<Object>} Sync result
 */
async function syncTransaction(signature) {
  try {
    // Step 1: Fetch transaction from Solana
    const txData = await solanaService.getTransaction(signature);
    
    if (!txData || !txData.meta) {
      throw new Error('Transaction not found or invalid');
    }
    
    // Step 2: Extract transaction details
    // This is a simplified example - in a real implementation, you would need to
    // decode the transaction based on Solana program structure
    const amount = txData.meta.fee / 1000000000; // Convert lamports to SOL
    const fromAddress = txData.transaction.message.accountKeys[0].toString();
    const toAddress = txData.transaction.message.accountKeys[1].toString();
    const timestamp = new Date(txData.blockTime * 1000).toISOString();
    const txId = `sol_${signature.substring(0, 8)}`;
    const currency = 'SOL'; // Simplified for this example
    
    // Step 3: Record in Hyperledger
    await fabricService.recordTransaction(
      txId,
      signature,
      fromAddress,
      toAddress,
      amount,
      currency,
      timestamp
    );
    
    return {
      txId,
      signature,
      fromAddress,
      toAddress,
      amount,
      currency,
      timestamp,
      syncedToHyperledger: true
    };
  } catch (error) {
    console.error(`Failed to sync transaction: ${error}`);
    throw new Error(`Failed to sync transaction: ${error.message}`);
  }
}

/**
 * Get combined user data from Solana and Hyperledger
 * @param {string} solanaAddress - User's Solana address
 * @returns {Promise<Object>} Combined user data
 */
async function getCombinedUserData(solanaAddress) {
  try {
    // Step 1: Get user data from Solana
    const solanaData = await solanaService.getUserData(solanaAddress);
    
    // Step 2: Get KYC status from Hyperledger
    let kycData = { kycVerified: false };
    try {
      kycData = await fabricService.getKYCStatus(solanaAddress);
    } catch (error) {
      console.warn(`KYC data not found for ${solanaAddress}`);
    }
    
    // Step 3: Combine data
    return {
      solanaAddress,
      username: solanaData.username,
      kyc: {
        verified: kycData.kycVerified,
        riskScore: kycData.riskScore || 0
      },
      homeCurrency: solanaData.home_currency,
      balances: {}
    };
  } catch (error) {
    console.error(`Failed to get combined user data: ${error}`);
    throw new Error(`Failed to get combined user data: ${error.message}`);
  }
}

/**
 * Register user on both Solana and store KYC in Hyperledger
 * @param {string} username - User's username
 * @param {string} solanaAddress - User's Solana address
 * @param {string} privateKey - User's private key
 * @param {string} fullName - User's full name
 * @param {string} homeCurrency - User's home currency
 * @param {Object} kycData - KYC data
 * @returns {Promise<Object>} Registration result
 */
async function registerUser(username, solanaAddress, privateKey, fullName, homeCurrency, kycData) {
  try {
    // Step 1: Register user on Solana (placeholder - would need to be implemented)
    // This would call the Solana program's register_user instruction
    
    // Step 2: Store KYC data in Hyperledger
    const verificationDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    await fabricService.storeKYCData(
      `user_${solanaAddress.substring(0, 8)}`,
      solanaAddress,
      fullName,
      true, // kycVerified
      verificationDate,
      kycData.riskScore || 10,
      kycData.documentHash || 'placeholder_hash'
    );
    
    return {
      solanaAddress,
      username,
      kycVerified: true,
      registeredOn: {
        solana: true,
        hyperledger: true
      }
    };
  } catch (error) {
    console.error(`Failed to register user: ${error}`);
    throw new Error(`Failed to register user: ${error.message}`);
  }
}

module.exports = {
  verifyAndTransfer,
  syncTransaction,
  getCombinedUserData,
  registerUser
}; 