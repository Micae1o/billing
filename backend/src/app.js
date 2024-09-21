require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const billingRoutes = require('./routes/billingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sequelize = require('./config/database');
const seedSubscriptionTypes = require('./seeders/subscriptionTypesSeeder');
const { clearOldPaymentHistory } = require('./controllers/paymentController');

const validateToken = require('./middleware/validateToken');

const app = express();
const port = process.env.PORT || 4000;
const backendUrl = process.env.BACKEND_URL || 'http://localhost';

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));

app.use(validateToken);

app.use('/api/auth', authRoutes);
app.use('/api', billingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

sequelize.sync().then(async () => {
    await seedSubscriptionTypes();
    app.listen(port, () => {
        console.log(`Backend server running at ${backendUrl}:${port}`);

        clearOldPaymentHistory();
        setInterval(clearOldPaymentHistory, 24 * 60 * 60 * 1000);
    });
});
