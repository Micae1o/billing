const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    console.log(token);

    jwt.verify(token.trim(), 'somesecretkey123', (err, decoded) => {
        console.log(decoded);
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }

        next();
    });
};
