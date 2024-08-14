const ApiError = require('../error/ApiError');
const userService = require('../service/user-service');
const notificationService = require('../service/notification-service');
const {validationResult} = require('express-validator');
const uuid = require('uuid');
const path = require('path');

userService.init();

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
            const idUser = await userService.logout(id, refreshToken);
            response.clearCookie('refreshToken');
            return response.json(idUser);
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

    async getProfile(request, response, next) {
        try {
            const {ref} = request.params;
            const {id} = request.query;
            const user = await userService.getOneUser(ref, id);
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }
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
            const {
                id, 
                email, 
                password, 
                username, 
                city, 
                website, 
                facebook, 
                instagram, 
                twitter, 
                linkedinn
            } = request.body;

            let profileImg = '';
            let coverImg = '';
            let typeImage;
            if (request.files) {
                const dataFiles = request.files;
                if (dataFiles?.profilePic) {
                    const profilePic = dataFiles.profilePic;
                    typeImage = profilePic.mimetype.replace('image/', '');
                    profileImg = uuid.v4() + '.' + typeImage;
                    profilePic.mv(path.resolve(__dirname, '..', 'static', profileImg));
                }
                if (dataFiles?.coverPic) {
                    const coverPic = dataFiles.coverPic;
                    typeImage = coverPic.mimetype.replace('image/', '');
                    coverImg = uuid.v4() + '.' + typeImage;
                    coverPic.mv(path.resolve(__dirname, '..', 'static', coverImg));
                }
            }
            const user = await userService.updateUser(
                parseInt(id), 
                email, 
                password, 
                username, 
                city, 
                website, 
                facebook, 
                instagram, 
                twitter, 
                linkedinn,
                profileImg, 
                coverImg
            );
            return response.json(user);
        } catch (error) {
            next(error);
        }
    }

    async subscribeUser(request, response, next) {
        try {
            const {curUserId, followerId} = request.body;
            const statusAction = await userService.subscribeUser(curUserId, followerId);
            const statusActionData = excludeKeysFromObj(statusAction.dataValues, ['createdAt', 'updatedAt']);
            return response.json(statusActionData);
        } catch (error) {
            next(error);
        }
    }

    async unsubscribeUser(request, response, next) {
        try {
            const {curUserId, followerId} = request.body;
            const statusAction = await userService.unsubscribeUser(String(curUserId), String(followerId));
            return response.json(statusAction);
        } catch (error) {
            next(error);
        }
    }

    async getFollowers(request, response, next) {
        try {
            const {id} = request.query;
            const followers = await userService.getFollowers(id);
            return response.json(followers);
        } catch (error) {
            next(error);
        }
    }

    async getFollowersSelected(request, response, next) {
        try {
            const {id, page, limit, selector} = request.query;
            const followers = await userService.getFollowersSelected(id, page, limit, selector);
            return response.json(followers);
        } catch (error) {
            next(error);
        }
    }

    async getAll(request, response, next) {
        try {
            const {curUserId} = request.query; 
            const users = await userService.getAllUsers(curUserId);
            const usersExcludeCurrent = excludeCurUserFromArr(users, parseInt(curUserId));
            return response.json(usersExcludeCurrent);
        } catch (error) {
            next(error);
        }
    }

    async getSuggestionsForUser(request, response, next) {
        try {
            const {id} = request.query;
            const possibleFriends = await userService.getPossibleFriends(id);
            return response.json(possibleFriends);
        } catch (error) {
            next(error);
        }
    }

    async getMutualFriends(request, response, next) {
        try {
            const {userId, idPosFriend} = request.query;
            const mutualFriends = await userService.getMutualFriends(userId, idPosFriend);
            return response.json(mutualFriends);
        } catch (error) {
            next(error);
        }
    }

    async getActivitiesUsers(request, response, next) {
        try {
            const {id} = request.query;
            const activities = await userService.getActivities(id);
            return response.json(activities);
        } catch (error) {
            next(error);
        }
    }

    async createActivityUser(request, response, next) {
        try {
            const {userId, type, desc, text, image} = request.body;
            const activity = await userService.createActivity(parseInt(userId), type, desc, text, image);
            return response.json(activity);
        } catch (error) {
            next(error);
        }
    }

    async getSelectedUsers(request, response, next) {
        try {
            const {search, id, limit, page} = request.query; 
            const users = await userService.getSelectedUsers(search, id, limit, page);
            return response.json(users);
        } catch (error) {
            next(error);
        }
    }

    async getAllNotifications(request, response, next) {
        try {
            const {userId} = request.query;
            const notification = await notificationService.getAll(Number(userId));
            return response.json(notification);
        } catch(error) {
            next(error);
        }
    }

    async updateNotifications(request, response, next) {
        try {
            const {userId} = request.body;
            console.log('БЛЯЯТЬ', userId);
            const notification = await notificationService.updateNotification(Number(userId));
            return response.json(notification);
        } catch(error) {
            next(error);
        }
    }

};

function excludeKeysFromObj(obj={}, keys=[]) {
    return Object.fromEntries(Object.entries(obj)
    .filter(key => !keys.includes(key[0])));
}

function excludeCurUserFromArr(arr=[], id=0) {
    return arr.filter(item => item.dataValues.id !== id);
}

module.exports = new UserController();
