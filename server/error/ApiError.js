class ApiError extends Error {
    constructor(status, message, errors = []) {
        super();
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    static badRequest(message, errors = []) {
        return new ApiError(404, message, errors);
    }

    static unAuthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован');
    }

    static internalError(message, errors = []) {
        return new ApiError(500, message, errors);
    }

    static forbidden(message, errors = []) {
        return new ApiError(403, message, errors);  //Нет доступа
    }

    static invalidData(serverMessage='', errors = []) {
        return new ApiError(403, serverMessage, errors);  //Нет доступа
    }
}


module.exports = ApiError;