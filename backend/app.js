require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const billingRoutes = require('./routes/billingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const sequelize = require('./config/database');
const seedSubscriptionTypes = require('./seeders/subscriptionTypesSeeder');
const { clearOldPaymentHistory } = require('./controllers/paymentController');

const app = express();
const port = process.env.PORT || 4000;
const backendUrl = process.env.BACKEND_URL || 'http://localhost';

app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));

app.use('/api/auth', authRoutes);
app.use('/api', billingRoutes);
app.use('/api/payment', paymentRoutes);

sequelize.sync().then(async () => {
    await seedSubscriptionTypes();
    app.listen(port, () => {
        console.log(`Backend server running at ${backendUrl}:${port}`);
    });

    clearOldPaymentHistory();
});
