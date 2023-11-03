const ApiError = require('../error/ApiError');
const userService = require('../service/user-service');
const {validationResult} = require('express-validator');



class UserController {
    async registration(request, response, next) {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка при валидации запроса', errors.array()));
            }
            const {username, email, password} = request.body;
            const userData = await userService.registration(username, email, password);
            response.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*3600*1000, httpOnly: true});
            const dataForClient = excludeKeysFromObj(userData, ['refreshToken']);
            return response.json(dataForClient);
        } catch (error) {
            next(error);
        }
    }

    async login(request, response, next) {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка при валидации запроса', errors.array()));
            }
            const {email, password} = request.body;
            const userData = await userService.login(email, password);

            response.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*3600*1000, httpOnly: true});
            const dataForClient = excludeKeysFromObj(userData, ['refreshToken']);
            return response.json(dataForClient);
        } catch (error) {
            next(error);
        }
    }

    async logout(request, response, next) {
        try {
            const {refreshToken} = request.cookies;
            const {id} = request.body;
            const token = await userService.logout(id, refreshToken);
            response.clearCookie('refreshToken');
            return response.json(token);
        } catch (error) {
            next(error);
        }
    }

    async refresh(request, response, next) {
        try {
            const {refreshToken} = request.cookies;
            const userData = await userService.refresh(refreshToken);
            response.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*3600*1000, httpOnly: true});
            const dataForClient = excludeKeysFromObj(userData, ['refreshToken']);
            return response.json(dataForClient);
        } catch (error) {
            next(error);
        }
    }

    async getAll(request, response, next) {
        try {
            const users = await userService.getAllUsers();
            const {current_user} = request.headers;
            const usersExcludeCurrent = excludeCurUserFromArr(users, current_user);
            return response.json(usersExcludeCurrent);
        } catch (error) {
            next(error);
        }
    }

    async getOne(request, response, next) {
        try {
            const {id} = request.params;
            const user = await userService.getOneUser(id);
            const profileData = excludeKeysFromObj(user.dataValues, ['email', 'password', 'status', 'createdAt', 'updatedAt']);
            return response.json(profileData);
        } catch (error) {
            next(error);
        }
    }

    async followUser(request, response, next) {
        try {
            const {curUserId, followerId} = request.body;
            const statusAction = await userService.followUser(curUserId, followerId);
            return response.json(statusAction);
        } catch (error) {
            next(error);
        }
    }

    async unsubscribeUser(request, response, next) {
        try {
            const {curUserId, followerId} = request.body;
            const statusAction = await userService.unsubscribeUser(curUserId, followerId);
            return response.json(statusAction);
        } catch (error) {
            next(error);
        }
    }

    async getFollowers(request, response, next) {
        try {
            const {id_user} = request.headers;
            const followers = await userService.getFollowers(id_user);
            return response.json(followers);
        } catch (error) {
            next(error);
        }
    }

};

function excludeKeysFromObj(obj={}, keys=[]) {
    return Object.fromEntries(Object.entries(obj)
    .filter(key => !keys.includes(key[0])));
}

function excludeCurUserFromArr(arr=[], refUser='') {
    return arr.filter(obj => obj.refUser !== refUser);
}

module.exports = new UserController();
