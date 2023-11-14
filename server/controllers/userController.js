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

    async getProfile(request, response, next) {
        try {
            const {ref} = request.params;
            const user = await userService.getOneUser(ref);
            const profileData = excludeKeysFromObj(user.dataValues, ['email', 'password', 'status', 'createdAt', 'updatedAt']);
            return response.json(profileData);
        } catch (error) {
            next(error);
        }
    }

    async getOneEdit(request, response, next) {
        try {
            const {ref} = request.params;
            const user = await userService.getUserDataForEdit(ref);
            const profileData = excludeKeysFromObj(user.dataValues, ['username', 'password', 'status', 'createdAt', 'updatedAt']);
            return response.json(profileData);
        } catch (error) {
            next(error);
        }
    }

    async updateProile(request, response, next) {
        try {
            const {id, email, password, username, city, website} = request.body;
            // let user;
            if (request.files) {
                let profileImg, coverImg;
                const {profilePic, coverPic} = request.files;
                if (profilePic) {
                    profileImg = uuid.v4() + ".jpg";
                    image.mv(path.resolve(__dirname, '..', 'static', profileImg));
                }
                if (coverPic) {
                    coverImg = uuid.v4() + ".jpg";
                    image.mv(path.resolve(__dirname, '..', 'static', coverImg));
                }
                if (!profilePic && coverPic) //Запись без обновления аватара
                if (profilePic && !coverPic) //Запись без обновления обложки
                if (!profilePic && !coverPic) //Запись без обновления обложки и аватара
                if (profilePic && coverPic) //Запись с обновлением обложки и аватара
                // user = await userService.updateUser(parseInt(id), email, password, username, city, website, profileImg, coverImg);
            } 

            console.log(id, email, password, username, city, website);
            const obj = {id, email, password, username, city, website};
            return response.json(obj);
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
            const {id} = request.headers;
            const followers = await userService.getFollowers(id);
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
