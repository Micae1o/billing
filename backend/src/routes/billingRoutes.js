const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

router.get('/subscription_types', billingController.getAllSubscriptionTypes);

router.get('/user_balance', billingController.getUserBalance);

router.get('/user_subscription', billingController.getUserSubscription);

router.post('/cancel_subscription', billingController.cancelSubscription);

router.get('/payment_history', billingController.getPaymentHistory);

router.get('/points-history', billingController.getPointsHistory);

router.post('/write_downs', billingController.writeDownPoints);

module.exports = router;
