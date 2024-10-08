const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/create-checkout-session', paymentController.createCheckoutSession);

router.post('/stripe-webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

module.exports = router;
