//Функция next() вызывает следующий в цепочке middleware и её вызывать обязательно
const ApiError = require('../error/ApiError');
const tokenService = require('../service/token-service');

module.exports = function (request, response, next) {
    try {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.unAuthorizedError());
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.unAuthorizedError());
        }
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.unAuthorizedError());
        }
        request.user = userData;
        next();
    } catch (error) {
        return next(ApiError.unAuthorizedError());
    }
}