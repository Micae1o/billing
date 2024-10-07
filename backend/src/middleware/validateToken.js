const axios = require('axios');
const https = require('https');

const agent = https.Agent({
    rejectUnauthorized: false
});

const username = process.env.BASIC_AUTH_USERNAME;
const password = process.env.BASIC_AUTH_PASSWORD;

const credentials = Buffer.from(`${username}:${password}`).toString('base64');

const validateToken = async (req, res, next) => {
    next()
    // const authHeader = req.headers['authorization'];
    // if (!authHeader) {
    //     return res.status(403).json({ message: 'No token provided' });
    // }

    // const token = authHeader.split(' ')[1];

    // try {
    //     const response = await axios.post(`https://178.156.131.224:9000/api/auth/v1/resource/validation`, {
    //         token: token,
    //         url: "/api/auth/permissions",
    //         action: "GET"
    //     }, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Basic ${credentials}`
    //         },
    //         httpsAgent: agent
    //     })

    //     if (response.data.code === 200) {
    //         next()
    //     } else {
    //         return res.status(422).json({ message: 'validator error' });
    //     }
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({ message: 'Failed to authenticate token' });
    // }
}

module.exports = validateToken;