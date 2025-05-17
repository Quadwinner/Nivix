const express = require('express');
const bridgeService = require('../services/bridge');
const router = express.Router();

/**
 * @route POST /api/bridge/verify-transfer
 * @desc Verify KYC status and execute transfer
 */
router.post('/verify-transfer', async (req, res, next) => {
  try {
    const { 
      fromAddress, 
      fromPrivateKey,
      toAddress, 
      amount,
      currency,
      memo
    } = req.body;
    
    const result = await bridgeService.verifyAndTransfer(
      fromAddress,
      fromPrivateKey,
      toAddress,
      amount,
      currency,
      memo
    );
    
    res.status(201).json({
      success: true,
      message: 'Transfer verified and executed successfully',
      result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/bridge/sync-transaction
 * @desc Sync a completed Solana transaction to Hyperledger
 */
router.post('/sync-transaction', async (req, res, next) => {
  try {
    const { signature } = req.body;
    
    const result = await bridgeService.syncTransaction(signature);
    
    res.status(201).json({
      success: true,
      message: 'Transaction synced successfully',
      result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/bridge/user/:solanaAddress
 * @desc Get combined user data from Solana and Hyperledger
 */
router.get('/user/:solanaAddress', async (req, res, next) => {
  try {
    const { solanaAddress } = req.params;
    
    const userData = await bridgeService.getCombinedUserData(solanaAddress);
    
    res.json(userData);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/bridge/register-user
 * @desc Register user on both Solana and store KYC in Hyperledger
 */
router.post('/register-user', async (req, res, next) => {
  try {
    const { 
      username,
      solanaAddress,
      privatKey,
      fullName,
      homeCurrency,
      kycData
    } = req.body;
    
    const result = await bridgeService.registerUser(
      username,
      solanaAddress,
      privatKey,
      fullName,
      homeCurrency,
      kycData
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully on both platforms',
      result
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 