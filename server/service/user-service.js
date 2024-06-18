const {User, Relationship, Activity} = require('../models/models');
const GraphUsers = require('../helpers/graphUsers');
const ApiError = require('../error/ApiError');
const tokenService = require('../service/token-service');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const { changeKeyboardLayout } = require('../helpers/changeKeyboardLayout');

class UserService {
    constructor() { 
        this.graphUsers = new GraphUsers();
    }

    async init() {
        const users = await User.findAll({attributes: ['id']});
        if (!users) {
            return;
        }
        for (let i = 0; i < users.length; i++) {
            this.graphUsers.addUser(String(users[i].dataValues.id));
        }
        const followers = await Relationship.findAll({
            attributes: ['userId', 'followerId']
        });
        if (!followers) {
            return;
        }
        for (let i = 0; i < followers.length; i++) {
            this.graphUsers.addFriend(followers[i].dataValues.userId, followers[i].dataValues.followerId);
        }
        console.log('Граф пользователей инициализирован');
    }

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
        this.graphUsers.addUser(String(user.id));
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

    async getAllUsers(id) {
        const users = await User.findAll({
            attributes: ['id', 'username', 'refUser', 'profilePic', 'status', 'city']
        });
        const friends = this.graphUsers.getFriendsOfUser(String(id));
        getStatusOfRelationship(users, friends);
        return users;
    }

    async getOneUser(refUser, id) {
        const user = await User.findOne(
            {
                where: {refUser: refUser},
            },
        );
        let userId = parseInt(user.dataValues.id);
        if (userId !== parseInt(id)) {
            userId = String(user.dataValues.id);
            const friends = this.graphUsers.getFriendsOfUser(String(id));
            if (!friends.includes(userId)) {
                user.dataValues.isSubscriber = false;
            } else {
                user.dataValues.isSubscriber = true;
            }
        }
        return user;
    }

    async getUserDataForEdit(refUser) {
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

    async updateUser(id, email, password, username, city, website, profileImg, coverImg) {
        if (!id) return {};
        let newEmail, newPassword, newUsername, newCity, newWebsite, newProfileImg, newCoverImg;
        const user = await User.findOne(
            {
                where: {id: id},
            },
        );
        newEmail = email || user.dataValues.email;
        newUsername = username || user.dataValues.username;
        let refToUser;
        if (username) {
            refToUser = username.replace(' ', '') + String(id);
        } else {
            refToUser = user.dataValues.username.replace(' ', '') + String(id);
        }
        newCity = city || user.dataValues.city;
        newWebsite = website || user.dataValues.website;
        newProfileImg = profileImg || user.dataValues.profilePic;
        newCoverImg = coverImg || user.dataValues.coverPic;
        if (profileImg) {
            let type = 'updatedAvatar';
            let desc = `Обновил(а) фото профиля`;
            await this.createActivity(parseInt(id), type, desc, '', profileImg, parseInt(id));
        }
        if (password) {
            newPassword = await bcrypt.hash(password, 5);
            const newDataUser = await User.update({ 
                email: newEmail,  
                refUser: refToUser,
                username: newUsername,
                password: newPassword,
                city: newCity,
                website: newWebsite,
                profilePic: newProfileImg,
                coverPic: newCoverImg,
            }, {where: {id: id}});
            return newDataUser;
        }
        return await User.update({ 
            email: newEmail,  
            refUser: refToUser,
            username: newUsername,
            city: newCity,
            website: newWebsite,
            profilePic: newProfileImg,
            coverPic: newCoverImg,
        }, {where: {id: id}});
    }

    async subscribeUser(curUserId, followerId) {
        if (curUserId && followerId) {
            const relatonship = await Relationship.create({
                userId: curUserId,
                followerId: followerId
            });
            this.graphUsers.addFriend(String(curUserId), String(followerId));
            return relatonship;
        }
        return {};
    }

    async unsubscribeUser(curUserId, followerId) {
        if (curUserId && followerId) {
            const result = await Relationship.destroy({
                where: {
                    userId: curUserId,
                    followerId: followerId,
                },
            });
            this.graphUsers.removeFriend(String(curUserId), String(followerId));
            return result ? followerId : false;
        }
        return false;
    }

    async getFollowers(curUserId) {
        const idFriends = this.graphUsers.getFriendsOfUser(String(curUserId));
        const users = await User.findAll({
            where: { id: idFriends},
            attributes: ['id', 'username', 'refUser', 'profilePic', 'status', 'city']
        });
        return users;
    }

    async getPossibleFriends(curUserId) {
        const idPossibleFriends = this.graphUsers.getPossibleFriends(String(curUserId));
        const idUsers = Object.keys(idPossibleFriends).map(item => parseInt(item));
        const possibleFriendsData = await User.findAll({
            where: {id: idUsers},
            attributes: ['id', 'username', 'refUser', 'profilePic']
        });
        for (let item of possibleFriendsData) {
            item.dataValues.numberMutualFriends = idPossibleFriends[String(item.dataValues.id)].size;
        }
        return possibleFriendsData;
    }

    async getMutualFriends(curUserId, idPosFriend) {
        const idPossibleFriends = this.graphUsers.getPossibleFriends(String(curUserId));
        const idUsers = [];
        for (let value of idPossibleFriends[idPosFriend]) {
            idUsers.push(parseInt(value));
        }
        const mutualFriendsData = await User.findAll({
            where: {id: idUsers},
            attributes: ['id', 'username', 'refUser', 'profilePic', 'status']
        });
        return mutualFriendsData;
    }

    async getActivities(curUserId) {
        const idFriends = this.graphUsers.getFriendsOfUser(String(curUserId));
        const activities = await Activity.findAll({
            order: [['createdAt', 'DESC']],
            where: {userId: idFriends},
            include: [{
                model: User,
                attributes: ["username", "refUser", "profilePic"]
            }],
        });
        return activities;
    }

    async createActivity(userId, type, desc, text='', image='', idAct) {
        const activity = await Activity.create({
            userId: userId,
            type: type,
            desc: desc,
            text: text,
            image: image,
            idAct: idAct
        });
        return activity;
    }

    async getSelectedUsers(search, id, limit, page) {
        page = page || 1;
        limit = limit || 5;
        let offset = page * limit - limit;
        let users = [];
        let friends = [];
        if (id) {
            friends = this.graphUsers.getFriendsOfUser(String(id));
        }
        if (!search) {
            users = await User.findAndCountAll({
                where: {id: { [Op.ne]: id } },
                attributes: ['id', 'username', 'refUser', 'profilePic', 'status', 'city'],
                limit, 
                offset,
            });
        }
        if (search) {
            const searchOtherKeys = changeKeyboardLayout(search);
            users = await User.findAndCountAll({
                where: {
                    username: {[Op.or]: [{[Op.iLike]: '%' + search + '%' }, {[Op.iLike]: '%' + searchOtherKeys + '%' }],},
                    id: { [Op.ne]: id },
                },
                attributes: ['id', 'username', 'refUser', 'profilePic', 'status', 'city'],
                limit, 
                offset
            });
        }
        getStatusOfRelationship(users.rows, friends);
        return users;
    }

    async getFollowersSelected(id, page = 1, limit = 5, selector = 'all') {
        let offset = page * limit - limit;
        const idFriends = this.graphUsers.getFriendsOfUser(String(id));
        let users;
        if (selector === 'all') {
            users = await User.findAndCountAll({
                where: { id: idFriends},
                attributes: ['id', 'username', 'refUser', 'profilePic', 'status', 'city'],
                limit, 
                offset,
            });
        }
        if (selector === 'online') {
            users = await User.findAndCountAll({
                where: { id: idFriends, status: 'online'},
                attributes: ['id', 'username', 'refUser', 'profilePic', 'status', 'city'],
                limit, 
                offset,
            });
        }
        if (selector === 'offline') {
            users = await User.findAndCountAll({
                where: { id: idFriends, status: 'offline'},
                attributes: ['id', 'username', 'refUser', 'profilePic', 'status', 'city'],
                limit, 
                offset,
            });
        }
        return users;
    }
}

function getStatusOfRelationship(users, friends) {
  if (friends.length === 0) return;
  const obj = {};
  let key;
  for (let i = 0; i < friends.length; i++) {
    key = friends[i];
    obj[key] = true;
  }
  for (let i = 0; i < users.length; i++) {
    key = String(users[i].dataValues.id);
    if (obj[key]) {
      users[i].dataValues.subscrStatus = obj[key];
    }
    if (!obj[key]) {
      users[i].dataValues.subscrStatus = false;
    }
  }
}

module.exports = new UserService();
