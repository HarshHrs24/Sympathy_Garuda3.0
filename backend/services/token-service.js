const jwt = require('jsonwebtoken');
const accessTokenSecret = '511ad183a6480a013b1def55218adcd7b501bb6a1eb73a75b8bd5428a00c233e70882670c8a8237cb8541f4c9ee74a9aba89455ab19e99b1831d89d2ce4a75e0';
const refreshTokenSecret = '6b8dde243eee26d68474862d9446e9ae56815573bdee7ff2a28f9281d6dcf3ccd515a3c58ce0bb2d15c81df9f16c62d9b45f8460438bd75be07a0dc6f47b2897';
const refreshModel = require('../models/refresh-model');
class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: '1m',
        });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: '1y',
        });
        return { accessToken, refreshToken };
    }

    async storeRefreshToken(token, userId) {
        try {
            await refreshModel.create({
                token,
                userId,
            });
        } catch (err) {
            console.log(err.message);
        }
    }

    async verifyAccessToken(token) {
        return jwt.verify(token, accessTokenSecret);
    }

    async verifyRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, refreshTokenSecret);
    }

    async findRefreshToken(userId, refreshToken) {
        return await refreshModel.findOne({
            userId: userId,
            token: refreshToken,
        });
    }

    async updateRefreshToken(userId, refreshToken) {
        return await refreshModel.updateOne(
            { userId: userId },
            { token: refreshToken }
        );
    }

    async removeToken(refreshToken) {
        return await refreshModel.deleteOne({ token: refreshToken });
    }
}

module.exports = new TokenService();
