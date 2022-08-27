const crypto = require('crypto');

class HashService {
    hashOtp(data) {
        const st = process.env.HASH_SECRET;
        return crypto
            .createHmac('sha256', st)
            .update(data)
            .digest('hex');
    }
}

module.exports = new HashService();
