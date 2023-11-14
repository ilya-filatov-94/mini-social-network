const {User, Relationship} = require('../models/models');
const ApiError = require('../error/ApiError');
const tokenService = require('../service/token-service');
const bcrypt = require('bcrypt');




class UserService {
    async registration(username, email, password) {
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            throw ApiError.invalidData(`Пользователь с почтовым адресом ${email} уже существует!`);
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
            throw ApiError.invalidData(`Пользователь с почтовым адресом ${email} не найден!`);
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.invalidData('Неверный пароль');
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

    async getAllUsers() {
        const users = await User.findAll({
            attributes: ['id', 'username', 'refUser', 'profilePic', 'status']
        });
        return users;
    }

    async getOneUser(refUser) {
        const user = await User.findOne(
            {
                where: {refUser: refUser},
            },
        );
        return user;
    }

    async getUSerDataForEdit(refUser) {
        const user = await User.findOne(
            {
                where: {refUser: refUser},
            },
        );
        const fullName = user.dataValues.username.split(' ');
        user.dataValues.name = fullName[0];
        user.dataValues.lastname = fullName[1];
        return user;
    }

    async followUser(curUserId, followerId) {
        const relatonship = await Relationship.create({
            userId: curUserId,
            followerId: followerId
        });
        return relatonship;
    }

    async unsubscribeUser(curUserId, followerId) {
        if (curUserId && followerId) {
            return await Relationship.destroy({
                where: {
                    userId: curUserId,
                    followerId: followerId,
                },
            }) ? followerId : false;
        }
        return false;
    }

    async getFollowers(curUserId) {
        const followers = await Relationship.findAll({
            where:{userId: curUserId},
            // include: [{model: User, as: "users"}]
        });
        const users = await User.findAll({
            attributes: ['id', 'username', 'refUser', 'profilePic', 'status']
        });
        const dataFollowers = intersectionArrays(followers, users);
        return dataFollowers;
    }
}

function intersectionArrays(followers, users) {
    const obj = {};
    const resultArray = [];
    let key;
    for (let i = 0; i < followers.length; i++) {
        key = followers[i].dataValues.followerId;
        obj[key] = true;
    }
    for (let i = 0; i < users.length; i++) {
        key = users[i].dataValues.id;
        if (obj[key]) {
            resultArray.push(users[i].dataValues);
        }
    }
    return resultArray;
}

module.exports = new UserService();
