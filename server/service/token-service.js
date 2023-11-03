const {Token} = require('../models/models');
const jwt = require('jsonwebtoken');




class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({where: {userId}});
        if (tokenData) {
            return await Token.update({ refreshToken: refreshToken }, {
                where: {
                    userId: userId,
                },
            });
        }
        const token = await Token.create({refreshToken, userId});
        return token;
    }

    async removeToken(userId, refreshToken) {
        if (userId && refreshToken) {
            return await Token.destroy({
                where: {
                    userId: userId,
                    refreshToken: refreshToken,
                },
            }) ? userId : false;
        }
        return false;
    }

    async findToken(refreshToken) {
        const tokenData = await Token.findOne({
            where: {
                refreshToken: refreshToken,
            },
        });
        return tokenData.dataValues.refreshToken;
    }
}

module.exports = new TokenService();