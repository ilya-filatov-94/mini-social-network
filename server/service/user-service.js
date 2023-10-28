const {User} = require('../models/models');
const ApiError = require('../error/ApiError');
const tokenService = require('../service/token-service');
const bcrypt = require('bcrypt');




class UserService {
    async registration(username, email, password) {
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            throw ApiError.badRequest(`Пользователь с почтовым адресом ${email} уже существует!`);
        }
        const hashPassword = await bcrypt.hash(password, 5); //второй параметр это количество раундов для генерации соли
        const user = await User.create({
            username, 
            email, 
            password: hashPassword,
            refUser: "",
            profilePic: "",
            coverPic: "",
            status: "online"
        });
        const refToUser = username.replace(' ', '') + String(user.id);
        await User.update({ refUser: refToUser }, {
            where: {
                id: user.id,
            },
        });
        const payload = {id: user.id, refUser: refToUser, email: user.email};
        const tokens = tokenService.generateTokens(payload);
        await tokenService.saveToken(user.id, tokens.refreshToken);
        return {
            ...tokens,
            user: {
                username: user.username,
                profilePic: user.profilePic,
            }
        }
    }

    async login(email, password) {
        const user = await User.findOne({where: {email}});
        if (!user) {
            throw ApiError.internalError(`Пользователь с почтовым адресом ${email} не найден!`);
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.badRequest('Неверный пароль');
        }
        const payload = {id: user.id, refUser: user.refUser, email: user.email};
        const tokens = tokenService.generateTokens(payload);
        await tokenService.saveToken(user.id, tokens.refreshToken);
        await User.update({ status: "online" }, {
            where: {
                id: user.id,
            },
        });
        return {
            ...tokens,
            user: {
                username: user.username,
                profilePic: user.profilePic,
            }
        }
    }

    async logout(userId, refreshToken) {
        const id = await tokenService.removeToken(userId, refreshToken);
        await User.update({ status: "offline" }, {
            where: {
                id: userId,
            },
        });
        return id;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unAuthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);
        if (userData && !tokenFromDB) {
            await User.update({ status: "offline" }, {
                where: {
                    id: userData.id,
                },
            });
        }
        if (!userData || !tokenFromDB) {
            throw ApiError.unAuthorizedError();
        }

        const user = await User.findOne({where: {id: userData.id}});
        const payload = {id: user.id, refUser: user.refUser, email: user.email};
        const tokens = tokenService.generateTokens(payload);
        await tokenService.saveToken(user.id, tokens.refreshToken);
        return tokens;
    }
}

module.exports = new UserService();
