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
            next(ApiError.badRequest(error.message));
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

    async check(request, response, next) {
        // const {id} = request.query;
        // if (!id) {
        //     return next(ApiError.badRequest('Не задан id!'));
        // }
        // response.json(id);
        response.json({message: "Всё отлично"});
    }

};

module.exports = new UserController();

function excludeKeysFromObj(obj={}, keys=[]) {
    return Object.fromEntries(Object.entries(obj)
    .filter(key => !keys.includes(key[0])));
}