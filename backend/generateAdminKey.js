const jwt = require('jsonwebtoken');
const fs = require('fs');

const payload = {
    role: 'admin'
};


const token = jwt.sign(payload, 'somesecretkey123');

fs.writeFileSync('adminToken.txt', token);
console.log('Admin token generated and saved to adminToken.txt');
