const express = require('express');
const solanaService = require('../services/solana');
const router = express.Router();

/**
 * @route GET /api/solana/balance/:address
 * @desc Get balance for a Solana address
 */
router.get('/balance/:address', async (req, res, next) => {
  try {
    const { address } = req.params;
    const balance = await solanaService.getBalance(address);
    res.json({ address, balance });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/solana/transaction/:signature
 * @desc Get transaction details by signature
 */
router.get('/transaction/:signature', async (req, res, next) => {
  try {
    const { signature } = req.params;
    const transaction = await solanaService.getTransaction(signature);
    res.json(transaction);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/solana/transfer
 * @desc Submit a transaction to Solana network
 */
router.post('/transfer', async (req, res, next) => {
  try {
    const { 
      fromPrivateKey, 
      toAddress, 
      amount,
      memo
    } = req.body;
    
    const result = await solanaService.transfer(
      fromPrivateKey,
      toAddress,
      amount,
      memo
    );
    
    res.status(201).json({
      success: true,
      message: 'Transaction sent successfully',
      signature: result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/solana/user/:address
 * @desc Get user data from Solana (Nivix program)
 */
router.get('/user/:address', async (req, res, next) => {
  try {
    const { address } = req.params;
    const userData = await solanaService.getUserData(address);
    res.json(userData);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/solana/wallet/:address/:currency
 * @desc Get wallet data for a specific currency
 */
router.get('/wallet/:address/:currency', async (req, res, next) => {
  try {
    const { address, currency } = req.params;
    const walletData = await solanaService.getWalletData(address, currency);
    res.json(walletData);
  } catch (error) {
    next(error);
  }
});

module.exports = router; 