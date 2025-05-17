const express = require('express');
const fabricService = require('../services/fabric');
const router = express.Router();

/**
 * @route GET /api/fabric/kyc/:solanaAddress
 * @desc Get KYC status for a Solana address
 */
router.get('/kyc/:solanaAddress', async (req, res, next) => {
  try {
    const { solanaAddress } = req.params;
    const result = await fabricService.getKYCStatus(solanaAddress);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/fabric/kyc
 * @desc Store KYC data for a user
 */
router.post('/kyc', async (req, res, next) => {
  try {
    const { 
      userId, 
      solanaAddress, 
      fullName, 
      kycVerified, 
      verificationDate, 
      riskScore, 
      documentHash 
    } = req.body;
    
    const result = await fabricService.storeKYCData(
      userId, 
      solanaAddress, 
      fullName, 
      kycVerified, 
      verificationDate, 
      riskScore, 
      documentHash
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'KYC data stored successfully',
      result 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/fabric/transaction
 * @desc Record a transaction from Solana in Hyperledger
 */
router.post('/transaction', async (req, res, next) => {
  try {
    const { 
      txId, 
      solanaSignature, 
      fromUser, 
      toUser, 
      amount, 
      currency, 
      timestamp 
    } = req.body;
    
    const result = await fabricService.recordTransaction(
      txId, 
      solanaSignature, 
      fromUser, 
      toUser, 
      amount, 
      currency, 
      timestamp
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Transaction recorded successfully',
      result 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/fabric/transaction/:txId
 * @desc Get transaction summary from Hyperledger
 */
router.get('/transaction/:txId', async (req, res, next) => {
  try {
    const { txId } = req.params;
    const result = await fabricService.getTransactionSummary(txId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;