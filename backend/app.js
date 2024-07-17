require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const sequelize = require('./config/database');

const app = express();
const port = process.env.PORT || 4000;
const backendUrl = process.env.BACKEND_URL || 'http://localhost';

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Backend server running at ${backendUrl}:${port}`);
    });
});
