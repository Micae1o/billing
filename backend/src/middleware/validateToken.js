const axios = require('axios');

const validateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const response = await axios.post(`https://178.156.131.224:9000/api/auth/v1/validate_token?token=${token}`, null, {
            headers: {
                'Accept': 'application/json'
            }
        })

        if (response.status === 200) {
            next()
        } else {
            return res.status(422).json({ message: 'validator error' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Failed to authenticate token' });
    }
}

module.exports = validateToken;