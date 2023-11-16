const StoryService = require('../service/story-service');
const uuid = require('uuid');
const path = require('path');
const ApiError = require('../error/ApiError');


class StoryController {
    async createStory(request, response, next) {
        try {
            const {userId} = request.body;
            if (request.files) {
                const {image} = request.files;
                let fileName = uuid.v4() + ".jpeg";
                image.mv(path.resolve(__dirname, '..', 'static', fileName));
                const story = await StoryService.createNewStory(parseInt(userId), fileName);
                return response.json(story);
            }
            return next(ApiError.forbidden('Ошибка при загрузке story', errors.array()));
        } catch (error) {
            next(error);
        }
    }

    async getAllStories(request, response, next) {
        try {            
            const stories = await StoryService.getAllStories();
            return response.json(stories);
        } catch (error) {
            next(error);
        }
    }

    async getUserStory(request, response, next) {
        try {
            const {id} = request.query;
            const story = await StoryService.getOneStory(parseInt(id));
            return response.json(story);
        } catch (error) {
            next(error);
        }
    }

};

module.exports = new StoryController();