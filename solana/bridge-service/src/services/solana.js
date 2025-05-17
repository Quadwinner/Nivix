const { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  Keypair, 
  sendAndConfirmTransaction 
} = require('@solana/web3.js');
const bs58 = require('bs58');

// Solana configuration
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const NIVIX_PROGRAM_ID = new PublicKey('6WapLzABgaKEBBos6NTTyNJajhe2uFZ27MUpYAwWcBzM');

// Create a Solana connection
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

/**
 * Get balance for a Solana address
 * @param {string} address - Solana wallet address
 * @returns {Promise<number>} Balance in SOL
 */
async function getBalance(address) {
  try {
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance / 1000000000; // Convert lamports to SOL
  } catch (error) {
    console.error(`Failed to get balance: ${error}`);
    throw new Error(`Failed to get Solana balance: ${error.message}`);
  }
}

/**
 * Get transaction details by signature
 * @param {string} signature - Solana transaction signature
 * @returns {Promise<Object>} Transaction details
 */
async function getTransaction(signature) {
  try {
    const transaction = await connection.getTransaction(signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0
    });
    
    if (!transaction) {
      throw new Error(`Transaction with signature ${signature} not found`);
    }
    
    return {
      signature,
      blockTime: transaction.blockTime,
      slot: transaction.slot,
      meta: transaction.meta,
      transaction: transaction.transaction
    };
  } catch (error) {
    console.error(`Failed to get transaction: ${error}`);
    throw new Error(`Failed to get Solana transaction: ${error.message}`);
  }
}

/**
 * Transfer SOL from one account to another
 * @param {string} fromPrivateKey - Sender's private key (base58)
 * @param {string} toAddress - Recipient's Solana address
 * @param {number} amount - Amount to transfer in SOL
 * @param {string} memo - Optional memo to include
 * @returns {Promise<string>} Transaction signature
 */
async function transfer(fromPrivateKey, toAddress, amount, memo = '') {
  try {
    // Convert private key from base58 to Uint8Array and create keypair
    const privateKeyBytes = bs58.decode(fromPrivateKey);
    const fromKeypair = Keypair.fromSecretKey(privateKeyBytes);
    
    // Convert recipient address to PublicKey
    const toPublicKey = new PublicKey(toAddress);
    
    // Convert amount from SOL to lamports
    const lamports = Math.round(amount * 1000000000);
    
    // Create a simple transfer transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports
      })
    );
    
    // Add a recent blockhash
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = fromKeypair.publicKey;
    
    // Sign and send the transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [fromKeypair]
    );
    
    return signature;
  } catch (error) {
    console.error(`Failed to transfer: ${error}`);
    throw new Error(`Failed to transfer SOL: ${error.message}`);
  }
}

/**
 * Get user data from Nivix program
 * @param {string} address - User's Solana address
 * @returns {Promise<Object>} User data
 */
async function getUserData(address) {
  try {
    // This would need to be implemented based on the specific Anchor program structure
    // For now, returning a placeholder
    return {
      address,
      username: 'Unknown',
      kyc_verified: false,
      home_currency: 'USD',
      message: 'Solana program integration required'
    };
  } catch (error) {
    console.error(`Failed to get user data: ${error}`);
    throw new Error(`Failed to get Solana user data: ${error.message}`);
  }
}

/**
 * Get wallet data for a specific currency
 * @param {string} address - User's Solana address
 * @param {string} currency - Currency code
 * @returns {Promise<Object>} Wallet data
 */
async function getWalletData(address, currency) {
  try {
    // This would need to be implemented based on the specific Anchor program structure
    // For now, returning a placeholder
    return {
      address,
      currency,
      balance: 0,
      message: 'Solana program integration required'
    };
  } catch (error) {
    console.error(`Failed to get wallet data: ${error}`);
    throw new Error(`Failed to get Solana wallet data: ${error.message}`);
  }
}

module.exports = {
  getBalance,
  getTransaction,
  transfer,
  getUserData,
  getWalletData
}; 