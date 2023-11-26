const ApiError = require('../error/ApiError');

module.exports = function (error, request, response, next) {
    if (error instanceof ApiError || error instanceof Error) {
        return response.status(error.status).json({message: error.message});
    }
    return response.status(500).json({message: 'Непредвиденная ошибка'});
}